"use client";

export default function AdminProducts() {
  return (
    <div>
      <h1 className="text-xl font-bold text-green-800">
        📦 Manage Products
      </h1>

      <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded">
        + Add Product
      </button>

      <div className="mt-6 space-y-3">

        <div className="bg-white p-4 shadow rounded flex justify-between">
          <span>Organic Apple</span>
          <span className="text-sm text-gray-500">Edit | Delete</span>
        </div>

        <div className="bg-white p-4 shadow rounded flex justify-between">
          <span>Natural Honey</span>
          <span className="text-sm text-gray-500">Edit | Delete</span>
        </div>

      </div>
    </div>
  );
}