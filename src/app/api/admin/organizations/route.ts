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
      id,
      name,
      type,
      contactPerson,
      designation,
      phone,
      altPhone,
      email,
      establishedYear,
      streetAddress,
      area,
      city,
      district,
      state,
      pincode,
      mapsLink,
      registrationNo,
      pan,
      taxExemptDetails,
      website,
      notes,
      isPublicPartner,
      logoUrl,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Organization name and contact phone are required." },
        { status: 400 }
      );
    }

    let organization;

    if (id) {
      // Update
      organization = await prisma.organization.update({
        where: { id },
        data: {
          name: name.trim(),
          type: type || "Other",
          contactPerson: contactPerson || "Representative",
          designation: designation || null,
          phone: phone.trim(),
          altPhone: altPhone ? altPhone.trim() : null,
          email: email || null,
          establishedYear: establishedYear || null,
          streetAddress: streetAddress || null,
          area: area || null,
          city: city || "Thane",
          district: district || "Thane",
          state: state || "Maharashtra",
          pincode: pincode || null,
          mapsLink: mapsLink || null,
          registrationNo: registrationNo || null,
          pan: pan || null,
          taxExemptDetails: taxExemptDetails || null,
          website: website || null,
          notes: notes || null,
          isPublicPartner: Boolean(isPublicPartner),
          logoUrl: logoUrl || null,
        },
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        action: "UPDATE_ORGANIZATION",
        entityType: "Organization",
        entityId: organization.id,
        details: { name: organization.name },
      });
    } else {
      // Check for duplicate name
      const existing = await prisma.organization.findFirst({
        where: {
          OR: [
            { name: { equals: name.trim() } },
            { phone: phone.trim() },
          ],
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            error: `Possible duplicate organization found with name "${existing.name}". Please edit the existing record or use a unique name.`,
          },
          { status: 409 }
        );
      }

      organization = await prisma.organization.create({
        data: {
          name: name.trim(),
          type: type || "Other",
          contactPerson: contactPerson || "Representative",
          designation: designation || null,
          phone: phone.trim(),
          altPhone: altPhone ? altPhone.trim() : null,
          email: email || null,
          establishedYear: establishedYear || null,
          streetAddress: streetAddress || null,
          area: area || null,
          city: city || "Thane",
          district: district || "Thane",
          state: state || "Maharashtra",
          pincode: pincode || null,
          mapsLink: mapsLink || null,
          registrationNo: registrationNo || null,
          pan: pan || null,
          taxExemptDetails: taxExemptDetails || null,
          website: website || null,
          notes: notes || null,
          isPublicPartner: Boolean(isPublicPartner),
          logoUrl: logoUrl || null,
        },
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        action: "CREATE_ORGANIZATION",
        entityType: "Organization",
        entityId: organization.id,
        details: { name: organization.name, type: organization.type },
      });
    }

    return NextResponse.json({ success: true, organization });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save organization" },
      { status: 500 }
    );
  }
}
