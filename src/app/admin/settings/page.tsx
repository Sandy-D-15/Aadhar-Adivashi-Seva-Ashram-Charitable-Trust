import React from "react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();

  const settingsRecords = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const supervisors = await prisma.supervisor.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <SettingsClient
      initialSettings={settingsMap}
      initialSupervisors={supervisors}
      userRole={user?.role || "STAFF"}
    />
  );
}
