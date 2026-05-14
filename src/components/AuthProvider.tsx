// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAuthChecking } from "@/redux/features/auth/authSlice";
import { auth } from "@/lib/firebase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🔵 AuthProvider mounted - Starting...");
    
    // Check Firebase immediately
    const currentUser = auth.currentUser;
    console.log("📌 Current Firebase user:", currentUser?.email || "No user");
    
    if (currentUser) {
      const userData = {
        _id: currentUser.uid,
        firebaseUid: currentUser.uid,
        name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
        email: currentUser.email || "",
        role: "user" as "user",
        avatar: currentUser.photoURL || ""
      };
      
      console.log("📤 Dispatching user to Redux:", userData);
      dispatch(setUser(userData));
      console.log("✅ User dispatched");
    } else {
      console.log("⚠️ No Firebase user found");
      dispatch(setAuthChecking(false));
    }
    
    // Listen for auth changes
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
        
        console.log("📤 Auth change - dispatching user:", userData);
        dispatch(setUser(userData));
      } else {
        console.log("⚠️ Auth change - no user");
        dispatch(setAuthChecking(false));
      }
    });

    return () => {
      console.log("🔴 AuthProvider unmounting");
      unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}