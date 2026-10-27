"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CommonDonorFields, CommonDonorData } from "@/components/CommonDonorFields";
import { OrganizationFields, OrganizationFormData } from "@/components/OrganizationFields";
import { Utensils, AlertTriangle, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export default function DonateFoodPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [foodType, setFoodType] = useState("COOKED");
  const [quantity, setQuantity] = useState("50 Servings");
  const [isVeg, setIsVeg] = useState(true);
  const [prepDate, setPrepDate] = useState("");
  const [urgencyHours, setUrgencyHours] = useState(3);
  const [dishDescription, setDishDescription] = useState("");

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

  const [donorData, setDonorData] = useState<CommonDonorData>({
    donorName: "",
    donorPhone: "",
    donorEmail: "",
    donorAddress: "",
    pincode: "",
    pickupType: "PICKUP",
    pickupDate: new Date().toISOString().split("T")[0],
    pickupSlot: "Immediate / As per urgency",
    notes: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorData.consent) {
      setError("Please confirm food safety: fresh, hygienic, and properly packed.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        donationType: "FOOD",
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
        foodType,
        foodIsVeg: isVeg,
        prepDate,
        urgencyHours,
        items: [
          {
            itemType: `${foodType} - ${dishDescription || "Meals"}`,
            quantity,
            condition: "HYGIENIC_FRESH",
            sizeOrAge: isVeg ? "Pure Vegetarian" : "Non-Vegetarian",
          },
        ],
      };

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit food donation");

      router.push(`/donate/success?ref=${json.referenceId}&type=Food&name=${encodeURIComponent(donorData.donorName)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting food donation");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Utensils className="w-4 h-4 text-amber-700" />
            Category: Food & Nutrition
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Donate Fresh Food & Ration Grains
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Combat hunger and ensure nutritious daily meals for children and elderly individuals in rural tribal settlements.
          </p>
        </div>

        {/* Food Safety Notice */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            Food Safety & Distribution Guidelines
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>
              <strong>Cooked Food:</strong> Must be freshly prepared within the last 4-6 hours, hygienic, and packed in food-grade containers or vessels.
            </li>
            <li>
              <strong>Catering / Event Excess:</strong> Please notify us early so our team can distribute meals directly without delay.
            </li>
            <li>
              <strong>Raw Grains & Dry Ration:</strong> Sealed bags of rice, wheat, dal, oil, spices, or packaged milk/biscuits with visible expiry dates.
            </li>
          </ul>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Food Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Food Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="COOKED">Cooked Meals (Events, Catering, Home)</option>
                  <option value="PACKAGED">Packaged Food (Biscuits, Milk, Cereals)</option>
                  <option value="GRAINS">Raw Grains & Pulses (Rice, Wheat, Dal)</option>
                  <option value="RAW">Fresh Fruits & Vegetables</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dietary Category <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vegType"
                      checked={isVeg}
                      onChange={() => setIsVeg(true)}
                      className="text-emerald-600"
                    />
                    <span className="font-semibold text-emerald-800">Pure Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vegType"
                      checked={!isVeg}
                      onChange={() => setIsVeg(false)}
                      className="text-rose-600"
                    />
                    <span className="font-semibold text-rose-800">Non-Vegetarian</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity (Servings or KG) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 80 meals / 25 kg rice"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Urgency: Collect Within
                </label>
                <select
                  value={urgencyHours}
                  onChange={(e) => setUrgencyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value={2}>Urgent (Within 2 Hours)</option>
                  <option value={4}>Within 4 Hours</option>
                  <option value={8}>Within 8 Hours</option>
                  <option value={24}>Within 24 Hours (Dry Grains / Packaged)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preparation or Expiry Date & Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cooked today at 1:00 PM"
                  value={prepDate}
                  onChange={(e) => setPrepDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Meal / Dish Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dal Khichdi, Chapati & Sabzi, Pulao"
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
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
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-amber-700 hover:bg-amber-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Submitting Food Pickup Request..." : "Request Urgent Food Collection"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
