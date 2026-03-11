"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Package, Clock, CheckCircle, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-2xl"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You haven&apos;t placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                    <p className="text-xl font-black text-gray-900">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {order.status === "completed" || order.status === "paid" ? (
                      <span className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <CheckCircle size={14} />
                        <span>{order.status}</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Clock size={14} />
                        <span>{order.status}</span>
                      </span>
                    )}
                  </div>
                  <button className="text-blue-600 font-bold text-sm flex items-center space-x-1 hover:underline">
                    <span>View Details</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
