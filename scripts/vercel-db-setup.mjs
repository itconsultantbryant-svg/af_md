#!/usr/bin/env node
/**
 * Runs on Vercel build when DATABASE_URL is configured.
 * Pushes schema and seeds admin + courses (idempotent).
 */
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.warn("[vercel-db-setup] DATABASE_URL not set — skipping db push/seed");
  process.exit(0);
}

try {
  console.log("[vercel-db-setup] Pushing Prisma schema...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  console.log("[vercel-db-setup] Seeding database...");
  execSync("npm run db:seed", { stdio: "inherit" });

  console.log("[vercel-db-setup] Done");
} catch (err) {
  console.error("[vercel-db-setup] Failed:", err);
  process.exit(1);
}
