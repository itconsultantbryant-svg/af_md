import { NextRequest } from "next/server";
import { getUpload } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const segments = params.path || [];
  if (segments[0] !== "uploads") return new Response(null, { status: 404 });
  const range = req.headers.get("range") || undefined;
  if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) return new Response(null, { status: 416 });
  try {
    const object = await getUpload(`/${segments.join("/")}`, range);
    if (!object.Body) return new Response(null, { status: 404 });
    const headers = new Headers({
      "Content-Type": object.ContentType || "application/octet-stream",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
    });
    if (object.ContentLength !== undefined) headers.set("Content-Length", String(object.ContentLength));
    if (object.ContentRange) headers.set("Content-Range", object.ContentRange);
    return new Response(object.Body.transformToWebStream(), { status: object.ContentRange ? 206 : 200, headers });
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 416) return new Response(null, { status: 416 });
    if (status === 404) return new Response(null, { status: 404 });
    return Response.json({ error: "Media storage unavailable" }, { status: 503 });
  }
}
