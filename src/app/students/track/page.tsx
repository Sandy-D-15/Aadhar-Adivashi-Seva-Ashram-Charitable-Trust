"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  GraduationCap,
  Award,
  Clock,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle2,
  QrCode,
  Heart,
  Star,
  MapPin,
} from "lucide-react";

interface StudentRecord {
  studentId: string;
  fullName: string;
  collegeName: string;
  course: string;
  yearSemester: string;
  purpose: string;
  qrCodeDataUrl?: string | null;
  totalHours: number;
  visits: Array<{
    id: string;
    date: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    totalHours: number;
    location: string;
    description: string;
    outcome?: string | null;
    rating?: number | null;
    status: string;
    supervisorName?: string | null;
    broughtDonation: boolean;
    activities: Array<{ activity: string }>;
    certificate?: { certificateId: string } | null;
  }>;
  certificates: Array<{
    id: string;
    certificateId: string;
    recipientName: string;
    totalHours: number;
    startDate: string;
    endDate: string;
    issuedAt: string;
  }>;
  donations: Array<{
    referenceId: string;
    donationType: string;
    createdAt: string;
  }>;
}

function StudentTrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [studentId, setStudentId] = useState(initialId);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<StudentRecord | null>(null);

  useEffect(() => {
    if (initialId) {
      handleLookup(initialId, "");
    }
  }, [initialId]);

  const handleLookup = async (id: string, p: string) => {
    if (!id.trim()) {
      setError("Please enter your Student ID (e.g. AASA-STU-2026-0001).");
      return;
    }

    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const url = `/api/students/track?id=${encodeURIComponent(id.trim())}&phone=${encodeURIComponent(p.trim())}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Student record not found");
      setStudent(data.student);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error looking up student records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-[#2E3192] text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            Student Service Record & Certificate Lookup
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Lookup Your Volunteer Hours & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Enter your Student ID and registered phone number to view all visits, supervisor ratings, and download verified certificates.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(studentId, phone);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AASA-STU-2026-0001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Mobile Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9820123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
            >
              <Search className="w-4 h-4" />
              {loading ? "Searching Work Register..." : "Lookup My Volunteer Records"}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Student Profile & Visits */}
        {student && (
          <div className="space-y-6 animate-fadeIn">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#2E3192] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {student.studentId}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {student.purpose}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {student.fullName}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {student.collegeName} • {student.course} ({student.yearSemester})
                </p>
              </div>

              {/* Total Hours Badge & QR */}
              <div className="flex items-center gap-5 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-black text-[#D32F2F] block">
                    {student.totalHours} hrs
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Verified Service
                  </span>
                </div>

                {student.qrCodeDataUrl && (
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={student.qrCodeDataUrl}
                      alt="Student QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Issued Certificates Section */}
            {student.certificates && student.certificates.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-900 to-[#2E3192] text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-300" />
                  <h3 className="text-lg font-bold">Official Certificates Issued</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {student.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-300 block">
                          {cert.certificateId}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1">
                          Certificate of Service ({cert.totalHours} Verified Hours)
                        </h4>
                        <p className="text-xs text-indigo-200 mt-0.5">
                          Period: {cert.startDate} to {cert.endDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={`/api/certificates/${cert.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </a>
                        <Link
                          href={`/verify/${cert.certificateId}`}
                          className="py-2 px-3 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Verify Page ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visits & Work Log */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#2E3192]" />
                  Visit Log & Attendance Register
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {student.visits.length} Visit(s) Recorded
                </span>
              </div>

              {student.visits.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No visits logged yet. Attend a scheduled drive or visit the ashram center to begin logging hours!
                </p>
              ) : (
                <div className="space-y-4">
                  {student.visits.map((v) => (
                    <div
                      key={v.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {v.date}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            {v.location}
                          </span>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            v.status === "APPROVED" || v.status === "CERTIFICATE_ISSUED"
                              ? "bg-emerald-100 text-emerald-800"
                              : v.status === "WORK_LOGGED"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {v.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {v.description}
                      </p>

                      {v.outcome && (
                        <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong>Outcome:</strong> {v.outcome}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>
                            Hours Logged: <strong className="text-[#2E3192]">{v.totalHours} hrs</strong>
                          </span>
                          {v.rating && (
                            <span className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              {v.rating}/5
                            </span>
                          )}
                        </div>

                        {v.supervisorName && (
                          <span>
                            Supervisor: <strong>{v.supervisorName}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentTrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading records...</div>}>
      <StudentTrackContent />
    </Suspense>
  );
}
