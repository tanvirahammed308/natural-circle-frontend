import { configureStore } from "@reduxjs/toolkit";

// slices
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import orderReducer from "./features/order/orderSlice";
import cartReducer from "./features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
    cart: cartReducer,
  },

  // optional but recommended for large apps
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for Firebase + FormData
    }),
});

// =======================
// TYPES
// =======================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;