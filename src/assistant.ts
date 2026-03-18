import { chatCompletion } from "./openai";
import * as swiggy from "./swiggy";
import {
  getMemory,
  saveMemory,
  saveOrder,
  clearPending,
  getLastOrder
} from "./memory";
import { callTool } from "./tools/swigyy.registry";

export async function runAssistant(userId: string, message: string) {
  const memory = getMemory(userId);
  const normalized = message.toLowerCase();

  /* ------------------------------------------------
     1️⃣ CONFIRMATION FLOW (NO LLM)
  ------------------------------------------------ */
  if (memory.awaitingConfirmation) {
    if (normalized.includes("yes")) {
      const cart = await swiggy.getCart();
      await callTool("place_order", {});
      saveOrder(userId, cart.items);
      clearPending(userId);
      return "✅ Order placed! I’ll remember this for next time.";
    }

    if (normalized.includes("no") || normalized.includes("cancel")) {
      clearPending(userId);
      return "❌ Order cancelled.";
    }

    return "Please say YES to place the order or NO to cancel.";
  }

  /* ------------------------------------------------
     2️⃣ REPEAT LAST ORDER (NO LLM)
  ------------------------------------------------ */
  const repeatKeywords = ["repeat", "same as last", "same order", "usual", "again"];

  if (repeatKeywords.some(k => normalized.includes(k))) {
    const lastOrder = getLastOrder(userId);
    if (!lastOrder) return "You don’t have any past orders yet.";

    for (const item of lastOrder.items) {
      await callTool("add_to_cart", item);
    }

    saveMemory(userId, {
      pendingCart: lastOrder.items,
      awaitingConfirmation: true
    });

    return "🔁 Added your last order to cart. Place order? (yes / no)";
  }

  /* ------------------------------------------------
     3️⃣ LLM TOOL SELECTION
  ------------------------------------------------ */
const systemPrompt = `
You are a food and grocery ordering assistant.

Your task is to extract structured order information.

Rules:
- Identify ALL items the user wants to order
- Extract quantity if mentioned
- If quantity is NOT mentioned, assume quantity = 1
- NEVER combine multiple items into one query
- Do NOT invent products
- Respond ONLY in valid JSON
- Do NOT explain anything

Response format:

{
  "tool": "search_products",
  "args": {
    "items": [
      { "query": "milk", "quantity": 2 },
      { "query": "bread", "quantity": 1 }
    ]
  }
}

If the user is not ordering anything, respond:

{
  "tool": "NONE",
  "response": "normal reply"
}
`;



  const response = await chatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: message }
  ]);

  let parsed: any;
  try {
    parsed = JSON.parse(response);
  } catch {
    return response;
  }

  if (parsed.tool === "NONE") {
    return parsed.response;
  }

  /* ------------------------------------------------
     4️⃣ TOOL EXECUTION
  ------------------------------------------------ */
  switch (parsed.tool) {
case "search_products": {
  const items = parsed.args?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return "❌ I couldn’t understand what you want to order.";
  }

  const addedItems = [];

  for (const item of items) {
    if (!item.query || typeof item.quantity !== "number") {
      return "❌ Invalid order format.";
    }

    const results = await callTool(
      "search_products",
      { query: item.query }
    ) as Awaited<ReturnType<typeof swiggy.searchProducts>>;

    if (results.length === 0) {
      return `❌ I couldn’t find "${item.query}".`;
    }

    const product = results[0];

    await callTool("add_to_cart", {
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price
    });

    addedItems.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price
    });
  }

  saveMemory(userId, {
    pendingCart: addedItems,
    awaitingConfirmation: true
  });

  return `🛒 Added to cart: ${addedItems
    .map(i => `${i.quantity} × ${i.name}`)
    .join(", ")}.
Place order? (yes / no)`;
}



    case "place_order": {
      const cart = await swiggy.getCart();
      await callTool("place_order", {});
      saveOrder(userId, cart.items);
      clearPending(userId);
      return "✅ Order placed!";
    }

    default:
      return "❌ Unknown tool requested.";
  }
}
