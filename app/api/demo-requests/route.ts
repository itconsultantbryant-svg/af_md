import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { json, error } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, company, email, phone, systemId, systemTitle, customDescription } = body;

    if (!fullName || !company || !email || !phone) {
      return error("Full name, company, email, and phone are required");
    }

    if (systemId === "custom" && !customDescription?.trim()) {
      return error("Please describe the software you need");
    }

    const record = await prisma.demoRequest.create({
      data: {
        fullName,
        company,
        email,
        phone,
        systemId: systemId || null,
        systemTitle: systemTitle || null,
        customDescription: customDescription?.trim() || null,
      },
    });

    return json({ success: true, id: record.id }, 201);
  } catch (e) {
    console.error(e);
    return error("Failed to submit demo request", 500);
  }
}

export async function GET() {
  return error("Method not allowed", 405);
}
