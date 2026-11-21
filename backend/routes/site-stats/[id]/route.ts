import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { siteStatSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const existing = await prisma.siteStat.findUnique({ where: { id: params.id } });
    if (!existing) return error("Statistic not found", 404);

    const data = siteStatSchema.parse(await req.json());
    const stat = await prisma.siteStat.update({
      where: { id: params.id },
      data: {
        key: data.key || existing.key,
        label: data.label,
        value: data.value,
        prefix: data.prefix ?? "",
        suffix: data.suffix ?? "",
        sortOrder: data.sortOrder ?? existing.sortOrder,
        published: data.published ?? existing.published,
      },
    });
    return json({ stat });
  } catch (e) {
    console.error("PUT /api/site-stats/[id] failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to update site stat", 400);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.siteStat.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/site-stats/[id] failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to delete site stat", 400);
  }
}
