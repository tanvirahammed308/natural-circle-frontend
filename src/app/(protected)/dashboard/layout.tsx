"use client";

import { RootState } from "@/redux/store";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// React Icons only
import { FaHome, FaBox, FaUser, FaShoppingCart } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, authChecking } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const pathname = usePathname();

  // =========================
  // PROTECT ROUTE (USER ONLY)
  // =========================
  useEffect(() => {
    if (authChecking) return;

    // ❌ not logged in
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // ❌ block admin from user dashboard
    if (user.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

  }, [authChecking, isAuthenticated, user, router]);

  // =========================
  // LOADING STATE
  // =========================
  if (authChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse">
          Loading Natural Circle...
        </p>
      </div>
    );
  }

  // =========================
  // BLOCK UI IF INVALID USER
  // =========================
  if (!isAuthenticated || !user || user.role === "admin") return null;

  return (
    <div className="flex min-h-screen bg-green-50">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-green-800 text-white p-5">

        <h1 className="text-2xl font-bold mb-8">
          🌿 Natural Circle
        </h1>

        <ul className="space-y-3 text-sm">

          <li>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/dashboard"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <FaHome />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/products"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/dashboard/products"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <FaBox />
              Products
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/orders"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/dashboard/orders"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <MdLocalShipping />
              Orders
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/cart"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/dashboard/cart"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <FaShoppingCart />
              Cart
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/dashboard/profile"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <FaUser />
              Profile
            </Link>
          </li>

        </ul>

        {/* ================= USER INFO ================= */}
        <div className="mt-10 border-t pt-4 text-sm">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-green-100">{user?.email}</p>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6">{children}</main>

    </div>
  );
};

export default ProtectedLayout;