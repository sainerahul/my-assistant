import { Order, OrderItem } from "./product";

export type Memory = {
  userId: string;
  pastOrders: Order[];
  pendingCart?: OrderItem[];
  awaitingConfirmation?: boolean;
};
