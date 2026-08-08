"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import { useLanguage } from "@/context/LanguageContext";
import { localizeProduct, localizeCategory } from "@/lib/productI18n";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const { language } = useLanguage();
  const router = useRouter();
  const localized = localizeProduct(product, language);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isAlreadyInCart = cart.some((item) => item.productId === product._id);

    if (isAlreadyInCart) {
      alert("El producto ya fue agregado al carrito.");
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <div 
      onClick={() => router.push(`/products/${product._id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
    >
      <div className="relative h-64 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
        <div className="relative h-1/2 w-1/2">
          <Image
            src={resolveImageUrl(product.image)}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
          {localizeCategory(product.category, language)}
        </p>
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
          {localized.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {localized.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-sm active:scale-90 cursor-pointer"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
