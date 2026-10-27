import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileSpreadsheet,
  Download,
  IndianRupee,
  Package,
  HeartHandshake,
  CheckCircle2,
  ArrowLeft,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      donations: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!org) {
    notFound();
  }

  const activeDonations = org.donations.filter((d) => d.status !== "VOIDED");
  const totalCash = activeDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalDrives = activeDonations.length;
  const lastDonationDate = activeDonations[0]
    ? new Date(activeDonations[0].createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
    : "No donations yet";

  // Counts by category
  const categoriesCount: Record<string, number> = {};
  activeDonations.forEach((d) => {
    categoriesCount[d.donationType] = (categoriesCount[d.donationType] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Back and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          href="/admin/organizations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E3192] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Organizations Directory
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/donation-register`}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Donation Against Organization
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#2E3192] border border-indigo-200">
                {org.type}
              </span>
              {org.isPublicPartner && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Public Partner Acknowledged
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900">{org.name}</h1>
            <p className="text-xs text-slate-500">
              Established / Working Since: <strong>{org.establishedYear || "N/A"}</strong> • Location: <strong>{org.city}, {org.district}</strong>
            </p>
          </div>
        </div>

        {/* Contact & Legal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Liaison Contact</span>
            <p className="font-semibold text-[#2E3192]">
              {org.contactPerson} {org.designation && `(${org.designation})`}
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {org.phone} {org.altPhone && ` / ${org.altPhone}`}
            </p>
            {org.email && (
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {org.email}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Address & Location</span>
            <p className="leading-snug">
              {org.streetAddress || "Address on file"}, {org.city} - {org.pincode || "421204"}
            </p>
            <p className="text-slate-400 text-[11px]">{org.state}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Registration & Tax IDs</span>
            <p>Trust/Reg No: <strong>{org.registrationNo || "—"}</strong></p>
            <p>PAN: <strong>{org.pan || "—"}</strong></p>
            <p className="text-slate-400 text-[11px]">80G/12A: {org.taxExemptDetails || "N/A"}</p>
          </div>
        </div>

        {org.notes && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900">
            <strong>Internal Notes:</strong> {org.notes}
          </div>
        )}
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Financial Contributions
            </span>
            <span className="text-xl font-black text-slate-900">
              ₹ {totalCash.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#2E3192] flex items-center justify-center font-bold shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Drives / Consignments
            </span>
            <span className="text-xl font-black text-[#2E3192]">
              {totalDrives} Drives
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Last Contribution Date
            </span>
            <span className="text-xs font-extrabold text-slate-900 block mt-1">
              {lastDonationDate}
            </span>
          </div>
        </div>
      </div>

      {/* Full Donation History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Complete Donation History ({org.name})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Date</th>
                <th className="p-3">Receipt / Ref</th>
                <th className="p-3">Category</th>
                <th className="p-3">Item Details</th>
                <th className="p-3">Quantity / Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {org.donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No donations recorded yet for this organization.
                  </td>
                </tr>
              ) : (
                org.donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-medium text-slate-700 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#2E3192]">
                      {d.receiptNo || d.referenceId}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#2E3192]">
                        {d.donationType}
                      </span>
                    </td>
                    <td className="p-3 max-w-[220px]">
                      {d.items && d.items.length > 0 ? (
                        d.items.map((it) => (
                          <span key={it.id} className="block truncate">
                            • {it.itemType}
                          </span>
                        ))
                      ) : (
                        <span>{d.purpose || "General Donation"}</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      {d.amount ? `₹ ${d.amount.toLocaleString("en-IN")}` : d.items.map((i) => i.quantity).join(", ")}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <a
                        href={`/api/receipts/${d.receiptNo || d.referenceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#2E3192] font-semibold text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        PDF Receipt
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
