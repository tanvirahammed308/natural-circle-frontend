import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";
import {
  getCurrentUser,
  updateUserProfile,
  deleteUser,
  changeUserRole,
} from "./authThunk";

const initialState: AuthState = {
  user: null,
  loading: false,
  authChecking: true, // IMPORTANT: start as true (app checking session)
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecking = false;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecking = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    
    // ================= GET CURRENT USER =================
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.authChecking = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.authChecking = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // ================= UPDATE PROFILE =================
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ================= DELETE USER =================
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      if (state.user?._id === action.payload) {
        state.user = null;
        state.isAuthenticated = false;
      }
    });

    // ================= CHANGE ROLE =================
    builder.addCase(changeUserRole.fulfilled, (state, action) => {
      if (state.user?._id === action.payload._id) {
        state.user = action.payload;
      }
    });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;