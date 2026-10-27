"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  QrCode,
  Share2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { STUDENT_PURPOSES, VOLUNTEER_ACTIVITIES, NGO_CONFIG } from "@/lib/constants";
import confetti from "canvas-confetti";

interface CollegeOption {
  id: string;
  name: string;
  university?: string | null;
  city?: string | null;
}

export default function StudentRegisterPage() {
  const [colleges, setColleges] = useState<CollegeOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    studentId: string;
    fullName: string;
    qrCodeDataUrl?: string;
  } | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [age, setAge] = useState("20");
  const [city, setCity] = useState("Kalyan");

  // College details
  const [collegeName, setCollegeName] = useState("");
  const [university, setUniversity] = useState("University of Mumbai");
  const [course, setCourse] = useState("");
  const [yearSemester, setYearSemester] = useState("Undergraduate");
  const [rollNumber, setRollNumber] = useState("");

  // Faculty coordinator
  const [facultyName, setFacultyName] = useState("");
  const [facultyPhone, setFacultyPhone] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");

  // Visit specifics
  const [visitType, setVisitType] = useState<"INDIVIDUAL" | "GROUP">("INDIVIDUAL");
  const [groupSize, setGroupSize] = useState(1);
  const [groupMemberNames, setGroupMemberNames] = useState("");
  const [purpose, setPurpose] = useState("COMMUNITY_SERVICE");
  const [preferredDates, setPreferredDates] = useState("");
  const [expectedHours, setExpectedHours] = useState(15);
  const [interests, setInterests] = useState<string[]>(["Teaching children"]);
  const [consent, setConsent] = useState(false);

  // Honeypot spam field
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    // Fetch colleges for autocomplete
    fetch("/api/students/colleges")
      .then((res) => res.json())
      .then((data) => {
        if (data.colleges) setColleges(data.colleges);
      })
      .catch(() => {});
  }, []);

  const toggleInterest = (act: string) => {
    if (interests.includes(act)) {
      setInterests(interests.filter((i) => i !== act));
    } else {
      setInterests([...interests, act]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Please check the privacy and consent box to continue.");
      return;
    }
    if (interests.length === 0) {
      setError("Please select at least one area of interest.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        fullName,
        phone,
        email,
        gender,
        age: parseInt(age) || null,
        city,
        collegeName,
        university,
        course,
        yearSemester,
        rollNumber,
        facultyName,
        facultyPhone,
        facultyEmail,
        visitType,
        groupSize,
        groupMemberNames,
        purpose,
        preferredDates,
        expectedHours,
        interests,
        honeypot,
      };

      const res = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit registration");

      setResult({
        studentId: json.studentId,
        fullName,
        qrCodeDataUrl: json.qrCodeDataUrl,
      });

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting registration");
      setSubmitting(false);
    }
  };

  if (result) {
    const whatsappMsg = encodeURIComponent(
      `Namaste Deva Salat ji, I have registered as a student volunteer with Aadhar Adivashi Seva Ashram.\nStudent ID: ${result.studentId}\nName: ${result.fullName}\nCollege: ${collegeName}\nPurpose: ${purpose}`
    );
    const whatsappUrl = `https://wa.me/91${NGO_CONFIG.chairman.phone}?text=${whatsappMsg}`;

    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-10 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Registration Complete
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
              Welcome, {result.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Your student volunteer profile has been officially registered in the ashram work register.
            </p>
          </div>

          {/* Student ID & QR Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Your Official Student Volunteer ID:
              </span>
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#2E3192] tracking-wide">
                {result.studentId}
              </span>
            </div>

            {result.qrCodeDataUrl && (
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl max-w-xs mx-auto shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.qrCodeDataUrl}
                  alt="Student QR Check-in Code"
                  className="w-44 h-44 object-contain"
                />
                <p className="text-[11px] font-semibold text-slate-600 mt-2 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#2E3192]" />
                  Show this QR code at Ashram Kiosk for fast Check-in
                </p>
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              A confirmation record has been logged. When you visit the ashram or attend field drives, your hours will be tracked against this ID.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs flex items-center justify-center gap-2.5 text-xs sm:text-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              Share Registration with Chairman on WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href={`/students/track?id=${result.studentId}`}
                className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                Lookup My Hours
              </Link>
              <Link
                href="/"
                className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-[#2E3192] text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            Public Student Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3192]">
            Register as a College Student Volunteer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Get an official Student ID (<code>AASA-STU-YYYY-XXXX</code>), log your field hours, and earn an authentic, verifiable certificate of service.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field (hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Section 1: Student Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-[#2E3192] flex items-center justify-center text-xs">
                1
              </span>
              Student Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Ashok Patil"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sneha.patil@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gender (Optional)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="15"
                  max="40"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City / Residence Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kalyan / Dombivli / Thane"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: College & Academic Background */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-[#2E3192] flex items-center justify-center text-xs">
                2
              </span>
              College & University Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  list="colleges-list"
                  placeholder="Type college name or select from existing..."
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
                <datalist id="colleges-list">
                  {colleges.map((col) => (
                    <option key={col.id} value={col.name} />
                  ))}
                </datalist>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Select an existing college or type your own college name if not listed.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  University / Board
                </label>
                <input
                  type="text"
                  placeholder="e.g. University of Mumbai"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course / Degree <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Sc. IT / B.Com / BSW / B.A."
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Year / Semester
                </label>
                <input
                  type="text"
                  placeholder="e.g. SY Sem 4 / TY Sem 6"
                  value={yearSemester}
                  onChange={(e) => setYearSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  College Roll No. / Student ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024-IT-42"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              {/* Faculty coordinator (Optional) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty / NSS Coordinator Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Sandeep Patil"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9821098210"
                  value={facultyPhone}
                  onChange={(e) => setFacultyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visit Type & Interests */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-[#2E3192] flex items-center justify-center text-xs">
                3
              </span>
              Visit Purpose & Areas of Interest
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Visit Format <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visitType"
                      checked={visitType === "INDIVIDUAL"}
                      onChange={() => setVisitType("INDIVIDUAL")}
                      className="text-[#2E3192]"
                    />
                    <span className="font-semibold text-slate-800">Individual Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visitType"
                      checked={visitType === "GROUP"}
                      onChange={() => setVisitType("GROUP")}
                      className="text-[#2E3192]"
                    />
                    <span className="font-semibold text-slate-800">Group / NSS Unit</span>
                  </label>
                </div>
              </div>

              {visitType === "GROUP" && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Number of Students in Group
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>
              )}

              {visitType === "GROUP" && (
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Group Member Names / Roll Numbers (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 1. Rohan Sharma, 2. Sneha Patil, 3. Aniket Jadhav"
                    value={groupMemberNames}
                    onChange={(e) => setGroupMemberNames(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Purpose of Engagement <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192] bg-white"
                >
                  {STUDENT_PURPOSES.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Expected Volunteer Hours
                </label>
                <input
                  type="number"
                  min={2}
                  max={240}
                  value={expectedHours}
                  onChange={(e) => setExpectedHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Preferred Dates or Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekends only, or 10th to 15th March 2026"
                  value={preferredDates}
                  onChange={(e) => setPreferredDates(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E3192]"
                />
              </div>
            </div>

            {/* Multi-select Interests */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Select Areas of Interest (Choose all that apply) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {VOLUNTEER_ACTIVITIES.map((act) => (
                  <label
                    key={act}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      interests.includes(act)
                        ? "border-[#2E3192] bg-indigo-50/70 text-[#2E3192] font-semibold"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes(act)}
                      onChange={() => toggleInterest(act)}
                      className="rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
                    />
                    <span>{act}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy notice and consent */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]"
                />
                <span>
                  <strong>Privacy Notice:</strong> I consent to my details being stored in the Aadhar Adivashi Seva Ashram work register for volunteer scheduling, attendance tracking, and certificate issuance. Personal phone/email are strictly confidential and will never be published publicly.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl font-bold text-white bg-[#2E3192] hover:bg-indigo-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {submitting ? "Registering Student Volunteer..." : "Complete Student Registration & Generate QR"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
