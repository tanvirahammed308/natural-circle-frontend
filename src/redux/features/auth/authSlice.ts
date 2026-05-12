import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./authTypes";

const initialState: AuthState = {
  user: null,
  loading: false,
  authChecking: true,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    // =========================
    // SET USER (LOGIN SUCCESS)
    // =========================
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecking = false;
      state.error = null;
    },

    // =========================
    // LOGOUT
    // =========================
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecking = false;
      state.error = null;
    },

    // =========================
    // START AUTH CHECKING
    // =========================
    setAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.authChecking = action.payload;
    },
  },
});

export const { setUser, logout, setAuthChecking } = authSlice.actions;
export default authSlice.reducer;