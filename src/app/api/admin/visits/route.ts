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
      studentId,
      date,
      checkInTime,
      checkOutTime,
      totalHours,
      location,
      beneficiaryCount,
      supervisorName,
      description,
      outcome,
      rating,
      status = "WORK_LOGGED",
      actionType, // "LOG_WORK" | "APPROVE" | "ISSUE_CERTIFICATE"
      visitId,
    } = body;

    if (actionType === "APPROVE" && visitId) {
      const visit = await prisma.studentVisit.update({
        where: { id: visitId },
        data: {
          status: "APPROVED",
          approvedBy: user.name,
          approvedAt: new Date(),
        },
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        action: "APPROVE_VISIT",
        entityType: "StudentVisit",
        entityId: visitId,
      });

      return NextResponse.json({ success: true, visit });
    }

    if (actionType === "ISSUE_CERTIFICATE" && visitId) {
      const visit = await prisma.studentVisit.findUnique({
        where: { id: visitId },
        include: { student: true },
      });

      if (!visit) {
        return NextResponse.json({ error: "Visit not found" }, { status: 404 });
      }

      const currentYear = new Date().getFullYear();
      const certCount = await prisma.certificate.count();
      const certificateId = `AASA-CERT-${currentYear}-${String(certCount + 1).padStart(4, "0")}`;

      const certificate = await prisma.certificate.create({
        data: {
          certificateId,
          type: "VOLUNTEER",
          studentId: visit.studentId,
          recipientName: visit.student.fullName,
          collegeName: visit.student.collegeName,
          course: visit.student.course,
          workSummary: visit.description,
          startDate: visit.date,
          endDate: visit.date,
          totalHours: visit.totalHours,
          supervisorName: visit.supervisorName || "Deva Salat",
          qrCodeData: `https://www.adivashisevango.org/verify/${certificateId}`,
        },
      });

      await prisma.studentVisit.update({
        where: { id: visitId },
        data: {
          status: "CERTIFICATE_ISSUED",
          certificateId: certificate.id,
        },
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        action: "ISSUE_CERTIFICATE",
        entityType: "Certificate",
        entityId: certificate.id,
        details: { certificateId, studentName: visit.student.fullName },
      });

      return NextResponse.json({ success: true, certificateId });
    }

    // Default: Log or Create Visit
    if (!studentId || !date) {
      return NextResponse.json({ error: "Student and date are required" }, { status: 400 });
    }

    // Compute hours if check-in & check-out provided
    let calculatedHours = totalHours ? parseFloat(totalHours) : 0;
    if (checkInTime && checkOutTime && (!totalHours || totalHours === 0)) {
      const [h1, m1] = checkInTime.split(":").map(Number);
      const [h2, m2] = checkOutTime.split(":").map(Number);
      calculatedHours = Math.max(0, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
    }

    const visit = await prisma.studentVisit.create({
      data: {
        studentId,
        date,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        totalHours: calculatedHours,
        location: location || "Khidkali Ashram",
        beneficiaryCount: beneficiaryCount ? parseInt(beneficiaryCount) : null,
        supervisorName: supervisorName || user.name,
        description: description || "Community service and fieldwork",
        outcome: outcome || null,
        rating: rating ? parseInt(rating) : 5,
        status,
        approvedBy: status === "APPROVED" ? user.name : null,
        approvedAt: status === "APPROVED" ? new Date() : null,
      },
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      action: "LOG_STUDENT_VISIT",
      entityType: "StudentVisit",
      entityId: visit.id,
    });

    return NextResponse.json({ success: true, visit });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record visit" },
      { status: 500 }
    );
  }
}
