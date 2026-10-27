"use client";

import React, { useState } from "react";
import {
  QrCode,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  School,
  Sparkles,
} from "lucide-react";
import { SUPERVISORS_LIST } from "@/lib/constants";

export default function AdminKioskCheckinPage() {
  const [studentId, setStudentId] = useState("");
  const [supervisorName, setSupervisorName] = useState(SUPERVISORS_LIST[0].name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [lastAction, setLastAction] = useState<{
    studentName: string;
    action: string;
    hours?: number;
    time: string;
  } | null>(null);

  const handleAction = async (action: "CHECK_IN" | "CHECK_OUT") => {
    if (!studentId.trim()) {
      setError("Please enter or scan a Student ID (e.g. AASA-STU-2026-0001)");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          action,
          supervisorName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setSuccessMsg(data.message);
      setLastAction({
        studentName: data.studentName,
        action: action === "CHECK_IN" ? "Checked In" : "Checked Out",
        hours: data.hours,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setStudentId("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error processing check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-50 text-[#2E3192] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
          Kiosk Attendance & Work Check-In
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Fast check-in and check-out kiosk for student volunteers arriving at the Ashram or attending field drives.
        </p>
      </div>

      {/* Main Kiosk Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        {/* Supervisor selector */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Supervising Trust Member on Duty
          </label>
          <select
            value={supervisorName}
            onChange={(e) => setSupervisorName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white text-xs font-medium"
          >
            {SUPERVISORS_LIST.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.role}) - {s.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Student ID Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Scan or Enter Student Volunteer ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder="e.g. AASA-STU-2026-0001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAction("CHECK_IN");
                }
              }}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-indigo-200 focus:border-[#2E3192] focus:outline-none focus:ring-2 focus:ring-indigo-100 font-mono text-base font-bold uppercase tracking-wider text-slate-900"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Scan the QR code on the student&apos;s phone or type their Student ID.
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("CHECK_IN")}
            className="py-4 px-6 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            <LogIn className="w-5 h-5" />
            Mark Check-In (Arrival)
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("CHECK_OUT")}
            className="py-4 px-6 rounded-2xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            <LogOut className="w-5 h-5" />
            Mark Check-Out (Done)
          </button>
        </div>
      </div>

      {/* Last Action Notification Card */}
      {lastAction && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="font-bold text-sm text-white">{lastAction.studentName}</p>
              <p className="text-slate-400 text-[11px]">
                {lastAction.action} at {lastAction.time}
                {lastAction.hours && ` • ${lastAction.hours} Verified Hours Added`}
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-md">
            Logged
          </span>
        </div>
      )}
    </div>
  );
}
