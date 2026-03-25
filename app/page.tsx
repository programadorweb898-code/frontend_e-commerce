"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, TrendingUp, Sparkles, Search, X, Filter } from "lucide-react";
import { Product } from "@/types";

export default function Home() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ["products", activeCategory, searchTerm, minPrice, maxPrice],
    queryFn: () => {
      let finalSearch = searchTerm;
      if (activeCategory !== "all" && !searchTerm) {
        const categoryMap: Record<string, string> = {
          'apparel': 'clothing', // Esto buscará men's clothing y women's clothing
          'tech': 'electronics',
          'home': 'jewelery'
        };
        finalSearch = categoryMap[activeCategory] || activeCategory;
      }
      return api.getProducts(finalSearch, minPrice || undefined, maxPrice || undefined);
    },
  });

  const categories = [
    { id: "all", label: t("products.all") },
    { id: "apparel", label: t("products.apparel") },
    { id: "tech", label: t("products.tech") },
    { id: "home", label: t("products.home") },
  ];

  const getRandomProducts = (products: Product[], count: number) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Modal de Nuestra Visión */}
      {isVisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsVisionModalOpen(false)}
              className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-6 italic">{t("hero.visionTitle")}</h2>
            <p className="text-gray-600 font-medium leading-relaxed text-lg">
              {t("hero.visionDescription")}
            </p>
            <button 
              onClick={() => setIsVisionModalOpen(false)}
              className="mt-8 w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        </div>
      )}

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
          
          {/* Controles de Búsqueda y Filtro */}
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                type="text"
                placeholder={t("navbar.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveCategory("all");
                }}
                className="w-full bg-white text-black pl-12 pr-4 py-4 rounded-[5px] border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
            
            <div className="flex gap-2 items-center bg-zinc-900/50 p-1 rounded-[5px] border border-zinc-800">
              <div className="relative w-24">
                <input 
                  type="number"
                  placeholder={t("products.minPrice")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-transparent text-white px-3 py-3 rounded-[5px] border border-zinc-700 focus:border-blue-500 outline-none text-sm font-bold"
                />
              </div>
              <span className="text-zinc-600">-</span>
              <div className="relative w-24">
                <input 
                  type="number"
                  placeholder={t("products.maxPrice")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-transparent text-white px-3 py-3 rounded-[5px] border border-zinc-700 focus:border-blue-500 outline-none text-sm font-bold"
                />
              </div>
              <div className="p-3 text-blue-500">
                <Filter size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              {t("hero.shopAll")}
            </button>
            <button 
              onClick={() => setIsVisionModalOpen(true)}
              className="border border-zinc-700 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-zinc-800 transition-all"
            >
              {t("hero.ourVision")}
            </button>
          </div>
        </div>
      </header>

      {/* Más Vendidos Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-zinc-900">Más Vendidos</h2>
            <p className="text-zinc-600 mt-2">Descubre nuestros productos más populares</p>
          </div>
          
          {products && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <div className="overflow-x-auto">
                <div className="flex space-x-6 pb-4">
                  {getRandomProducts(products, 4).map((product) => (
                    <div key={product._id} className="flex-shrink-0 w-64">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-2 font-black uppercase tracking-widest text-xs">
              <TrendingUp size={16} />
              <span>{t("products.mostWanted")}</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tight">
              {activeCategory === 'all' ? t("products.featuredItems") : categories.find(c => c.id === activeCategory)?.label}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchTerm("");
                }}
                className={`px-6 py-2 rounded-full border transition-all font-bold text-sm ${
                  activeCategory === cat.id 
                  ? 'bg-zinc-900 text-white border-zinc-900' 
                  : 'border-zinc-100 hover:bg-zinc-900 hover:text-white'
                }`}
              >
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
            <p className="text-red-400 font-medium">
              {error instanceof Error ? error.message : "Request failed"}
            </p>
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
