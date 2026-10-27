# Aadhar Adivashi Seva Ashram Charitable Trust (Regd.)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black.svg)](https://nextjs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-blue.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License: Private](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)]()

> **"Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) | Est. 2012 | Regd. No. 1950"**  
> Serving Adivasi tribal communities, children, and underprivileged families across Thane and Mumbai since **20 December 2012**.

---

## 🏛️ Official Trust Registration & Details

- **Trust Name:** Aadhar Adivashi Seva Ashram Charitable Trust (Regd.)
- **Registration Number:** Regd. No. 1950, Act 29, Rules E-29288, Mumbai
- **Date of Establishment:** 20 December 2012 (`2012-12-20`)
- **Registered Address:** Nana Devkar Row House, Jiga Society, Nr. Khidkaleshwar Mandir, Khidkali, Kalyan Shill Rd., Dist. Thane, Maharashtra
- **Website:** [www.adivashisevango.org](https://www.adivashisevango.org)
- **Email:** devasalat3601@gmail.com
- **Leadership:**
  - **Chairman:** Deva Salat — `+91 8108751580`
  - **Secretary:** Priti Salat — `+91 7506101471`
  - **Trustee / Supervisor:** Sunil Waghmare — `+91 9820011223`

---

## 🌟 Key Functional Modules

### 1. 7 Expanded Donation Channels (`/donate`)
The entire system standardizes on a unified shared enum supporting 7 donation streams:
1. **Clothes** (`/donate/clothes`): Age group (infant/child/teen/adult), gender, quantity, condition, pickup/drop-off.
2. **Food** (`/donate/food`): Fresh cooked vs. dry ration/groceries, shelf life, safety guidelines acknowledgment, pickup urgency flag.
3. **Toys** (`/donate/toys`): Soft, educational, board games, outdoor toys, condition, photo upload.
4. **Learning Materials** (`/donate/learning-materials`): Notebooks, stationery kits, school bags, story books, textbooks.
5. **Instruments** (`/donate/instruments`): Harmonium, tabla, dholki, guitar, keyboard, drum, flute, sports equipment, condition, age group.
6. **Furniture** (`/donate/furniture`): Desks, benches, chairs, tables, cupboards, beds, mattresses, fans, condition, floor number, lift availability, transport vehicle requirement, mandatory photo upload.
7. **Cash & Online Money** (`/donate/money`): Direct bank transfer (NEFT/RTGS/IMPS), UPI QR (`8108751580@upi`), Cash/Cheque, purpose selector, optional PAN (if 80G is active), and automated receipt generation (`AASA-RCPT-YYYY-XXXX`).

### 2. Donor Organization Register (`/admin/organizations`)
- Dedicated registry for NGOs, trusts, companies (CSR), housing societies, schools, temples, and government bodies.
- Organization profiles (`/admin/organizations/[id]`) with total contribution metrics, category breakdown, full donation logs, and printable PDF summaries.
- **Smart Duplicate Detection:** When public donors toggle *"I'm donating on behalf of an organization"*, the system matches by name + phone/email to prevent duplicate records and alerts administrators.
- **Public Partner Showcase:** Organizations marked as *"Show publicly as a partner"* appear in the homepage partner gallery (showing only name and logo, never private contact details).

### 3. Master Donation Register (`/admin/donation-register`)
- Centralized register of every donation across individuals, organizations, walk-ins, and student visits.
- **Walk-in Manual Entry Modal:** Immediate entry for walk-in donors or phone inquiries, with autocomplete search to link existing donors or create inline.
- **Real-Time Totals Bar:** Dynamically calculates total cash collected, items count by category, and distinct donor counts based on applied filters.
- **Receipt Engine:** Instant PDF receipt generator with trust registration header, anti-fraud QR code, items/cash breakdown, and authorized signature placeholder.
- **Audit Logging & Non-Destructive Voiding:** Entries cannot be hard deleted; they are voided with a mandatory audit reason and logged with user credentials.
- **Multi-Format Export:** Real-time CSV export and print-ready PDF donation registers.

### 4. College Student Visit & Work Register (`/students` & `/admin/students`)
- **Public Student Registration (`/students/register`):** Instant registration issuing student ID `AASA-STU-YYYY-XXXX` with personalized QR code and WhatsApp share.
- **Kiosk Scanner (`/admin/checkin`):** Camera QR scanner or manual ID entry for instant volunteer check-in and check-out with automated duration calculation.
- **Visit Donation Tracking (`/admin/student-donations`):** Log what students or NSS groups bring (e.g., college donation drives), automatically cross-referenced to the Master Donation Register.
- **NSS / Accreditation Reports (`/admin/colleges` & `/api/reports/college/[id]`):** Instant official PDF reports for university and college NAAC/NSS committees documenting dates, supervisors, verified hours, and activity logs.
- **Tamper-Proof Certificates (`/verify/[certificateId]`):** Automated Certificate of Appreciation generation with unique UUID, official seal, and public QR code verification.

### 5. Multi-Lingual & Established Date Engine
- **Establishment Date:** Stored centrally in configuration and admin settings as `2012-12-20`.
- **Dynamic Service Counter:** The impact metric *"Years of Service"* is calculated dynamically based on current date (never hardcoded).
- **Trilingual Support:** Instant UI toggle across English, Marathi (मराठी), and Hindi (हिंदी) with localized date formats (e.g. `२०-१२-२०१२`).
- **SEO & Schema.org:** Organization JSON-LD contains `foundingDate: "2012-12-20"`, full address coordinates, and official leadership profiles.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18.18+ or 20+
- npm 9+

### 1. Clone & Install Dependencies
```bash
cd NGO
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="aadhar-adivasi-secret-key-change-in-production-2026"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Initialize & Seed Database
Sync the SQLite database schema and load seed data:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Pre-Seeded Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@adivashisevango.org` | `admin123` | Full access (Master Register, Void Entries, Settings, Organizations, Certificates) |
| **Staff** | `staff@adivashisevango.org` | `staff123` | Add & view records, Kiosk check-in/out, Student visit logs |

---

## 🛠️ Production Configuration Checklist

Before deploying to production, review the following settings in `/admin/settings`:

1. **Receipt Numbering Prefix:**
   - Default is `AASA-RCPT-YYYY-`. Customize in `/admin/settings` if the trust uses a different financial year series.
2. **80G Tax Exemption Status:**
   - Toggle **Enable 80G Tax Exemption** in `/admin/settings` once 80G provisional/final approval numbers are active. This enables mandatory PAN collection and prints 80G tax exemption clauses on receipts.
3. **Chairman Digital Signature:**
   - Upload Chairman Deva Salat's authorized signature graphic (`PNG` format with transparent background) in `/admin/settings` to appear on official PDF receipts and certificates.
4. **Authorized Supervisors List:**
   - Keep the authorized list of supervisors updated (default: Deva Salat, Priti Salat, Sunil Waghmare) to ensure proper attribution on student visit records.
5. **Bank Account Details:**
   - Confirm trust bank account number, IFSC code, branch, and official UPI VPA in `/admin/settings`.

### Render Database Setup

This project uses SQLite. On Render, attach a persistent disk to the web service at `/var/data` and set `DATABASE_URL` to `file:/var/data/ngo.db`. The `npm start` lifecycle runs `prisma db push` before starting Next.js, creating the schema on the mounted database.

SQLite data on Render's default filesystem is temporary and can be lost when the service is redeployed or restarted. Persistent disks require a paid Render instance; for a service without a disk, use a managed database instead. Set `JWT_SECRET` to a unique, random production value and set `NEXT_PUBLIC_BASE_URL` to the deployed site URL.

---

## 🧪 Testing Checklist & Verification Flows

1. **Online Public Donation:**
   - Navigate to `/donate/instruments` or `/donate/furniture`.
   - Submit a donation. Test toggling *"I'm donating on behalf of an organization"*.
   - Verify redirect to `/donate/success` with generated Reference ID and PDF receipt download.
2. **Online Money Donation:**
   - Navigate to `/donate/money`. Test copying bank credentials, selecting UPI, entering reference ID, and receiving receipt `AASA-RCPT-2026-XXXX`.
3. **Donor Organization Duplicate Detection:**
   - Navigate to `/admin/organizations`.
   - Add an organization or submit a donation with existing organization name/phone. Observe duplicate warning indicator.
4. **Master Donation Register & Void Entry:**
   - Log in as Admin at `/admin/login`.
   - Go to `/admin/donation-register`.
   - Click **+ Add Walk-In Manual Entry** and submit a cash donation.
   - Filter by donation type (e.g., Furniture) and check the real-time totals bar.
   - Test voiding an entry: click Void, provide a reason ("Wrong donor phone entered"), and verify audit trail.
5. **Student Volunteer Kiosk & Certificate:**
   - Register a student at `/students/register`. Note their QR code and ID.
   - Log visit in `/admin/visits` or scan student via `/admin/checkin`.
   - Approve visit and click **Issue Certificate**.
   - Open `/verify/[certificateId]` to verify anti-fraud badge.
6. **College NSS Drive & Report:**
   - Go to `/admin/student-donations`.
   - Click **+ Log College Group Drive** to record items collected during a campus drive.
   - Go to `/admin/colleges` and click **NSS Report (PDF)** to generate the university accreditation document.

---

## 📄 License & Attribution

© 2012–2026 **Aadhar Adivashi Seva Ashram Charitable Trust (Regd. No. 1950, Act 29, Rules E-29288, Mumbai)**.  
All rights reserved. Built for community welfare and tribal upliftment.
