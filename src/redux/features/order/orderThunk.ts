import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { Order } from "./orderTypes";

/* =========================
   CREATE ORDER (USER)
   POST /
========================= */
export const createOrder = createAsyncThunk<
  Order,
  {
    items: { product: string; quantity: number }[];
    shippingAddress: any;
    paymentMethod: "stripe" | "cod";
    tax?: number;
    shippingCost?: number;
    notes?: string;
  }
>("order/create", async (data, thunkAPI) => {
  try {
    const res = await api.post("/orders", data);
    return res.data.order;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Order creation failed"
    );
  }
});

/* =========================
   GET MY ORDERS (USER)
   GET /my-orders
========================= */
export const getMyOrders = createAsyncThunk<Order[]>(
  "order/getMyOrders",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders/my-orders");
      return res.data.orders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

/* =========================
   GET SINGLE ORDER
   GET /:id
========================= */
export const getOrderById = createAsyncThunk<Order, string>(
  "order/getById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data.order;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Order not found"
      );
    }
  }
);

/* =========================
   GET ALL ORDERS (ADMIN)
   GET /admin/all
========================= */
export const getAllOrders = createAsyncThunk<Order[]>(
  "order/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders/admin/all");
      return res.data.orders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders"
      );
    }
  }
);

/* =========================
   UPDATE ORDER STATUS (ADMIN)
   PUT /:id/status
========================= */
export const updateOrderStatus = createAsyncThunk<
  Order,
  {
    id: string;
    orderStatus?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  }
>("order/updateStatus", async ({ id, ...data }, thunkAPI) => {
  try {
    const res = await api.put(`/orders/${id}/status`, data);
    return res.data.order;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update order"
    );
  }
});

/* =========================
   DELETE ORDER (ADMIN)
   DELETE /:id
========================= */
export const deleteOrder = createAsyncThunk<string, string>(
  "order/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/orders/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);