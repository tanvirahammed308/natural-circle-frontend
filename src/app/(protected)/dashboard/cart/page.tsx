"use client";

export default function CartPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-green-800">
        🛒 My Cart
      </h1>

      <p className="text-gray-600 mt-2">
        Items you added for checkout.
      </p>

      <div className="mt-6 space-y-3">

        <div className="p-4 bg-white shadow rounded flex justify-between">
          <span>Apple</span>
          <span>2 pcs</span>
        </div>

        <div className="p-4 bg-white shadow rounded flex justify-between">
          <span>Honey</span>
          <span>1 jar</span>
        </div>

      </div>
    </div>
  );
}