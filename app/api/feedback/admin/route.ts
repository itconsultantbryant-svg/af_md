import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const feedback = await prisma.siteFeedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    return json({ feedback });
  } catch {
    return error("Forbidden", 403);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { id, status } = await req.json();
    if (!id) return error("id required");
    const updated = await prisma.siteFeedback.update({
      where: { id },
      data: { status },
    });
    return json({ feedback: updated });
  } catch {
    return error("Update failed", 500);
  }
}
