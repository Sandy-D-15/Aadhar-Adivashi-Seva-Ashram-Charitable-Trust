"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NGO_CONFIG } from "@/lib/constants";
import { OrganizationFields, OrganizationFormData } from "@/components/OrganizationFields";
import {
  IndianRupee,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  ArrowRight,
  Info,
} from "lucide-react";

export default function DonateMoneyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Settings
  const [tax80gEnabled, setTax80gEnabled] = useState(NGO_CONFIG.bankDetails.tax80gEnabled);

  // Form State
  const [amount, setAmount] = useState("1000");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [txnReference, setTxnReference] = useState("");
  const [purpose, setPurpose] = useState("GENERAL");
  const [donorPan, setDonorPan] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  const [orgData, setOrgData] = useState<OrganizationFormData>({
    isOrganization: false,
    orgName: "",
    orgType: "Company / CSR",
    contactPerson: "",
    designation: "",
    establishedYear: "",
    orgAddress: "",
    orgCity: "Thane",
    isPublicPartner: true,
  });

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAmountSelect = (val: string) => {
    setAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        donationType: "CASH",
        amount: parseFloat(amount),
        paymentMode,
        txnReference,
        purpose,
        donorPan,
        donorName,
        donorPhone,
        donorEmail,
        donorAddress,
        pincode,
        notes,
        isOrganization: orgData.isOrganization,
        orgName: orgData.orgName,
        orgType: orgData.orgType,
        contactPerson: orgData.contactPerson,
        designation: orgData.designation,
        establishedYear: orgData.establishedYear,
        orgCity: orgData.orgCity,
        isPublicPartner: orgData.isPublicPartner,
        items: [
          {
            itemType: `Financial Support - ${purpose}`,
            quantity: `₹ ${amount}`,
            condition: "CASH_OR_ONLINE",
          },
        ],
      };

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to record donation");

      router.push(
        `/donate/success?ref=${json.referenceId}&receipt=${json.receiptNo || ""}&type=Financial&name=${encodeURIComponent(
          donorName
        )}&amount=${amount}`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting financial donation");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <IndianRupee className="w-4 h-4 text-emerald-700" />
            Direct Monetary & Online Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Support Adivasi Children & Hamlets Financially
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            100% of your contributions go towards daily hot meals, education kits, medical emergencies, and tribal welfare drives.
          </p>
        </div>

        {/* 80G / Tax notice banner */}
        <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-slate-900">Official Donation Notice:</strong>
            <p className="mt-0.5">{NGO_CONFIG.bankDetails.tax80gNote}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Official trust receipts with QR verification codes are automatically issued for all contributions.
            </p>
          </div>
        </div>

        {/* Bank & UPI Transfer Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Details Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-[#2E3192]" />
              Official Trust Bank Account Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Bank Name:</span>
                <span className="font-semibold text-slate-800">
                  {NGO_CONFIG.bankDetails.bankName}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Account Name:</span>
                <span className="font-semibold text-slate-800">
                  {NGO_CONFIG.bankDetails.accountName}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Account Number:</span>
                  <span className="font-mono font-bold text-sm text-[#2E3192]">
                    {NGO_CONFIG.bankDetails.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(NGO_CONFIG.bankDetails.accountNumber, "acct")
                  }
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "acct" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "acct" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">IFSC Code:</span>
                  <span className="font-mono font-bold text-sm text-[#2E3192]">
                    {NGO_CONFIG.bankDetails.ifscCode}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (Alt: {NGO_CONFIG.bankDetails.alternateIfsc})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(NGO_CONFIG.bankDetails.ifscCode, "ifsc")
                  }
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "ifsc" ? "Copied" : "Copy"}
                </button>
              </div>

              <div>
                <span className="text-slate-500 block">Branch & Type:</span>
                <span className="font-medium text-slate-800">
                  {NGO_CONFIG.bankDetails.branch} ({NGO_CONFIG.bankDetails.accountType})
                </span>
              </div>
            </div>
          </div>

          {/* UPI Scan Code Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <QrCode className="w-4 h-4 text-emerald-600" />
              Scan & Pay via any UPI App
            </div>

            <div className="p-3 bg-white border-2 border-dashed border-emerald-400 rounded-2xl shadow-xs">
              {/* QR Image representation */}
              <div className="w-44 h-44 bg-slate-100 rounded-xl flex flex-col items-center justify-center p-2 text-slate-500 text-xs">
                <QrCode className="w-24 h-24 text-slate-800 mb-1" />
                <span className="font-mono font-bold text-slate-900 text-[11px]">
                  {NGO_CONFIG.chairman.phone}@upi
                </span>
                <span className="text-[10px] text-slate-500">Google Pay / PhonePe / Paytm</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                UPI ID: <span className="font-mono text-[#2E3192]">{NGO_CONFIG.bankDetails.upiId}</span>
              </p>
              <p className="text-slate-500 text-[11px]">
                Chairman Phone: {NGO_CONFIG.chairman.phone} ({NGO_CONFIG.chairman.name})
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        {/* Donation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Donation Details & Receipt Generation
            </h3>

            {/* Quick Amount Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select or Enter Amount (INR) <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5 mb-3">
                {["500", "1000", "2500", "5000", "10000", "25000"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAmountSelect(preset)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      amount === preset
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    ₹ {preset}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Mode <span className="text-rose-500">*</span>
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                  <option value="CASH">Cash in Person at Ashram</option>
                  <option value="ONLINE">Other Online Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Reference / UTR / Cheque No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR / UPI Ref ID / Cheque No."
                  value={txnReference}
                  onChange={(e) => setTxnReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Intended Purpose <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="GENERAL">General Welfare & Daily Ashram Support</option>
                  <option value="FOOD">Child Nutrition & Hot Meal Drives</option>
                  <option value="EDUCATION">School Kits, Books & Scholarships</option>
                  <option value="CLOTHES">Winter Blankets & Clothes Distribution</option>
                  <option value="EMERGENCY">Medical Emergencies & Hamlets Aid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Donor PAN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>

            {/* Donor Personal Information */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Donor Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="For official receipt"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Phone (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9820123456"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address (For PDF Receipt)
                </label>
                <input
                  type="email"
                  placeholder="e.g. donor@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 421204"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Complete Address
                </label>
                <input
                  type="text"
                  placeholder="Address to appear on official donation receipt"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>
          </div>

          <OrganizationFields
            data={orgData}
            onChange={(upd) => setOrgData((prev) => ({ ...prev, ...upd }))}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Processing Contribution..." : `Submit & Generate Official Receipt (₹ ${amount})`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
