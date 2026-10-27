import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!ref) {
      return NextResponse.json({ error: "Reference ID is required" }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({
      where: { referenceId: ref },
      include: {
        items: true,
        receipts: true,
        organization: {
          select: { name: true, type: true },
        },
      },
    });

    if (!donation) {
      return NextResponse.json(
        { error: "No donation found matching this Reference ID." },
        { status: 404 }
      );
    }

    // Phone validation if supplied
    if (phone && !donation.donorPhone.includes(phone) && !phone.includes(donation.donorPhone)) {
      return NextResponse.json(
        { error: "Phone number does not match records for this Reference ID." },
        { status: 403 }
      );
    }

    return NextResponse.json({ donation });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to look up donation status" },
      { status: 500 }
    );
  }
}
