"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";

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

  // ================= THEME TOGGLE =================
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";

    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());

    Swal.fire({
      icon: "success",
      title: "Logged out successfully",
      timer: 1200,
      showConfirmButton: false,
    });

    router.push("/login");
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

          {/* ================= SEARCH ================= */}
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="text-xl text-gray-700 dark:text-white hover:text-[#7AA209] transition"
            >
              <MdSearch />
            </button>
          ) : (
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-md overflow-hidden transition-all"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-56 px-4 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-white"
              />

              <button
                type="submit"
                className="bg-[#7AA209] hover:bg-[#6a9208] text-white px-4 py-2 transition"
              >
                <MdSearch size={18} />
              </button>

              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="px-3 text-gray-500 hover:text-red-500 transition"
              >
                <IoMdClose size={20} />
              </button>
            </form>
          )}

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="text-xl text-gray-700 dark:text-white hover:text-[#7AA209]"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* CART */}
          <Link
            href="/dashboard/cart"
            className="text-xl text-gray-700 dark:text-white hover:text-[#7AA209]"
          >
            <FaShoppingCart />
          </Link>

          {/* AUTH */}
          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-[#7AA209] hover:bg-[#6a9208] text-white px-4 py-2 rounded-lg transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#7AA209] hover:bg-[#6a9208] text-white px-4 py-2 rounded-lg transition"
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
            className="block py-2 text-gray-700 dark:text-white"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;