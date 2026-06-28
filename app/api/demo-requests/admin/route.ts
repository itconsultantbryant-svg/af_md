import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const requests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return json({ requests });
  } catch {
    return error("Forbidden", 403);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { id, status, adminNotes } = await req.json();
    if (!id) return error("id required");

    const updated = await prisma.demoRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });
    return json({ request: updated });
  } catch {
    return error("Update failed", 500);
  }
}
