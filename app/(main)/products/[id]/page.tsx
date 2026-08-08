"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import { useLanguage } from "@/context/LanguageContext";
import { localizeProduct, localizeCategory } from "@/lib/productI18n";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const data = await api.getProduct(id as string);
          setProduct(data);
        } catch (error) {
          console.error("Failed to fetch product", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center">{t("productDetail.loading")}</div>;
  if (!product) return <div className="p-20 text-center text-red-500">{t("productDetail.notFound")}</div>;

  const localized = localizeProduct(product, language);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">{t("productDetail.back")}</span>
        </button>

        <div className="grid grid-cols-1 gap-20 items-start max-w-2xl mx-auto">
          <div className="relative aspect-[4/3] overflow-hidden w-full max-w-md mx-auto">
            <Image
              src={resolveImageUrl(product.image)}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col h-full w-full">
            <div className="flex-grow">
              <span className="inline-block text-blue-600 bg-blue-50 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                {localizeCategory(product.category, language)}
              </span>
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                {localized.title}
              </h1>
              <p className="text-4xl font-black text-gray-900 mb-8">
                ${product.price.toFixed(2)}
              </p>
              
              <div className="prose prose-blue mb-10">
                <p className="text-base text-gray-500 leading-relaxed">
                  {localized.description}
                </p>
              </div>

              <div className="flex items-center space-x-6 mb-12">
                <div className="flex items-center border border-gray-200 rounded-2xl p-2 bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-16 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-grow bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-200"
                >
                  <ShoppingCart size={24} />
                  <span>{t("productDetail.addToCart")}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-12 border-t border-gray-100">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="text-gray-400" size={24} />
                <span className="text-xs font-bold text-gray-500 uppercase">{t("productDetail.freeShipping")}</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="text-gray-400" size={24} />
                <span className="text-xs font-bold text-gray-500 uppercase">{t("productDetail.warranty")}</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RefreshCw className="text-gray-400" size={24} />
                <span className="text-xs font-bold text-gray-500 uppercase">{t("productDetail.easyReturns")}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
