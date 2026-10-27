"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { NGO_CONFIG, DONATION_TYPES, formatEstablishedDate } from "@/lib/constants";
import { MapPin, Phone, Mail, Heart, Shield, Award } from "lucide-react";

export function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t-4 border-[#D32F2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About & Trust Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-slate-700 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Aadhar Adivashi Seva Ashram Logo"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full rounded-full"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">
                  {NGO_CONFIG.shortName}
                </h3>
                <p className="text-xs text-rose-400 font-medium">
                  Charitable Trust (Regd. 1950)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.aboutText}
            </p>

            <div className="pt-2 text-xs text-slate-300 space-y-1.5 border-t border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>Serving the community since 2012</span>
              </div>
              <p className="text-slate-400">
                Established:{" "}
                <span className="text-slate-200 font-semibold">
                  {formatEstablishedDate(locale)}
                </span>
              </p>
              <p className="text-slate-400">{NGO_CONFIG.regNo}</p>
            </div>
          </div>

          {/* Col 2: Ways to Donate (All 7 types) */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              {t.footer.categories}
            </h4>
            <ul className="space-y-2 text-xs">
              {DONATION_TYPES.map((type) => (
                <li key={type.key}>
                  <Link
                    href={type.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{type.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/track"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
                >
                  Track Donation Status →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Work Register & Community */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Student Register
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/students"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Volunteer Overview & Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/students/register"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  College Student Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/students/track"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Lookup Student Hours & Records
                </Link>
              </li>
              <li>
                <Link
                  href="/students"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Our College Partners (NSS / CSR)
                </Link>
              </li>
              <li className="pt-3">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin & Supervisor Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Address & Contacts */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Contact Ashram
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <a
                  href={NGO_CONFIG.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {NGO_CONFIG.address}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p>
                    Chairman:{" "}
                    <a
                      href={`tel:${NGO_CONFIG.chairman.phone}`}
                      className="text-slate-200 font-semibold hover:text-white"
                    >
                      {NGO_CONFIG.chairman.phone}
                    </a>{" "}
                    ({NGO_CONFIG.chairman.name})
                  </p>
                  <p>
                    Secretary:{" "}
                    <a
                      href={`tel:${NGO_CONFIG.secretary.phone}`}
                      className="text-slate-200 font-semibold hover:text-white"
                    >
                      {NGO_CONFIG.secretary.phone}
                    </a>{" "}
                    ({NGO_CONFIG.secretary.name})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${NGO_CONFIG.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {NGO_CONFIG.email}
                </a>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Official Drop-off Hours: {NGO_CONFIG.dropoffHours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright, Legal & Patch compliance */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {NGO_CONFIG.name}. {t.footer.rights}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy & Student Data
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-slate-300">
              About Trust
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
