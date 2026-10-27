import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, action, supervisorName } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId: studentId.trim() },
    });

    if (!student) {
      return NextResponse.json({ error: "No student found with ID: " + studentId }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (action === "CHECK_IN") {
      // Create visit
      const visit = await prisma.studentVisit.create({
        data: {
          studentId: student.id,
          date: today,
          checkInTime: currentTime,
          location: "Khidkali Ashram Center",
          supervisorName: supervisorName || user.name,
          description: "Attended community session at Ashram",
          status: "VISITED",
        },
      });

      return NextResponse.json({
        success: true,
        message: `Checked in ${student.fullName} at ${currentTime}`,
        visit,
        studentName: student.fullName,
      });
    }

    if (action === "CHECK_OUT") {
      // Find today's open visit
      const visit = await prisma.studentVisit.findFirst({
        where: {
          studentId: student.id,
          date: today,
          checkOutTime: null,
        },
        orderBy: { createdAt: "desc" },
      });

      if (!visit) {
        return NextResponse.json(
          { error: `No active check-in found today for ${student.fullName}.` },
          { status: 400 }
        );
      }

      // Calculate hours
      const checkIn = visit.checkInTime || "10:00";
      const [h1, m1] = checkIn.split(":").map(Number);
      const [h2, m2] = currentTime.split(":").map(Number);
      const hours = Math.max(0.5, parseFloat(((h2 * 60 + m2 - (h1 * 60 + m1)) / 60).toFixed(1)));

      const updated = await prisma.studentVisit.update({
        where: { id: visit.id },
        data: {
          checkOutTime: currentTime,
          totalHours: hours,
          status: "WORK_LOGGED",
        },
      });

      return NextResponse.json({
        success: true,
        message: `Checked out ${student.fullName} at ${currentTime}. Total hours: ${hours} hrs`,
        visit: updated,
        studentName: student.fullName,
        hours,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kiosk operation failed" },
      { status: 500 }
    );
  }
}
