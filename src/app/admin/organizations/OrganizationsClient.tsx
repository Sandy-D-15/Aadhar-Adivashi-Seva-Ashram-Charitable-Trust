"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ORGANIZATION_TYPES } from "@/lib/constants";
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

interface OrganizationRecord {
  id: string;
  name: string;
  type: string;
  contactPerson: string;
  designation?: string | null;
  phone: string;
  altPhone?: string | null;
  email?: string | null;
  establishedYear?: string | null;
  streetAddress?: string | null;
  city: string;
  district: string;
  state: string;
  pincode?: string | null;
  registrationNo?: string | null;
  pan?: string | null;
  isPublicPartner: boolean;
  notes?: string | null;
  createdAt: Date | string;
  donations: Array<{
    id: string;
    amount?: number | null;
    donationType: string;
    createdAt: Date | string;
  }>;
}

export default function OrganizationsClient({
  initialOrganizations,
  userRole,
}: {
  initialOrganizations: OrganizationRecord[];
  userRole: string;
}) {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>(initialOrganizations);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationRecord | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    type: "Company / CSR",
    contactPerson: "",
    designation: "",
    phone: "",
    altPhone: "",
    email: "",
    establishedYear: "",
    streetAddress: "",
    area: "",
    city: "Thane",
    pincode: "",
    registrationNo: "",
    pan: "",
    notes: "",
    isPublicPartner: true,
  });

  const openAddModal = () => {
    setEditingOrg(null);
    setForm({
      name: "",
      type: "Company / CSR",
      contactPerson: "",
      designation: "",
      phone: "",
      altPhone: "",
      email: "",
      establishedYear: "",
      streetAddress: "",
      area: "",
      city: "Thane",
      pincode: "",
      registrationNo: "",
      pan: "",
      notes: "",
      isPublicPartner: true,
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (org: OrganizationRecord) => {
    setEditingOrg(org);
    setForm({
      name: org.name,
      type: org.type,
      contactPerson: org.contactPerson,
      designation: org.designation || "",
      phone: org.phone,
      altPhone: org.altPhone || "",
      email: org.email || "",
      establishedYear: org.establishedYear || "",
      streetAddress: org.streetAddress || "",
      area: "",
      city: org.city,
      pincode: org.pincode || "",
      registrationNo: org.registrationNo || "",
      pan: org.pan || "",
      notes: org.notes || "",
      isPublicPartner: org.isPublicPartner,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const payload = {
        ...form,
        id: editingOrg ? editingOrg.id : undefined,
      };

      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save organization");

      setShowModal(false);
      router.refresh();
      // Optimistic update
      if (editingOrg) {
        setOrganizations(
          organizations.map((o) => (o.id === editingOrg.id ? { ...o, ...data.organization } : o))
        );
      } else {
        setOrganizations([
          { ...data.organization, donations: [] },
          ...organizations,
        ]);
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error saving organization");
    } finally {
      setSaving(false);
    }
  };

  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        org.name.toLowerCase().includes(q) ||
        org.contactPerson.toLowerCase().includes(q) ||
        org.city.toLowerCase().includes(q) ||
        org.phone.includes(q);

      const matchType = selectedType === "ALL" || org.type === selectedType;

      return matchSearch && matchType;
    });
  }, [organizations, search, selectedType]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2E3192]">
            Donor Organizations Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record and manage companies, NGOs, housing societies, and institutions that partner and donate.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Organization
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by organization name, contact person, city, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
        >
          <option value="ALL">All Organization Types</option>
          {ORGANIZATION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            No donor organizations found matching criteria.
          </div>
        ) : (
          filteredOrgs.map((org) => {
            const totalCash = org.donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            const totalDrives = org.donations.length;

            return (
              <div
                key={org.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#2E3192]/60 transition-all space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#2E3192] border border-indigo-200">
                      {org.type}
                    </span>
                    {org.isPublicPartner && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Public Partner
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {org.name}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 font-medium">
                      <span className="text-slate-400">Contact:</span>{" "}
                      <strong>{org.contactPerson}</strong>{" "}
                      {org.designation && <span className="text-slate-400 font-normal">({org.designation})</span>}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {org.phone}
                    </p>
                    {org.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {org.email}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {org.city}, {org.district}
                      {org.establishedYear && ` • Est. ${org.establishedYear}`}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contributions:</span>
                    <span className="font-bold text-[#2E3192]">
                      {totalDrives} Drives
                      {totalCash > 0 && ` • ₹ ${totalCash.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(org)}
                      title="Edit Organization"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/organizations/${org.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#2E3192] bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    >
                      Profile & History →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#2E3192]">
                  {editingOrg ? "Edit Donor Organization" : "Register New Donor Organization"}
                </h2>
                <p className="text-xs text-slate-500">
                  Record institutional details for official partnerships, drives, and CSR reports.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization / Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotary Club of Kalyan Riverside / Apex Ltd"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                  >
                    {ORGANIZATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Year Established
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2010"
                    value={form.establishedYear}
                    onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name of liaison"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. President / CSR Manager"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Phone (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9820011223"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alternate Phone / Landline
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    value={form.altPhone}
                    onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. csr@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kalyan / Thane"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    placeholder="Office / Center address"
                    value={form.streetAddress}
                    onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Registration No / Trust Act No (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. F-12345/Mumbai"
                    value={form.registrationNo}
                    onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization PAN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AAATR1234F"
                    value={form.pan}
                    onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={form.isPublicPartner}
                      onChange={(e) => setForm({ ...form, isPublicPartner: e.target.checked })}
                      className="rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
                    />
                    <span>
                      Show publicly as a partner on trust website (only organization name and logo are displayed publicly; contact info remains confidential).
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  {saving ? "Saving..." : editingOrg ? "Update Organization" : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
