import React from "react";
import { NGO_CONFIG } from "@/lib/constants";
import { FileText, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Terms & Guidelines
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192] mt-3">
            Terms of Service & Code of Conduct
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aadhar Adivashi Seva Ashram Charitable Trust (Regd. No. 1950, Mumbai) | Established 2012
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2E3192]" />
            1. Acceptance of Terms
          </h2>
          <p>
            By utilizing this website, submitting donation requests, registering as a student volunteer, or downloading official receipts and certificates, you agree to comply with these Terms and all applicable laws in India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Donation Commitments
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Wearable Clothes:</strong> Donors agree that donated clothing is washed, clean, wearable, and respectful of the dignity of tribal beneficiaries.</li>
            <li><strong>Food Items:</strong> Cooked food must be hygienic, prepared within safe timelines, and properly packaged.</li>
            <li><strong>Safe Toys & Materials:</strong> Toys, learning items, instruments, and furniture must be safe, functional, and structurally sound.</li>
            <li><strong>Monetary Gifts:</strong> Voluntary contributions are channeled into daily nutrition, education kits, medical relief, and tribal welfare projects.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Student Volunteer Code of Conduct
          </h2>
          <p>
            College students participating in field visits, teaching children, and sorting donations agree to treat all community members with compassion, humility, and respect. No photography of minors or beneficiaries without supervisor permission is permitted. Certificates are issued strictly upon genuine completion and supervisor verification of logged hours.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p>
            For any clarifications, please reach us at: <code>{NGO_CONFIG.email}</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
