"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1 className="text-xl font-bold text-green-800">
        👤 My Profile
      </h1>

      <div className="mt-6 bg-white p-6 rounded shadow space-y-2">

        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>

      </div>
    </div>
  );
}