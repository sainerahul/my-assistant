import * as swiggy from "../swiggy";

export async function callTool(toolName: string, args: any) {
  switch (toolName) {
    case "search_products":
      return swiggy.searchProducts(args.query);

    case "add_to_cart":
      return swiggy.addToCart(
        args.productId,
        args.name,
        args.quantity,
        args.price
      );

    case "place_order":
      return swiggy.placeOrder();

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
