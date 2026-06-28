import { prisma } from "@/lib/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return json({
      status: "ok",
      service: "af-md-api",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return json({ status: "degraded", db: false }, 503);
  }
}
