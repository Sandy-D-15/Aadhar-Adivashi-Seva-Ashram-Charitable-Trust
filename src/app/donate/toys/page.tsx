"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CommonDonorFields, CommonDonorData } from "@/components/CommonDonorFields";
import { OrganizationFields, OrganizationFormData } from "@/components/OrganizationFields";
import { Gamepad2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function DonateToysPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [toyType, setToyType] = useState("Educational Board Games & Puzzles");
  const [ageGroup, setAgeGroup] = useState("3 to 8 Years");
  const [quantity, setQuantity] = useState("10 sets");
  const [condition, setCondition] = useState("GENTLY_USED");
  const [photoUrl, setPhotoUrl] = useState("");

  const [orgData, setOrgData] = useState<OrganizationFormData>({
    isOrganization: false,
    orgName: "",
    orgType: "NGO",
    contactPerson: "",
    designation: "",
    establishedYear: "",
    orgAddress: "",
    orgCity: "Thane",
    isPublicPartner: true,
  });

  const [donorData, setDonorData] = useState<CommonDonorData>({
    donorName: "",
    donorPhone: "",
    donorEmail: "",
    donorAddress: "",
    pincode: "",
    pickupType: "PICKUP",
    pickupDate: "",
    pickupSlot: "Morning (9:30 AM - 1:00 PM)",
    notes: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorData.consent) {
      setError("Please check the consent box to confirm toys are safe, complete, and clean.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        donationType: "TOYS",
        donorName: donorData.donorName,
        donorPhone: donorData.donorPhone,
        donorEmail: donorData.donorEmail,
        donorAddress: donorData.donorAddress,
        pincode: donorData.pincode,
        pickupType: donorData.pickupType,
        pickupDate: donorData.pickupDate,
        pickupSlot: donorData.pickupSlot,
        notes: donorData.notes,
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
            itemType: toyType,
            quantity,
            condition,
            sizeOrAge: ageGroup,
          },
        ],
        photos: photoUrl ? [photoUrl] : [],
      };

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit toys donation");

      router.push(`/donate/success?ref=${json.referenceId}&type=Toys&name=${encodeURIComponent(donorData.donorName)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting donation");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-cyan-700" />
            Category: Toys & Games
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Donate Clean & Safe Toys for Little Ones
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Brighten the childhood of tribal children in Adivasi hamlets with educational games, stuffed toys, and sports goods.
          </p>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-cyan-950">
          <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Child Safety Guideline:</strong>
            <p className="mt-0.5">
              Please verify that toys are clean, sanitized, and have <strong>no sharp broken edges</strong> or missing critical pieces.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Toy Category Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Toy Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={toyType}
                  onChange={(e) => setToyType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Educational Board Games & Puzzles">Educational Board Games & Puzzles</option>
                  <option value="Soft Toys & Dolls">Soft Toys & Dolls</option>
                  <option value="Building Blocks & STEM Kits">Building Blocks & STEM Kits</option>
                  <option value="Cars, Trucks & Vehicle Sets">Cars, Trucks & Vehicle Sets</option>
                  <option value="Outdoor Sports (Bats, Balls, Badminton)">Outdoor Sports (Bats, Balls, Badminton)</option>
                  <option value="Assorted / Mixed Toys">Assorted / Mixed Toys</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Suited Age Group <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Infants & Toddlers (0-3 yrs)">Infants & Toddlers (0-3 yrs)</option>
                  <option value="Pre-Schoolers (3-6 yrs)">Pre-Schoolers (3-6 yrs)</option>
                  <option value="Primary School (6-10 yrs)">Primary School (6-10 yrs)</option>
                  <option value="Adolescents (10-14 yrs)">Adolescents (10-14 yrs)</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 boxes, 12 items"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Condition <span className="text-rose-500">*</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="NEW">Brand New / In Box</option>
                  <option value="GENTLY_USED">Gently Used (Complete & Functional)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Photo Link / Remarks (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Optional photo URL or description"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>
          </div>

          <OrganizationFields
            data={orgData}
            onChange={(upd) => setOrgData((prev) => ({ ...prev, ...upd }))}
          />

          <CommonDonorFields
            data={donorData}
            onChange={(upd) => setDonorData((prev) => ({ ...prev, ...upd }))}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-cyan-700 hover:bg-cyan-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Recording Toy Donation..." : "Submit Toy Donation"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
