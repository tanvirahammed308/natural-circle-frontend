"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0b1220] to-[#0f172a] text-white mt-10">

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 justify-between gap-12">

        {/* LOGO + DESCRIPTION */}
        <div>
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-30 h-14 object-contain"
          />

          <p className="text-gray-300 text-sm leading-relaxed mt-5">
            We deliver 100% fresh organic food directly from trusted farmers.
            Eat healthy, stay healthy with natural lifestyle choices.
          </p>

          {/* BADGES */}
          <div className="flex gap-2 mt-5 flex-wrap">
            <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
              Organic
            </span>
            <span className="px-3 py-1 text-xs bg-white/10 rounded-full">
              Fresh
            </span>
            <span className="px-3 py-1 text-xs bg-white/10 rounded-full">
              Fast Delivery
            </span>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-lg font-semibold mb-5">Quick Links</h2>

          <ul className="space-y-3 text-gray-300">
            <li><Link href="/" className="hover:text-green-400">Home</Link></li>
            <li><Link href="/shop" className="hover:text-green-400">Shop</Link></li>
            <li><Link href="/about" className="hover:text-green-400">About</Link></li>
            <li><Link href="/contact" className="hover:text-green-400">Contact</Link></li>
          </ul>
        </div>

        {/* CONTACT + SOCIAL */}
        <div>
          <h2 className="text-lg font-semibold mb-5">Contact</h2>

          <div className="space-y-3 text-gray-300 text-sm">
            <p>📧 support@email.com</p>
            <p>📞 +880 1234 567 890</p>
            <p>📍 Dhaka, Bangladesh</p>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex gap-3 mt-6">
            
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-500 transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-500 transition"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-500 transition"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-500 transition"
            >
              <FaTwitter />
            </a>

          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 py-5 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} All rights reserved.
      </div>

    </footer>
  );
}