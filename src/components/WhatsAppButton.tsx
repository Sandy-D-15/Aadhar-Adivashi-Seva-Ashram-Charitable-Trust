"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { NGO_CONFIG } from "@/lib/constants";

export function WhatsAppFloatingButton() {
  const whatsappUrl = `https://wa.me/91${NGO_CONFIG.chairman.phone}?text=${encodeURIComponent(
    "Namaste! I would like to support Aadhar Adivashi Seva Ashram or inquire about donations/volunteering."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
      aria-label="Chat on WhatsApp with Chairman"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
      <span className="hidden sm:inline text-sm font-semibold tracking-wide">
        WhatsApp Us
      </span>
      <span className="inline-block w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping group-hover:animate-none" />
    </a>
  );
}
