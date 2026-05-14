"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";
import { logout, setUser } from "@/redux/features/auth/authSlice";
import { logoutUser } from "@/lib/auth";
import { auth } from "@/lib/firebase";

import Swal from "sweetalert2";

// Icons
import { MdMenuOpen, MdSearch } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaMoon, FaSun, FaUser, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  // ================= THEME INIT =================
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // ================= CLOSE DROPDOWN ON CLICK OUTSIDE =================
  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // ================= CHECK FIREBASE AUTH =================
  useEffect(() => {
    const checkFirebaseAuth = async () => {
      try {
        const firebaseUser = auth.currentUser;
        console.log("Firebase user:", firebaseUser?.email);
        
        if (firebaseUser && !user) {
          const userData = {
            _id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            email: firebaseUser.email || "",
            role: "user" as "user",
          };
          dispatch(setUser(userData));
          console.log("User set from Navbar:", userData);
        }
      } catch (error) {
        console.error("Error checking Firebase auth:", error);
      }
    };
    
    checkFirebaseAuth();
  }, [user, dispatch]);

  // ================= THEME TOGGLE =================
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";

    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());

      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: "Please try again",
      });
    }
  };

  // ================= SEARCH =================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/products?search=${search}`);

    setSearch("");
    setShowSearch(false);
    setOpen(false);
  };

  // ================= ACTIVE LINK =================
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">

        {/* ================= LOGO ================= */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition ${
                isActive(link.href)
                  ? "text-[#7AA209]"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#7AA209]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden md:flex items-center gap-4">

          {/* SEARCH */}
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="text-xl text-gray-700 dark:text-white"
            >
              <MdSearch />
            </button>
          ) : (
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white dark:bg-gray-800 border rounded-full overflow-hidden"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-56 px-4 py-2 outline-none dark:bg-gray-800 dark:text-white"
              />

              <button className="bg-[#7AA209] text-white px-3 py-2">
                <MdSearch />
              </button>

              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="px-3 text-gray-700 dark:text-white"
              >
                <IoMdClose />
              </button>
            </form>
          )}

          {/* THEME */}
          <button onClick={toggleTheme} className="text-xl text-gray-700 dark:text-white">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* CART */}
          <Link href="/dashboard/cart" className="text-xl text-gray-700 dark:text-white">
            <FaShoppingCart />
          </Link>

          {/* AUTH */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="flex items-center gap-2 bg-[#7AA209] text-white px-4 py-2 rounded-lg hover:bg-[#6b8f08] transition"
              >
                <FaUser />
                {user.name?.split(" ")[0] || user.email?.split("@")[0]}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50 border dark:border-gray-700">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#7AA209] text-white px-4 py-2 rounded-lg hover:bg-[#6b8f08] transition"
            >
              <FaUser />
              Login
            </Link>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-[#7AA209]"
        >
          {open ? <IoMdClose /> : <MdMenuOpen />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed top-16 right-0 w-72 h-screen bg-white dark:bg-gray-900 p-5 transition-transform transform md:hidden z-50 shadow-lg ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#7AA209] transition"
          >
            {link.name}
          </Link>
        ))}

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        {/* MOBILE AUTH */}
        {isAuthenticated && user ? (
          <div className="space-y-3">
            <p className="text-[#7AA209] font-semibold">
              {user.name || user.email}
            </p>

            <Link 
              href="/dashboard" 
              onClick={() => setOpen(false)}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#7AA209] transition"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block text-center bg-[#7AA209] text-white py-2 rounded-lg hover:bg-[#6b8f08] transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;