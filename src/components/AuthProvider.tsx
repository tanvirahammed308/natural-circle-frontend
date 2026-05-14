// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getCurrentUser, registerUser, loginUser } from "@/redux/features/auth/authThunk";
import { setAuthChecking } from "@/redux/features/auth/authSlice";
import { listenAuthState } from "@/lib/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { authChecking } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = listenAuthState(async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.uid, firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          // First try to get the user from MongoDB
          const result = await dispatch(getCurrentUser()).unwrap();
          console.log("User data fetched successfully:", result);
        } catch (error: any) {
          console.log("User not found in MongoDB, error:", error);
          
          // If user doesn't exist in MongoDB (404 or user not found), create them
          if (error === "User not found" || error?.message === "User not found" || error?.includes("not found")) {
            try {
              console.log("Creating new user in MongoDB...");
              const createResult = await dispatch(registerUser({
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
                email: firebaseUser.email || "",
                avatar: firebaseUser.photoURL || undefined,
              })).unwrap();
              console.log("User created successfully:", createResult);
            } catch (createError) {
              console.error("Failed to create user:", createError);
              dispatch(setAuthChecking(false));
            }
          } else {
            console.error("Error fetching user:", error);
            dispatch(setAuthChecking(false));
          }
        }
      } else {
        // No Firebase user, set auth as checked
        console.log("No Firebase user");
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