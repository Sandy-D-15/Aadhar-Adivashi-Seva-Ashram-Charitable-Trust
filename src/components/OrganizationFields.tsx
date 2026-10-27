"use client";

import React from "react";
import { ORGANIZATION_TYPES } from "@/lib/constants";
import { Building2, CheckSquare, Square } from "lucide-react";

export interface OrganizationFormData {
  isOrganization: boolean;
  orgName: string;
  orgType: string;
  contactPerson: string;
  designation: string;
  establishedYear: string;
  orgAddress: string;
  orgCity: string;
  isPublicPartner: boolean;
}

interface OrganizationFieldsProps {
  data: OrganizationFormData;
  onChange: (data: Partial<OrganizationFormData>) => void;
}

export function OrganizationFields({ data, onChange }: OrganizationFieldsProps) {
  return (
    <div className="border border-indigo-100 rounded-2xl bg-indigo-50/40 p-5 space-y-4">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => onChange({ isOrganization: !data.isOrganization })}
        className="flex items-center gap-3 w-full text-left cursor-pointer group"
      >
        <div className="text-[#2E3192]">
          {data.isOrganization ? (
            <CheckSquare className="w-5 h-5 fill-indigo-100" />
          ) : (
            <Square className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Building2 className="w-4 h-4 text-[#2E3192]" />
            <span>I am donating on behalf of an Organization / Company / Society</span>
          </div>
          <p className="text-xs text-slate-500">
            For NGOs, housing societies, CSR partners, schools, and institutions.
          </p>
        </div>
      </button>

      {/* Expanded Organization Fields */}
      {data.isOrganization && (
        <div className="pt-3 border-t border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization / Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required={data.isOrganization}
              placeholder="e.g. Rotary Club of Kalyan / ABC Ltd"
              value={data.orgName}
              onChange={(e) => onChange({ orgName: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={data.orgType}
              onChange={(e) => onChange({ orgType: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
            >
              {ORGANIZATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Person Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required={data.isOrganization}
              placeholder="Full name of representative"
              value={data.contactPerson}
              onChange={(e) => onChange({ contactPerson: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Designation / Role
            </label>
            <input
              type="text"
              placeholder="e.g. CSR Lead / Secretary / President"
              value={data.designation}
              onChange={(e) => onChange({ designation: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Year Established / Working Since
            </label>
            <input
              type="text"
              placeholder="e.g. 2015"
              value={data.establishedYear}
              onChange={(e) => onChange({ establishedYear: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Kalyan / Dombivli / Thane"
              value={data.orgCity}
              onChange={(e) => onChange({ orgCity: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={data.isPublicPartner}
                onChange={(e) => onChange({ isPublicPartner: e.target.checked })}
                className="rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
              />
              <span>
                Show our organization name in public partner acknowledgments (contact info stays confidential).
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
