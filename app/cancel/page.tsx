"use client";

import { Navbar } from "@/components/Navbar";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 w-full max-w-lg text-center">
          <div className="space-y-6">
            <div className="flex justify-center text-red-500">
              <XCircle size={64} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 italic tracking-tight">Pago cancelado</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Has cancelado el proceso de pago. Tu carrito sigue guardado por si decides completar la compra más tarde.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                <ArrowLeft size={20} />
                <span>Volver a la tienda</span>
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                Reintentar pago
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
