"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NGO_CONFIG, formatEstablishedDate, getYearsOfService } from "@/lib/constants";
import {
  Settings,
  Building,
  Truck,
  Clock,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";

export default function SettingsClient({
  initialSettings,
  initialSupervisors,
  userRole,
}: {
  initialSettings: Record<string, string>;
  initialSupervisors: Array<{ id: string; name: string; phone: string; roleTitle: string }>;
  userRole: string;
}) {
  const router = useRouter();

  let parsedBank = NGO_CONFIG.bankDetails;
  try {
    if (initialSettings["BANK_DETAILS"]) {
      parsedBank = JSON.parse(initialSettings["BANK_DETAILS"]);
    }
  } catch {}

  let parsedAreas = NGO_CONFIG.defaultPickupAreas;
  try {
    if (initialSettings["PICKUP_AREAS"]) {
      parsedAreas = JSON.parse(initialSettings["PICKUP_AREAS"]);
    }
  } catch {}

  const [bank, setBank] = useState(parsedBank);
  const [pickupAreas, setPickupAreas] = useState<string[]>(parsedAreas);
  const [newArea, setNewArea] = useState("");
  const [dropoffHours, setDropoffHours] = useState(
    initialSettings["DROPOFF_HOURS"] || NGO_CONFIG.dropoffHours
  );
  const [establishedDate, setEstablishedDate] = useState(
    initialSettings["ESTABLISHED_DATE"] || NGO_CONFIG.establishedDate
  );
  const [tax80gEnabled, setTax80gEnabled] = useState(
    initialSettings["TAX_80G_ENABLED"] === "true"
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleAddArea = () => {
    if (newArea.trim() && !pickupAreas.includes(newArea.trim())) {
      setPickupAreas([...pickupAreas, newArea.trim()]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setPickupAreas(pickupAreas.filter((a) => a !== area));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const payload = {
        settings: {
          BANK_DETAILS: bank,
          PICKUP_AREAS: pickupAreas,
          DROPOFF_HOURS: dropoffHours,
          ESTABLISHED_DATE: establishedDate,
          TAX_80G_ENABLED: String(tax80gEnabled),
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving settings");
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
            Trust Settings & Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage official bank accounts, pickup service areas, drop-off hours, and 80G tax status.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save All Settings"}
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Settings successfully updated across the trust website!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6 text-xs">
        {/* Section 1: Establishment Date & Service Counter */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-amber-600" />
            Establishment Date & Years of Service (PATCH Compliance)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Trust Established Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                required
                value={establishedDate}
                onChange={(e) => setEstablishedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Founding Date: <strong>20 December 2012</strong>. Impact counters automatically calculate years of service from this date.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Auto-Calculated Counter:
                </span>
                <span className="text-2xl font-black text-[#D32F2F]">
                  {getYearsOfService(establishedDate)}+ Years
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {formatEstablishedDate("en")}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Bank Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-[#2E3192]" />
            Official Bank Account & UPI Details (Money Donation Hub)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bank.bankName}
                onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={bank.accountName}
                onChange={(e) => setBank({ ...bank, accountName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={bank.accountNumber}
                onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={bank.ifscCode}
                onChange={(e) => setBank({ ...bank, ifscCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Branch Location</label>
              <input
                type="text"
                value={bank.branch}
                onChange={(e) => setBank({ ...bank, branch: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={bank.upiId}
                onChange={(e) => setBank({ ...bank, upiId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={tax80gEnabled}
                onChange={(e) => setTax80gEnabled(e.target.checked)}
                className="rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
              />
              <span>
                Enable 80G Tax Exemption Notice on Receipts & Money Page (Only check once 80G order is received).
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: Pickup Areas & Drop-Off Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-emerald-600" />
            Service Areas for Doorstep Pickups
          </h2>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Active Pickup Municipalities / Areas
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {pickupAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-[#2E3192] font-bold rounded-lg flex items-center gap-1.5"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    className="hover:text-rose-600 text-slate-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add new area (e.g. Ambernath)"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddArea();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-3 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 cursor-pointer"
              >
                + Add Area
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1">
              Drop-off Hours at Khidkali Center
            </label>
            <input
              type="text"
              value={dropoffHours}
              onChange={(e) => setDropoffHours(e.target.value)}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
            />
          </div>
        </div>

        {/* Section 4: Supervisors Directory */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-rose-600" />
            Authorized Trust Supervisors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {initialSupervisors.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">{s.name}</span>
                <p className="text-slate-500">{s.roleTitle}</p>
                <p className="text-[#2E3192] font-semibold">{s.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
