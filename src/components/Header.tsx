"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { Menu, X, Heart, GraduationCap, Search, PhoneCall, ShieldCheck } from "lucide-react";
import { NGO_CONFIG } from "@/lib/constants";

export function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = `https://wa.me/91${NGO_CONFIG.chairman.phone}?text=${encodeURIComponent(
    "Namaste! I would like to support Aadhar Adivashi Seva Ashram."
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro bar for trust registration and quick contact */}
      <div className="bg-[#2E3192] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-wide">
              {NGO_CONFIG.regNo}
            </span>
            <span className="text-indigo-200">|</span>
            <span className="text-indigo-100 font-normal">
              Serving the community since 2012
            </span>
          </div>
          <div className="flex items-center gap-4 text-indigo-100">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              Chairman: <strong>{NGO_CONFIG.chairman.phone}</strong>
            </span>
            <span className="text-indigo-300">|</span>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-xs hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Trust Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-[#2E3192]/20 p-0.5 group-hover:scale-105 transition-transform bg-white">
              <Image
                src="/logo.png"
                alt="Aadhar Adivashi Seva Ashram Logo"
                width={56}
                height={56}
                className="object-contain w-full h-full rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-[#2E3192] leading-tight tracking-tight">
                {NGO_CONFIG.shortName}
              </span>
              <span className="text-xs text-rose-700 font-semibold tracking-wide">
                Charitable Trust (Regd. 1950)
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                Khidkali, Kalyan-Shil Road, Thane
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className="hover:text-[#2E3192] transition-colors py-1"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/donate"
              className="flex items-center gap-1.5 text-rose-700 hover:text-rose-800 font-semibold transition-colors py-1"
            >
              <Heart className="w-4 h-4 fill-rose-100" />
              {t.nav.donate}
            </Link>
            <Link
              href="/students"
              className="flex items-center gap-1.5 hover:text-[#2E3192] transition-colors py-1"
            >
              <GraduationCap className="w-4 h-4 text-[#2E3192]" />
              {t.nav.volunteer}
            </Link>
            <Link
              href="/track"
              className="flex items-center gap-1 hover:text-[#2E3192] transition-colors py-1"
            >
              <Search className="w-3.5 h-3.5" />
              {t.nav.track}
            </Link>
            <Link
              href="/about"
              className="hover:text-[#2E3192] transition-colors py-1"
            >
              {t.nav.about}
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#2E3192] transition-colors py-1"
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-[#D32F2F] hover:bg-rose-700 transition-all shadow-xs"
            >
              Donate Now
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 rounded">
            {NGO_CONFIG.regNo}
          </div>
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-rose-700 font-bold hover:bg-rose-50 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-rose-100" />
              {t.nav.donate} (7 Ways to Give)
            </Link>
            <Link
              href="/students"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100 flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-[#2E3192]" />
              {t.nav.volunteer}
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t.nav.track}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              {t.nav.about}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              {t.nav.contact}
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md bg-slate-100 text-[#2E3192] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </nav>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#D32F2F] hover:bg-rose-700 transition-colors shadow-xs"
            >
              Direct WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
