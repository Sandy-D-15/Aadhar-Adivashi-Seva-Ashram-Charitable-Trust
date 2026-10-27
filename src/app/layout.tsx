import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppShell } from "@/components/AppShell";
import { NGO_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2E3192",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.adivashisevango.org"
  ),
  title: {
    default: `${NGO_CONFIG.name} | Est. ${NGO_CONFIG.establishedDate.split("-")[0]} | Regd. No. 1950`,
    template: `%s | ${NGO_CONFIG.name}`,
  },
  description:
    "Aadhar Adivashi Seva Ashram Charitable Trust (Regd. No. 1950, Act 29, Rules E-29288, Mumbai). Serving tribal communities and children since 2012 through donation drives, education, student volunteer programs, and community welfare.",
  keywords: [
    "Aadhar Adivashi Seva Ashram",
    "Tribal NGO Mumbai",
    "Adivasi Welfare Thane",
    "Donate Clothes Mumbai",
    "Donate Food Kalyan Shill Road",
    "College Student Volunteering Mumbai",
    "NSS Accreditation Certificate",
    "NGO Donation 80G",
    "Deva Salat NGO",
  ],
  authors: [{ name: NGO_CONFIG.name, url: NGO_CONFIG.website }],
  creator: NGO_CONFIG.name,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.adivashisevango.org",
    siteName: NGO_CONFIG.name,
    title: `${NGO_CONFIG.name} | Serving Tribal Communities Since 2012`,
    description:
      "Join us in supporting Adivasi children and families. Donate clothes, food, toys, learning materials, instruments, furniture, or funds, or register as a student volunteer.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: `${NGO_CONFIG.name} Emblem`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: NGO_CONFIG.name,
    description:
      "Aadhar Adivashi Seva Ashram Charitable Trust (Regd. No. 1950, Mumbai). Serving since 2012.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
