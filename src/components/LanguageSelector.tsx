"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200 text-xs font-medium">
      <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
      <button
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1 rounded-full transition-all ${
          locale === "en"
            ? "bg-white text-indigo-900 shadow-xs font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLocale("mr")}
        className={`px-2.5 py-1 rounded-full transition-all ${
          locale === "mr"
            ? "bg-white text-indigo-900 shadow-xs font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        मराठी
      </button>
      <button
        onClick={() => setLocale("hi")}
        className={`px-2.5 py-1 rounded-full transition-all ${
          locale === "hi"
            ? "bg-white text-indigo-900 shadow-xs font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
