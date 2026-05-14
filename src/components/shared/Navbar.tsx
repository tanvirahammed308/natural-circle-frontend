"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";
import { logout, setUser } from "@/redux/features/auth/authSlice";
import { logoutUser } from "@/lib/auth"; // Import Firebase logout

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
      // Firebase logout
      await logoutUser();
      // Redux logout
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

  // Debug log to check user state
  useEffect(() => {
    console.log("Navbar user state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);
  // Navbar.tsx - এই useEffect যোগ করুন (অন্যান্য useEffect এর সাথে)
useEffect(() => {
  console.log("Navbar - Current user from Redux:", user);
  console.log("Navbar - Is Authenticated:", isAuthenticated);
  
  // যদি Redux এ user না থাকে কিন্তু Firebase এ থাকে
  const checkFirebase = async () => {
    const { auth } = await import('@/lib/firebase');
    const firebaseUser = auth.currentUser;
    
    if (firebaseUser && !user) {
      console.log("Firebase user found but Redux empty - fixing...");
      const userData = {
        _id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
        email: firebaseUser.email || "",
        role: "user" as "user",
      };
      dispatch(setUser(userData));
    }
  };
  
  checkFirebase();
}, [user, isAuthenticated, dispatch]);

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
                className="w-56 px-4 py-2 outline-none"
              />

              <button className="bg-[#7AA209] text-white px-3 py-2">
                <MdSearch />
              </button>

              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="px-3"
              >
                <IoMdClose />
              </button>
            </form>
          )}

          {/* THEME */}
          <button onClick={toggleTheme} className="text-xl">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* CART */}
          <Link href="/dashboard/cart" className="text-xl">
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
                className="flex items-center gap-2 bg-[#7AA209] text-white px-4 py-2 rounded-lg"
              >
                <FaUser />
                {user.name?.split(" ")[0] || user.email?.split("@")[0]}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#7AA209] text-white px-4 py-2 rounded-lg"
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
        className={`fixed top-16 right-0 w-72 h-screen bg-white dark:bg-gray-900 p-5 transition-transform md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="block py-2"
          >
            {link.name}
          </Link>
        ))}

        <hr className="my-4" />

        {/* MOBILE AUTH */}
        {isAuthenticated && user ? (
          <div className="space-y-3">
            <p className="text-[#7AA209] font-semibold">
              {user.name || user.email}
            </p>

            <Link 
              href="/dashboard" 
              onClick={() => setOpen(false)}
              className="block"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block text-center bg-[#7AA209] text-white py-2 rounded-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;