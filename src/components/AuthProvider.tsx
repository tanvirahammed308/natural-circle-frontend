// components/AuthProvider.tsx

"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setUser,
  setAuthChecking,
} from "@/redux/features/auth/authSlice";

import { auth } from "@/lib/firebase";
import api from "@/lib/axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const [isInitialized, setIsInitialized] =
    useState(false);

  useEffect(() => {
    const unsubscribe =
      auth.onAuthStateChanged(async (firebaseUser) => {
        try {
          console.log(
            "🔥 Firebase user:",
            firebaseUser?.email || "No User"
          );

          if (firebaseUser) {
            // Get Firebase token
            const token =
              await firebaseUser.getIdToken();

            console.log("✅ Token received");

            // Fetch MongoDB profile
            const res = await api.get(
              "/auth/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(
              "✅ MongoDB profile fetched:",
              res.data
            );

            dispatch(setUser(res.data.user));
          }

        } catch (error) {
          console.error(
            "❌ AuthProvider Error:",
            error
          );
        } finally {
          dispatch(setAuthChecking(false));

          setIsInitialized(true);
        }
      });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7AA209] mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}