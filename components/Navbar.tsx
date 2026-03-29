"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import Image from "next/image";
import { ShoppingCart, User, LogOut, Package, Globe, ChevronDown, Home, Phone, HelpCircle, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { CartProductInput } from "@/types";
import { useState, useEffect } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { cart, totalItems, removeFromCart, restFromCart, addToCart, totalPrice, clearCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              {t("navbar.store")}
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="flex items-center text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
              <Home size={16} className="mr-1" />
              {t("navbar.home")}
            </Link>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex items-center text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600"
            >
              <Phone size={16} className="mr-1" />
              {t("navbar.phoneSales")}
            </button>
            <Link href="/ayuda" className="flex items-center text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
              <HelpCircle size={16} className="mr-1" />
              {t("navbar.help")}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
              >
                <Globe size={20} />
                <span className="font-medium uppercase text-sm">{language}</span>
                <ChevronDown size={16} className={`transition-transform ${showLanguageMenu ? "rotate-180" : ""}`} />
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setLanguage("es");
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left font-medium transition-colors ${
                      language === "es"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🇪🇸 {t("language.es")}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left font-medium transition-colors ${
                      language === "en"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🇺🇸 {t("language.en")}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/orders" className="text-gray-600 hover:text-blue-600">
                  <Package size={24} />
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                <User size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        />
        <aside 
          className={`absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-blue-600" size={24} />
              <h2 className="text-xl font-black italic tracking-tight">{t("cart.title")}</h2>
            </div>
            <button
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-gray-50 p-8 rounded-full">
                  <ShoppingCart size={48} className="text-gray-200" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{t("cart.empty")}</p>
                  <p className="text-gray-500 font-medium">{t("cart.emptyDesc")}</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  {t("cart.continueShopping")}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-start group">
                    <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 leading-tight pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-black text-blue-600 mb-3">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 bg-gray-50 w-fit rounded-lg p-1">
                        <button 
                          onClick={() => restFromCart(item.productId)}
                          className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
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
                          className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-zinc-50 space-y-4">
              <div className="flex justify-between items-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
                <span>{t("cart.subtotal")}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-900 font-black text-2xl">
                <span>{t("cart.total")}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { url } = await api.createCheckoutSession(language);
                    window.location.href = url;
                  } catch (err) {
                    console.error("Error al iniciar checkout:", err);
                  }
                }}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase italic tracking-tighter"
              >
                <span>{t("cart.checkout")}</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={clearCart}
                className="w-full text-zinc-400 font-bold text-sm hover:text-red-500 transition-colors"
              >
                {t("cart.clear") || "Vaciar todo el carrito"}
              </button>
            </div>
          )}
        </aside>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">{t("navbar.logoutConfirmTitle")}</h2>
            <p className="text-gray-700 mb-6">{t("navbar.logoutConfirmMessage")}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {t("navbar.cancel")}
              </button>
              <button
                onClick={async () => {
                  await logout();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t("navbar.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Venta online</h2>
            <p className="mb-4">Llámanos al número: <strong>+1 (555) 123-4567</strong></p>
            <p className="text-sm text-gray-600">Estamos disponibles de lunes a viernes de 9:00 a 18:00.</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
