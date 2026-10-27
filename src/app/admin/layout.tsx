import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSessionUser } from "@/lib/auth";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  GraduationCap,
  School,
  HeartHandshake,
  QrCode,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 md:min-h-screen flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full rounded-full"
              />
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-white text-sm block truncate">
                Aadhar Ashram
              </span>
              <span className="text-[11px] text-rose-400 font-semibold block">
                Trust Admin (Regd. 1950)
              </span>
            </div>
          </div>

          {/* User Badge */}
          {user && (
            <div className="px-5 py-3 bg-slate-800/60 border-b border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-300 font-medium truncate">
                {user.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user.role}
              </span>
            </div>
          )}

          {/* Navigation Links Component */}
          <AdminNav userRole={user?.role || "STAFF"} />
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Public Website ↗</span>
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
