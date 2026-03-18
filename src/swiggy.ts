import { product } from "./mock-data/product";
import { Cart, CartItem } from "./types/product";

let cart: Cart = { items: [], total: 0 };

export async function searchProducts(query: string) {
  const q = query.toLowerCase();

  return product.filter(p =>
    p.name.toLowerCase().includes(q)
  );
}

export async function addToCart(productId: string, name: string, qty: number, price: number) {
  console.log("-----", name, qty, price)
    const existing = cart.items.find(i => i.productId === productId);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ productId, name, quantity: qty, price });
  }

  cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return cart;
}

export async function getCart() {
  return cart;
}

export async function clearCart() {
  cart = { items: [], total: 0 };
}

export async function placeOrder() {
  console.log("✅ Order placed:", cart);
  clearCart();
}
