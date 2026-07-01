import { NextRequest } from "next/server";
import { trackVisit } from "@/lib/analytics";
import { json } from "@/lib/api";
import { checkDbConnection, isDbConnectionError } from "@/lib/db-health";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorKey, sessionId, type, path, label, metadata, durationSec } = body;

    if (!visitorKey || !type) {
      return json({ ok: false, skipped: true });
    }

    if (!(await checkDbConnection())) {
      return json({ ok: false, skipped: true });
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const referrer = req.headers.get("referer") || undefined;

    const result = await trackVisit({
      visitorKey,
      sessionId,
      type,
      path,
      label,
      metadata,
      durationSec,
      userAgent,
      referrer,
    });

    return json({ ok: true, ...result });
  } catch (e) {
    if (!isDbConnectionError(e)) {
      console.error("Analytics track error:", e);
    }
    return json({ ok: false, skipped: true });
  }
}
