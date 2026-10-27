import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDonationReceiptPdf } from "@/lib/pdf";
import { NGO_CONFIG } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const donation = await prisma.donation.findFirst({
      where: {
        OR: [{ receiptNo: id }, { referenceId: id }],
      },
      include: {
        items: true,
        organization: true,
      },
    });

    if (!donation) {
      return NextResponse.json({ error: "Donation receipt not found." }, { status: 404 });
    }

    if (donation.status === "VOIDED") {
      return NextResponse.json(
        { error: "This donation receipt has been marked VOID." },
        { status: 410 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Item summary
    const itemSummary =
      donation.items.length > 0
        ? donation.items.map((it) => `${it.itemType} (${it.quantity})`).join(", ")
        : donation.purpose || donation.donationType;

    const quantityOrAmount = donation.amount
      ? `Rs. ${donation.amount.toLocaleString("en-IN")}/-`
      : donation.items.length > 0
      ? donation.items.map((it) => it.quantity).join(", ")
      : "1 Consignment";

    const pdfBytes = await generateDonationReceiptPdf({
      receiptNo: donation.receiptNo || donation.referenceId,
      referenceId: donation.referenceId,
      date: new Date(donation.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      donorName: donation.donorName,
      donorType: donation.donorType,
      organizationName: donation.organization?.name || null,
      phone: donation.donorPhone,
      email: donation.donorEmail,
      address: donation.donorAddress,
      donationType: donation.donationType,
      itemSummary,
      quantityOrAmount,
      paymentMode: donation.paymentMode,
      txnReference: donation.txnReference,
      donorPan: donation.donorPan,
      receivedBy: donation.receivedBy || "Deva Salat (Chairman)",
      baseUrl,
      tax80gEnabled: false,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Receipt-${donation.receiptNo || donation.referenceId}.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("Receipt PDF generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate receipt PDF" },
      { status: 500 }
    );
  }
}
