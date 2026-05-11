import { createSlice } from "@reduxjs/toolkit";
import { ProductState } from "./productTypes";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunk";

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },

  extraReducers: (builder) => {
    // ================= GET ALL =================
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });

    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ================= GET SINGLE =================
    builder.addCase(getProductBySlug.fulfilled, (state, action) => {
      state.selectedProduct = action.payload;
    });

    // ================= CREATE =================
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.unshift(action.payload);
    });

    // ================= UPDATE =================
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.products = state.products.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );

      state.selectedProduct = action.payload;
    });

    // ================= DELETE =================
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
    });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;