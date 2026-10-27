import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      donationType,
      donorType = "INDIVIDUAL",
      donorName,
      donorPhone,
      donorEmail,
      donorAddress,
      pincode,
      pickupType = "PICKUP",
      pickupDate,
      pickupSlot,
      notes,
      // Organization fields (if donating on behalf of org)
      isOrganization = false,
      orgName,
      orgType,
      contactPerson,
      designation,
      establishedYear,
      orgCity,
      isPublicPartner = true,
      // Category specifics
      items = [],
      // Cash specifics
      amount,
      paymentMode,
      txnReference,
      purpose,
      donorPan,
      // Food specifics
      urgencyHours,
      foodType,
      foodIsVeg,
      prepDate,
      // Furniture specifics
      floorsCount,
      hasLift,
      needsVehicle,
      approxWeight,
      photos,
      // Honeypot spam check
      honeypot,
    } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    if (!donorName || !donorPhone) {
      return NextResponse.json(
        { error: "Donor name and phone number are required." },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();

    // Generate unique reference ID
    const count = await prisma.donation.count();
    const referenceId = `AASA-DON-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    // Handle Organization linking/creation if applicable
    let organizationId: string | null = null;
    let actualDonorType = donorType;

    if (isOrganization && orgName) {
      actualDonorType = "ORGANIZATION";
      // Check for existing organization
      let existingOrg = await prisma.organization.findFirst({
        where: {
          OR: [
            { name: { equals: orgName.trim() } },
            { phone: donorPhone.trim() },
          ],
        },
      });

      if (!existingOrg) {
        existingOrg = await prisma.organization.create({
          data: {
            name: orgName.trim(),
            type: orgType || "Other",
            contactPerson: contactPerson || donorName,
            designation: designation || "Representative",
            phone: donorPhone.trim(),
            email: donorEmail || null,
            establishedYear: establishedYear || null,
            streetAddress: donorAddress || null,
            city: orgCity || "Thane",
            pincode: pincode || null,
            isPublicPartner: Boolean(isPublicPartner),
          },
        });
      }
      organizationId = existingOrg.id;
    }

    // Receipt number for cash or confirmed donations
    let receiptNo: string | null = null;
    if (donationType === "CASH" || amount) {
      const receiptCount = await prisma.receipt.count();
      receiptNo = `AASA-RCPT-${currentYear}-${String(receiptCount + 1).padStart(4, "0")}`;
    }

    // Create Donation
    const donation = await prisma.donation.create({
      data: {
        referenceId,
        receiptNo,
        donationType,
        donorType: actualDonorType,
        donorName,
        donorPhone,
        donorEmail: donorEmail || null,
        donorAddress: donorAddress || null,
        pincode: pincode || null,
        pickupType,
        pickupDate: pickupDate || null,
        pickupSlot: pickupSlot || null,
        notes: notes || null,
        organizationId,
        // Cash details
        amount: amount ? parseFloat(amount) : null,
        paymentMode: paymentMode || null,
        txnReference: txnReference || null,
        purpose: purpose || "GENERAL",
        donorPan: donorPan || null,
        // Food details
        urgencyHours: urgencyHours ? parseInt(urgencyHours) : null,
        foodType: foodType || null,
        foodIsVeg: foodIsVeg !== undefined ? Boolean(foodIsVeg) : null,
        prepDate: prepDate || null,
        // Furniture details
        floorsCount: floorsCount ? parseInt(floorsCount) : null,
        hasLift: hasLift !== undefined ? Boolean(hasLift) : null,
        needsVehicle: needsVehicle !== undefined ? Boolean(needsVehicle) : null,
        approxWeight: approxWeight || null,
        photos: photos ? (typeof photos === "string" ? photos : JSON.stringify(photos)) : null,
        status: donationType === "CASH" ? "DELIVERED" : "PENDING",
      },
    });

    // Create donation items
    if (items && Array.isArray(items) && items.length > 0) {
      await prisma.donationItem.createMany({
        data: items.map((it: { itemType: string; quantity: string; condition?: string; sizeOrAge?: string; detailsJson?: string }) => ({
          donationId: donation.id,
          itemType: it.itemType || donationType,
          quantity: it.quantity || "1",
          condition: it.condition || "GENTLY_USED",
          sizeOrAge: it.sizeOrAge || null,
          detailsJson: it.detailsJson || null,
        })),
      });
    }

    // Create receipt record if receiptNo generated
    if (receiptNo) {
      await prisma.receipt.create({
        data: {
          receiptNo,
          donationId: donation.id,
        },
      });
    }

    // Audit log
    await logAudit({
      action: "PUBLIC_DONATION_SUBMITTED",
      entityType: "Donation",
      entityId: donation.id,
      details: {
        referenceId,
        receiptNo,
        donationType,
        donorName,
        organizationId,
      },
    });

    return NextResponse.json({
      success: true,
      referenceId,
      receiptNo,
      donationId: donation.id,
      message: "Donation recorded successfully",
    });
  } catch (err: unknown) {
    console.error("Donation submission error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record donation" },
      { status: 500 }
    );
  }
}
