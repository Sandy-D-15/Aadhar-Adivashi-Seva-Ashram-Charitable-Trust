import React from "react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import StudentDonationsClient from "./StudentDonationsClient";

export const dynamic = "force-dynamic";

export default async function AdminStudentDonationsPage() {
  const user = await getSessionUser();

  const donations = await prisma.donation.findMany({
    where: {
      donorType: "STUDENT",
      status: { not: "VOIDED" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      college: true,
      visit: true,
      items: true,
      receipts: true,
    },
  });

  const colleges = await prisma.college.findMany({
    select: { id: true, name: true, facultyName: true, facultyPhone: true },
    orderBy: { name: "asc" },
  });

  const students = await prisma.student.findMany({
    where: { isDeleted: false },
    select: { id: true, fullName: true, studentId: true, collegeName: true, collegeId: true },
    orderBy: { fullName: "asc" },
  });

  const supervisors = await prisma.supervisor.findMany({
    select: { name: true },
  });

  return (
    <StudentDonationsClient
      initialDonations={donations}
      colleges={colleges}
      students={students}
      supervisors={supervisors.map((s) => s.name)}
      userRole={user?.role || "STAFF"}
      userName={user?.name || "Staff Coordinator"}
    />
  );
}
