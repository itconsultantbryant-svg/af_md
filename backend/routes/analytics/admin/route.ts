import { getAnalyticsSummary } from "@/lib/analytics";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const data = await getAnalyticsSummary();
    return json(data);
  } catch {
    return error("Forbidden", 403);
  }
}
