"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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

// =========================
// ZOD SCHEMA
// =========================
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  // =========================
  // EMAIL SIGNUP (FIREBASE + MONGODB)
  // =========================
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // 1. Firebase user create
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // 2. Set display name in Firebase
      await updateProfile(firebaseUser, {
        displayName: data.name,
      });

      // 3. Send to MongoDB backend
      await api.post("/auth/register", {
        firebaseUid: firebaseUser.uid,
        name: data.name,
        email: data.email,
        avatar: "",
      });

      // 4. Success message
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE SIGNUP (FIREBASE + MONGODB)
  // =========================
  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // Send to MongoDB
      await api.post("/auth/register", {
        firebaseUid: user.uid,
        name: user.displayName || "Google User",
        email: user.email,
        avatar: user.photoURL || "",
      });

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Google signup successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-2">

        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NAME */}
          <input
            {...register("name")}
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-lg"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* EMAIL */}
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {/* PASSWORD */}
          <div className="flex items-center border rounded-lg px-4 py-3">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="flex-1 outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("terms")} />
            I agree to terms
          </label>

          {errors.terms && (
            <p className="text-red-500">{errors.terms.message}</p>
          )}

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full bg-[#7AA209] text-white py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* GOOGLE */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 border py-3 rounded-lg"
        >
          <FcGoogle size={22} />
          {googleLoading ? "Loading..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm mt-2">
          Already have account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}