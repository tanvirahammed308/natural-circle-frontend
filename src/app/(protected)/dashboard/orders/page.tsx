"use client";

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-green-800">
        📦 My Orders
      </h1>

      <p className="text-gray-600 mt-2">
        Track your order status.
      </p>

      <div className="mt-6 space-y-3">

        <div className="p-4 bg-white shadow rounded">
          Order #1001 - Pending
        </div>

        <div className="p-4 bg-white shadow rounded">
          Order #1002 - Shipped
        </div>

      </div>
    </div>
  );
}