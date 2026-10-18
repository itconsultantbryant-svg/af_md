import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { clientSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const data = clientSchema.partial().parse(await req.json());
    const client = await prisma.client.update({
      where: { id: params.id },
      data,
      include: { contracts: true },
    });
    return json({ client });
  } catch {
    return error("Failed to update client", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.client.delete({ where: { id: params.id } });
    return json({ success: true });
  } catch {
    return error("Failed to delete client", 500);
  }
}
