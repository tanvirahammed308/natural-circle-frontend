"use client";

import { RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// React Icons
import { FaHome, FaBox, FaUsers, FaShoppingCart } from "react-icons/fa";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, authChecking } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const pathname = usePathname();

  // =========================
  // PROTECT ADMIN ROUTE
  // =========================
  useEffect(() => {
    if (authChecking) return;

    // not logged in
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // not admin → redirect user dashboard
    if (user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, authChecking, user, router]);

  // =========================
  // LOADING
  // =========================
  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse">
          Loading Admin Panel...
        </p>
      </div>
    );
  }

  // block UI if not admin
  if (!isAuthenticated || !user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-green-800 text-white p-5">

        <h1 className="text-2xl font-bold mb-8">
          🌿 Admin Panel
        </h1>

        <ul className="space-y-3 text-sm">

          <li>
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/admin/dashboard"
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
              href="/admin/products"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/admin/products"
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
              href="/admin/orders"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/admin/orders"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <FaShoppingCart />
              Orders
            </Link>
          </li>

          <li>
            <Link
              href="/admin/users"
              className={`flex items-center gap-2 p-2 rounded ${
                pathname === "/admin/users"
                  ? "bg-white text-green-800"
                  : ""
              }`}
            >
              <FaUsers />
              Users
            </Link>
          </li>

        </ul>

        {/* USER INFO */}
        <div className="mt-10 border-t pt-4 text-sm">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-green-100">{user?.email}</p>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;