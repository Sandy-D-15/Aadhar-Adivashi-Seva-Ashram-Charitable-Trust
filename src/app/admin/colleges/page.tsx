import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  School,
  Users,
  Clock,
  Phone,
  Mail,
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCollegesPage() {
  const colleges = await prisma.college.findMany({
    orderBy: { name: "asc" },
    include: {
      students: {
        where: { isDeleted: false },
        include: {
          visits: true,
        },
      },
      donations: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Colleges & University Partners
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of partner institutions, student volunteers, cumulative hours, and NSS/Internship reports.
          </p>
        </div>
      </div>

      {/* Grid of Colleges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((col) => {
          let totalHours = 0;
          let totalVisits = 0;
          let latestDate = "—";

          col.students.forEach((s) => {
            s.visits.forEach((v) => {
              totalVisits++;
              if (v.status === "APPROVED" || v.status === "CERTIFICATE_ISSUED") {
                totalHours += v.totalHours || 0;
              }
              if (v.date && (latestDate === "—" || v.date > latestDate)) {
                latestDate = v.date;
              }
            });
          });

          return (
            <div
              key={col.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2E3192]/60 transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#2E3192] flex items-center justify-center font-bold">
                    <School className="w-5 h-5" />
                  </div>
                  {col.showPublicly && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Public Partner
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {col.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {col.university} • {col.city || "Thane/Mumbai"}
                </p>

                {/* Faculty Contact */}
                {col.facultyName && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-semibold text-slate-700 block">
                      Faculty / NSS Coordinator:
                    </span>
                    <p className="font-bold text-[#2E3192]">{col.facultyName}</p>
                    {col.facultyPhone && (
                      <p className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                        <Phone className="w-3 h-3" /> {col.facultyPhone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Registered Students:</span>
                  <strong className="text-slate-900">{col.students.length}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Community Service Hours:</span>
                  <strong className="text-[#D32F2F] font-black">{totalHours} hrs</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Last Visit Recorded:</span>
                  <span className="text-slate-500 font-medium">{latestDate}</span>
                </div>

                <div className="pt-2">
                  <a
                    href={`/api/reports/college/${col.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-[#2E3192] rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print NSS / College Report (PDF)
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
