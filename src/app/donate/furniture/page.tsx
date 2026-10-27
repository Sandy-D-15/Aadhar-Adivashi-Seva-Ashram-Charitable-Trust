"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CommonDonorFields, CommonDonorData } from "@/components/CommonDonorFields";
import { OrganizationFields, OrganizationFormData } from "@/components/OrganizationFields";
import { Armchair, Sparkles, ArrowRight, Truck, Building } from "lucide-react";

export default function DonateFurniturePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [furnitureType, setFurnitureType] = useState("Study Bench & Desks");
  const [quantity, setQuantity] = useState("5 units");
  const [condition, setCondition] = useState("WORKING");
  const [approxWeight, setApproxWeight] = useState("Heavy (Requires 2+ people)");
  const [needsVehicle, setNeedsVehicle] = useState(true);
  const [floorsCount, setFloorsCount] = useState(1);
  const [hasLift, setHasLift] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");

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
    pickupDate: "",
    pickupSlot: "Morning (9:30 AM - 1:00 PM)",
    notes: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      setError("Photos are required for furniture donations so our logistics team can assess vehicle size.");
      return;
    }
    if (!donorData.consent) {
      setError("Please check the consent box to confirm the furniture is intact and usable.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        donationType: "FURNITURE",
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
        floorsCount,
        hasLift,
        needsVehicle,
        approxWeight,
        photos: [photoUrl],
        items: [
          {
            itemType: furnitureType,
            quantity,
            condition,
            sizeOrAge: approxWeight,
            detailsJson: JSON.stringify({
              floors: floorsCount,
              hasLift,
              needsVehicle,
            }),
          },
        ],
      };

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit furniture donation");

      router.push(`/donate/success?ref=${json.referenceId}&type=Furniture&name=${encodeURIComponent(donorData.donorName)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting donation");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200 text-stone-900 text-xs font-bold">
            <Armchair className="w-4 h-4 text-stone-800" />
            Category: Furniture & Center Infrastructure
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Donate Furniture, Desks & Appliances
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Help equip tribal study centers, children’s reading rooms, and ashram accommodation with tables, benches, and storage.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-700" />
              Furniture Specifications & Logistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Furniture Item Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={furnitureType}
                  onChange={(e) => setFurnitureType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Study Bench & Desks">Study Bench & Desks (फळ्या-बाकडे)</option>
                  <option value="Tables & Computer Desks">Tables & Computer Desks</option>
                  <option value="Plastic / Wooden Chairs">Plastic / Wooden Chairs</option>
                  <option value="Steel Cupboards & Almirahs">Steel Cupboards & Almirahs</option>
                  <option value="Beds & Cots">Beds & Cots</option>
                  <option value="Mattresses & Pillows">Mattresses & Pillows</option>
                  <option value="Ceiling Fans & Table Fans">Ceiling Fans & Table Fans</option>
                  <option value="Water Purifier / Coolers">Water Purifier / Coolers</option>
                  <option value="Other Furniture Item">Other Furniture Item</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4 tables, 10 chairs"
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
                  <option value="NEW">Brand New / Unused</option>
                  <option value="WORKING">Working / Good Condition</option>
                  <option value="MINOR_WEAR">Minor Wear & Tear (Sturdy)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Approximate Size / Weight
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5x3 ft wooden desk / 20kg"
                  value={approxWeight}
                  onChange={(e) => setApproxWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              {/* Logistics Specifics */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  Floor at Pickup Address
                </label>
                <input
                  type="number"
                  min={0}
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
                <span className="text-[11px] text-slate-500">(0 = Ground Floor)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lift / Elevator Available?
                </label>
                <select
                  value={hasLift ? "YES" : "NO"}
                  onChange={(e) => setHasLift(e.target.value === "YES")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="YES">Yes, Service / Passenger Lift Available</option>
                  <option value="NO">No Lift (Stairs Only)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={needsVehicle}
                    onChange={(e) => setNeedsVehicle(e.target.checked)}
                    className="rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
                  />
                  <Truck className="w-4 h-4 text-[#2E3192]" />
                  <span>
                    Needs Transport Vehicle (Tempo / Truck required for pickup)
                  </span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Furniture Photos URL (Required) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste image URL or cloud photo link (e.g. Google Drive/Imgur/Direct link)"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
                <span className="text-[11px] text-slate-500">
                  Photos allow our volunteers to ensure adequate tempo sizing and helpers.
                </span>
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
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-stone-800 hover:bg-stone-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Submitting Furniture Pickup..." : "Submit Furniture Donation Request"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
