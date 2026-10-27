"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DONATION_TYPES } from "@/lib/constants";
import {
  HeartHandshake,
  Search,
  Plus,
  Download,
  Award,
  School,
  User,
  Package,
  IndianRupee,
  Calendar,
  X,
  CheckCircle2,
} from "lucide-react";

interface StudentDonationRecord {
  id: string;
  referenceId: string;
  receiptNo?: string | null;
  donationType: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string | null;
  amount?: number | null;
  paymentMode?: string | null;
  notes?: string | null;
  receivedBy?: string | null;
  createdAt: Date | string;
  student?: {
    id: string;
    studentId: string;
    fullName: string;
    collegeName: string;
    phone: string;
    email: string;
  } | null;
  college?: {
    id: string;
    name: string;
    facultyName?: string | null;
    facultyPhone?: string | null;
  } | null;
  items: Array<{
    id: string;
    itemType: string;
    quantity: string;
    condition?: string | null;
  }>;
}

export default function StudentDonationsClient({
  initialDonations,
  colleges,
  students,
  supervisors,
  userRole,
  userName,
}: {
  initialDonations: StudentDonationRecord[];
  colleges: Array<{ id: string; name: string; facultyName?: string | null; facultyPhone?: string | null }>;
  students: Array<{ id: string; fullName: string; studentId: string; collegeName: string; collegeId?: string | null }>;
  supervisors: string[];
  userRole: string;
  userName: string;
}) {
  const router = useRouter();
  const [donations, setDonations] = useState<StudentDonationRecord[]>(initialDonations);

  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [showDriveModal, setShowDriveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Group Drive Form State
  const [driveForm, setDriveForm] = useState({
    collegeId: colleges[0]?.id || "",
    studentId: "",
    driveTitle: "",
    donationType: "LEARNING",
    itemType: "Notebooks & School Kits",
    quantity: "150 Sets",
    condition: "NEW",
    amount: "",
    paymentMode: "CASH",
    receivedBy: supervisors[0] || userName,
    notes: "",
  });

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        d.donorName.toLowerCase().includes(q) ||
        (d.receiptNo && d.receiptNo.toLowerCase().includes(q)) ||
        (d.student && d.student.studentId.toLowerCase().includes(q)) ||
        (d.college && d.college.name.toLowerCase().includes(q));

      const matchCollege =
        selectedCollege === "ALL" ||
        (d.college && d.college.id === selectedCollege) ||
        (d.student && d.student.collegeName === selectedCollege);

      const matchCat = selectedCategory === "ALL" || d.donationType === selectedCategory;

      return matchSearch && matchCollege && matchCat;
    });
  }, [donations, search, selectedCollege, selectedCategory]);

  // Summaries
  const summary = useMemo(() => {
    let cash = 0;
    const uniqueStudents = new Set<string>();

    filteredDonations.forEach((d) => {
      if (d.amount) cash += d.amount;
      if (d.student) uniqueStudents.add(d.student.id);
    });

    return {
      totalDonations: filteredDonations.length,
      totalStudents: uniqueStudents.size,
      totalCash: cash,
    };
  }, [filteredDonations]);

  const handleDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const col = colleges.find((c) => c.id === driveForm.collegeId);
      const stu = students.find((s) => s.id === driveForm.studentId);

      const payload = {
        donationType: driveForm.donationType,
        donorType: "STUDENT",
        donorName: stu ? stu.fullName : `${col?.name || "College"} NSS Drive`,
        donorPhone: stu ? stu.fullName : (col?.facultyPhone || "N/A"),
        collegeId: driveForm.collegeId,
        studentId: driveForm.studentId || undefined,
        amount: driveForm.amount ? parseFloat(driveForm.amount) : undefined,
        paymentMode: driveForm.amount ? driveForm.paymentMode : undefined,
        itemType: driveForm.itemType,
        quantity: driveForm.quantity,
        condition: driveForm.condition,
        receivedBy: driveForm.receivedBy,
        notes: `Combined College Drive: ${driveForm.driveTitle || col?.name}`,
      };

      const res = await fetch("/api/admin/donations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record drive donation");

      setShowDriveModal(false);
      router.refresh();
      setDonations([data.donation, ...donations]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error recording drive");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Student & College Visit Donation Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of items and monetary collections brought by students and college NSS units during visits.
          </p>
        </div>

        <button
          onClick={() => setShowDriveModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Combined College Drive
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#2E3192] flex items-center justify-center font-bold shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Student Drives
            </span>
            <span className="text-xl font-black text-slate-900">
              {summary.totalDonations} Collections
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center font-bold shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Contributing Students
            </span>
            <span className="text-xl font-black text-cyan-800">
              {summary.totalStudents} Students
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Cash Collections
            </span>
            <span className="text-xl font-black text-emerald-700">
              ₹ {summary.totalCash.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, college, receipt no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          >
            <option value="ALL">All Colleges</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          >
            <option value="ALL">All Categories</option>
            {DONATION_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Date</th>
                <th className="p-4">College Name</th>
                <th className="p-4">Student & ID</th>
                <th className="p-4">Faculty Liaison</th>
                <th className="p-4">Category</th>
                <th className="p-4">Items / Details</th>
                <th className="p-4">Quantity / Amount</th>
                <th className="p-4">Received By</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No student/college donation records found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-4 font-bold text-slate-900 max-w-[200px]">
                      <span className="block truncate">
                        {d.college ? d.college.name : d.student ? d.student.collegeName : "College Drive"}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {d.student ? d.student.fullName : d.donorName}
                      </span>
                      {d.student && (
                        <span className="font-mono text-[10px] text-[#2E3192]">
                          {d.student.studentId}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {d.college?.facultyName || "—"}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#2E3192]">
                        {d.donationType}
                      </span>
                    </td>

                    <td className="p-4 max-w-[200px]">
                      {d.items && d.items.length > 0 ? (
                        d.items.map((it) => (
                          <span key={it.id} className="block truncate">
                            • {it.itemType}
                          </span>
                        ))
                      ) : (
                        <span>{d.notes || "Drive contribution"}</span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                      {d.amount ? (
                        <span className="text-emerald-700">₹ {d.amount.toLocaleString("en-IN")}</span>
                      ) : (
                        d.items.map((i) => i.quantity).join(", ")
                      )}
                    </td>

                    <td className="p-4 text-slate-600">
                      {d.receivedBy || "Ashram Staff"}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <a
                        href={`/api/receipts/${d.receiptNo || d.referenceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#2E3192] font-semibold text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        Receipt
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMBINED DRIVE MODAL */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2E3192]">
                  Log Combined College Drive Donation
                </h2>
                <p className="text-xs text-slate-500">
                  Record donations collected collectively by a college NSS unit or group.
                </p>
              </div>
              <button
                onClick={() => setShowDriveModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDriveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  College / Institution <span className="text-rose-500">*</span>
                </label>
                <select
                  value={driveForm.collegeId}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, collegeId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lead Student (Optional)
                </label>
                <select
                  value={driveForm.studentId}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, studentId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="">Whole Group / NSS Unit</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.collegeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Donation Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={driveForm.donationType}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, donationType: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  {DONATION_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Items Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 150 Storybooks"
                    value={driveForm.itemType}
                    onChange={(e) =>
                      setDriveForm({ ...driveForm, itemType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 150 Units / 50 kg"
                    value={driveForm.quantity}
                    onChange={(e) =>
                      setDriveForm({ ...driveForm, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Received By (Supervisor) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={driveForm.receivedBy}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, receivedBy: e.target.value })
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

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  {saving ? "Recording..." : "Save College Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
