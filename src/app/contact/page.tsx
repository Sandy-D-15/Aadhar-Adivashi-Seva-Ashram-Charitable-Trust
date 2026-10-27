"use client";

import React, { useState } from "react";
import { NGO_CONFIG } from "@/lib/constants";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/91${NGO_CONFIG.chairman.phone}?text=${encodeURIComponent(
    `Namaste Deva Salat ji, my name is ${name || "a donor/volunteer"}. I would like to inquire about: ${subject}.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E3192]">
            Contact Ashram & Leadership
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Have questions about donations, student volunteer hours, pickup logistics, or CSR partnerships? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Ashram & Communication Points
              </h2>

              <div className="space-y-5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Ashram Center Location:</strong>
                    <p className="leading-relaxed">{NGO_CONFIG.address}</p>
                    <a
                      href={NGO_CONFIG.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E3192] font-bold underline mt-1.5 inline-block text-[11px]"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Direct Phone Numbers:</strong>
                    <p>
                      Chairman Deva Salat:{" "}
                      <a href={`tel:${NGO_CONFIG.chairman.phone}`} className="font-bold text-[#2E3192] hover:underline">
                        +91 {NGO_CONFIG.chairman.phone}
                      </a>
                    </p>
                    <p className="mt-0.5">
                      Secretary Priti Salat:{" "}
                      <a href={`tel:${NGO_CONFIG.secretary.phone}`} className="font-bold text-[#2E3192] hover:underline">
                        +91 {NGO_CONFIG.secretary.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Email Support:</strong>
                    <a href={`mailto:${NGO_CONFIG.email}`} className="text-[#2E3192] hover:underline">
                      {NGO_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#2E3192] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Drop-off & Visiting Hours:</strong>
                    <p>{NGO_CONFIG.dropoffHours}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct connect */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-xs shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  Chat Directly on WhatsApp with Chairman
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form & Map placeholder */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Send an Online Inquiry / Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. Our team will contact you shortly on your registered phone or email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-indigo-700 font-bold underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Deshmukh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Phone (10 Digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9820123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. anand@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Donation Pickup Assistance">Donation Pickup Assistance</option>
                      <option value="College Student Volunteering / NSS">College Student Volunteering / NSS</option>
                      <option value="Corporate CSR Partnership">Corporate CSR Partnership</option>
                      <option value="Certificate Verification Help">Certificate Verification Help</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Message / Questions <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please let us know how we can assist you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
