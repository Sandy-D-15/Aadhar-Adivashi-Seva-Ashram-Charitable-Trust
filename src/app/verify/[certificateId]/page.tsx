import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, XCircle, Award, Calendar, Clock, Download, Building } from "lucide-react";
import { NGO_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;

  const cert = await prisma.certificate.findUnique({
    where: { certificateId },
  });

  const isValid = cert && !cert.isRevoked;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Verification Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-10 space-y-6 text-center">
          {isValid ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  Official Verified Certificate
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
                  Authentic Certificate of Service
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Certificate ID: <strong>{cert.certificateId}</strong>
                </p>
              </div>

              {/* Record Summary - strictly no personal phone/email as required */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500 font-medium">Recipient Name:</span>
                  <span className="font-bold text-sm text-slate-900">{cert.recipientName}</span>
                </div>

                {cert.collegeName && (
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                    <span className="text-slate-500 font-medium">Institution / College:</span>
                    <span className="font-semibold text-slate-800">{cert.collegeName}</span>
                  </div>
                )}

                {cert.course && (
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                    <span className="text-slate-500 font-medium">Course / Academic Discipline:</span>
                    <span className="font-semibold text-slate-800">{cert.course}</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500 font-medium">Community Service Period:</span>
                  <span className="font-semibold text-slate-800">
                    {cert.startDate} to {cert.endDate}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500 font-medium">Verified Service Hours:</span>
                  <span className="font-extrabold text-sm text-rose-700">
                    {cert.totalHours} Volunteer Hours
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block mb-1">Activities Conducted:</span>
                  <p className="text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-200">
                    {cert.workSummary}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500">
                  <span>Authorized Supervisor: <strong>{cert.supervisorName}</strong></span>
                  <span>Issued: {new Date(cert.issuedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`/api/certificates/${cert.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Official PDF Certificate
                </a>
                <Link
                  href="/"
                  className="py-3 px-6 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-xs sm:text-sm"
                >
                  Visit Trust Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <XCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
                  Verification Failed
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Invalid or Revoked Certificate
                </h1>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                  No active certificate was found for ID <code className="font-mono font-bold text-rose-700">{certificateId}</code>.
                  It may have been revoked or the identifier was mistyped.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/students/track"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-colors text-xs"
                >
                  Student Lookup Portal
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Official Trust Footnote from PATCH */}
        <div className="text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) | Est. 2012 | Regd. No. 1950
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Act 29, Rules E-29288, Mumbai | Khidkali, Kalyan-Shilphata Rd, Thane - 421204
          </p>
        </div>
      </div>
    </div>
  );
}
