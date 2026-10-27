import React from "react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import VisitsClient from "./VisitsClient";

export const dynamic = "force-dynamic";

export default async function AdminVisitsPage() {
  const user = await getSessionUser();

  const visits = await prisma.studentVisit.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      activities: true,
      certificate: true,
    },
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
    <VisitsClient
      initialVisits={visits}
      students={students}
      supervisors={supervisors.map((s) => s.name)}
      userRole={user?.role || "STAFF"}
      userName={user?.name || "Staff Coordinator"}
    />
  );
}
