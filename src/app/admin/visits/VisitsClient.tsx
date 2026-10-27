"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Search,
  Plus,
  CheckCircle2,
  Award,
  Download,
  Clock,
  Star,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";

interface VisitRecord {
  id: string;
  studentId: string;
  date: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  totalHours: number;
  location: string;
  beneficiaryCount?: number | null;
  supervisorName?: string | null;
  description: string;
  outcome?: string | null;
  rating?: number | null;
  status: string;
  student: {
    fullName: string;
    studentId: string;
    collegeName: string;
  };
  certificate?: {
    certificateId: string;
  } | null;
}

export default function VisitsClient({
  initialVisits,
  students,
  supervisors,
  userRole,
  userName,
}: {
  initialVisits: VisitRecord[];
  students: Array<{ id: string; fullName: string; studentId: string; collegeName: string }>;
  supervisors: string[];
  userRole: string;
  userName: string;
}) {
  const router = useRouter();
  const [visits, setVisits] = useState<VisitRecord[]>(initialVisits);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    studentId: students[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    checkInTime: "10:00",
    checkOutTime: "16:00",
    totalHours: 6,
    location: "Khidkali Ashram Center",
    beneficiaryCount: 40,
    supervisorName: supervisors[0] || userName,
    description: "Tutored children in basic mathematics and English reading",
    outcome: "Children actively engaged with practice worksheets",
    rating: 5,
    status: "WORK_LOGGED",
  });

  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        v.student.fullName.toLowerCase().includes(q) ||
        v.student.studentId.toLowerCase().includes(q) ||
        v.student.collegeName.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);

      const matchStatus = selectedStatus === "ALL" || v.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [visits, search, selectedStatus]);

  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log visit");

      setShowModal(false);
      router.refresh();
      const stu = students.find((s) => s.id === form.studentId);
      if (stu) {
        setVisits([
          {
            ...data.visit,
            student: {
              fullName: stu.fullName,
              studentId: stu.studentId,
              collegeName: stu.collegeName,
            },
          },
          ...visits,
        ]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error creating visit");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (visitId: string) => {
    setProcessingId(visitId);
    try {
      const res = await fetch("/api/admin/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: "APPROVE", visitId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve visit");

      setVisits(
        visits.map((v) => (v.id === visitId ? { ...v, status: "APPROVED" } : v))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error approving visit");
    } finally {
      setProcessingId(null);
    }
  };

  const handleIssueCertificate = async (visitId: string) => {
    setProcessingId(visitId);
    try {
      const res = await fetch("/api/admin/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: "ISSUE_CERTIFICATE", visitId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to issue certificate");

      setVisits(
        visits.map((v) =>
          v.id === visitId
            ? {
                ...v,
                status: "CERTIFICATE_ISSUED",
                certificate: { certificateId: data.certificateId },
              }
            : v
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error issuing certificate");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Student Visits & Work Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log fieldwork hours, approve completed community drives, and issue verified certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/checkin"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            Open Kiosk Check-In
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Visit Record
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, Student ID, college, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
        >
          <option value="ALL">All Statuses</option>
          <option value="REGISTERED">REGISTERED</option>
          <option value="VISITED">VISITED</option>
          <option value="WORK_LOGGED">WORK_LOGGED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="CERTIFICATE_ISSUED">CERTIFICATE_ISSUED</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Date</th>
                <th className="p-4">Student & College</th>
                <th className="p-4">Location</th>
                <th className="p-4">Work Done</th>
                <th className="p-4">Check-In / Out</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Supervisor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No visit records found.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">
                      {v.date}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">
                        {v.student.fullName}
                      </span>
                      <span className="font-mono text-[10px] text-[#2E3192] block">
                        {v.student.studentId}
                      </span>
                      <span className="text-[11px] text-slate-400 block max-w-[150px] truncate">
                        {v.student.collegeName}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {v.location}
                    </td>

                    <td className="p-4 max-w-[200px]">
                      <p className="text-slate-800 line-clamp-2 leading-relaxed font-medium">
                        {v.description}
                      </p>
                      {v.outcome && (
                        <p className="text-slate-500 text-[10px] mt-0.5 truncate">
                          Outcome: {v.outcome}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {v.checkInTime || "—"} to {v.checkOutTime || "—"}
                    </td>

                    <td className="p-4 font-black text-[#D32F2F] whitespace-nowrap">
                      {v.totalHours} hrs
                    </td>

                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {v.supervisorName || "—"}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === "CERTIFICATE_ISSUED"
                            ? "bg-emerald-100 text-emerald-800"
                            : v.status === "APPROVED"
                            ? "bg-cyan-100 text-cyan-800"
                            : v.status === "WORK_LOGGED"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {v.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      {v.status === "WORK_LOGGED" && (
                        <button
                          disabled={processingId === v.id}
                          onClick={() => handleApprove(v.id)}
                          className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {v.status === "APPROVED" && (
                        <button
                          disabled={processingId === v.id}
                          onClick={() => handleIssueCertificate(v.id)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Issue Cert
                        </button>
                      )}

                      {v.certificate && (
                        <a
                          href={`/api/certificates/${v.certificate.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-[#2E3192] rounded-lg font-bold text-[11px]"
                        >
                          <Download className="w-3 h-3" />
                          Cert PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD VISIT */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2E3192]">
                  Log Student Visit & Community Work
                </h2>
                <p className="text-xs text-slate-500">Record attendance and work for registered students.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Registered Student <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentId} - {s.collegeName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hours Served <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    required
                    value={form.totalHours}
                    onChange={(e) =>
                      setForm({ ...form, totalHours: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supervisor</label>
                  <select
                    value={form.supervisorName}
                    onChange={(e) =>
                      setForm({ ...form, supervisorName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                  >
                    {supervisors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description of Work Done <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Outcome / Impact (Optional)
                </label>
                <input
                  type="text"
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  {saving ? "Saving..." : "Record Visit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
