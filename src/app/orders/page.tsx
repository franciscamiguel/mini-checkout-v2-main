"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: string;
  productId: string;
  product: { name: string }; // Assuming Product has a name field
  customerName: string;
  customerPhone: string;
  customerCPF: string;
  customerEmail: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    axios
      .get("/api/orders") 
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-48 w-48 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Orders</h2>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                "Product",
                "Customer",
                "Phone",
                "CPF",
                "Email",
                "Status",
                "Payment Method",
                "Date",
              ].map((header) => (
                <th key={header} className="p-4 border-b text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="even:bg-gray-50">
                <td className="p-4 border-b break-words">{order.productId}</td>
                <td className="p-4 border-b">{order.customerName}</td>
                <td className="p-4 border-b">{order.customerPhone}</td>
                <td className="p-4 border-b">{order.customerCPF}</td>
                <td className="p-4 border-b">{order.customerEmail}</td>
                <td className="p-4 border-b">{order.status}</td>
                <td className="p-4 border-b">{order.paymentMethod}</td>
                <td className="p-4 border-b">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
