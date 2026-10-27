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

    const body = await req.json();
    const {
      donationType,
      donorType = "INDIVIDUAL",
      donorName,
      donorPhone,
      donorEmail,
      donorAddress,
      pincode,
      organizationId,
      studentId,
      collegeId,
      amount,
      paymentMode,
      txnReference,
      purpose,
      receivedBy,
      notes,
      itemType,
      quantity,
      condition,
    } = body;

    if (!donorName || !donationType) {
      return NextResponse.json(
        { error: "Donor name and donation type are required." },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const donCount = await prisma.donation.count();
    const referenceId = `AASA-DON-${currentYear}-${String(donCount + 1).padStart(4, "0")}`;

    const receiptCount = await prisma.receipt.count();
    const receiptNo = `AASA-RCPT-${currentYear}-${String(receiptCount + 1).padStart(4, "0")}`;

    const donation = await prisma.donation.create({
      data: {
        referenceId,
        receiptNo,
        donationType,
        donorType,
        donorName: donorName.trim(),
        donorPhone: donorPhone ? donorPhone.trim() : "N/A",
        donorEmail: donorEmail || null,
        donorAddress: donorAddress || null,
        pincode: pincode || null,
        organizationId: organizationId || null,
        studentId: studentId || null,
        collegeId: collegeId || null,
        pickupType: "DROPOFF",
        amount: amount ? parseFloat(amount) : null,
        paymentMode: paymentMode || (donationType === "CASH" ? "CASH" : null),
        txnReference: txnReference || null,
        purpose: purpose || "GENERAL",
        receivedBy: receivedBy || user.name,
        notes: notes || "Manual walk-in / phone entry",
        isManualEntry: true,
        status: "DELIVERED",
      },
    });

    // Create item
    await prisma.donationItem.create({
      data: {
        donationId: donation.id,
        itemType: itemType || donationType,
        quantity: quantity || (amount ? `Rs. ${amount}` : "1 Unit"),
        condition: condition || "WORKING",
      },
    });

    // Create receipt record
    await prisma.receipt.create({
      data: {
        receiptNo,
        donationId: donation.id,
      },
    });

    // Audit log
    await logAudit({
      userId: user.userId,
      userName: user.name,
      action: "MANUAL_DONATION_CREATED",
      entityType: "Donation",
      entityId: donation.id,
      details: { referenceId, receiptNo, donationType, donorName, amount },
    });

    return NextResponse.json({
      success: true,
      donation,
      referenceId,
      receiptNo,
      message: "Manual donation recorded successfully",
    });
  } catch (err: unknown) {
    console.error("Manual donation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record manual donation" },
      { status: 500 }
    );
  }
}
