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
    
    // 🔥 IMPORTANT: First check localStorage for cached user
    const cachedUser = localStorage.getItem('userData');
    if (cachedUser && isActive) {
      try {
        const userData = JSON.parse(cachedUser);
        console.log("📦 User loaded from localStorage cache:", userData.email);
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Error parsing cached user:", error);
        localStorage.removeItem('userData');
      }
    }
    
    // 🔥 Listen to Firebase auth state
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!isActive) return;
      
      console.log("🔄 Firebase auth state changed:", firebaseUser?.email || "No user");
      
      if (firebaseUser) {
        try {
          // Get fresh token
          const token = await firebaseUser.getIdToken(true);
          
          const userData = {
            _id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            email: firebaseUser.email || "",
            role: "user" as "user",
            avatar: firebaseUser.photoURL || "",
            lastVerified: Date.now(),
          };
          
          // 🔥 Save to localStorage (persists through page refresh)
          localStorage.setItem('userData', JSON.stringify(userData));
          console.log("💾 User saved to localStorage:", userData.email);
          
          // Update Redux
          dispatch(setUser(userData));
          
        } catch (error) {
          console.error("Token refresh failed:", error);
          localStorage.removeItem('userData');
          dispatch(setAuthChecking(false));
        }
      } else {
        // 🔥 Clear localStorage on logout
        console.log("⚠️ No Firebase user, clearing cache");
        localStorage.removeItem('userData');
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