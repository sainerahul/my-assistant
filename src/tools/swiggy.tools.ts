export const swiggyTools = [
  {
    name: "search_products",
    description: "Search for grocery or food items",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" }
      },
      required: ["query"]
    }
  },
  {
    name: "add_to_cart",
    description: "Add an item to the cart",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        name: { type: "string" },
        quantity: { type: "number" },
        price: { type: "number" }
      },
      required: ["productId", "name", "quantity", "price"]
    }
  },
  {
    name: "place_order",
    description: "Place the current cart order",
    input_schema: {
      type: "object",
      properties: {}
    }
  }
];
