// It is for MongoDB backend API.

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { User } from "./authTypes";

// REGISTER USER (MONGODB)

export const registerUser = createAsyncThunk<
  User,
  {
    firebaseUid: string;
    name: string;
    email: string;
    avatar?: string;
  }
>("auth/registerUser", async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to register user"
    );
  }
});

// LOGIN USER (MONGODB)

export const loginUser = createAsyncThunk<
  User,
  { firebaseUid: string }
>("auth/loginUser", async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to login"
    );
  }
});

// GET CURRENT USER PROFILE

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/profile");
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

// UPDATE USER PROFILE

export const updateUserProfile = createAsyncThunk<
  User,
  {
    name?: string;
    phone?: string;
    address?: string; 
  }
>("auth/updateUserProfile", async (data, thunkAPI) => {
  try {
    const res = await api.put("/auth/profile", data);
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

// GET ALL USERS (ADMIN)

export const getAllUsers = createAsyncThunk<User[]>(
  "auth/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth");
      return res.data.users;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get users"
      );
    }
  }
);

// GET USER BY ID (ADMIN)

export const getUserById = createAsyncThunk<User, string>(
  "auth/getUserById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/auth/${id}`);
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

// DELETE USER (ADMIN)

export const deleteUser = createAsyncThunk<string, string>(
  "auth/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await api.delete(`/auth/${userId}`);
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// CHANGE ROLE (ADMIN)

export const changeUserRole = createAsyncThunk<
  User,
  { id: string; role: "user" | "admin" }
>("auth/changeUserRole", async ({ id, role }, thunkAPI) => {
  try {
    const res = await api.patch(`/auth/${id}/role`, { role });
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to change role"
    );
  }
});