import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only full Admins have permission to void donation entries." },
        { status: 403 }
      );
    }

    const { donationId, reason } = await req.json();

    if (!donationId || !reason) {
      return NextResponse.json(
        { error: "Donation ID and void reason are required." },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "VOIDED",
        voidedAt: new Date(),
        voidReason: reason.trim(),
      },
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      action: "VOID_DONATION",
      entityType: "Donation",
      entityId: donationId,
      details: { referenceId: donation.referenceId, reason },
    });

    return NextResponse.json({ success: true, message: "Donation voided successfully" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to void donation" },
      { status: 500 }
    );
  }
}
