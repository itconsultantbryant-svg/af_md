import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { portfolioProjectSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";
import { normalizeUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

function nullable(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const data = portfolioProjectSchema.parse(await req.json());
    const project = await prisma.portfolioProject.update({
      where: { id: params.id },
      data: {
        name: data.name,
        url: normalizeUrl(data.url),
        logoUrl: nullable(data.logoUrl),
        clientName: data.clientName,
        clientPhone: nullable(data.clientPhone),
        clientEmail: nullable(data.clientEmail),
        clientAddress: nullable(data.clientAddress),
        description: nullable(data.description),
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
    return json({ project });
  } catch (e) {
    console.error("PUT /api/portfolio-projects/[id] failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to update portfolio project", 400);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.portfolioProject.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/portfolio-projects/[id] failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to delete portfolio project", 400);
  }
}
