import { prisma } from "@/lib/prisma";

export async function logAudit({
  userId,
  userName,
  action,
  entityType,
  entityId,
  details,
}: {
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown> | string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userName: userName || "System / Admin",
        action,
        entityType,
        entityId,
        details: typeof details === "object" ? JSON.stringify(details) : details || null,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
