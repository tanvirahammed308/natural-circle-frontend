// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUser, setAuthChecking } from "@/redux/features/auth/authSlice";
import { listenAuthState } from "@/lib/auth";
import { User } from "@/redux/features/auth/authTypes";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = listenAuthState((firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email);
      
      if (firebaseUser) {
        
        const userData: User = {
          _id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          email: firebaseUser.email || "",
          role: "user", 
          avatar: firebaseUser.photoURL || ""
        };
        
        console.log("Setting user:", userData);
        dispatch(setUser(userData));
        dispatch(setAuthChecking(false));
      } else {
        dispatch(setAuthChecking(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}