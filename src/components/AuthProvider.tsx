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
    console.log("🔵 AuthProvider mounted - Starting...");
    
    // Listen for auth changes (এটাই main listener)
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log("🔄 Firebase auth changed:", firebaseUser?.email || "No user");
      
      if (firebaseUser) {
        const userData = {
          _id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          email: firebaseUser.email || "",
          role: "user" as "user",
          avatar: firebaseUser.photoURL || ""
        };
        
        console.log("📤 Dispatching user to Redux:", userData);
        dispatch(setUser(userData));
      } else {
        console.log("⚠️ No Firebase user");
        dispatch(setAuthChecking(false));
      }
      
      setIsInitialized(true);
    });

    return () => {
      console.log("🔴 AuthProvider unmounting");
      unsubscribe();
    };
  }, [dispatch]);

  // Show loading until Firebase initializes
  if (!isInitialized) {
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