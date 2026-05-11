import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { Cart } from "./cartTypes";

/* =========================
   GET CART
   GET /
========================= */
export const getCart = createAsyncThunk<Cart>(
  "cart/getCart",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/cart");
      return res.data.cart;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get cart"
      );
    }
  }
);

/* =========================
   ADD TO CART
   POST /add
========================= */
export const addToCart = createAsyncThunk<
  Cart,
  { productId: string; quantity?: number }
>("cart/addToCart", async (data, thunkAPI) => {
  try {
    const res = await api.post("/cart/add", data);
    return res.data.cart;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to add to cart"
    );
  }
});

/* =========================
   UPDATE CART ITEM
   PUT /update
========================= */
export const updateCartItem = createAsyncThunk<
  Cart,
  { productId: string; quantity: number }
>("cart/updateItem", async (data, thunkAPI) => {
  try {
    const res = await api.put("/cart/update", data);
    return res.data.cart;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update cart item"
    );
  }
});

/* =========================
   REMOVE FROM CART
   DELETE /remove/:productId
========================= */
export const removeFromCart = createAsyncThunk<
  Cart,
  string
>("cart/removeItem", async (productId, thunkAPI) => {
  try {
    const res = await api.delete(`/cart/remove/${productId}`);
    return res.data.cart;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to remove item"
    );
  }
});

/* =========================
   CLEAR CART
   DELETE /clear
========================= */
export const clearCart = createAsyncThunk<Cart>(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const res = await api.delete("/cart/clear");
      return res.data.cart;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);