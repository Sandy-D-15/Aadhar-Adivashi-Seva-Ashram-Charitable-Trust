"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CommonDonorFields, CommonDonorData } from "@/components/CommonDonorFields";
import { OrganizationFields, OrganizationFormData } from "@/components/OrganizationFields";
import { Music, Sparkles, ArrowRight, Trophy } from "lucide-react";

export default function DonateInstrumentsPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [instrumentType, setInstrumentType] = useState("Harmonium");
  const [customType, setCustomType] = useState("");
  const [quantity, setQuantity] = useState("1 Unit");
  const [condition, setCondition] = useState("WORKING");
  const [ageGroup, setAgeGroup] = useState("All Ages (Children & Youth)");
  const [photoUrl, setPhotoUrl] = useState("");

  const [orgData, setOrgData] = useState<OrganizationFormData>({
    isOrganization: false,
    orgName: "",
    orgType: "Temple or Religious Body",
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
      setError("Please check the consent box to confirm the instrument/sports equipment is in good condition.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const actualType = instrumentType === "Other" && customType ? customType : instrumentType;

      const payload = {
        donationType: "INSTRUMENTS",
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
            itemType: actualType,
            quantity,
            condition,
            sizeOrAge: ageGroup,
            detailsJson: JSON.stringify({ category: "INSTRUMENTS", type: actualType }),
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
      if (!res.ok) throw new Error(json.error || "Failed to submit instruments donation");

      router.push(`/donate/success?ref=${json.referenceId}&type=Instruments&name=${encodeURIComponent(donorData.donorName)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting donation");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
            <Music className="w-4 h-4 text-purple-700" />
            Category: Musical & Sports Instruments
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Donate Musical Instruments & Sports Gear
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Nurture artistic talent, devotional bhajan culture, and physical fitness among tribal children in Adivasi ashrams.
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
              <Sparkles className="w-4 h-4 text-purple-600" />
              Instrument & Equipment Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instrument / Equipment Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={instrumentType}
                  onChange={(e) => setInstrumentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Harmonium">Harmonium (पेटी)</option>
                  <option value="Tabla & Bayan">Tabla & Bayan (तबला-डग्गा)</option>
                  <option value="Dholki / Dholak">Dholki / Dholak (ढोलकी)</option>
                  <option value="Acoustic Guitar">Acoustic Guitar</option>
                  <option value="Electronic Keyboard / Piano">Electronic Keyboard / Piano</option>
                  <option value="Drum / Congo / Bongo">Drum / Congo / Bongo</option>
                  <option value="Bansuri / Flute">Bansuri / Flute</option>
                  <option value="Sports Equipment (Cricket kit, footballs, etc.)">Sports Equipment (Cricket kit, footballs, etc.)</option>
                  <option value="Other">Other Specific Instrument</option>
                </select>
              </div>

              {instrumentType === "Other" && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Specify Instrument Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Veena / Trumpet / Volleyball net"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 unit, 2 sets"
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
                  <option value="WORKING">Working & Ready to Play</option>
                  <option value="NEEDS_REPAIR">Needs Minor Repair / Tuning</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Suited Age Group
                </label>
                <input
                  type="text"
                  placeholder="e.g. Children (6-12 yrs) / Youth / All"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Photo Link / Model Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste image link or make/brand details (e.g. Yamaha, Bina, SG)"
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
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Submitting Instrument Donation..." : "Submit Instruments Donation"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
