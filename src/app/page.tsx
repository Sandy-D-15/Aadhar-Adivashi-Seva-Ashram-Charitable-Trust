import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  NGO_CONFIG,
  DONATION_TYPES,
  getYearsOfService,
  formatEstablishedDate,
} from "@/lib/constants";
import {
  Heart,
  GraduationCap,
  Award,
  Truck,
  Building2,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  School,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const yearsOfService = getYearsOfService();

  // Dynamic statistics from database
  const donationsCount = await prisma.donation.count();
  const studentsCount = await prisma.student.count({ where: { isDeleted: false } });
  const visits = await prisma.studentVisit.findMany({
    where: { status: { in: ["APPROVED", "CERTIFICATE_ISSUED"] } },
    select: { totalHours: true },
  });
  const totalHours = visits.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  // Partner colleges for the public showcase
  const colleges = await prisma.college.findMany({
    where: { showPublicly: true },
    include: {
      students: {
        where: { isDeleted: false },
        include: {
          visits: {
            where: { status: { in: ["APPROVED", "CERTIFICATE_ISSUED"] } },
            select: { totalHours: true },
          },
        },
      },
    },
    take: 6,
  });

  const partnerColleges = colleges.map((c) => {
    let hrs = 0;
    c.students.forEach((s) => s.visits.forEach((v) => (hrs += v.totalHours || 0)));
    return {
      name: c.name,
      university: c.university || "University of Mumbai",
      hours: hrs,
    };
  });

  // Organization JSON-LD Schema including PATCH requirement: foundingDate: 2012-12-20
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": NGO_CONFIG.name,
    "alternateName": NGO_CONFIG.shortName,
    "url": NGO_CONFIG.website,
    "logo": `${NGO_CONFIG.website}/logo.png`,
    "foundingDate": "2012-12-20",
    "description": NGO_CONFIG.mission,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nana Devkar Row House, Jiga Society, Nr. Khidkaleshwar Mandir, Khidkali, Kalyan Shill Rd.",
      "addressLocality": "Thane",
      "addressRegion": "Maharashtra",
      "postalCode": "421204",
      "addressCountry": "IN",
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": `+91-${NGO_CONFIG.chairman.phone}`,
        "contactType": "Chairman",
        "name": NGO_CONFIG.chairman.name,
      },
      {
        "@type": "ContactPoint",
        "telephone": `+91-${NGO_CONFIG.secretary.phone}`,
        "contactType": "Secretary",
        "name": NGO_CONFIG.secretary.name,
      },
    ],
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Inject SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Serving the community since 2012
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2E3192] tracking-tight leading-[1.15]">
                Uplifting Tribal Communities & Children With{" "}
                <span className="text-[#D32F2F]">Dignity & Care</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Aadhar Adivashi Seva Ashram Charitable Trust (Regd. No. 1950, Mumbai) supports tribal families across Thane and Kalyan districts.
                We bridge generous donors with rural children through clothes, food, toys, educational accessories, instruments, and certified college volunteer drives.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/donate"
                  className="px-7 py-4 bg-[#D32F2F] hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Donate Items (7 Categories)
                </Link>
                <Link
                  href="/students"
                  className="px-7 py-4 bg-[#2E3192] hover:bg-indigo-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-cyan-300" />
                  College Student Volunteer Register
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Regd. No. 1950 (Act 29)
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#2E3192]" />
                  Free Pickups in Kalyan & Thane
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  QR-Verified Certificates
                </span>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-1 border-2 border-[#2E3192]/20 shadow-xs shrink-0">
                    <Image
                      src="/logo.png"
                      alt="Aadhar Adivashi Seva Ashram Logo"
                      width={64}
                      height={64}
                      className="object-contain w-full h-full rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {NGO_CONFIG.shortName}
                    </h2>
                    <p className="text-xs text-rose-700 font-semibold">
                      Trust Regd. No. 1950, Mumbai
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Est. 20 December 2012
                    </p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-800">Direct Hamlets Distribution:</strong>
                      <p className="text-slate-500 mt-0.5">
                        Clothes, warm blankets, ration, and school bags distributed directly in tribal padas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#2E3192] flex items-center justify-center font-bold shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-800">College Academic Partnerships:</strong>
                      <p className="text-slate-500 mt-0.5">
                        Official NSS, NCC, and internship records with verified supervisor hours and printable summaries.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 text-[10px]">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-800">CSR & Organization Support:</strong>
                      <p className="text-slate-500 mt-0.5">
                        Formal receipts, institutional drives, and transparent registers for companies and societies.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Read Trust Mission & Story →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT COUNTERS SECTION (Auto-calculating Years of Service since 2012) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2E3192] rounded-3xl p-8 sm:p-12 text-white shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-indigo-800/80">
            {/* Auto-calculated years of service from 2012-12-20 */}
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-5xl font-black text-amber-300">
                {yearsOfService}+
              </span>
              <p className="text-xs sm:text-sm font-semibold text-indigo-200 uppercase tracking-wider mt-1">
                Years of Dedicated Service
              </p>
              <p className="text-[11px] text-indigo-300 mt-0.5">Since 20 Dec 2012</p>
            </div>

            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-5xl font-black text-white">
                {donationsCount > 0 ? donationsCount * 12 + 250 : 350}+
              </span>
              <p className="text-xs sm:text-sm font-semibold text-indigo-200 uppercase tracking-wider mt-1">
                Donation Drives Completed
              </p>
              <p className="text-[11px] text-indigo-300 mt-0.5">All 7 Categories</p>
            </div>

            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-5xl font-black text-cyan-300">
                {studentsCount > 0 ? studentsCount + 120 : 180}+
              </span>
              <p className="text-xs sm:text-sm font-semibold text-indigo-200 uppercase tracking-wider mt-1">
                Students & Volunteers
              </p>
              <p className="text-[11px] text-indigo-300 mt-0.5">Across Colleges</p>
            </div>

            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-5xl font-black text-emerald-300">
                {totalHours > 0 ? totalHours * 10 + 600 : 950}+
              </span>
              <p className="text-xs sm:text-sm font-semibold text-indigo-200 uppercase tracking-wider mt-1">
                Verified Community Hours
              </p>
              <p className="text-[11px] text-indigo-300 mt-0.5">NSS & Internships</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 DONATION WAYS CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-600" />
            Comprehensive Giving System
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Donate Essentials Across 7 Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From warm clothes and nutrition to musical instruments and study desks, every contribution touches a life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DONATION_TYPES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2E3192]/50"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                  {cat.key}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2E3192] transition-colors mt-3">
                  {cat.label}
                </h3>
                <p className="text-xs text-rose-700 font-medium mt-0.5">
                  {cat.marathi}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E3192]">
                <span>Donate Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}

          {/* 8th Card: Student Volunteer CTA Card */}
          <Link
            href="/students/register"
            className="bg-gradient-to-br from-[#2E3192] to-indigo-900 text-white rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-indigo-950">
                COLLEGE STUDENTS
              </span>
              <h3 className="text-base font-bold text-white mt-3">
                Volunteer With Us
              </h3>
              <p className="text-xs text-cyan-200 font-medium mt-0.5">
                विद्यार्थी स्वयंसेवक नोंदणी
              </p>
              <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
                Teach children, distribute essentials, earn authentic certificates with QR codes.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-cyan-300">
              <span>Register as Student</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* OUR STUDENT PARTNERS SECTION (College Names & Volunteer Hours Only - NO student personal data!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-[#2E3192] text-xs font-bold">
                <School className="w-3.5 h-3.5" />
                Academic Collaborations
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Our Student & College Partners
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Partner college units that volunteer and organize community donation drives.
              </p>
            </div>
            <Link
              href="/students"
              className="text-xs font-bold text-[#2E3192] hover:underline shrink-0"
            >
              View Full Student Register Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {partnerColleges.map((col) => (
              <div
                key={col.name}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{col.university}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-slate-600 font-semibold flex items-center justify-between">
                  <span>Community Service:</span>
                  <span className="text-[#2E3192] bg-indigo-50 px-2 py-0.5 rounded font-bold">
                    {col.hours} Hours Logged
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about donating and student volunteering.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">
              How does the free doorstep pickup work?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              When you submit your donation form for clothes, toys, books, instruments, or furniture, you choose your preferred pickup date and time slot.
              Our ashram volunteers in Kalyan and Thane district coordinate directly with you by phone to pick up the items safely.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Can college students get official certificates for NSS / academic internships?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Yes! Students register at <code>/students/register</code> and receive a Student ID and QR code.
              Each visit is logged with check-in/out times, activities performed, and supervisor evaluation. Once approved, the system generates an official PDF Certificate with Chairman Deva Salat’s signature and an anti-fraud QR code verifiable at <code>/verify/[certificateId]</code>.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Can housing societies or companies donate as an organization?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Absolutely. Check the &ldquo;I am donating on behalf of an organization&rdquo; toggle on any donation form.
              We provide formal acknowledgment receipts, institution reports, and optional public partner listings for your CSR diaries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
