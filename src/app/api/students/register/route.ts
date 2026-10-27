import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      phone,
      email,
      gender,
      age,
      city,
      collegeName,
      university,
      course,
      yearSemester,
      rollNumber,
      facultyName,
      facultyPhone,
      facultyEmail,
      visitType = "INDIVIDUAL",
      groupSize = 1,
      groupMemberNames,
      purpose,
      preferredDates,
      expectedHours,
      interests = [],
      honeypot,
    } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: "Spam rejected" }, { status: 400 });
    }

    if (!fullName || !phone || !email || !collegeName || !course || !purpose) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Name, Phone, Email, College, Course, Purpose)." },
        { status: 400 }
      );
    }

    // Upsert or link College
    let college = await prisma.college.findUnique({
      where: { name: collegeName.trim() },
    });

    if (!college) {
      college = await prisma.college.create({
        data: {
          name: collegeName.trim(),
          university: university || "University of Mumbai",
          city: city || "Thane / Mumbai Region",
          facultyName: facultyName || null,
          facultyPhone: facultyPhone || null,
          facultyEmail: facultyEmail || null,
          showPublicly: true,
        },
      });
    }

    const currentYear = new Date().getFullYear();
    const count = await prisma.student.count();
    const studentId = `AASA-STU-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    // Generate QR code for student quick check-in kiosk
    const qrCodeDataUrl = await generateQrDataUrl(studentId);

    const student = await prisma.student.create({
      data: {
        studentId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        gender: gender || null,
        age: age ? parseInt(age) : null,
        city: city || null,
        collegeId: college.id,
        collegeName: college.name,
        university: university || college.university,
        course,
        yearSemester: yearSemester || "Undergraduate",
        rollNumber: rollNumber || null,
        facultyName: facultyName || null,
        facultyPhone: facultyPhone || null,
        facultyEmail: facultyEmail || null,
        visitType,
        groupSize: groupSize ? parseInt(groupSize) : 1,
        groupMemberNames: groupMemberNames || null,
        purpose,
        preferredDates: preferredDates || null,
        expectedHours: expectedHours ? parseInt(expectedHours) : 10,
        interests: JSON.stringify(interests),
        qrCodeDataUrl,
      },
    });

    // Create initial student visit entry
    const visitDate = preferredDates ? preferredDates.split(",")[0].trim() : new Date().toISOString().split("T")[0];
    await prisma.studentVisit.create({
      data: {
        studentId: student.id,
        date: visitDate,
        location: "Khidkali Ashram Center & Hamlets",
        description: `Registered for ${purpose} - ${course} student engagement.`,
        status: "REGISTERED",
        activities: {
          create: interests.slice(0, 3).map((act: string) => ({ activity: act })),
        },
      },
    });

    // Audit log
    await logAudit({
      action: "STUDENT_REGISTERED",
      entityType: "Student",
      entityId: student.id,
      details: {
        studentId,
        fullName,
        collegeName: college.name,
        purpose,
      },
    });

    return NextResponse.json({
      success: true,
      studentId,
      fullName: student.fullName,
      qrCodeDataUrl,
      message: "Student registered successfully",
    });
  } catch (err: unknown) {
    console.error("Student registration error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to register student" },
      { status: 500 }
    );
  }
}
