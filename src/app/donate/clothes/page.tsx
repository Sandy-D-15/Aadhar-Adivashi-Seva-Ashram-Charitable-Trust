"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CommonDonorFields, CommonDonorData } from "@/components/CommonDonorFields";
import { OrganizationFields, OrganizationFormData } from "@/components/OrganizationFields";
import { Shirt, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function DonateClothesPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Category specific state
  const [itemType, setItemType] = useState("Mix / Multiple Types");
  const [quantity, setQuantity] = useState("Approx. 15-20 clothes");
  const [condition, setCondition] = useState("GENTLY_USED");
  const [sizeRange, setSizeRange] = useState("All Sizes (Men, Women, Kids)");
  const [photoUrl, setPhotoUrl] = useState("");

  // Organization state
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

  // Common donor state
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
      setError("Please check the consent box to confirm clothes are clean and usable.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        donationType: "CLOTHES",
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
            itemType,
            quantity,
            condition,
            sizeOrAge: sizeRange,
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
      if (!res.ok) throw new Error(json.error || "Failed to submit clothes donation");

      router.push(`/donate/success?ref=${json.referenceId}&type=Clothes&name=${encodeURIComponent(donorData.donorName)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting donation");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
            <Shirt className="w-4 h-4 text-rose-600" />
            Category: Clothes Donation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Donate Wearable Clothes & Winter Wear
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Provide warmth, dignity, and joy to Adivasi families and tribal children living in Thane and Kalyan hamlets.
          </p>
        </div>

        {/* Quality Guidelines Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-950">Dignity First Guideline:</strong>
            <p className="mt-0.5">
              Please ensure all clothes are <strong>washed, clean, and wearable</strong> with functional buttons/zippers and no severe tears.
              Winter wear, sarees, and children’s clothing are especially high in demand!
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Clothes Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              Clothes Specifics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Item Types <span className="text-rose-500">*</span>
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Kids Wear (All Ages)">Kids Wear (All Ages)</option>
                  <option value="Winter Jackets & Sweaters">Winter Jackets & Sweaters</option>
                  <option value="Sarees & Women Kurtas">Sarees & Women Kurtas</option>
                  <option value="Men Shirts & Trousers">Men Shirts & Trousers</option>
                  <option value="Blankets & Bedspreads">Blankets & Bedspreads</option>
                  <option value="Mix / Multiple Types">Mix / Multiple Types</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Approximate Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 bags, or approx 25 pieces"
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
                  <option value="NEW">Brand New</option>
                  <option value="GENTLY_USED">Gently Used (Washed & Great Condition)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Size Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kids 4-10 yrs / Adult M & L"
                  value={sizeRange}
                  onChange={(e) => setSizeRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Photo Link / Note
                </label>
                <input
                  type="text"
                  placeholder="Paste an image link if available (or keep handy during pickup)"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>
          </div>

          {/* Organization Donor Toggle */}
          <OrganizationFields
            data={orgData}
            onChange={(upd) => setOrgData((prev) => ({ ...prev, ...upd }))}
          />

          {/* Common Donor & Logistics Fields */}
          <CommonDonorFields
            data={donorData}
            onChange={(upd) => setDonorData((prev) => ({ ...prev, ...upd }))}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#D32F2F] hover:bg-rose-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Recording Clothes Donation..." : "Submit Clothes Donation"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
