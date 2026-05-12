import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { User, Address } from "./authTypes";

// ===============================
// GET CURRENT USER PROFILE
// ===============================
export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/users/profile");
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

// ===============================
// UPDATE USER PROFILE
// ===============================
export const updateUserProfile = createAsyncThunk<
  User,
  {
    name?: string;
    phone?: string;
    address?: Address;
  }
>("auth/updateUserProfile", async (data, thunkAPI) => {
  try {
    const res = await api.put("/users/profile", data);
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

// ===============================
// DELETE USER (ADMIN)
// ===============================
export const deleteUser = createAsyncThunk<string, string>(
  "auth/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// ===============================
// CHANGE ROLE (ADMIN)
// ===============================
export const changeUserRole = createAsyncThunk<
  User,
  { id: string; role: "user" | "admin" }
>("auth/changeUserRole", async ({ id, role }, thunkAPI) => {
  try {
    const res = await api.patch(`/users/${id}/role`, { role });
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to change role"
    );
  }
});