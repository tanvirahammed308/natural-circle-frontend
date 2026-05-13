import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./authTypes";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  changeUserRole,
} from "./authThunk";


// INITIAL STATE

const initialState: AuthState = {
  user: null,
  users: [],
  loading: false,
  authChecking: true,
  error: null,
  isAuthenticated: false,
};

// SLICE

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecking = false;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.users = [];
      state.isAuthenticated = false;
      state.authChecking = false;
      state.error = null;
    },

    setAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.authChecking = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    
    // REGISTER
    
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Register failed";
    });

    // LOGIN

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Login failed";
    });

    // CURRENT USER
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecking = false;
    });

    builder.addCase(getCurrentUser.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecking = false;
    });

    
    // UPDATE PROFILE
    
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    
    // GET ALL USERS (ADMIN)
    
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload || [];
    });

    
    // GET USER BY ID
    
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    
    // DELETE USER
    
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(
        (u) => u._id !== action.payload
      );
    });

    // =========================
    // CHANGE ROLE
    // =========================
    builder.addCase(changeUserRole.fulfilled, (state, action) => {
      const updatedUser = action.payload;

      state.users = state.users.map((u) =>
        u._id === updatedUser._id ? updatedUser : u
      );
    });
  },
});

export const { setUser, logout, setAuthChecking, clearError } =
  authSlice.actions;

export default authSlice.reducer;