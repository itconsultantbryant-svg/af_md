import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { clientSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const clients = await prisma.client.findMany({
      include: { contracts: true },
      orderBy: { createdAt: "desc" },
    });
    return json({ clients });
  } catch {
    return error("Forbidden", 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = clientSchema.parse(await req.json());
    const client = await prisma.client.create({ data });
    return json({ client }, 201);
  } catch {
    return error("Failed to create client", 500);
  }
}
