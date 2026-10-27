import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  IndianRupee,
  Heart,
  Building2,
  GraduationCap,
  Clock,
  Download,
  Calendar,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { DONATION_TYPES, NGO_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Cash computations
  const allCashDonations = await prisma.donation.findMany({
    where: {
      amount: { not: null },
      status: { not: "VOIDED" },
    },
    select: { amount: true, createdAt: true },
  });

  const totalCashAllTime = allCashDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalCashYear = allCashDonations
    .filter((d) => new Date(d.createdAt) >= startOfYear)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalCashMonth = allCashDonations
    .filter((d) => new Date(d.createdAt) >= startOfMonth)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Counts by 7 donation categories
  const donationsByType = await Promise.all(
    DONATION_TYPES.map(async (t) => {
      const count = await prisma.donation.count({
        where: { donationType: t.key, status: { not: "VOIDED" } },
      });
      return { ...t, count };
    })
  );

  const totalDonations = await prisma.donation.count({ where: { status: { not: "VOIDED" } } });
  const activeOrgsCount = await prisma.organization.count({ where: { isDeleted: false } });
  const activeCollegesCount = await prisma.college.count();

  // Volunteer hours
  const visits = await prisma.studentVisit.findMany({
    where: { status: { in: ["APPROVED", "CERTIFICATE_ISSUED"] } },
    select: { totalHours: true },
  });
  const totalVolunteerHours = visits.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  // Recent 5 donations
  const recentDonations = await prisma.donation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { organization: { select: { name: true } } },
  });

  // Recent 5 student visits
  const recentVisits = await prisma.studentVisit.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { fullName: true, collegeName: true, studentId: true } },
    },
  });

  return (
    <div className="space-y-8">
      {/* Top Welcome & Report Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Trust Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all 7 donation streams, student registers, and partner organizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/reports/donations?format=csv"
            download
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Register (CSV)
          </a>
          <Link
            href="/admin/donation-register"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5"
          >
            + Manual Entry
          </Link>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Cash Received (This Month)</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹ {totalCashMonth.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            Current Billing Cycle
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Cash Received (This Year)</span>
            <span className="p-1.5 bg-indigo-50 text-[#2E3192] rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#2E3192]">
            ₹ {totalCashYear.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-slate-500 font-semibold block">
            Annual Financial Pool
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>All-Time Contributions</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700">
            ₹ {totalCashAllTime.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-slate-500 font-semibold block">
            Since 20 December 2012
          </span>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Total Donations</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {totalDonations}
          </span>
          <span className="text-[11px] text-rose-600 font-medium">Across all 7 types</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Active Donor Orgs</span>
          <span className="text-2xl font-black text-[#2E3192] mt-1 block">
            {activeOrgsCount}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">NGOs, Trusts & CSR</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Colleges Connected</span>
          <span className="text-2xl font-black text-cyan-700 mt-1 block">
            {activeCollegesCount}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">NSS Units & Univs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Verified Volunteer Hrs</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {totalVolunteerHours}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Certified community hrs</span>
        </div>
      </div>

      {/* Breakdown by 7 Donation Categories */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Donations Breakdown By 7 Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
          {donationsByType.map((t) => (
            <div
              key={t.key}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 inline-block ${t.badgeColor}`}>
                {t.label}
              </span>
              <div>
                <span className="text-2xl font-black text-slate-900 block">{t.count}</span>
                <span className="text-[11px] text-slate-500 font-medium">donations logged</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Recent Donations & Recent Student Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              Recent Donations (All Sources)
            </h2>
            <Link
              href="/admin/donation-register"
              className="text-xs font-bold text-[#2E3192] hover:underline"
            >
              View All Register →
            </Link>
          </div>

          <div className="space-y-3">
            {recentDonations.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      {d.receiptNo || d.referenceId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-[#2E3192]">
                      {d.donationType}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium mt-0.5">
                    {d.donorName}{" "}
                    {d.organization && (
                      <span className="text-slate-400">({d.organization.name})</span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {d.status}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Student Visits */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#2E3192]" />
              Recent Student Volunteer Visits
            </h2>
            <Link
              href="/admin/visits"
              className="text-xs font-bold text-[#2E3192] hover:underline"
            >
              Manage Visits →
            </Link>
          </div>

          <div className="space-y-3">
            {recentVisits.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {v.student.fullName}
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {v.student.collegeName} • {v.date}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#2E3192] bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                    {v.totalHours} hrs
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {v.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
