"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
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
  );
}
