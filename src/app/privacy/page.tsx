import React from "react";
import { NGO_CONFIG } from "@/lib/constants";
import { ShieldCheck, Lock, UserCheck, Trash2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Trust Transparency & Data Protection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192] mt-3">
            Privacy Policy & Student Data Protection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Last Updated: January 2026 | Aadhar Adivashi Seva Ashram Charitable Trust (Regd. No. 1950, Mumbai)
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            1. Commitment to Privacy
          </h2>
          <p>
            Aadhar Adivashi Seva Ashram Charitable Trust (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Trust&rdquo;) is committed to protecting the privacy of our donors, volunteers, student partners, and beneficiary communities. We handle all personal data with utmost discretion, legal integrity, and security.
          </p>
        </section>

        {/* STUDENT DATA POLICY SECTION */}
        <section className="space-y-3 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
          <h2 className="text-base font-bold text-[#2E3192] flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            2. College Student Volunteer Data Policy
          </h2>
          <p>
            When college students register via <code>/students/register</code> or participate in NSS, NCC, or internship drives, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal Identifiers:</strong> Full name, mobile phone number, email address, gender (optional), age, and residential city.</li>
            <li><strong>Academic Details:</strong> College name, university affiliation, course/degree, year/semester, and student roll number.</li>
            <li><strong>Attendance & Work Records:</strong> Dates of visits, check-in and check-out timestamps, hours served, activities performed, and supervisor feedback.</li>
          </ul>
          <p className="pt-1">
            <strong>Purpose of Collection:</strong> Student data is strictly utilized to schedule community visits, verify hours, generate academic reports for universities/NSS diaries, and issue anti-fraud QR-verified certificates of service.
          </p>
          <p>
            <strong>Public Anonymity:</strong> Under no circumstances are student personal contact numbers, residential addresses, or emails displayed publicly. Public partner sections display only college names and cumulative volunteer hours.
          </p>
          <p>
            <strong>Retention Period & Deletion:</strong> Student records are preserved for a period of up to 5 academic years for verification audits by colleges. Students may request soft deletion or rectification of their records anytime by emailing <code>{NGO_CONFIG.email}</code>.
          </p>
        </section>

        {/* DONOR & ORGANIZATION DATA */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2E3192]" />
            3. Donor & Organization Data Protection
          </h2>
          <p>
            For individual and organizational donors (NGOs, trusts, housing societies, companies):
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact details and pickup addresses are used solely by ashram coordinators for logistics scheduling and issuing official receipts.</li>
            <li>Financial transactions and PAN numbers (when provided) are maintained strictly for accounting and statutory compliance.</li>
            <li>Partner organizations that select &ldquo;Show publicly as a partner&rdquo; will only have their organization name/logo displayed, never individual contact person details.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            4. Information Sharing & Third Parties
          </h2>
          <p>
            We do not sell, rent, or trade your personal information to commercial third parties. Data is only accessible to authorized trust supervisors (Deva Salat, Priti Salat, and administrative staff).
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p>
            For privacy inquiries or deletion requests, please contact our Chairman at: <br />
            <strong>Aadhar Adivashi Seva Ashram Charitable Trust</strong> <br />
            Nana Devkar Row House, Jiga Society, Khidkali, Kalyan-Shilphata Rd, Thane - 421204 <br />
            Email: <code>{NGO_CONFIG.email}</code> | Phone: +91 8108751580
          </p>
        </section>
      </div>
    </div>
  );
}
