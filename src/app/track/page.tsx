"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NGO_CONFIG } from "@/lib/constants";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Heart,
  Download,
  AlertCircle,
  Building,
  Phone,
  User,
  Package,
} from "lucide-react";

interface DonationRecord {
  id: string;
  referenceId: string;
  receiptNo?: string | null;
  donationType: string;
  donorType: string;
  donorName: string;
  donorPhone: string;
  donorAddress?: string | null;
  pickupType: string;
  pickupDate?: string | null;
  pickupSlot?: string | null;
  status: string;
  receivedBy?: string | null;
  amount?: number | null;
  paymentMode?: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    itemType: string;
    quantity: string;
    condition?: string | null;
  }>;
  organization?: {
    name: string;
    type: string;
  } | null;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [ref, setRef] = useState(initialRef);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [donation, setDonation] = useState<DonationRecord | null>(null);

  useEffect(() => {
    if (initialRef) {
      handleLookup(initialRef, "");
    }
  }, [initialRef]);

  const handleLookup = async (lookupRef: string, lookupPhone: string) => {
    if (!lookupRef.trim()) {
      setError("Please enter your Reference ID (e.g. AASA-DON-2026-0001).");
      return;
    }

    setLoading(true);
    setError("");
    setDonation(null);

    try {
      const url = `/api/donations/track?ref=${encodeURIComponent(
        lookupRef.trim()
      )}&phone=${encodeURIComponent(lookupPhone.trim())}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Record not found");
      setDonation(data.donation);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error looking up donation");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = [
      { key: "PENDING", label: "Registered / Pending Review", desc: "Our team has received your details" },
      { key: "CONFIRMED", label: "Confirmed & Assigned", desc: "Volunteer / logistics assigned" },
      { key: "PICKED_UP", label: "Picked Up / Received", desc: "Items received and sorting underway" },
      { key: "DELIVERED", label: "Distributed to Tribal Hamlets", desc: "Handed over to children and families" },
    ];

    let activeIndex = 0;
    if (status === "CONFIRMED") activeIndex = 1;
    if (status === "PICKED_UP") activeIndex = 2;
    if (status === "DELIVERED") activeIndex = 3;
    if (status === "VOIDED" || status === "REJECTED") activeIndex = -1;

    return { steps, activeIndex };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-[#2E3192] text-xs font-bold">
            <Search className="w-4 h-4" />
            Donation Status Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Track Your Donation & Download Receipt
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Enter your Donation Reference ID and registered phone number to view live progress.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(ref, phone);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Donation Reference ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AASA-DON-2026-0001"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Phone Number (Optional)
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
              {loading ? "Looking Up Donation..." : "Track My Donation"}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Display */}
        {donation && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#2E3192]">
                    {donation.referenceId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#2E3192] border border-indigo-200">
                    {donation.donationType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Submitted on {new Date(donation.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>

              {donation.receiptNo && (
                <a
                  href={`/api/receipts/${donation.receiptNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt ({donation.receiptNo})
                </a>
              )}
            </div>

            {/* Status Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Progress
              </h3>

              {donation.status === "VOIDED" ? (
                <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-xs text-stone-700">
                  <strong className="text-rose-700 font-bold">Entry Voided:</strong> This donation record was voided by administration.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                  {getStatusStep(donation.status).steps.map((step, idx) => {
                    const isCompleted = idx <= getStatusStep(donation.status).activeIndex;
                    const isCurrent = idx === getStatusStep(donation.status).activeIndex;
                    return (
                      <div
                        key={step.key}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                            : isCompleted
                            ? "border-slate-200 bg-slate-50"
                            : "border-slate-100 opacity-50 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCompleted
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              isCurrent ? "text-emerald-900" : "text-slate-800"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-7">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Donation Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Donor Information
                </h4>
                <p className="text-slate-600">
                  Name: <strong>{donation.donorName}</strong>
                </p>
                {donation.organization && (
                  <p className="text-slate-600">
                    Organization: <strong>{donation.organization.name}</strong> ({donation.organization.type})
                  </p>
                )}
                <p className="text-slate-600">
                  Category: <strong>{donation.donorType}</strong>
                </p>
                {donation.pickupDate && (
                  <p className="text-slate-600">
                    Pickup: {donation.pickupDate} ({donation.pickupSlot || "Daytime"})
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  Items / Contribution
                </h4>
                {donation.amount ? (
                  <p className="font-bold text-sm text-emerald-700">
                    Amount: ₹ {donation.amount}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      ({donation.paymentMode || "Online"})
                    </span>
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {donation.items.map((it) => (
                      <li key={it.id} className="text-slate-700">
                        • {it.itemType}: <strong>{it.quantity}</strong> ({it.condition || "Used"})
                      </li>
                    ))}
                  </ul>
                )}
                {donation.receivedBy && (
                  <p className="text-slate-500 text-[11px] pt-1">
                    Handled by Ashram Coordinator: <strong>{donation.receivedBy}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading tracking...</div>}>
      <TrackContent />
    </Suspense>
  );
}
