import React from "react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import DonationRegisterClient from "./DonationRegisterClient";

export const dynamic = "force-dynamic";

export default async function AdminDonationRegisterPage() {
  const user = await getSessionUser();

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { id: true, name: true, type: true } },
      student: { select: { id: true, fullName: true, studentId: true } },
      college: { select: { id: true, name: true } },
      items: true,
      receipts: true,
    },
  });

  const organizations = await prisma.organization.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, type: true },
    orderBy: { name: "asc" },
  });

  const students = await prisma.student.findMany({
    where: { isDeleted: false },
    select: { id: true, fullName: true, studentId: true, collegeName: true },
    orderBy: { fullName: "asc" },
  });

  const supervisors = await prisma.supervisor.findMany({
    select: { name: true },
  });

  return (
    <DonationRegisterClient
      initialDonations={donations}
      organizations={organizations}
      students={students}
      supervisors={supervisors.map((s) => s.name)}
      userRole={user?.role || "STAFF"}
      userName={user?.name || "Staff Coordinator"}
    />
  );
}
