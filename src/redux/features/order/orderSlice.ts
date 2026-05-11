import { createSlice } from "@reduxjs/toolkit";
import { OrderState } from "./orderTypes";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "./orderThunk";

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    clearOrderError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ================= CREATE ORDER =================
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.unshift(action.payload);
    });

    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ================= GET MY ORDERS =================
    builder.addCase(getMyOrders.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getMyOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });

    builder.addCase(getMyOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ================= GET SINGLE ORDER =================
    builder.addCase(getOrderById.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;
    });

    builder.addCase(getOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ================= GET ALL ORDERS (ADMIN) =================
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });

    // ================= UPDATE ORDER STATUS (ADMIN) =================
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.orders = state.orders.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );

      if (state.selectedOrder?._id === action.payload._id) {
        state.selectedOrder = action.payload;
      }
    });

    // ================= DELETE ORDER (ADMIN) =================
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );

      if (state.selectedOrder?._id === action.payload) {
        state.selectedOrder = null;
      }
    });
  },
});

export const { clearSelectedOrder, clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;