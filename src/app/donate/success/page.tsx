"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NGO_CONFIG } from "@/lib/constants";
import {
  CheckCircle2,
  Heart,
  Share2,
  Download,
  Search,
  MessageCircle,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import confetti from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "AASA-DON-2026-XXXX";
  const receipt = searchParams.get("receipt");
  const type = searchParams.get("type") || "Donation";
  const name = searchParams.get("name") || "Kind Donor";
  const amount = searchParams.get("amount");

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti unavailable
    }
  }, []);

  const whatsappShareText = encodeURIComponent(
    `Namaste Deva Salat ji, I have registered a ${type} donation with Aadhar Adivashi Seva Ashram.\nReference ID: ${ref}${
      receipt ? `\nReceipt No: ${receipt}` : ""
    }${amount ? `\nAmount: Rs. ${amount}` : ""}\nDonor: ${name}`
  );

  const whatsappUrl = `https://wa.me/91${NGO_CONFIG.chairman.phone}?text=${whatsappShareText}`;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Donation Successfully Recorded
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Thank You, {name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Your generous {type.toLowerCase()} contribution directly supports tribal children and families in Thane & Kalyan.
          </p>
        </div>

        {/* Reference & Receipt Numbers Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-left">
          <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Donation Reference ID:</span>
            <span className="font-mono font-bold text-sm text-[#2E3192]">{ref}</span>
          </div>

          {receipt && (
            <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Official Receipt No:</span>
              <span className="font-mono font-bold text-sm text-emerald-700">{receipt}</span>
            </div>
          )}

          {amount && (
            <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Contribution Amount:</span>
              <span className="font-bold text-sm text-slate-900">₹ {amount}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-500 pt-1">
            Keep your Reference ID safe to check pickup status or download certificates anytime.
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          {/* WhatsApp Direct Share Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs flex items-center justify-center gap-2.5 text-xs sm:text-sm"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            Share with Chairman on WhatsApp
          </a>

          {/* Download Receipt if available */}
          {receipt && (
            <a
              href={`/api/receipts/${receipt}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-xl font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Download className="w-4 h-4 text-indigo-700" />
              Download Official PDF Receipt
            </a>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href={`/track?ref=${ref}`}
              className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              Track Status
            </Link>
            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 text-xs"
            >
              Return Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading receipt details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
