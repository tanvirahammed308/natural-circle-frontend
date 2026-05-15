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
          if (firebaseUser) {
            // Fetch MongoDB profile
            const res = await api.get("/auth/profile");

            dispatch(setUser(res.data.user));
          }

          dispatch(setAuthChecking(false));

          setIsInitialized(true);

        } catch (error) {
          console.error(error);

          dispatch(setAuthChecking(false));

          setIsInitialized(true);
        }
      });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}