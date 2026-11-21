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

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return json({ projects });
  } catch (e) {
    console.error("GET /api/portfolio-projects failed:", e);
    return error("Failed to load portfolio projects", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = portfolioProjectSchema.parse(await req.json());
    const project = await prisma.portfolioProject.create({
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
    return json({ project }, 201);
  } catch (e) {
    console.error("POST /api/portfolio-projects failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to create portfolio project", 400);
  }
}
