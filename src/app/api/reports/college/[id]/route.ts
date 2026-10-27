import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCollegeReportPdf } from "@/lib/pdf";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        students: {
          where: { isDeleted: false },
          include: {
            visits: {
              where: { status: { in: ["APPROVED", "CERTIFICATE_ISSUED"] } },
            },
          },
        },
        donations: {
          include: { items: true },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    let totalHours = 0;
    const visitsList: Array<{
      date: string;
      studentName: string;
      description: string;
      hours: number;
    }> = [];

    college.students.forEach((s) => {
      s.visits.forEach((v) => {
        totalHours += v.totalHours || 0;
        visitsList.push({
          date: v.date,
          studentName: s.fullName,
          description: v.description,
          hours: v.totalHours,
        });
      });
    });

    const donationsList = college.donations.map((d) => ({
      date: new Date(d.createdAt).toISOString().split("T")[0],
      type: d.donationType,
      details: d.items.map((i) => i.itemType).join(", ") || d.purpose || "Donation",
      quantity: d.items.map((i) => i.quantity).join(", ") || (d.amount ? `Rs. ${d.amount}` : "1 Unit"),
    }));

    const pdfBytes = await generateCollegeReportPdf({
      collegeName: college.name,
      university: college.university,
      facultyName: college.facultyName,
      totalStudents: college.students.length,
      totalHours,
      totalDonationsCount: college.donations.length,
      visits: visitsList,
      donations: donationsList,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="College-Report-${college.name.replace(/[^a-zA-Z0-9]/g, "-")}.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("College report PDF error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate college report" },
      { status: 500 }
    );
  }
}
