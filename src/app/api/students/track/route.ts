import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const student = await prisma.student.findFirst({
      where: {
        studentId: { equals: studentId },
        isDeleted: false,
      },
      include: {
        visits: {
          include: {
            activities: true,
            certificate: true,
          },
          orderBy: { date: "desc" },
        },
        certificates: {
          where: { isRevoked: false },
          orderBy: { issuedAt: "desc" },
        },
        donations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "No student found with this ID." }, { status: 404 });
    }

    // Phone verification if provided
    if (phone && !student.phone.includes(phone) && !phone.includes(student.phone)) {
      return NextResponse.json(
        { error: "Phone number does not match registered student record." },
        { status: 403 }
      );
    }

    // Calculate total verified hours
    const totalHours = student.visits
      .filter((v) => v.status === "APPROVED" || v.status === "CERTIFICATE_ISSUED")
      .reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

    return NextResponse.json({
      student: {
        studentId: student.studentId,
        fullName: student.fullName,
        collegeName: student.collegeName,
        course: student.course,
        yearSemester: student.yearSemester,
        purpose: student.purpose,
        qrCodeDataUrl: student.qrCodeDataUrl,
        totalHours,
        visits: student.visits,
        certificates: student.certificates,
        donations: student.donations,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to look up student records" },
      { status: 500 }
    );
  }
}
