"use client";

import React from "react";
import { NGO_CONFIG } from "@/lib/constants";
import { Truck, MapPin, Calendar, Clock, AlertCircle } from "lucide-react";

export interface CommonDonorData {
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  donorAddress: string;
  pincode: string;
  pickupType: "PICKUP" | "DROPOFF";
  pickupDate: string;
  pickupSlot: string;
  notes: string;
  consent: boolean;
}

interface CommonDonorFieldsProps {
  data: CommonDonorData;
  onChange: (data: Partial<CommonDonorData>) => void;
}

export function CommonDonorFields({ data, onChange }: CommonDonorFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Donor Personal Contact */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
            1
          </span>
          Your Contact & Location Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patil"
              value={data.donorName}
              onChange={(e) => onChange({ donorName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mobile Phone (10 Digits) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              placeholder="e.g. 9820123456"
              value={data.donorPhone}
              onChange={(e) => onChange({ donorPhone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. ramesh@example.com"
              value={data.donorEmail}
              onChange={(e) => onChange({ donorEmail: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pincode <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 421204"
              value={data.pincode}
              onChange={(e) => onChange({ pincode: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Complete Pickup Address / Landmark <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Flat/House no., Building, Society name, Street, Landmark"
              value={data.donorAddress}
              onChange={(e) => onChange({ donorAddress: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
            />
          </div>
        </div>
      </div>

      {/* Pickup vs Drop-off Choice */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
            2
          </span>
          Pickup or Ashram Drop-Off
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onChange({ pickupType: "PICKUP" })}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
              data.pickupType === "PICKUP"
                ? "border-[#2E3192] bg-indigo-50/50 ring-2 ring-[#2E3192]"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${data.pickupType === "PICKUP" ? "bg-[#2E3192] text-white" : "bg-slate-100 text-slate-600"}`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Schedule a Free Pickup</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Our ashram volunteer will pick up items from your address.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ pickupType: "DROPOFF" })}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
              data.pickupType === "DROPOFF"
                ? "border-[#2E3192] bg-indigo-50/50 ring-2 ring-[#2E3192]"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${data.pickupType === "DROPOFF" ? "bg-[#2E3192] text-white" : "bg-slate-100 text-slate-600"}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">I will Drop It Off</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Drop off directly at our Khidkali Ashram center.
              </p>
            </div>
          </button>
        </div>

        {/* Pickup Details or Drop-off Info */}
        {data.pickupType === "PICKUP" ? (
          <div className="pt-2 space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Service Area Notice:</strong> Free doorstep pickups are available across{" "}
                <strong>{NGO_CONFIG.defaultPickupAreas.join(", ")}</strong> and neighboring Thane districts.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Preferred Pickup Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required={data.pickupType === "PICKUP"}
                  value={data.pickupDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => onChange({ pickupDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Preferred Time Slot <span className="text-rose-500">*</span>
                </label>
                <select
                  value={data.pickupSlot}
                  onChange={(e) => onChange({ pickupSlot: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Morning (9:30 AM - 1:00 PM)">Morning (9:30 AM - 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:30 PM)">Afternoon (1:00 PM - 4:30 PM)</option>
                  <option value="Evening (4:30 PM - 7:30 PM)">Evening (4:30 PM - 7:30 PM)</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <p className="font-bold text-slate-800">Ashram Drop-off Center Details:</p>
            <p className="text-slate-600">{NGO_CONFIG.address}</p>
            <p className="text-slate-600">Hours: <strong>{NGO_CONFIG.dropoffHours}</strong></p>
            <a
              href={NGO_CONFIG.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-semibold underline pt-1"
            >
              Open Location in Google Maps ↗
            </a>
          </div>
        )}

        <div className="pt-2 text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Additional Instructions / Landmark Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Call before coming, gate passcode, etc."
            value={data.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          />
        </div>

        <div className="pt-3 border-t border-slate-100">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={data.consent}
              onChange={(e) => onChange({ consent: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
            />
            <span>
              I confirm that the donated items are in good, usable, and respectful condition for Adivasi families.
              My contact details will only be used for pickup coordination and official NGO receipts.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
