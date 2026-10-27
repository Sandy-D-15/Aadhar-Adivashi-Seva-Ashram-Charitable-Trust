import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for Aadhar Adivashi Seva Ashram...");

  // 1. Users
  const adminHash = await bcrypt.hash("admin123", 10);
  const staffHash = await bcrypt.hash("staff123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@adivashisevango.org" },
    update: {},
    create: {
      email: "admin@adivashisevango.org",
      name: "Deva Salat (Admin)",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@adivashisevango.org" },
    update: {},
    create: {
      email: "staff@adivashisevango.org",
      name: "Ashram Staff",
      passwordHash: staffHash,
      role: "STAFF",
    },
  });

  // 2. Settings
  const settings = [
    { key: "ESTABLISHED_DATE", value: "2012-12-20" },
    {
      key: "PICKUP_AREAS",
      value: JSON.stringify([
        "Khidkali",
        "Kalyan",
        "Dombivli",
        "Diva",
        "Shilphata",
        "Thane",
        "Navi Mumbai",
        "Palava / Lodha",
        "Mumbra",
      ]),
    },
    { key: "DROPOFF_HOURS", value: "9:00 AM - 7:30 PM (All 7 Days)" },
    { key: "TAX_80G_ENABLED", value: "false" },
    {
      key: "BANK_DETAILS",
      value: JSON.stringify({
        bankName: "Andhra Bank (Now Union Bank of India)",
        accountName: "Aadhar Adivashi Seva Ashram Charitable Trust",
        accountNumber: "023810100036400",
        ifscCode: "ANDB0000238",
        branch: "Kalyan-Shill Road",
        upiId: "8108751580@upi",
      }),
    },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 3. Supervisors
  const deva = await prisma.supervisor.create({
    data: {
      name: "Deva Salat",
      phone: "8108751580",
      roleTitle: "Chairman",
      isDefault: true,
    },
  });

  const priti = await prisma.supervisor.create({
    data: {
      name: "Priti Salat",
      phone: "7506101471",
      roleTitle: "Secretary",
      isDefault: false,
    },
  });

  await prisma.supervisor.create({
    data: {
      name: "Sunil Waghmare",
      phone: "9820112233",
      roleTitle: "Field Outreach Lead",
      isDefault: false,
    },
  });

  // 4. Colleges
  const birla = await prisma.college.upsert({
    where: { name: "B.K. Birla College of Arts, Science & Commerce, Kalyan" },
    update: {},
    create: {
      name: "B.K. Birla College of Arts, Science & Commerce, Kalyan",
      university: "University of Mumbai",
      city: "Kalyan",
      facultyName: "Dr. Sandeep Kumar",
      facultyPhone: "9821098210",
      facultyEmail: "nss@birlacollege.edu.in",
      showPublicly: true,
    },
  });

  const model = await prisma.college.upsert({
    where: { name: "Model College, Dombivli" },
    update: {},
    create: {
      name: "Model College, Dombivli",
      university: "University of Mumbai",
      city: "Dombivli",
      facultyName: "Prof. Rekha Sharma",
      facultyPhone: "9819281920",
      facultyEmail: "social@modelcollege.edu.in",
      showPublicly: true,
    },
  });

  const saket = await prisma.college.upsert({
    where: { name: "Saket College of Arts, Science & Commerce, Kalyan" },
    update: {},
    create: {
      name: "Saket College of Arts, Science & Commerce, Kalyan",
      university: "University of Mumbai",
      city: "Kalyan",
      facultyName: "Prof. Arvind Patil",
      facultyPhone: "9833441122",
      facultyEmail: "nss@saketcollege.edu.in",
      showPublicly: true,
    },
  });

  // 5. Donor Organizations
  const rotary = await prisma.organization.upsert({
    where: { name: "Rotary Club of Kalyan Riverside" },
    update: {},
    create: {
      name: "Rotary Club of Kalyan Riverside",
      type: "NGO",
      contactPerson: "Rajesh Singhania",
      designation: "President",
      phone: "9820011223",
      email: "contact@rotarykalyan.org",
      establishedYear: "2008",
      streetAddress: "Rotary Bhavan, Murbad Road",
      area: "Syndicate",
      city: "Kalyan",
      district: "Thane",
      state: "Maharashtra",
      pincode: "421301",
      isPublicPartner: true,
      notes: "Annual education kit and winter blanket partner.",
    },
  });

  const palavaRwa = await prisma.organization.upsert({
    where: { name: "Palava City Lakeshore Residents Association" },
    update: {},
    create: {
      name: "Palava City Lakeshore Residents Association",
      type: "Housing Society",
      contactPerson: "Meera Nair",
      designation: "Welfare Committee Head",
      phone: "9892019283",
      email: "welfare@palavaship.in",
      establishedYear: "2016",
      streetAddress: "Lakeshore Greens, Palava Phase 2",
      area: "Dombivli East",
      city: "Dombivli",
      district: "Thane",
      state: "Maharashtra",
      pincode: "421204",
      isPublicPartner: true,
      notes: "Conducts quarterly clothes and toys donation drives across clusters.",
    },
  });

  // 6. Students
  const qr1 = await QRCode.toDataURL("AASA-STU-2026-0001");
  const stu1 = await prisma.student.upsert({
    where: { studentId: "AASA-STU-2026-0001" },
    update: {},
    create: {
      studentId: "AASA-STU-2026-0001",
      fullName: "Rohan Vinod Sharma",
      phone: "9821345678",
      email: "rohan.sharma@gmail.com",
      gender: "Male",
      age: 20,
      city: "Kalyan",
      collegeId: birla.id,
      collegeName: birla.name,
      university: "University of Mumbai",
      course: "B.Sc. Information Technology",
      yearSemester: "TY Sem 6",
      rollNumber: "IT-2024-42",
      facultyName: "Dr. Sandeep Kumar",
      facultyPhone: "9821098210",
      visitType: "INDIVIDUAL",
      purpose: "NSS_NCC",
      expectedHours: 20,
      interests: JSON.stringify(["Teaching children", "Data entry and documentation", "Field visits"]),
      qrCodeDataUrl: qr1,
    },
  });

  const qr2 = await QRCode.toDataURL("AASA-STU-2026-0002");
  const stu2 = await prisma.student.upsert({
    where: { studentId: "AASA-STU-2026-0002" },
    update: {},
    create: {
      studentId: "AASA-STU-2026-0002",
      fullName: "Sneha Ashok Patil",
      phone: "9876543210",
      email: "sneha.patil@outlook.com",
      gender: "Female",
      age: 19,
      city: "Dombivli",
      collegeId: model.id,
      collegeName: model.name,
      university: "University of Mumbai",
      course: "B.Com",
      yearSemester: "SY Sem 4",
      facultyName: "Prof. Rekha Sharma",
      visitType: "INDIVIDUAL",
      purpose: "COMMUNITY_SERVICE",
      expectedHours: 15,
      interests: JSON.stringify(["Teaching children", "Clothes sorting and distribution", "Event management"]),
      qrCodeDataUrl: qr2,
    },
  });

  // 7. Student Visits & Certificate
  const cert1 = await prisma.certificate.upsert({
    where: { certificateId: "AASA-CERT-2026-0001" },
    update: {},
    create: {
      certificateId: "AASA-CERT-2026-0001",
      type: "VOLUNTEER",
      studentId: stu1.id,
      recipientName: "Rohan Vinod Sharma",
      collegeName: birla.name,
      course: "B.Sc. IT",
      workSummary: "Conducted basic digital literacy and math classes for 45 tribal children at Khidkali center",
      startDate: "2026-01-10",
      endDate: "2026-01-15",
      totalHours: 18,
      supervisorName: deva.name,
      qrCodeData: "https://www.adivashisevango.org/verify/AASA-CERT-2026-0001",
    },
  });

  const visit1 = await prisma.studentVisit.create({
    data: {
      studentId: stu1.id,
      date: "2026-01-10",
      checkInTime: "10:00",
      checkOutTime: "16:00",
      totalHours: 6,
      location: "Khidkali Ashram Center",
      beneficiaryCount: 45,
      supervisorId: deva.id,
      supervisorName: deva.name,
      description: "Assisted in tutoring primary school children and organizing library books.",
      outcome: "Children learned basic multiplication and solved worksheets with enthusiasm.",
      rating: 5,
      status: "CERTIFICATE_ISSUED",
      approvedBy: admin.name,
      approvedAt: new Date("2026-01-16"),
      certificateId: cert1.id,
      activities: {
        create: [{ activity: "Teaching children" }, { activity: "Data entry and documentation" }],
      },
    },
  });

  const visit2 = await prisma.studentVisit.create({
    data: {
      studentId: stu1.id,
      date: "2026-01-15",
      checkInTime: "09:00",
      checkOutTime: "21:00",
      totalHours: 12,
      location: "Kalyan Rural Tribal Hamlet",
      beneficiaryCount: 80,
      supervisorId: priti.id,
      supervisorName: priti.name,
      description: "Field drive distributing winter jackets and stationery kits to children.",
      outcome: "Successfully reached 80 families in interior hamlets.",
      rating: 5,
      status: "CERTIFICATE_ISSUED",
      approvedBy: admin.name,
      approvedAt: new Date("2026-01-16"),
      certificateId: cert1.id,
      activities: {
        create: [{ activity: "Clothes sorting and distribution" }, { activity: "Field visits to tribal areas" }],
      },
    },
  });

  // Visit with Student Donation!
  const visit3 = await prisma.studentVisit.create({
    data: {
      studentId: stu2.id,
      date: "2026-02-05",
      checkInTime: "11:00",
      checkOutTime: "17:00",
      totalHours: 6,
      location: "Khidkali Center",
      beneficiaryCount: 30,
      supervisorId: priti.id,
      supervisorName: priti.name,
      description: "Conducted art, storytelling, and reading sessions. Brought 35 children's storybooks from Model College drive.",
      rating: 5,
      status: "WORK_LOGGED",
      broughtDonation: true,
      donationSource: "COLLEGE_DRIVE",
      activities: {
        create: [{ activity: "Teaching children" }, { activity: "Toy and book distribution" }],
      },
    },
  });

  // 8. Master Donations across 7 types
  // 1. Clothes (Individual)
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0001",
      receiptNo: "AASA-RCPT-2026-0001",
      donationType: "CLOTHES",
      donorType: "INDIVIDUAL",
      donorName: "Ananya Deshmukh",
      donorPhone: "9820123456",
      donorEmail: "ananya.deshmukh@gmail.com",
      donorAddress: "B-402, Godrej Hill, Barave Road, Kalyan West",
      pincode: "421301",
      pickupType: "PICKUP",
      pickupDate: "2026-02-10",
      pickupSlot: "Morning (10 AM - 1 PM)",
      status: "CONFIRMED",
      receivedBy: "Sunil Waghmare",
      items: {
        create: [
          { itemType: "Kids winter clothes", quantity: "25 pcs", condition: "GENTLY_USED", sizeOrAge: "5-10 yrs" },
          { itemType: "Women sarees & kurtas", quantity: "15 pcs", condition: "GENTLY_USED" },
        ],
      },
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0001" }],
      },
    },
  });

  // 2. Learning Accessories (From Organization: Rotary Club)
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0002",
      receiptNo: "AASA-RCPT-2026-0002",
      donationType: "LEARNING",
      donorType: "ORGANIZATION",
      organizationId: rotary.id,
      donorName: "Rajesh Singhania (Rotary Club)",
      donorPhone: "9820011223",
      donorEmail: "contact@rotarykalyan.org",
      donorAddress: "Rotary Bhavan, Murbad Road, Kalyan",
      pincode: "421301",
      pickupType: "DROPOFF",
      status: "DELIVERED",
      receivedBy: "Deva Salat",
      items: {
        create: [
          { itemType: "Ruled notebooks 100 pgs", quantity: "200 books", condition: "NEW", sizeOrAge: "Std 1 to 8" },
          { itemType: "School backpacks with stationery", quantity: "50 kits", condition: "NEW" },
        ],
      },
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0002" }],
      },
    },
  });

  // 3. Cash / Online Donation
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0003",
      receiptNo: "AASA-RCPT-2026-0003",
      donationType: "CASH",
      donorType: "INDIVIDUAL",
      donorName: "Vikas K. Joshi",
      donorPhone: "9819445566",
      donorEmail: "vikas.joshi@tcs.com",
      donorAddress: "Thane West",
      pincode: "400602",
      pickupType: "DROPOFF",
      amount: 15000,
      paymentMode: "UPI",
      txnReference: "UPI/604512984120",
      purpose: "FOOD",
      status: "DELIVERED",
      receivedBy: "Deva Salat",
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0003" }],
      },
    },
  });

  // 4. Musical Instruments
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0004",
      receiptNo: "AASA-RCPT-2026-0004",
      donationType: "INSTRUMENTS",
      donorType: "INDIVIDUAL",
      donorName: "Pandit Suresh Kelkar",
      donorPhone: "9820448899",
      donorAddress: "Pendharkar College Road, Dombivli East",
      pincode: "421201",
      pickupType: "PICKUP",
      pickupDate: "2026-02-14",
      pickupSlot: "Evening (4 PM - 7 PM)",
      status: "DELIVERED",
      receivedBy: "Priti Salat",
      items: {
        create: [
          { itemType: "Harmonium (Bina 7-stopper)", quantity: "1 unit", condition: "WORKING", detailsJson: JSON.stringify({ type: "harmonium" }) },
          { itemType: "Tabla pair with bayan", quantity: "1 set", condition: "WORKING", detailsJson: JSON.stringify({ type: "tabla" }) },
          { itemType: "Cricket kit & footballs", quantity: "2 kits", condition: "NEW", sizeOrAge: "Under 14" },
        ],
      },
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0004" }],
      },
    },
  });

  // 5. Furniture & Essentials
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0005",
      receiptNo: "AASA-RCPT-2026-0005",
      donationType: "FURNITURE",
      donorType: "ORGANIZATION",
      organizationId: palavaRwa.id,
      donorName: "Meera Nair (Palava Lakeshore)",
      donorPhone: "9892019283",
      donorAddress: "Cluster Club, Palava Phase 2, Dombivli East",
      pincode: "421204",
      pickupType: "PICKUP",
      status: "CONFIRMED",
      floorsCount: 1,
      hasLift: true,
      needsVehicle: true,
      approxWeight: "Heavy (Van required)",
      receivedBy: "Sunil Waghmare",
      items: {
        create: [
          { itemType: "Study Benches with attached desks", quantity: "8 sets", condition: "WORKING" },
          { itemType: "Steel Book Storage Cupboard", quantity: "2 units", condition: "WORKING" },
        ],
      },
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0005" }],
      },
    },
  });

  // 6. Food Donation (with safety guidelines)
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0006",
      receiptNo: "AASA-RCPT-2026-0006",
      donationType: "FOOD",
      donorType: "INDIVIDUAL",
      donorName: "Kailash Catering Services",
      donorPhone: "9820556677",
      donorAddress: "Shilphata Junction, Kalyan Shil Road",
      pincode: "421204",
      pickupType: "PICKUP",
      urgencyHours: 3,
      foodType: "COOKED",
      foodIsVeg: true,
      prepDate: "2026-02-12 13:00",
      status: "DELIVERED",
      receivedBy: "Deva Salat",
      items: {
        create: [
          { itemType: "Fresh Dal Khichdi & Vegetable Pulao", quantity: "120 servings", condition: "FRESH_HOT" },
        ],
      },
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0006" }],
      },
    },
  });

  // 7. Student Visit Linked Donation!
  await prisma.donation.create({
    data: {
      referenceId: "AASA-DON-2026-0007",
      receiptNo: "AASA-RCPT-2026-0007",
      donationType: "TOYS",
      donorType: "STUDENT",
      studentId: stu2.id,
      collegeId: model.id,
      visitId: visit3.id,
      donorName: "Sneha Ashok Patil",
      donorPhone: stu2.phone,
      donorEmail: stu2.email,
      donorAddress: "Model College Campus Collection",
      pickupType: "DROPOFF",
      status: "DELIVERED",
      receivedBy: "Priti Salat",
      items: {
        create: [
          { itemType: "Educational board games, puzzles and plush toys", quantity: "35 sets", condition: "GENTLY_USED", sizeOrAge: "3-12 yrs" },
        ],
      },
      receipts: {
        create: [{ receiptNo: "AASA-RCPT-2026-0007" }],
      },
    },
  });

  console.log("Database seeded successfully with users, settings, colleges, orgs, students, visits, and 7 donation types!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
