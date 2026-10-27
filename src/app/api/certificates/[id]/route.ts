import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/pdf";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cert = await prisma.certificate.findUnique({
      where: { certificateId: id },
      include: {
        student: true,
      },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    if (cert.isRevoked) {
      return NextResponse.json(
        { error: "This certificate has been revoked by administration." },
        { status: 410 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const pdfBytes = await generateCertificatePdf({
      certificateId: cert.certificateId,
      type: cert.type,
      recipientName: cert.recipientName,
      collegeName: cert.collegeName,
      course: cert.course,
      workSummary: cert.workSummary,
      startDate: cert.startDate,
      endDate: cert.endDate,
      totalHours: cert.totalHours,
      supervisorName: cert.supervisorName,
      baseUrl,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Certificate-${cert.certificateId}.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("Certificate PDF error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate certificate PDF" },
      { status: 500 }
    );
  }
}
