// components/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAuthChecking } from "@/redux/features/auth/authSlice";
import { auth } from "@/lib/firebase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isActive = true;
    
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!isActive) return;
      
      if (firebaseUser) {
        try {
          // Always verify with fresh token
          const token = await firebaseUser.getIdToken(true);
          
          const userData = {
            _id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            email: firebaseUser.email || "",
            role: "user" as "user",
            lastVerified: Date.now(),
          };
          
          // Store minimal non-sensitive data
          sessionStorage.setItem('userId', firebaseUser.uid);
          sessionStorage.setItem('userName', userData.name);
          
          dispatch(setUser(userData));
        } catch (error) {
          console.error("Token refresh failed:", error);
          dispatch(setAuthChecking(false));
        }
      } else {
        // Clear all cached data
        sessionStorage.clear();
        dispatch(setAuthChecking(false));
      }
      
      setIsInitialized(true);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [dispatch]);

  if (!isInitialized) {
    // Loading spinner সরাসরি JSX এ দিন
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