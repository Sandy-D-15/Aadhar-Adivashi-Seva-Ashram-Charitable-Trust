"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DONATION_TYPES, NGO_CONFIG, getYearsOfService } from "@/lib/constants";
import {
  Shirt,
  Utensils,
  Gamepad2,
  BookOpen,
  Music,
  IndianRupee,
  Armchair,
  Building2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  HeartHandshake,
} from "lucide-react";

export default function DonateOverviewPage() {
  const { t } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shirt":
        return <Shirt className="w-6 h-6" />;
      case "Utensils":
        return <Utensils className="w-6 h-6" />;
      case "Gamepad2":
        return <Gamepad2 className="w-6 h-6" />;
      case "BookOpen":
        return <BookOpen className="w-6 h-6" />;
      case "Music":
        return <Music className="w-6 h-6" />;
      case "IndianRupee":
        return <IndianRupee className="w-6 h-6" />;
      case "Armchair":
        return <Armchair className="w-6 h-6" />;
      default:
        return <Shirt className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold tracking-wide">
            <HeartHandshake className="w-4 h-4" />
            7 Ways to Bring Hope & Smiles
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E3192] tracking-tight">
            {t.donations.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.donations.subtitle}
          </p>
          <div className="text-xs text-slate-500 font-medium">
            Free doorstep pickup available across Kalyan, Khidkali, Dombivli, Diva, and Thane district.
          </div>
        </div>

        {/* 7 Donation Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DONATION_TYPES.map((cat) => (
            <div
              key={cat.key}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cat.gradient} shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    {getIcon(cat.icon)}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.badgeColor}`}
                  >
                    {cat.key}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#2E3192] transition-colors">
                  {cat.label}
                </h2>
                <p className="text-xs text-rose-700 font-medium mt-0.5">
                  {cat.marathi}
                </p>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Pickup / Drop
                </span>
                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs"
                >
                  Donate {cat.label.split(" ")[0]} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Organization / CSR / Corporate Donation Banner */}
        <div className="bg-gradient-to-r from-[#2E3192] to-indigo-900 rounded-3xl p-8 text-white shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-indigo-800/80 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200">
                <Building2 className="w-4 h-4" />
                {t.donations.orgDonateTitle}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Partner with Aadhar Adivashi Seva Ashram
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl">
                {t.donations.orgDonateDesc} Every form supports corporate and institutional donations with official receipts and acknowledgment certificates.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap gap-3">
              <Link
                href="/donate/money"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Donate via Bank / Online
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all"
              >
                Inquire for CSR Drives
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works & Trust Pillars */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900">How The Donation Process Works</h2>
            <p className="text-xs text-slate-500 mt-1">Simple, transparent, and verified community support</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Fill The Category Form</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your items, describe the quantity and condition, and schedule your preferred pickup slot or drop-off.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#2E3192] flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Volunteer Pickup & Sorting</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our ashram coordinators collect the goods, inspect them with dignity, and sort them for children and families.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Direct Distribution & Receipt</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Items reach tribal hamlets across Kalyan & Thane. You receive a verified receipt and tracking link.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Track donation status CTA */}
        <div className="text-center py-4">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E3192] hover:underline"
          >
            <Search className="w-4 h-4" />
            Already made a donation? Track its status using your Reference ID →
          </Link>
        </div>
      </div>
    </div>
  );
}
