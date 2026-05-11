import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "./cartTypes";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cartThunk";

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ================= GET CART =================
    builder.addCase(getCart.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });

    builder.addCase(getCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ================= ADD TO CART =================
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // ================= UPDATE ITEM =================
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // ================= REMOVE ITEM =================
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // ================= CLEAR CART =================
    builder.addCase(clearCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;