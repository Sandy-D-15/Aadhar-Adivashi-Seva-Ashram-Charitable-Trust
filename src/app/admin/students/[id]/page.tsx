import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  Award,
  Clock,
  Calendar,
  Download,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Package,
  Plus,
  Star,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      visits: {
        orderBy: { date: "desc" },
        include: {
          activities: true,
          certificate: true,
        },
      },
      certificates: {
        orderBy: { issuedAt: "desc" },
      },
      donations: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const approvedVisits = student.visits.filter(
    (v) => v.status === "APPROVED" || v.status === "CERTIFICATE_ISSUED"
  );
  const totalVerifiedHours = approvedVisits.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E3192] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students Register
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#2E3192] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {student.studentId}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {student.purpose}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">{student.fullName}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {student.collegeName} • {student.course} ({student.yearSemester})
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center shrink-0">
            <span className="text-2xl font-black text-[#D32F2F] block">
              {totalVerifiedHours} hrs
            </span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Verified Service
            </span>
          </div>
        </div>

        {/* Contact & Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Personal Contact</span>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {student.phone}
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {student.email}
            </p>
            <p className="text-slate-500 text-[11px]">
              Location: {student.city || "Thane/Kalyan"} • Age: {student.age || "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Academic Liaison</span>
            <p>Roll No: <strong>{student.rollNumber || "—"}</strong></p>
            <p>Faculty Coord: <strong>{student.facultyName || "—"}</strong></p>
            <p className="text-slate-400 text-[11px]">Faculty Phone: {student.facultyPhone || "—"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Registered Interests</span>
            <p className="text-slate-700 leading-relaxed">
              {(() => {
                try {
                  const arr = JSON.parse(student.interests);
                  return Array.isArray(arr) ? arr.join(", ") : student.interests;
                } catch {
                  return student.interests;
                }
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Issued Certificates */}
      {student.certificates.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900 to-[#2E3192] text-white rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold">Official Certificates Issued</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <span className="font-mono font-bold text-xs text-amber-300 block">
                    {cert.certificateId}
                  </span>
                  <p className="font-bold text-xs text-white mt-0.5">
                    {cert.totalHours} Verified Hours ({cert.startDate} to {cert.endDate})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/api/certificates/${cert.certificateId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </a>
                  <Link
                    href={`/verify/${cert.certificateId}`}
                    target="_blank"
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold"
                  >
                    Verify ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visits Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-4 h-4 text-[#2E3192]" />
          Student Community Service Visits ({student.visits.length})
        </h2>

        <div className="space-y-3">
          {student.visits.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No visits recorded yet.</p>
          ) : (
            student.visits.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">
                    {v.date} • {v.location}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {v.status}
                  </span>
                </div>
                <p className="text-slate-700">{v.description}</p>
                {v.outcome && (
                  <p className="text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                    <strong>Outcome:</strong> {v.outcome}
                  </p>
                )}
                <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
                  <span>Hours: <strong className="text-[#2E3192]">{v.totalHours} hrs</strong></span>
                  <span>Supervisor: <strong>{v.supervisorName || "Ashram Team"}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
