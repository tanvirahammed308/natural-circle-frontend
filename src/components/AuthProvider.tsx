// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getCurrentUser } from "@/redux/features/auth/authThunk";
import { setAuthChecking } from "@/redux/features/auth/authSlice";
import { listenAuthState } from "@/lib/auth";


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { authChecking } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Use your existing listenAuthState function
    const unsubscribe = listenAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user exists, fetch MongoDB user data
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to fetch user:", error);
          dispatch(setAuthChecking(false));
        }
      } else {
        // No Firebase user, set auth as checked
        dispatch(setAuthChecking(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (authChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7AA209] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}