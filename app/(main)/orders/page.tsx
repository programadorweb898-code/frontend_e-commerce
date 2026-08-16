"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Order } from "@/types";
import { api } from "@/lib/api";
import { Package, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { resolveImageUrl } from "@/lib/image";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const { t } = useLanguage();

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-8">{t("orders.title")}</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-2xl"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">{t("orders.empty")}</p>
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
                    <p className="text-xl font-black text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-900">E-Commerce App</span>
                  </div>
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
                  <button 
                    onClick={() => toggleExpand(order._id)}
                    className="text-blue-600 font-bold text-sm flex items-center space-x-1 hover:underline">
                    <span>{expandedOrderId === order._id ? "Hide Details" : "View Details"}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
                {expandedOrderId === order._id && (
                  <div className="px-6 py-4 bg-white border-t border-gray-100">
                    <h3 className="font-bold mb-2">Items:</h3>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center py-2 border-b border-gray-50 last:border-none">
                        <div className="relative h-12 w-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                          <Image
                            src={resolveImageUrl(item.productId.image)}
                            alt={item.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-grow flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-900">{item.title} (x{item.quantity})</span>
                            <span className="font-bold text-gray-900">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
