"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setUser,
  setAuthChecking,
  logout,
} from "@/redux/features/auth/authSlice";

import { auth } from "@/lib/firebase";
import { User } from "@/redux/features/auth/authTypes";


export default function AuthProvider({ children }: any) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    dispatch(setAuthChecking(true));

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log("🔥 Firebase user:", firebaseUser.email);

          
const userData: User = {
  _id: firebaseUser.uid,
  firebaseUid: firebaseUser.uid,
  name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
  email: firebaseUser.email || "",
  role: "user",
};

dispatch(setUser(userData));
localStorage.setItem("userData", JSON.stringify(userData));
          
        } else {
          dispatch(logout());
          localStorage.removeItem("userData");
        }
      } catch (err) {
        console.log("Auth error:", err);
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