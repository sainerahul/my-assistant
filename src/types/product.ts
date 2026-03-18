export type Product = {
  id: string;
  name: string;
  price: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  items: OrderItem[];
  timestamp: number;
};

export type CartItem = OrderItem;

export type Cart = {
  items: CartItem[];
  total: number;
};
