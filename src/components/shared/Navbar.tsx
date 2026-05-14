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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  // close dropdown on outside click
  useEffect(() => {
    const close = () => setDropdown(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    dispatch(logout());

    Swal.fire({
      icon: "success",
      title: "Logged out",
      timer: 1200,
      showConfirmButton: false,
    });

    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    router.push(`/products?search=${search}`);
    setSearch("");
    setShowSearch(false);
    setOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">

        {/* LOGO */}
        <Link href="/">
          <Image src="/images/logo.png" alt="logo" width={120} height={40} />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                isActive(link.href)
                  ? "text-[#7AA209]"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">

          {/* SEARCH */}
          {!showSearch ? (
            <button onClick={() => setShowSearch(true)}>
              <MdSearch size={20} />
            </button>
          ) : (
            <form onSubmit={handleSearch} className="flex">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-1 rounded-l"
                placeholder="Search..."
              />
              <button className="bg-[#7AA209] text-white px-3">
                <MdSearch />
              </button>
            </form>
          )}

          {/* THEME */}
          <button onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* CART */}
          <Link href="/dashboard/cart">
            <FaShoppingCart />
          </Link>

          {/* USER LOGIN / DROPDOWN */}
          {isAuthenticated && user ? (
            <div className="relative">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(!dropdown);
                }}
                className="flex items-center gap-2 bg-[#7AA209] text-white px-3 py-2 rounded-lg"
              >
                <FaUser />
                {user.name?.split(" ")[0]}
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-md rounded w-44">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#7AA209] text-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <IoMdClose size={28} /> : <MdMenuOpen size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-16 right-0 w-72 h-screen bg-white dark:bg-gray-900 p-5 md:hidden transition-transform ${
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
              {user.name}
            </p>

            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
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
}