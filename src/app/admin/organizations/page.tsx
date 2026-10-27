import React from "react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import OrganizationsClient from "./OrganizationsClient";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  const user = await getSessionUser();

  const organizations = await prisma.organization.findMany({
    where: { isDeleted: false },
    orderBy: { name: "asc" },
    include: {
      donations: {
        where: { status: { not: "VOIDED" } },
        select: {
          id: true,
          amount: true,
          donationType: true,
          createdAt: true,
        },
      },
    },
  });

  return (
    <OrganizationsClient
      initialOrganizations={organizations}
      userRole={user?.role || "STAFF"}
    />
  );
}
