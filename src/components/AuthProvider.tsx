// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUser, setAuthChecking } from "@/redux/features/auth/authSlice";
import { auth } from "@/lib/firebase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // সরাসরি Firebase থেকে ইউজার চেক করুন
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log("Firebase user:", firebaseUser?.email);
      
      if (firebaseUser) {
        // ইউজার ডাটা তৈরি করুন
        const userData = {
          _id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          email: firebaseUser.email || "",
          role: "user" as "user",
          avatar: firebaseUser.photoURL || ""
        };
        
        // Redux এ সেট করুন
        dispatch(setUser(userData));
        console.log("User set in Redux:", userData);
      } else {
        dispatch(setAuthChecking(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}