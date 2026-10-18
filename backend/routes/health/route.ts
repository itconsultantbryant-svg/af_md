import { checkDbConnection, dbConfigHint } from "@/lib/db-health";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await checkDbConnection();
  if (db) {
    return json({
      status: "ok",
      service: "af-md-api",
      db: true,
      timestamp: new Date().toISOString(),
    });
  }

  return json(
    {
      status: "degraded",
      db: false,
      hint: dbConfigHint(),
    },
    503
  );
}
