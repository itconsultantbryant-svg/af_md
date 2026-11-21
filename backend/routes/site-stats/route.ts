import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { siteStatSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "stat";
}

export async function GET() {
  try {
    const stats = await prisma.siteStat.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return json({ stats });
  } catch (e) {
    console.error("GET /api/site-stats failed:", e);
    return error("Failed to load site stats", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = siteStatSchema.parse(await req.json());
    let key = data.key || slugify(data.label);

    // Ensure a unique key without overwriting an existing statistic.
    let suffix = 2;
    while (await prisma.siteStat.findUnique({ where: { key } })) {
      key = `${data.key || slugify(data.label)}_${suffix++}`;
    }

    const stat = await prisma.siteStat.create({
      data: {
        key,
        label: data.label,
        value: data.value,
        prefix: data.prefix ?? "",
        suffix: data.suffix ?? "",
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
    });
    return json({ stat }, 201);
  } catch (e) {
    console.error("POST /api/site-stats failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to create site stat", 400);
  }
}
