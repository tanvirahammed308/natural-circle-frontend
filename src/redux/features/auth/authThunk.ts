// redux/features/auth/authThunk.ts
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
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/register", data);
    console.log("Register response:", res.data);
    
    // Your backend returns { success: true, message: "", user: {...} }
    if (res.data.success && res.data.user) {
      return res.data.user;
    } else {
      return rejectWithValue(res.data.message || "Failed to register user");
    }
  } catch (error: any) {
    console.error("Register error:", error.response?.data);
    return rejectWithValue(
      error.response?.data?.message || "Failed to register user"
    );
  }
});

// LOGIN USER (MONGODB)
export const loginUser = createAsyncThunk<
  User,
  { firebaseUid: string }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data);
    console.log("Login response:", res.data);
    
    // Your backend returns { success: true, message: "", user: {...} }
    if (res.data.success && res.data.user) {
      return res.data.user;
    } else {
      return rejectWithValue(res.data.message || "Failed to login");
    }
  } catch (error: any) {
    console.error("Login error:", error.response?.data);
    return rejectWithValue(
      error.response?.data?.message || "Failed to login"
    );
  }
});

// GET CURRENT USER PROFILE
export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/profile");
      console.log("Get current user response:", res.data);
      
      // Your backend returns { success: true, user: {...} }
      if (res.data.success && res.data.user) {
        return res.data.user;
      } else if (!res.data.success && res.data.message === "User not found") {
        return rejectWithValue("User not found");
      } else {
        return rejectWithValue(res.data.message || "Failed to get user");
      }
    } catch (error: any) {
      console.error("Get current user error:", error.response?.data);
      
      // Handle 404 or user not found
      if (error.response?.status === 404 || error.response?.data?.message === "User not found") {
        return rejectWithValue("User not found");
      }
      
      return rejectWithValue(
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
>("auth/updateUserProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await api.put("/auth/profile", data);
    console.log("Update profile response:", res.data);
    
    if (res.data.success && res.data.user) {
      return res.data.user;
    } else {
      return rejectWithValue(res.data.message || "Failed to update profile");
    }
  } catch (error: any) {
    console.error("Update profile error:", error.response?.data);
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

// GET ALL USERS (ADMIN)
export const getAllUsers = createAsyncThunk<User[]>(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth");
      console.log("Get all users response:", res.data);
      
      // Your backend returns { success: true, count: number, users: [...] }
      if (res.data.success && res.data.users) {
        return res.data.users;
      } else {
        return rejectWithValue(res.data.message || "Failed to get users");
      }
    } catch (error: any) {
      console.error("Get all users error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get users"
      );
    }
  }
);

// GET USER BY ID (ADMIN)
export const getUserById = createAsyncThunk<User, string>(
  "auth/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/auth/${id}`);
      console.log("Get user by ID response:", res.data);
      
      if (res.data.success && res.data.user) {
        return res.data.user;
      } else {
        return rejectWithValue(res.data.message || "Failed to get user");
      }
    } catch (error: any) {
      console.error("Get user by ID error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

// DELETE USER (ADMIN)
export const deleteUser = createAsyncThunk<string, string>(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/auth/${userId}`);
      console.log("Delete user response:", res.data);
      
      if (res.data.success) {
        return userId;
      } else {
        return rejectWithValue(res.data.message || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Delete user error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// CHANGE ROLE (ADMIN)
export const changeUserRole = createAsyncThunk<
  User,
  { id: string; role: "user" | "admin" }
>("auth/changeUserRole", async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/auth/${id}/role`, { role });
    console.log("Change role response:", res.data);
    
    if (res.data.success && res.data.user) {
      return res.data.user;
    } else {
      return rejectWithValue(res.data.message || "Failed to change role");
    }
  } catch (error: any) {
    console.error("Change role error:", error.response?.data);
    return rejectWithValue(
      error.response?.data?.message || "Failed to change role"
    );
  }
});