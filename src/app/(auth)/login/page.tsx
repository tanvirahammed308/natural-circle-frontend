"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setUser,
  setAuthChecking,
} from "@/redux/features/auth/authSlice";

import { auth } from "@/lib/firebase";

export default function AuthProvider({ children }: any) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user) {
          setIsInitialized(true);
          dispatch(setAuthChecking(false));
          return;
        }

        console.log("🔥 Firebase user:", user.email);

        // ✅ FORCE FRESH TOKEN
        const token = await user.getIdToken(true);

        // 🚀 DIRECT FETCH (NO AXIOS)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log("✅ PROFILE:", data);

        dispatch(setUser(data.user));

      } catch (err) {
        console.log("❌ Auth error:", err);
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