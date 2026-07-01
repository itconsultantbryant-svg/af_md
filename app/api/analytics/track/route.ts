import { NextRequest } from "next/server";
import { trackVisit } from "@/lib/analytics";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorKey, sessionId, type, path, label, metadata, durationSec } = body;

    if (!visitorKey || !type) {
      return error("visitorKey and type required");
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

    return json(result);
  } catch (e) {
    console.error("Analytics track error:", e);
    return error("Tracking failed", 500);
  }
}
