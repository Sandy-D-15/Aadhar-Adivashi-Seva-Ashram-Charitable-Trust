import React from "react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import StudentsClient from "./StudentsClient";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const user = await getSessionUser();

  const students = await prisma.student.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      college: { select: { id: true, name: true } },
      visits: {
        select: {
          id: true,
          totalHours: true,
          status: true,
          date: true,
        },
      },
      certificates: {
        where: { isRevoked: false },
        select: { id: true, certificateId: true },
      },
    },
  });

  const colleges = await prisma.college.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <StudentsClient
      initialStudents={students}
      colleges={colleges}
      userRole={user?.role || "STAFF"}
    />
  );
}
