import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NGO_CONFIG, getYearsOfService, formatEstablishedDate } from "@/lib/constants";
import {
  Award,
  ShieldCheck,
  Heart,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const years = getYearsOfService();

  const milestones = [
    {
      year: "20 December 2012",
      title: "Founding of the Ashram Trust",
      desc: "Founded by Deva Salat and Priti Salat with a solemn pledge to serve marginalized Adivasi (tribal) families and children with dignity and care.",
    },
    {
      year: "2016",
      title: "Outreach Across Kalyan & Thane Districts",
      desc: "Expanded regular clothing, winter blanket, and ration distribution drives into remote rural hamlets around Shilphata, Kalyan, and Diva.",
    },
    {
      year: "2020",
      title: "COVID-19 Relief & Food Security",
      desc: "Provided critical cooked meals and dry ration kits to over 1,200 tribal families during lockdown crises.",
    },
    {
      year: "2023",
      title: "College Student Work Register Launch",
      desc: "Instituted structured community service programs with leading Mumbai and Thane colleges, offering academic credits, NSS diaries, and verifiable certificates.",
    },
    {
      year: "Present",
      title: "7-Category Holistic Community Care",
      desc: "Expanded donation networks covering clothes, food, toys, learning materials, musical instruments, furniture, and institutional CSR partnerships.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
            <Award className="w-4 h-4 text-rose-600" />
            Serving the Community Since 2012 ({years}+ Years)
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#2E3192] tracking-tight">
            About Aadhar Adivashi Seva Ashram
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {NGO_CONFIG.mission}
          </p>
        </div>

        {/* Legal & Registration Snapshot */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#2E3192] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Registration
              </h2>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {NGO_CONFIG.regNo}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Charity Commissioner, Mumbai</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Established Date
              </h2>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {formatEstablishedDate("en")} (20-12-2012)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {years} Continuous Years of Active Service
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Ashram Address
              </h2>
              <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                {NGO_CONFIG.address}
              </p>
              <a
                href={NGO_CONFIG.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-700 hover:underline font-semibold mt-1 inline-block"
              >
                Google Maps Location ↗
              </a>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Trust Leadership & Trustees
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Dedicated founders working directly at the grassroots level every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Chairman */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#2E3192] text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                DS
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Chairman & Founder
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {NGO_CONFIG.chairman.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Phone:{" "}
                  <a
                    href={`tel:${NGO_CONFIG.chairman.phone}`}
                    className="text-[#2E3192] font-bold hover:underline"
                  >
                    +91 {NGO_CONFIG.chairman.phone}
                  </a>
                </p>
                <p className="text-xs text-slate-500">
                  Email: {NGO_CONFIG.chairman.email}
                </p>
              </div>
            </div>

            {/* Secretary */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#D32F2F] text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                PS
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Secretary & Trustee
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {NGO_CONFIG.secretary.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Phone:{" "}
                  <a
                    href={`tel:${NGO_CONFIG.secretary.phone}`}
                    className="text-[#2E3192] font-bold hover:underline"
                  >
                    +91 {NGO_CONFIG.secretary.phone}
                  </a>
                </p>
                <p className="text-xs text-slate-500">
                  Community Coordination & Child Education Lead
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline of Milestones (PATCH requirement) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
              Our Journey of Service Since 2012
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Key milestones in our commitment to tribal welfare and child education.
            </p>
          </div>

          <div className="relative border-l-2 border-indigo-200 ml-4 sm:ml-8 pl-6 space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#2E3192] border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#D32F2F] hover:bg-rose-700 transition-colors shadow-md text-sm"
          >
            Support Our Mission With a Donation →
          </Link>
        </div>
      </div>
    </div>
  );
}
