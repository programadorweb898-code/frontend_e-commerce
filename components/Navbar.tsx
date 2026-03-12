"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingCart, User, LogOut, Package, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              STORE
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
              {t("navbar.home")}
            </Link>
            <Link href="/products" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
              {t("navbar.products")}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
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

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/orders" className="text-gray-600 hover:text-blue-600">
                  <Package size={24} />
                </Link>
                <button
                  onClick={logout}
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
    </nav>
  );
}
