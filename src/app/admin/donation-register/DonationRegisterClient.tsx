"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DONATION_TYPES, DONOR_TYPES } from "@/lib/constants";
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Ban,
  CheckCircle2,
  X,
  IndianRupee,
  Package,
  Users,
  Building,
  GraduationCap,
  Eye,
} from "lucide-react";

interface DonationItem {
  id: string;
  itemType: string;
  quantity: string;
  condition?: string | null;
}

interface DonationRecord {
  id: string;
  referenceId: string;
  receiptNo?: string | null;
  donationType: string;
  donorType: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string | null;
  donorAddress?: string | null;
  pincode?: string | null;
  pickupType: string;
  status: string;
  receivedBy?: string | null;
  amount?: number | null;
  paymentMode?: string | null;
  txnReference?: string | null;
  purpose?: string | null;
  notes?: string | null;
  createdAt: Date | string;
  voidedAt?: Date | string | null;
  voidReason?: string | null;
  organization?: { id: string; name: string; type: string } | null;
  student?: { id: string; fullName: string; studentId: string } | null;
  college?: { id: string; name: string } | null;
  items: DonationItem[];
}

export default function DonationRegisterClient({
  initialDonations,
  organizations,
  students,
  supervisors,
  userRole,
  userName,
}: {
  initialDonations: DonationRecord[];
  organizations: Array<{ id: string; name: string; type: string }>;
  students: Array<{ id: string; fullName: string; studentId: string; collegeName: string }>;
  supervisors: string[];
  userRole: string;
  userName: string;
}) {
  const router = useRouter();
  const [donations, setDonations] = useState<DonationRecord[]>(initialDonations);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDonorType, setSelectedDonorType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [selectedDonationForVoid, setSelectedDonationForVoid] = useState<DonationRecord | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [voiding, setVoiding] = useState(false);

  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    donationType: "CLOTHES",
    donorType: "INDIVIDUAL",
    donorName: "",
    donorPhone: "",
    donorEmail: "",
    donorAddress: "",
    organizationId: "",
    studentId: "",
    itemType: "Clothes bundle",
    quantity: "2 bags",
    condition: "GENTLY_USED",
    amount: "",
    paymentMode: "CASH",
    txnReference: "",
    purpose: "GENERAL",
    receivedBy: supervisors[0] || userName,
    notes: "",
  });
  const [savingManual, setSavingManual] = useState(false);

  // Filtered donations
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      // Search
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        d.donorName.toLowerCase().includes(q) ||
        d.donorPhone.includes(q) ||
        (d.receiptNo && d.receiptNo.toLowerCase().includes(q)) ||
        d.referenceId.toLowerCase().includes(q) ||
        (d.organization && d.organization.name.toLowerCase().includes(q));

      // Category
      const matchCat = selectedCategory === "ALL" || d.donationType === selectedCategory;

      // Donor Type
      const matchDonorType = selectedDonorType === "ALL" || d.donorType === selectedDonorType;

      // Status
      const matchStatus = selectedStatus === "ALL" || d.status === selectedStatus;

      return matchSearch && matchCat && matchDonorType && matchStatus;
    });
  }, [donations, search, selectedCategory, selectedDonorType, selectedStatus]);

  // Compute Totals Bar
  const totals = useMemo(() => {
    let cash = 0;
    let donorsCount = filteredDonations.length;
    let nonVoidCount = 0;

    filteredDonations.forEach((d) => {
      if (d.status !== "VOIDED") {
        nonVoidCount++;
        if (d.amount) cash += d.amount;
      }
    });

    return { cash, donorsCount, nonVoidCount };
  }, [filteredDonations]);

  // Handle Manual Form Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingManual(true);

    try {
      const res = await fetch("/api/admin/donations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add manual donation");

      setShowManualModal(false);
      router.refresh();
      // Optimistic update
      setDonations([data.donation, ...donations]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving manual entry");
    } finally {
      setSavingManual(false);
    }
  };

  // Handle Void Entry Submit
  const handleVoidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationForVoid || !voidReason.trim()) return;

    setVoiding(true);
    try {
      const res = await fetch("/api/admin/donations/void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: selectedDonationForVoid.id,
          reason: voidReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to void entry");

      setShowVoidModal(false);
      setVoidReason("");
      setSelectedDonationForVoid(null);
      router.refresh();

      setDonations(
        donations.map((d) =>
          d.id === selectedDonationForVoid.id
            ? { ...d, status: "VOIDED", voidReason }
            : d
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error voiding entry");
    } finally {
      setVoiding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Master Donation Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified record of all donations across 7 streams from individuals, organizations, and colleges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/reports/donations?format=csv"
            download
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </a>

          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Manual Entry (Walk-In)
          </button>
        </div>
      </div>

      {/* Totals Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Cash Collected
            </span>
            <span className="text-xl font-black text-slate-900">
              ₹ {totals.cash.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-slate-400 block">Active entries in view</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#2E3192] flex items-center justify-center font-bold shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Donation Records
            </span>
            <span className="text-xl font-black text-[#2E3192]">
              {totals.donorsCount} Records
            </span>
            <span className="text-[11px] text-slate-400 block">
              {totals.nonVoidCount} Active, {totals.donorsCount - totals.nonVoidCount} Voided
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Filtered Categories
            </span>
            <span className="text-xl font-black text-slate-900">
              {selectedCategory === "ALL" ? "All 7 Streams" : selectedCategory}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Donor Type: {selectedDonorType}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by donor name, phone, receipt no, org name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          >
            <option value="ALL">All Categories (7)</option>
            {DONATION_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Donor Type */}
          <select
            value={selectedDonorType}
            onChange={(e) => setSelectedDonorType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          >
            <option value="ALL">All Donor Types</option>
            <option value="INDIVIDUAL">Individual Donor</option>
            <option value="ORGANIZATION">Organization / CSR</option>
            <option value="STUDENT">College Student / Drive</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PICKED_UP">PICKED_UP</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="VOIDED">VOIDED</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Receipt / Ref No.</th>
                <th className="p-4">Date</th>
                <th className="p-4">Donor Type</th>
                <th className="p-4">Donor & Contact</th>
                <th className="p-4">Category</th>
                <th className="p-4">Item Details / Qty</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Received By</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    No donation records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr
                    key={d.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      d.status === "VOIDED" ? "bg-stone-50 opacity-60" : ""
                    }`}
                  >
                    <td className="p-4 font-mono font-bold text-slate-900">
                      <div>
                        <span className="text-[#2E3192] block">{d.receiptNo || "—"}</span>
                        <span className="text-[10px] text-slate-400 block">{d.referenceId}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-700 block">
                        {d.donorType}
                      </span>
                      {d.organization && (
                        <span className="text-[10px] text-indigo-700 font-bold block truncate max-w-[140px]">
                          {d.organization.name}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{d.donorName}</span>
                      <span className="text-[11px] text-slate-500 block">{d.donorPhone}</span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#2E3192] border border-indigo-200">
                        {d.donationType}
                      </span>
                    </td>

                    <td className="p-4 max-w-[200px]">
                      {d.items && d.items.length > 0 ? (
                        <div className="space-y-0.5">
                          {d.items.map((it) => (
                            <p key={it.id} className="text-slate-700 truncate">
                              • {it.itemType}: <strong>{it.quantity}</strong>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">{d.purpose || "General"}</span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                      {d.amount ? (
                        <span className="text-emerald-700 font-extrabold">
                          ₹ {d.amount.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : d.status === "VOIDED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      {d.receivedBy || "Ashram Team"}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap space-x-2">
                      {/* PDF Receipt Link */}
                      <a
                        href={`/api/receipts/${d.receiptNo || d.referenceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Download Official PDF Receipt"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#2E3192] font-semibold text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </a>

                      {/* Void Button (Admins only) */}
                      {userRole === "ADMIN" && d.status !== "VOIDED" && (
                        <button
                          onClick={() => {
                            setSelectedDonationForVoid(d);
                            setShowVoidModal(true);
                          }}
                          title="Void entry"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] cursor-pointer"
                        >
                          <Ban className="w-3 h-3" />
                          Void
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD MANUAL ENTRY (WALK-IN) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#2E3192]">
                  Add Manual Donation Entry
                </h2>
                <p className="text-xs text-slate-500">
                  Record donations received in person at Ashram or via phone call.
                </p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Donation Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={manualForm.donationType}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, donationType: e.target.value })
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Donor Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={manualForm.donorType}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, donorType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                  >
                    <option value="INDIVIDUAL">Individual Walk-in Donor</option>
                    <option value="ORGANIZATION">Organization / Institution</option>
                    <option value="STUDENT">College Student / NSS Unit</option>
                  </select>
                </div>

                {/* If Organization selected */}
                {manualForm.donorType === "ORGANIZATION" && (
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Link Existing Organization or Type Name
                    </label>
                    <select
                      value={manualForm.organizationId}
                      onChange={(e) => {
                        const org = organizations.find((o) => o.id === e.target.value);
                        setManualForm({
                          ...manualForm,
                          organizationId: e.target.value,
                          donorName: org ? org.name : manualForm.donorName,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                    >
                      <option value="">Select Existing Organization...</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Donor / Representative Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={manualForm.donorName}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, donorName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="10 Digits"
                    value={manualForm.donorPhone}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, donorPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                {/* Cash vs Items specifics */}
                {manualForm.donationType === "CASH" ? (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Amount (INR) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 5000"
                        value={manualForm.amount}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, amount: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={manualForm.paymentMode}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, paymentMode: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                      >
                        <option value="CASH">Cash in Hand</option>
                        <option value="UPI">UPI Transfer</option>
                        <option value="BANK_TRANSFER">Bank NEFT/IMPS</option>
                        <option value="CHEQUE">Cheque</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Item Description <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarees & Kids wear / 5 Study tables"
                        value={manualForm.itemType}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, itemType: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Quantity / Approximate Count <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 3 boxes, 25 pieces"
                        value={manualForm.quantity}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, quantity: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Received By (Supervisor) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={manualForm.receivedBy}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, receivedBy: e.target.value })
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Donor Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="For receipt emailing"
                    value={manualForm.donorEmail}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, donorEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Address / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Donor location or remarks"
                    value={manualForm.donorAddress}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, donorAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingManual}
                  className="px-6 py-2 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  {savingManual ? "Saving..." : "Record & Issue Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VOID ENTRY WITH MANDATORY REASON */}
      {showVoidModal && selectedDonationForVoid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-base font-bold">Void Donation Entry</h2>
            </div>

            <p className="text-xs text-slate-600">
              You are about to mark reference <strong>{selectedDonationForVoid.referenceId}</strong> (Receipt: {selectedDonationForVoid.receiptNo || "N/A"}) as VOID. Entries cannot be hard deleted for financial audit compliance.
            </p>

            <form onSubmit={handleVoidSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Voiding <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Duplicate entry by donor, incorrect amount recorded, test entry"
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVoidModal(false);
                    setSelectedDonationForVoid(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={voiding}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  {voiding ? "Voiding..." : "Confirm Void"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
