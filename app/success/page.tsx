"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { CheckCircle, Loader2, LogOut, ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const effectRan = useRef(false);
  const { language } = useLanguage();
  const t = translations[language].success;

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const lang = params.get("lang") || localStorage.getItem("language") || "es";

    if (!sessionId) {
      setLoading(false);
      setShowModal(true);
      return;
    }

    const confirmOrder = async () => {
      try {
        await api.confirmPayment(sessionId, lang);
        queryClient.invalidateQueries({ queryKey: ['cart'] });

        setLoading(false);
        setTimeout(() => setShowModal(true), 1500);
      } catch (err) {
        console.error("Error al confirmar el pedido:", err);
        setLoading(false);
        setShowModal(true);
      }
    };

    confirmOrder();
  }, [queryClient]);

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          {loading ? (
            <div className="space-y-6">
              <Loader2 className="animate-spin text-blue-600 mx-auto" size={80} />
              <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter">
                {t.processing}
              </h1>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle size={60} className="text-green-600" />
              </div>
              <h1 className="text-6xl font-black text-gray-900 italic tracking-tighter mb-4">
                {t.title}
              </h1>
              <p className="text-xl text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                {t.description}
              </p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-gray-100 transform animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 italic uppercase">{t.modalTitle}</h2>
                <p className="text-gray-500 font-medium text-lg">{t.modalDescription}</p>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={() => router.push("/")}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200 uppercase italic tracking-tighter"
                >
                  <ShoppingBag size={24} />
                  <span>{t.keepShopping}</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full bg-gray-100 text-gray-900 py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-95 uppercase italic tracking-tighter"
                >
                  <LogOut size={24} />
                  <span>{t.logout}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
