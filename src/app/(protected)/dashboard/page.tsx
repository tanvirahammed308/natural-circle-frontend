"use client";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800">
        🌿 Welcome to Natural Circle
      </h1>

      <p className="text-gray-600 mt-2">
        Your organic shopping dashboard.
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold text-green-700">🛒 Cart</h2>
          <p>View selected products</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold text-green-700">📦 Orders</h2>
          <p>Track your purchases</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold text-green-700">🌿 Products</h2>
          <p>Browse organic items</p>
        </div>

      </div>
    </div>
  );
}