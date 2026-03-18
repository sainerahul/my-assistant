import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY is missing in .env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Cheap, safe chat completion helper
 */
export async function chatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    max_tokens: 180,
    temperature: 0.3
  });

  return response.choices[0].message.content ?? "";
}
