import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const subscriptions = await prisma.newsletterSubscription.findMany({
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    return json({ subscriptions });
  } catch {
    return error("Forbidden", 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return error("Email required");

    const sub = await prisma.newsletterSubscription.upsert({
      where: { email },
      update: { active: true },
      create: { email, active: true },
    });
    return json({ subscription: sub }, 201);
  } catch {
    return error("Subscription failed", 500);
  }
}
