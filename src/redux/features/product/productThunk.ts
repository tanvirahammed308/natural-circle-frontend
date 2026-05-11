import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { Product } from "./productTypes";

/* =========================
   GET ALL PRODUCTS
========================= */
export const getAllProducts = createAsyncThunk<
  Product[],
  { category?: string; search?: string } | undefined
>("product/getAll", async (params, thunkAPI) => {
  try {
    const res = await api.get("/products", {
      params,
    });

    return res.data.products;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

/* =========================
   GET PRODUCT BY SLUG
========================= */
export const getProductBySlug = createAsyncThunk<Product, string>(
  "product/getBySlug",
  async (slug, thunkAPI) => {
    try {
      const res = await api.get(`/products/${slug}`);
      return res.data.product;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Product not found"
      );
    }
  }
);

/* =========================
   CREATE PRODUCT (ADMIN)
========================= */
export const createProduct = createAsyncThunk<Product, FormData>(
  "product/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.product;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

/* =========================
   UPDATE PRODUCT (ADMIN)
========================= */
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; data: FormData }
>("product/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.product;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update product"
    );
  }
});

/* =========================
   DELETE PRODUCT (ADMIN)
========================= */
export const deleteProduct = createAsyncThunk<string, string>(
  "product/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);