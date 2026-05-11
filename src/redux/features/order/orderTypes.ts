export interface OrderItem {
  product: string;
  name?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export type PaymentMethod = "stripe" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  user: string;

  orderNumber: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  stripePaymentIntentId?: string;

  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;

  notes?: string;

  deliveredAt?: string;
  cancelledAt?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}