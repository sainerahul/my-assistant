import { Memory } from "./types/memory";
import { OrderItem } from "./types/product";

const store = new Map<string, Memory>();

export function getMemory(userId: string): Memory {
  if (!store.has(userId)) {
    store.set(userId, {
      userId,
      pastOrders: []
    });
  }
  return store.get(userId)!;
}
export function saveMemory(userId: string, data: Partial<Memory>) {
  const current = getMemory(userId);
  store.set(userId, { ...current, ...data });
}

export function saveOrder(userId: string, items: OrderItem[]) {
  const memory = getMemory(userId);

  memory.pastOrders.push({
    items,
    timestamp: Date.now()
  });

  store.set(userId, memory);
}

export function clearPending(userId: string) {
  const memory = getMemory(userId);
  delete memory.pendingCart;
  delete memory.awaitingConfirmation;
  store.set(userId, memory);
}

export function getLastOrder(userId: string) {
  const memory = getMemory(userId);
  if (memory.pastOrders.length === 0) return null;
  return memory.pastOrders[memory.pastOrders.length - 1];
}