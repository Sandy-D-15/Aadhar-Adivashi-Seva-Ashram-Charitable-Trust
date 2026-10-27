import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        organization: { select: { name: true } },
        student: { select: { fullName: true, studentId: true } },
        college: { select: { name: true } },
        items: true,
      },
    });

    const headers = [
      "Reference ID",
      "Receipt No",
      "Date",
      "Donor Type",
      "Donor Name",
      "Organization",
      "Phone",
      "Email",
      "Address",
      "Pincode",
      "Category",
      "Items Particulars",
      "Quantity / Servings",
      "Cash Amount (INR)",
      "Payment Mode",
      "Txn Reference",
      "Pickup/Dropoff",
      "Received By",
      "Status",
    ];

    const escapeCsv = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = donations.map((d) => [
      escapeCsv(d.referenceId),
      escapeCsv(d.receiptNo || ""),
      escapeCsv(new Date(d.createdAt).toISOString().split("T")[0]),
      escapeCsv(d.donorType),
      escapeCsv(d.donorName),
      escapeCsv(d.organization?.name || ""),
      escapeCsv(d.donorPhone),
      escapeCsv(d.donorEmail || ""),
      escapeCsv(d.donorAddress || ""),
      escapeCsv(d.pincode || ""),
      escapeCsv(d.donationType),
      escapeCsv(d.items.map((i) => i.itemType).join("; ") || d.purpose || ""),
      escapeCsv(d.items.map((i) => i.quantity).join("; ") || ""),
      escapeCsv(d.amount ? d.amount : ""),
      escapeCsv(d.paymentMode || ""),
      escapeCsv(d.txnReference || ""),
      escapeCsv(d.pickupType),
      escapeCsv(d.receivedBy || ""),
      escapeCsv(d.status),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AASA-Donation-Register-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to export CSV" },
      { status: 500 }
    );
  }
}
