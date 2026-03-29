"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { translations } from "@/lib/translations";
import { CartProductInput } from "@/types";

export default function CartPage() {
  const { cart, removeFromCart, restFromCart, addToCart, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language].cart;

  const handleCheckout = async () => {
    try {
      const { url } = await api.createCheckoutSession(language);
      window.location.href = url;
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <h1 className="text-6xl font-black mb-12 italic tracking-tighter text-gray-900">{t.title}</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 transform hover:scale-[1.01] transition-all">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-blue-600" size={40} />
            </div>
            <p className="text-gray-400 text-2xl font-bold mb-8 italic tracking-tight">{t.empty}</p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-12 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-200"
            >
              {t.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.productId} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-50 flex items-center space-x-8 group hover:border-blue-100 transition-all">
                  <div className="relative h-32 w-32 flex-shrink-0 bg-gray-50 rounded-[1.5rem] overflow-hidden shadow-inner">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-grow space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tight uppercase line-clamp-1">{item.name}</h3>
                    <p className="text-blue-600 font-black text-xl italic">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-4 bg-gray-100/80 p-2 rounded-2xl">
                      <button 
                        onClick={() => restFromCart(item.productId)}
                        className="p-2 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Minus size={20} className="text-gray-600" />
                      </button>
                      <span className="font-black text-xl w-8 text-center text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => {
                          const product: CartProductInput = {
                            _id: item.productId,
                            title: item.name,
                            price: item.price,
                            image: item.image
                          };
                          addToCart(product, 1);
                        }}
                        className="p-2 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Plus size={20} className="text-gray-600" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2 flex items-center space-x-1 group/del"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={clearCart}
                className="group flex items-center space-x-2 text-gray-400 font-bold hover:text-red-500 transition-all px-4 py-2 rounded-xl hover:bg-red-50"
              >
                <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="text-sm uppercase tracking-widest">{t.clear}</span>
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/60 border border-gray-50 h-fit sticky top-24 transform hover:translate-y-[-4px] transition-transform">
              <h2 className="text-3xl font-black mb-8 italic tracking-tighter text-gray-900 uppercase underline decoration-blue-600 decoration-4 underline-offset-8">{t.summary}</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-sm">
                  <span>{t.subtotal}</span>
                  <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-sm border-b border-gray-100 pb-6">
                  <span>{t.shipping}</span>
                  <span className="text-green-600 font-black italic">GRATIS</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-xl font-black text-gray-900 uppercase italic">{t.total}</span>
                  <span className="text-4xl font-black text-blue-600 italic tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-6 rounded-[1.5rem] font-black text-2xl flex items-center justify-center space-x-3 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-blue-200 uppercase italic tracking-tighter"
              >
                <span>{t.checkout}</span>
                <ArrowRight size={28} className="animate-pulse" />
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50 -z-10"></div>
    </div>
  );
}

