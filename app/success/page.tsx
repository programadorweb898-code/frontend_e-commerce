"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { CheckCircle, Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    
    const confirmOrder = async () => {
      try {
        // Llamamos al endpoint que convierte el carrito en orden
        // El sessionId de Stripe nos sirve como referencia del pago exitoso
        await api.checkout(sessionId || undefined);
        
        // Invalidamos el carrito para que se limpie en la UI
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        
        setLoading(false);
      } catch (err) {
        console.error("Error al confirmar el pedido:", err);
        setError(true);
        setLoading(false);
      }
    };

    if (sessionId) {
      confirmOrder();
      effectRan.current = true;
    } else {
      setLoading(false);
    }
  }, [sessionId, queryClient]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 w-full max-w-lg text-center">
          {loading ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 className="animate-spin text-blue-600" size={64} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 italic">Procesando tu pedido...</h1>
              <p className="text-gray-500 font-medium">Estamos confirmando tu pago con Stripe y preparando tu orden.</p>
            </div>
          ) : error ? (
            <div className="space-y-6">
              <div className="flex justify-center text-red-500">
                <Package size={64} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 italic">Algo salió mal</h1>
              <p className="text-gray-500 font-medium">No pudimos confirmar tu pedido automáticamente. Por favor, contacta a soporte o revisa tu historial de compras.</p>
              <Link 
                href="/orders"
                className="inline-flex items-center space-x-2 text-blue-600 font-black hover:underline"
              >
                <span>Ir a mis pedidos</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center text-green-500">
                <CheckCircle size={64} />
              </div>
              <h1 className="text-4xl font-black text-gray-900 italic tracking-tight">¡Gracias por tu compra!</h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Tu pago ha sido procesado con éxito. Tu pedido está en camino y te hemos enviado un correo con los detalles.
              </p>
              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/orders"
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  <Package size={20} />
                  <span>Ver mis pedidos</span>
                </Link>
                <Link 
                  href="/"
                  className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black flex items-center justify-center hover:bg-gray-200 transition-all"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
