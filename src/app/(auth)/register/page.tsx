"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import api from "@/lib/axios";
import { setUser } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";

// =========================
// ZOD SCHEMA
// =========================
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
    .regex(/[0-9]/, "Must include at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character"),

  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms & conditions",
  }),
});

type FormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  // =========================
  // EMAIL SIGNUP
  // =========================
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      console.log("1. Starting signup...");

      // FIREBASE USER CREATE
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      console.log("2. Firebase user created");

      // UPDATE FIREBASE PROFILE
      await updateProfile(firebaseUser, {
        displayName: data.name,
      });

      console.log("3. Firebase profile updated");

      // SAVE USER IN MONGODB
      console.log("4. Sending user to backend...");

      const response = await api.post("/auth/register", {
        firebaseUid: firebaseUser.uid,
        name: data.name,
        email: data.email,
        avatar: "",
      });

      console.log("5. Backend response:", response.data);

      // SAVE USER IN REDUX
      dispatch(setUser(response.data.user));

      console.log("6. User saved in Redux");

      // SUCCESS ALERT
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      // REDIRECT
      router.push("/");
      router.refresh();

    } catch (err: any) {
      console.error("SIGNUP ERROR:", err);

      console.log("BACKEND ERROR:", err.response?.data);

      let errorMessage = "Something went wrong";

      // FIREBASE ERRORS
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email already exists";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }

      // BACKEND ERRORS
      else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE SIGNUP
  // =========================
  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);

      console.log("1. Starting Google signup...");

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log("2. Google login success:", user.email);

      let response;

      try {
        // LOGIN EXISTING USER
        response = await api.post("/auth/login", {
          firebaseUid: user.uid,
        });

        console.log("3. Existing user logged in");

      } catch (loginError: any) {

        console.log(
          "LOGIN ERROR:",
          loginError.response?.data || loginError
        );

        // REGISTER NEW USER
        response = await api.post("/auth/register", {
          firebaseUid: user.uid,
          name: user.displayName || "Google User",
          email: user.email,
          avatar: user.photoURL || "",
        });

        console.log("4. New user registered");
      }

      // SAVE USER IN REDUX
      dispatch(setUser(response.data.user));

      console.log("5. User saved in Redux");

      // SUCCESS ALERT
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Google signup successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      // REDIRECT
      router.push("/");
      router.refresh();

    } catch (err: any) {
      console.error("GOOGLE SIGNUP ERROR:", err);

      console.log("BACKEND ERROR:", err.response?.data);

      let errorMessage = "Google signup failed";

      if (err.code === "auth/popup-blocked") {
        errorMessage =
          "Popup blocked. Please allow popups and try again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });

    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">

        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-1">
            Sign up to get started
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          {/* NAME */}
          <div>
            <input
              {...register("name")}
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">

              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="flex-1 bg-transparent outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="text-gray-500 hover:text-green-600"
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
                {errors.password.message}
              </p>
            )}
          </div>

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              {...register("terms")}
              className="w-4 h-4"
            />

            I agree to the

            <Link
              href="/terms"
              className="text-green-600 hover:underline"
            >
              Terms & Conditions
            </Link>
          </label>

          {errors.terms && (
            <p className="text-red-500 text-sm">
              {errors.terms.message}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7AA209] text-white py-3 rounded-lg font-semibold transition hover:bg-[#6b8f08] disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
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

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />

          {googleLoading
            ? "Connecting..."
            : "Continue with Google"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?

          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}