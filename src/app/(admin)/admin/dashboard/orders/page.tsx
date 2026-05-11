"use client";

export default function AdminOrders() {
  return (
    <div>
      <h1 className="text-xl font-bold text-green-800">
        🛒 Manage Orders
      </h1>

      <div className="mt-6 space-y-3">

        <div className="bg-white p-4 shadow rounded">
          Order #1001 - Pending
          <div className="text-sm text-gray-500">
            Update Status | View Details
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded">
          Order #1002 - Shipped
        </div>

      </div>
    </div>
  );
}