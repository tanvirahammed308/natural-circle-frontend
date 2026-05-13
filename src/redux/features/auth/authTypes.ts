export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  phone?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  users: User[];   
  loading: boolean;
  authChecking: boolean;
  error: string | null;
  isAuthenticated: boolean;
}