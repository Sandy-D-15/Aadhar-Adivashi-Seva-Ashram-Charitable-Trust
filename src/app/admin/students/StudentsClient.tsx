"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { STUDENT_PURPOSES } from "@/lib/constants";
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Award,
  Clock,
  Building,
  User,
  Plus,
} from "lucide-react";

interface StudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  phone: string;
  email: string;
  collegeName: string;
  course: string;
  yearSemester: string;
  purpose: string;
  createdAt: Date | string;
  visits: Array<{
    id: string;
    totalHours: number;
    status: string;
    date: string;
  }>;
  certificates: Array<{
    id: string;
    certificateId: string;
  }>;
}

export default function StudentsClient({
  initialStudents,
  colleges,
  userRole,
}: {
  initialStudents: StudentRecord[];
  colleges: Array<{ id: string; name: string }>;
  userRole: string;
}) {
  const [students] = useState<StudentRecord[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("ALL");
  const [selectedPurpose, setSelectedPurpose] = useState("ALL");

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.collegeName.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q);

      const matchCollege =
        selectedCollege === "ALL" || s.collegeName === selectedCollege;
      const matchPurpose =
        selectedPurpose === "ALL" || s.purpose === selectedPurpose;

      return matchSearch && matchCollege && matchPurpose;
    });
  }, [students, search, selectedCollege, selectedPurpose]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Student Volunteer Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of all registered university and college volunteers, tracked hours, and issued certificates.
          </p>
        </div>

        <Link
          href="/students/register"
          target="_blank"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Open Public Registration
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, Student ID, phone, college, course..."
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
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          >
            <option value="ALL">All Purposes</option>
            {STUDENT_PURPOSES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
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
                <th className="p-4">Student ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">College & Course</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Phone & Email</th>
                <th className="p-4">Visits</th>
                <th className="p-4">Total Hours</th>
                <th className="p-4">Certificates</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No student volunteers found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const hours = s.visits
                    .filter((v) => v.status === "APPROVED" || v.status === "CERTIFICATE_ISSUED")
                    .reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#2E3192] whitespace-nowrap">
                        {s.studentId}
                      </td>
                      <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                        {s.fullName}
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <span className="font-semibold text-slate-800 block truncate">
                          {s.collegeName}
                        </span>
                        <span className="text-slate-400 text-[11px] block">
                          {s.course} ({s.yearSemester})
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#2E3192]">
                          {s.purpose}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="block text-slate-700">{s.phone}</span>
                        <span className="text-[11px] text-slate-400 block">{s.email}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        {s.visits.length}
                      </td>
                      <td className="p-4 font-extrabold text-[#D32F2F]">
                        {hours} hrs
                      </td>
                      <td className="p-4">
                        {s.certificates && s.certificates.length > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                            <Award className="w-3 h-3" />
                            {s.certificates.length} Issued
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending</span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/students/${s.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#2E3192] font-semibold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Profile & Log
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
