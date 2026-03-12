"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.getProducts(),
  });

  const categories = [
    { id: "all", label: t("products.all") },
    { id: "apparel", label: t("products.apparel") },
    { id: "tech", label: t("products.tech") },
    { id: "home", label: t("products.home") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <header className="bg-zinc-950 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-3 text-blue-400 mb-6">
            <Sparkles size={20} />
            <span className="font-black uppercase tracking-[0.3em] text-xs">{t("hero.badge")}</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 max-w-4xl leading-[0.9]">
            {t("hero.title")} <span className="text-blue-600 italic">{t("hero.titleHighlight")}</span> {t("hero.titleEnd")}
          </h1>
          <p className="text-zinc-400 text-xl max-w-xl mb-12 font-medium leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:bg-zinc-200 transition-all transform hover:scale-105">
              {t("hero.shopAll")}
            </button>
            <button className="border border-zinc-700 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-zinc-800 transition-all">
              {t("hero.ourVision")}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-2 font-black uppercase tracking-widest text-xs">
              <TrendingUp size={16} />
              <span>{t("products.mostWanted")}</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tight">
              {t("products.featuredItems")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat.id} className="px-6 py-2 rounded-full border border-zinc-100 font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="animate-pulse bg-zinc-100 aspect-square rounded-[2rem]"></div>
                <div className="h-6 w-2/3 animate-pulse bg-zinc-100 rounded-full"></div>
                <div className="h-4 w-1/2 animate-pulse bg-zinc-100 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-24 bg-red-50 rounded-[3rem] border border-red-100">
            <p className="text-red-500 font-black text-xl mb-4">{t("products.connectionFailed")}</p>
            <p className="text-red-400 font-medium">{(error as any).message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {products?.length === 0 && !isLoading && (
          <div className="text-center py-32">
            <ShoppingBag size={64} className="mx-auto text-zinc-200 mb-6" />
            <h3 className="text-3xl font-black text-zinc-900 mb-2">{t("products.noProducts")}</h3>
            <p className="text-zinc-400 font-medium text-lg">{t("products.noProductsDesc")}</p>
          </div>
        )}
      </main>

      <footer className="bg-zinc-50 border-t border-zinc-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-2xl font-black mb-6 italic">STORE.</h3>
            <p className="text-zinc-500 max-w-sm font-medium leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-zinc-400">{t("footer.support")}</h4>
            <ul className="space-y-4 font-bold text-zinc-900">
              <li>{t("footer.contact")}</li>
              <li>{t("footer.shipping")}</li>
              <li>{t("footer.returns")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-zinc-400">{t("footer.social")}</h4>
            <ul className="space-y-4 font-bold text-zinc-900">
              <li>{t("footer.instagram")}</li>
              <li>{t("footer.twitter")}</li>
              <li>{t("footer.linkedin")}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-zinc-200 text-center">
          <p className="text-zinc-400 text-sm font-black uppercase tracking-[0.2em]">
            © 2026 Professional E-Commerce — Built for Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
