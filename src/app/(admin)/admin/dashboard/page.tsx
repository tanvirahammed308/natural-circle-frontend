"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800">
        🌿 Admin Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Manage your Natural Circle platform
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">

        <div className="bg-white p-4 shadow rounded">
          📦 Total Products
        </div>

        <div className="bg-white p-4 shadow rounded">
          🛒 Total Orders
        </div>

        <div className="bg-white p-4 shadow rounded">
          👤 Total Users
        </div>

      </div>
    </div>
  );
}