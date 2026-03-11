"use client";

import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function CartPage() {
  const { cart, removeFromCart, restFromCart, addToCart, totalPrice, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xl mb-6">Your cart is empty</p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6">
                  <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-500 font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-full">
                    <button 
                      onClick={() => restFromCart(item.productId)}
                      className="p-1 hover:bg-white rounded-full transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart({ _id: item.productId, name: item.name, price: item.price, image: item.image } as any, 1)}
                      className="p-1 hover:bg-white rounded-full transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={clearCart}
                className="text-gray-500 text-sm font-medium hover:text-red-500 px-4"
              >
                Clear entire cart
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 border-b border-gray-100 pb-4">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-2">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
