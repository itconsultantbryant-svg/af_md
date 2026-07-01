import { prisma } from "@/lib/db";

export function isDbConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; name?: string; message?: string };
  return (
    e.code === "P1001" ||
    e.code === "P1000" ||
    e.code === "P1017" ||
    e.name === "PrismaClientInitializationError" ||
    /connect|database|ECONNREFUSED|ENOTFOUND|timeout/i.test(e.message || "")
  );
}

export async function checkDbConnection(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export function dbConfigHint(): string {
  if (process.env.BACKEND_URL) {
    return "API is proxied to BACKEND_URL. Ensure the Render service is running and has DATABASE_URL set.";
  }
  if (!process.env.DATABASE_URL) {
    return "Set DATABASE_URL on Vercel (Neon PostgreSQL recommended) or configure BACKEND_URL to a running Render API.";
  }
  return "DATABASE_URL is set but the database is unreachable. Check the connection string and network access.";
}
