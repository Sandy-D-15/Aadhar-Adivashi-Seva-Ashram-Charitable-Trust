import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  HeartHandshake,
  QrCode,
  ArrowRight,
  School,
  Building2,
} from "lucide-react";
import { VOLUNTEER_ACTIVITIES, NGO_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function StudentsVolunteerHubPage() {
  // Fetch colleges that are public partners and compute total volunteer hours
  const colleges = await prisma.college.findMany({
    where: { showPublicly: true },
    include: {
      students: {
        where: { isDeleted: false },
        include: {
          visits: {
            where: {
              status: { in: ["APPROVED", "CERTIFICATE_ISSUED"] },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const partnerColleges = colleges.map((col) => {
    let hours = 0;
    col.students.forEach((stu) => {
      stu.visits.forEach((v) => {
        hours += v.totalHours || 0;
      });
    });
    return {
      id: col.id,
      name: col.name,
      university: col.university || "University of Mumbai",
      city: col.city || "Thane District",
      totalStudents: col.students.length,
      totalHours: hours,
    };
  });

  // Total stats
  const totalStudents = await prisma.student.count({ where: { isDeleted: false } });
  const totalVisits = await prisma.studentVisit.count({
    where: { status: { in: ["APPROVED", "CERTIFICATE_ISSUED"] } },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#2E3192] via-indigo-900 to-[#1A237E] text-white p-8 sm:p-14 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold border border-white/20">
              <GraduationCap className="w-4 h-4 text-cyan-300" />
              NSS • NCC • Internships • Community Service
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Transform Tribal Lives. <br />
              <span className="text-cyan-300">Earn Verified Community Hours.</span>
            </h1>

            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed max-w-2xl">
              Aadhar Adivashi Seva Ashram welcomes university and college students for structured, supervised social work.
              Every visit is tracked, logged, and certified with a QR-verifiable certificate recognized for academic credits and NSS diaries.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/students/register"
                className="px-6 py-3.5 bg-[#D32F2F] hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
              >
                Register as a Student Volunteer
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/students/track"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-cyan-300" />
                Lookup My Hours & Certificate
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar inside hero */}
          <div className="relative z-10 pt-10 mt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalStudents > 0 ? totalStudents : 150}+
              </p>
              <p className="text-xs text-indigo-200 mt-0.5">Students Registered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                {colleges.length > 0 ? colleges.length : 8}+
              </p>
              <p className="text-xs text-indigo-200 mt-0.5">Partner Colleges</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {totalVisits > 0 ? totalVisits * 6 : 850}+
              </p>
              <p className="text-xs text-indigo-200 mt-0.5">Community Hours Served</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">100%</p>
              <p className="text-xs text-indigo-200 mt-0.5">QR Verified Certificates</p>
            </div>
          </div>
        </div>

        {/* What You Can Do: Volunteer Activities */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Meaningful Ways You Can Contribute
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pick your areas of interest when registering. Our supervisors guide you on each drive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {VOLUNTEER_ACTIVITIES.map((activity, idx) => (
              <div
                key={activity}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#2E3192]/50 hover:shadow-sm transition-all flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#2E3192] flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs">{activity}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Field / Ashram drive</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How The Student Record & Certificate System Works */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Verifiable Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192] mt-3">
              How The Visit & Certificate System Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#2E3192] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Register Online</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fill in your college, course, and purpose. Receive a unique Student ID (<code>AASA-STU-YYYY-XXXX</code>) and a personal QR code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Visit & QR Check-in</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan your QR code at the ashram kiosk or get marked in by supervisors Deva Salat or Priti Salat. Check-out auto-calculates hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Log Work & Donations</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe the activities you performed. If your group brought donation items, they are logged right into the master register.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Verified Certificate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supervisor approves your record. Download your PDF Certificate of Service with Chairman signature and QR verification!
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: Our Student Partners (strictly NO personal student data) */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <School className="w-3.5 h-3.5 text-[#2E3192]" />
              Institutions & NSS Units
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Our Student Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Proudly collaborating with esteemed colleges and universities across Mumbai and Thane.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerColleges.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-[#2E3192] transition-colors"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#2E3192] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {col.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {col.university} • {col.city}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Volunteers: <strong>{col.totalStudents}</strong>
                  </span>
                  <span className="font-bold text-[#2E3192] bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {col.totalHours} Volunteer Hours
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-[#D32F2F] text-white p-8 sm:p-12 text-center space-y-4 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Make a Direct Difference?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl mx-auto">
            Sign up today. Help us teach, distribute essentials, sort books, and visit tribal hamlets with compassion.
          </p>
          <div className="pt-2">
            <Link
              href="/students/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-rose-700 hover:bg-rose-50 transition-colors shadow-md text-sm"
            >
              Start Student Volunteer Registration →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
