// app/login/page.tsx

"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import {
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";

import { FcGoogle } from "react-icons/fc";

import Swal from "sweetalert2";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import api from "@/lib/axios";

// =========================
// ZOD SCHEMA
// =========================

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  // =========================
  // EMAIL LOGIN
  // =========================

  const onSubmit = async (
    data: FormData
  ) => {
    try {
      setLoading(true);

      console.log(
        "1. Starting email login..."
      );

      // Firebase Login
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

      console.log(
        "2. Firebase login success:",
        userCredential.user.email
      );

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      console.log("3. Redirecting...");

      router.push("/");

    } catch (err: any) {
      console.error(
        "❌ Login Error:",
        err
      );

      Swal.fire(
        "Error",
        err.message || "Login failed",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin =
    async () => {
      try {
        setGoogleLoading(true);

        console.log(
          "1. Starting Google login..."
        );

        const provider =
          new GoogleAuthProvider();

        const result =
          await signInWithPopup(
            auth,
            provider
          );

        const user = result.user;

        console.log(
          "2. Google login success:",
          user.email
        );

        // Register MongoDB user if needed
        try {
          await api.post(
            "/auth/register",
            {
              firebaseUid: user.uid,

              name:
                user.displayName ||
                user.email?.split("@")[0] ||
                "User",

              email: user.email,

              avatar:
                user.photoURL || "",
            }
          );

          console.log(
            "3. MongoDB user saved"
          );

        } catch (error) {
          console.log(
            "ℹ️ User may already exist"
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Google login successful!",
          timer: 1500,
          showConfirmButton: false,
        });

        router.push("/");

      } catch (err: any) {
        console.error(
          "❌ Google Login Error:",
          err
        );

        Swal.fire(
          "Error",
          err.message ||
            "Google login failed",
          "error"
        );

      } finally {
        setGoogleLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5">

        {/* TITLE */}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          {/* EMAIL */}

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#7AA209]"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors.email
                    .message
                }
              </p>
            )}
          </div>

          {/* PASSWORD */}

          <div>
            <div className="flex items-center border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#7AA209]">
              <input
                {...register(
                  "password"
                )}
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                className="flex-1 bg-transparent outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="text-gray-500 hover:text-[#7AA209]"
              >
                {showPassword ? (
                  <FaRegEyeSlash />
                ) : (
                  <FaRegEye />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {/* FORGOT PASSWORD */}

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[#7AA209] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7AA209] hover:bg-[#6b9008] text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* DIVIDER */}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="text-sm text-gray-400">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN */}

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />

          {googleLoading
            ? "Connecting..."
            : "Continue with Google"}
        </button>

        {/* REGISTER */}

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an
          account?{" "}

          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}