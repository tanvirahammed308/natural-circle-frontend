export interface CartItem {
  product: string; // Product ObjectId
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;

  user: string; // User ObjectId

  items: CartItem[];

  totalAmount: number;
  totalItems: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}