import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQrBuffer } from "@/lib/qr";
import fs from "fs";
import path from "path";

function getLogoBytes(): Uint8Array | null {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      return new Uint8Array(fs.readFileSync(logoPath));
    }
  } catch (err) {
    console.error("Error reading logo.png for PDF:", err);
  }
  return null;
}

// 1. STUDENT VOLUNTEER & APPRECIATION CERTIFICATE
export async function generateCertificatePdf(data: {
  certificateId: string;
  type?: string; // "VOLUNTEER" | "APPRECIATION_DONATION"
  recipientName: string;
  collegeName?: string | null;
  course?: string | null;
  workSummary: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  supervisorName: string;
  baseUrl: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // Landscape A4: 841.89 x 595.28
  const page = pdfDoc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Border (Double frame)
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.18, 0.19, 0.57), // Deep Indigo #2E3192
    borderWidth: 3,
  });

  page.drawRectangle({
    x: 26,
    y: 26,
    width: width - 52,
    height: height - 52,
    borderColor: rgb(0.83, 0.18, 0.18), // Brand Red #D32F2F
    borderWidth: 1,
  });

  // Header Logo
  const logoBytes = getLogoBytes();
  if (logoBytes) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logoImage, {
        x: 45,
        y: height - 120,
        width: 80,
        height: 80,
      });
    } catch {
      // Continue without logo if embed fails
    }
  }

  // Header Text
  const title1 = "AADHAR ADIVASHI SEVA ASHRAM CHARITABLE TRUST";
  const title1Width = fontBold.widthOfTextAtSize(title1, 20);
  page.drawText(title1, {
    x: (width - title1Width) / 2,
    y: height - 60,
    size: 20,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  const regText = "Regd. No. 1950, Act 29, Rules E-29288, Mumbai | Established 20 December 2012";
  const regWidth = fontRegular.widthOfTextAtSize(regText, 10);
  page.drawText(regText, {
    x: (width - regWidth) / 2,
    y: height - 76,
    size: 10,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  const addressText = "Khidkali, Kalyan-Shilphata Road, Dist. Thane - 421204, Maharashtra";
  const addrWidth = fontRegular.widthOfTextAtSize(addressText, 9);
  page.drawText(addressText, {
    x: (width - addrWidth) / 2,
    y: height - 90,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Certificate Heading
  const certHeading =
    data.type === "APPRECIATION_DONATION"
      ? "CERTIFICATE OF APPRECIATION"
      : "CERTIFICATE OF SERVICE & VOLUNTEER ENGAGEMENT";
  const certHeadingWidth = fontBold.widthOfTextAtSize(certHeading, 17);
  page.drawText(certHeading, {
    x: (width - certHeadingWidth) / 2,
    y: height - 135,
    size: 17,
    font: fontBold,
    color: rgb(0.83, 0.18, 0.18),
  });

  // Intro text
  const presentedText = "This is proudly presented to";
  const presWidth = fontOblique.widthOfTextAtSize(presentedText, 13);
  page.drawText(presentedText, {
    x: (width - presWidth) / 2,
    y: height - 175,
    size: 13,
    font: fontOblique,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Recipient Name
  const name = data.recipientName.toUpperCase();
  const nameWidth = fontBold.widthOfTextAtSize(name, 24);
  page.drawText(name, {
    x: (width - nameWidth) / 2,
    y: height - 215,
    size: 24,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  // Underline under name
  page.drawLine({
    start: { x: (width - nameWidth) / 2 - 20, y: height - 222 },
    end: { x: (width + nameWidth) / 2 + 20, y: height - 222 },
    thickness: 1.5,
    color: rgb(0.83, 0.18, 0.18),
  });

  // College / Institution text
  const collegeLine = data.collegeName
    ? `representing ${data.collegeName}${data.course ? ` (${data.course})` : ""}`
    : "for dedicated community service and social outreach";
  const colWidth = fontRegular.widthOfTextAtSize(collegeLine, 12);
  page.drawText(collegeLine, {
    x: (width - colWidth) / 2,
    y: height - 250,
    size: 12,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Body Narrative
  const bodyText1 = `for exemplary voluntary contribution in tribal welfare activities including:`;
  const body1Width = fontRegular.widthOfTextAtSize(bodyText1, 12);
  page.drawText(bodyText1, {
    x: (width - body1Width) / 2,
    y: height - 280,
    size: 12,
    font: fontRegular,
    color: rgb(0.25, 0.25, 0.25),
  });

  const work = data.workSummary || "Teaching children, sorting donations, and field community service";
  const workWidth = fontBold.widthOfTextAtSize(work, 13);
  page.drawText(work, {
    x: Math.max(50, (width - workWidth) / 2),
    y: height - 305,
    size: Math.min(13, (width - 100) / work.length * 1.5),
    font: fontBold,
    color: rgb(0.1, 0.1, 0.4),
  });

  const hoursLine = `Dedicated ${data.totalHours > 0 ? `${data.totalHours} Verified Hours` : "Dedicated Service"} between ${data.startDate} and ${data.endDate}.`;
  const hoursWidth = fontBold.widthOfTextAtSize(hoursLine, 12);
  page.drawText(hoursLine, {
    x: (width - hoursWidth) / 2,
    y: height - 335,
    size: 12,
    font: fontBold,
    color: rgb(0.83, 0.18, 0.18),
  });

  // QR Code for verification
  const verifyUrl = `${data.baseUrl}/verify/${data.certificateId}`;
  const qrBytes = await generateQrBuffer(verifyUrl);
  if (qrBytes.length > 0) {
    try {
      const qrImage = await pdfDoc.embedPng(qrBytes);
      page.drawImage(qrImage, {
        x: width - 150,
        y: 65,
        width: 85,
        height: 85,
      });
      page.drawText("Scan to Verify", {
        x: width - 142,
        y: 52,
        size: 9,
        font: fontBold,
        color: rgb(0.18, 0.19, 0.57),
      });
    } catch {
      // Continue if QR embed fails
    }
  }

  // Signatures
  // Left: Supervisor
  page.drawLine({
    start: { x: 70, y: 100 },
    end: { x: 230, y: 100 },
    thickness: 1,
    color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText(data.supervisorName || "Priti Salat", {
    x: 70,
    y: 84,
    size: 11,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });
  page.drawText("Supervisor / Secretary", {
    x: 70,
    y: 70,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Center: Chairman
  page.drawLine({
    start: { x: 340, y: 100 },
    end: { x: 500, y: 100 },
    thickness: 1,
    color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText("Deva Salat", {
    x: 340,
    y: 84,
    size: 11,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });
  page.drawText("Chairman & Founder", {
    x: 340,
    y: 70,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Certificate ID & Patch requirement footer line
  page.drawText(`Certificate ID: ${data.certificateId}`, {
    x: 50,
    y: 35,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  const patchFooter = "Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) | Est. 2012 | Regd. No. 1950";
  const patchFooterWidth = fontRegular.widthOfTextAtSize(patchFooter, 9);
  page.drawText(patchFooter, {
    x: (width - patchFooterWidth) / 2,
    y: 35,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  return pdfDoc.save();
}

// 2. OFFICIAL DONATION RECEIPT (Cash, Online, In-kind)
export async function generateDonationReceiptPdf(data: {
  receiptNo: string;
  referenceId: string;
  date: string;
  donorName: string;
  donorType: string;
  organizationName?: string | null;
  phone: string;
  email?: string | null;
  address?: string | null;
  donationType: string;
  itemSummary: string;
  quantityOrAmount: string;
  amountInWords?: string | null;
  paymentMode?: string | null;
  txnReference?: string | null;
  donorPan?: string | null;
  receivedBy?: string | null;
  baseUrl: string;
  tax80gEnabled?: boolean;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // Portrait A4: 595.28 x 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Border
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderColor: rgb(0.18, 0.19, 0.57),
    borderWidth: 2,
  });

  // Logo
  const logoBytes = getLogoBytes();
  if (logoBytes) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logoImage, {
        x: 45,
        y: height - 110,
        width: 70,
        height: 70,
      });
    } catch {
      // Continue
    }
  }

  // Header Title
  page.drawText("AADHAR ADIVASHI SEVA ASHRAM CHARITABLE TRUST (REGD.)", {
    x: 125,
    y: height - 60,
    size: 13,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  page.drawText("Regd. No. 1950, Act 29, Rules E-29288, Mumbai | Est. 20-12-2012", {
    x: 125,
    y: height - 76,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText("Nana Devkar Row House, Jiga Society, Khidkali, Kalyan-Shilphata Rd, Thane - 421204", {
    x: 125,
    y: height - 90,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText("Phone: 8108751580 / 7506101471 | Email: devasalat3601@gmail.com", {
    x: 125,
    y: height - 103,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Horizontal divider
  page.drawLine({
    start: { x: 35, y: height - 120 },
    end: { x: width - 35, y: height - 120 },
    thickness: 1.5,
    color: rgb(0.83, 0.18, 0.18),
  });

  // Receipt Banner
  page.drawRectangle({
    x: 35,
    y: height - 155,
    width: width - 70,
    height: 28,
    color: rgb(0.95, 0.96, 0.98),
  });

  page.drawText("OFFICIAL DONATION RECEIPT", {
    x: 45,
    y: height - 146,
    size: 12,
    font: fontBold,
    color: rgb(0.83, 0.18, 0.18),
  });

  page.drawText(`Receipt No: ${data.receiptNo}`, {
    x: 350,
    y: height - 146,
    size: 11,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  // Details Grid
  let currY = height - 185;
  const drawRow = (label: string, value: string) => {
    page.drawText(label, {
      x: 45,
      y: currY,
      size: 10,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(value, {
      x: 190,
      y: currY,
      size: 10,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
    currY -= 22;
  };

  drawRow("Date of Receipt:", data.date);
  drawRow("Reference ID:", data.referenceId);
  drawRow("Donor Category:", data.donorType);
  drawRow("Received From:", data.donorName);
  if (data.organizationName) {
    drawRow("Organization:", data.organizationName);
  }
  drawRow("Contact Phone:", data.phone);
  if (data.email) {
    drawRow("Email Address:", data.email);
  }
  if (data.address) {
    drawRow("Address:", data.address);
  }
  if (data.donorPan) {
    drawRow("Donor PAN:", data.donorPan);
  }

  currY -= 10;
  // Box for donation summary
  page.drawRectangle({
    x: 40,
    y: currY - 95,
    width: width - 80,
    height: 100,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
    color: rgb(0.98, 0.99, 1),
  });

  page.drawText("DONATION PARTICULARS", {
    x: 55,
    y: currY - 15,
    size: 10,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  page.drawText(`Category: ${data.donationType}`, {
    x: 55,
    y: currY - 35,
    size: 10.5,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(`Details: ${data.itemSummary}`, {
    x: 55,
    y: currY - 55,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText(`Quantity / Amount: ${data.quantityOrAmount}`, {
    x: 55,
    y: currY - 75,
    size: 11,
    font: fontBold,
    color: rgb(0.83, 0.18, 0.18),
  });

  if (data.paymentMode) {
    page.drawText(
      `Payment Mode: ${data.paymentMode} ${data.txnReference ? `(Ref: ${data.txnReference})` : ""}`,
      {
        x: 55,
        y: currY - 92,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
      }
    );
  }

  currY -= 120;

  // 80G Note (if enabled)
  if (data.tax80gEnabled) {
    page.drawText("80G TAX BENEFIT: Eligible for deduction under section 80G of Income Tax Act 1961.", {
      x: 45,
      y: currY,
      size: 9,
      font: fontBold,
      color: rgb(0.1, 0.5, 0.2),
    });
    currY -= 20;
  }

  page.drawText(
    "Thank you for your warm generosity. Your gift directly empowers tribal children and families.",
    {
      x: 45,
      y: currY,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    }
  );

  // QR Code for verification
  const verifyUrl = `${data.baseUrl}/verify-receipt/${data.receiptNo}`;
  const qrBytes = await generateQrBuffer(verifyUrl);
  if (qrBytes.length > 0) {
    try {
      const qrImage = await pdfDoc.embedPng(qrBytes);
      page.drawImage(qrImage, {
        x: 45,
        y: 65,
        width: 75,
        height: 75,
      });
      page.drawText("Scan to Verify Receipt", {
        x: 42,
        y: 52,
        size: 8,
        font: fontBold,
        color: rgb(0.18, 0.19, 0.57),
      });
    } catch {
      // Continue
    }
  }

  // Right signature
  page.drawLine({
    start: { x: width - 210, y: 100 },
    end: { x: width - 50, y: 100 },
    thickness: 1,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText(data.receivedBy || "Authorized Signatory", {
    x: width - 200,
    y: 85,
    size: 10,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  page.drawText("For Aadhar Adivashi Seva Ashram", {
    x: width - 200,
    y: 72,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Footer line from PATCH requirement
  const patchFooter = "Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) | Est. 2012 | Regd. No. 1950";
  const patchFooterWidth = fontRegular.widthOfTextAtSize(patchFooter, 9);
  page.drawText(patchFooter, {
    x: (width - patchFooterWidth) / 2,
    y: 35,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  return pdfDoc.save();
}

// 3. COLLEGE DONATION & VOLUNTEER REPORT
export async function generateCollegeReportPdf(data: {
  collegeName: string;
  university?: string | null;
  facultyName?: string | null;
  totalStudents: number;
  totalHours: number;
  totalDonationsCount: number;
  visits: Array<{
    date: string;
    studentName: string;
    description: string;
    hours: number;
  }>;
  donations: Array<{
    date: string;
    type: string;
    details: string;
    quantity: string;
  }>;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Border
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderColor: rgb(0.18, 0.19, 0.57),
    borderWidth: 1.5,
  });

  // Header
  page.drawText("AADHAR ADIVASHI SEVA ASHRAM CHARITABLE TRUST (REGD.)", {
    x: 40,
    y: height - 55,
    size: 13,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  page.drawText("Est. 20-12-2012 | Regd. No. 1950, Act 29, Rules E-29288, Mumbai", {
    x: 40,
    y: height - 70,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawLine({
    start: { x: 35, y: height - 80 },
    end: { x: width - 35, y: height - 80 },
    thickness: 1,
    color: rgb(0.83, 0.18, 0.18),
  });

  page.drawText("COLLEGE OUTREACH, NSS & DONATION SUMMARY REPORT", {
    x: 40,
    y: height - 105,
    size: 13,
    font: fontBold,
    color: rgb(0.83, 0.18, 0.18),
  });

  page.drawText(`Institution: ${data.collegeName}`, {
    x: 40,
    y: height - 128,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  if (data.university) {
    page.drawText(`Affiliation: ${data.university}`, {
      x: 40,
      y: height - 144,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Summary Metrics
  let currY = height - 170;
  page.drawRectangle({
    x: 40,
    y: currY - 35,
    width: width - 80,
    height: 40,
    color: rgb(0.95, 0.96, 0.99),
  });

  page.drawText(
    `Total Students: ${data.totalStudents}  |  Total Volunteer Hours: ${data.totalHours} hrs  |  Donations Made: ${data.totalDonationsCount}`,
    {
      x: 55,
      y: currY - 20,
      size: 10,
      font: fontBold,
      color: rgb(0.18, 0.19, 0.57),
    }
  );

  currY -= 60;

  // Recent Visits
  page.drawText("STUDENT COMMUNITY SERVICE VISITS (RECENT)", {
    x: 40,
    y: currY,
    size: 10.5,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });
  currY -= 18;

  data.visits.slice(0, 10).forEach((v) => {
    page.drawText(`${v.date} - ${v.studentName}: ${v.description.slice(0, 50)} (${v.hours} hrs)`, {
      x: 45,
      y: currY,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    currY -= 14;
  });

  currY -= 15;
  // Donations
  page.drawText("COLLEGE / STUDENT DONATION DRIVES", {
    x: 40,
    y: currY,
    size: 10.5,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });
  currY -= 18;

  data.donations.slice(0, 8).forEach((d) => {
    page.drawText(`${d.date} [${d.type}]: ${d.details.slice(0, 50)} (${d.quantity})`, {
      x: 45,
      y: currY,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    currY -= 14;
  });

  // Footer line
  const patchFooter = "Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) | Est. 2012 | Regd. No. 1950";
  const patchFooterWidth = fontRegular.widthOfTextAtSize(patchFooter, 9);
  page.drawText(patchFooter, {
    x: (width - patchFooterWidth) / 2,
    y: 35,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  return pdfDoc.save();
}
