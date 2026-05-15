"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  setAuthChecking,
} from "@/redux/features/auth/authSlice";

import { auth } from "@/lib/firebase";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser) => {
        console.log(
          "🔥 Firebase auth changed:",
          firebaseUser?.email || "No user"
        );

        if (firebaseUser) {
          const userData = {
            _id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              "User",

            email: firebaseUser.email || "",

            role: "user" as "user",

            avatar: firebaseUser.photoURL || "",
          };

          localStorage.setItem(
            "userData",
            JSON.stringify(userData)
          );

          dispatch(setUser(userData));
        } else {
          localStorage.removeItem("userData");
        }

        dispatch(setAuthChecking(false));

        setIsInitialized(true);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7AA209] mx-auto"></div>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}