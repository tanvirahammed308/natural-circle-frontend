"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setUser,
  setAuthChecking,
} from "@/redux/features/auth/authSlice";

import { auth } from "@/lib/firebase";
import api from "@/lib/axios";

export default function AuthProvider({ children }: any) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log("🔥 Firebase user:", firebaseUser.email);

          // ✅ ONLY GET TOKEN
          const token = await firebaseUser.getIdToken(true);

          // ❌ NO manual headers here
          const res = await api.get("/auth/profile");

          console.log("✅ PROFILE:", res.data);

          dispatch(setUser(res.data.user));
        }

      } catch (err) {
        console.log("❌ PROFILE ERROR:", err);
      } finally {
        dispatch(setAuthChecking(false));
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}