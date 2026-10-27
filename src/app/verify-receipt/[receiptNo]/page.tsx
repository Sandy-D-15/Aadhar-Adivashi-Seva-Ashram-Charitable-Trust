import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, XCircle, Download, CheckCircle2 } from "lucide-react";
import { NGO_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ReceiptVerificationPage({
  params,
}: {
  params: Promise<{ receiptNo: string }>;
}) {
  const { receiptNo } = await params;

  const donation = await prisma.donation.findFirst({
    where: {
      OR: [{ receiptNo }, { referenceId: receiptNo }],
    },
    include: {
      organization: { select: { name: true } },
      items: true,
    },
  });

  const isValid = donation && donation.status !== "VOIDED";

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-10 space-y-6 text-center">
          {isValid ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  Verified Official Receipt
                </span>
                <h1 className="text-2xl font-extrabold text-[#2E3192]">
                  Valid Trust Donation Receipt
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Receipt No: <strong>{donation.receiptNo || donation.referenceId}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Donor Name:</span>
                  <span className="font-bold text-slate-900">{donation.donorName}</span>
                </div>

                {donation.organization && (
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-medium">Organization:</span>
                    <span className="font-semibold text-slate-800">{donation.organization.name}</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Donation Type:</span>
                  <span className="font-semibold text-slate-800">{donation.donationType}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Date Received:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(donation.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Particulars:</span>
                  <span className="font-bold text-slate-900">
                    {donation.amount
                      ? `₹ ${donation.amount.toLocaleString("en-IN")}/-`
                      : donation.items.map((i) => `${i.itemType} (${i.quantity})`).join(", ")}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
                  <span>Authorized By: <strong>{donation.receivedBy || "Deva Salat"}</strong></span>
                  <span className="text-emerald-700 font-bold">STATUS: {donation.status}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`/api/receipts/${donation.receiptNo || donation.referenceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Verified PDF Receipt
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <XCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
                  Invalid Receipt
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Receipt Not Found or Voided
                </h1>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                  No active receipt was found matching number <code className="font-mono text-rose-700">{receiptNo}</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) | Est. 2012 | Regd. No. 1950
          </p>
        </div>
      </div>
    </div>
  );
}
