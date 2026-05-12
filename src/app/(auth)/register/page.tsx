"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { registerUser } from "@/lib/auth";



// ================= ZOD SCHEMA =================
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // ================= EMAIL REGISTER =================
  const onSubmit = async (data: RegisterInput) => {
    try {
      setLoading(true);

      await registerUser(data.name, data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "You can now login",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogle = async () => {
    try {
      setLoading(true);

      await googleLogin();

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* NAME */}
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="text-center text-gray-400">
          OR
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border p-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width={20}
            height={20}
            alt="google"
          />
          Continue with Google
        </button>

      </div>
    </div>
  );
};

export default RegisterPage;