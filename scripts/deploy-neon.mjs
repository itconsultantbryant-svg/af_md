import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

process.loadEnvFile(".env.local");
const context = JSON.parse(readFileSync(".neon", "utf8"));
const expected = process.env.NEON_DEPLOY_PROJECT_ID;
if (!expected || context.projectId !== expected) {
  throw new Error("Set NEON_DEPLOY_PROJECT_ID to the newly created Afrimind_AI project ID and link .neon to it before deploying.");
}
const branch = context.branch || context.branchId;
if (!branch) throw new Error("Pin the intended deployment branch with neon checkout before deploying.");
execFileSync("npm", ["run", "build:neon"], { stdio: "inherit" });
execFileSync("neon", ["deploy", "--project-id", context.projectId, "--branch", branch, "--env", ".env.local"], { stdio: "inherit" });
