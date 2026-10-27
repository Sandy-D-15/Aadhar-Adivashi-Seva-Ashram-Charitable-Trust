"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  GraduationCap,
  School,
  HeartHandshake,
  QrCode,
  Settings,
  CalendarCheck,
} from "lucide-react";

export default function AdminNav({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard & Analytics",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Master Donation Register",
      href: "/admin/donation-register",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      label: "Donor Organizations",
      href: "/admin/organizations",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      label: "Student Register",
      href: "/admin/students",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      label: "Colleges Directory",
      href: "/admin/colleges",
      icon: <School className="w-4 h-4" />,
    },
    {
      label: "Student & College Donations",
      href: "/admin/student-donations",
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    {
      label: "Visits & Work Records",
      href: "/admin/visits",
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      label: "Kiosk QR Check-In",
      href: "/admin/checkin",
      icon: <QrCode className="w-4 h-4" />,
    },
    {
      label: "NGO Settings & Config",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="p-3 space-y-1 text-xs font-medium">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive
                ? "bg-[#2E3192] text-white font-bold shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
