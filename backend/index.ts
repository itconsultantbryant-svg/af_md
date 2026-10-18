import { timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { requestContext } from "./request-context";
import { routes } from "./routes";

type Handler = (request: NextRequest, context: { params: Record<string, string | string[]> }) => Promise<Response>;

function matchPath(pattern: string, pathname: string) {
  const expected = pattern.split("/").filter(Boolean);
  const actual = pathname.split("/").filter(Boolean);
  const params: Record<string, string | string[]> = {};
  for (let i = 0; i < expected.length; i++) {
    const part = expected[i];
    if (part.startsWith("[...")) {
      if (!actual[i]) return null;
      params[part.slice(4, -1)] = actual.slice(i).map(decodeURIComponent);
      return params;
    }
    if (!actual[i]) return null;
    if (part.startsWith("[")) params[part.slice(1, -1)] = decodeURIComponent(actual[i]);
    else if (part !== actual[i]) return null;
  }
  return actual.length === expected.length ? params : null;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const secret = process.env.ORIGIN_SECRET;
    if (!secret || !process.env.JWT_SECRET) {
      return Response.json({ error: "Backend configuration missing" }, { status: 503 });
    }
    const received = Buffer.from(request.headers.get("x-secret") || "");
    const expected = Buffer.from(secret);
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const url = new URL(request.url);
      // Preserve existing material URLs while storing their bytes in Neon.
      const pathname = url.pathname.startsWith("/uploads/") ? `/api/media${url.pathname}` : url.pathname;
      for (const route of routes) {
        const params = matchPath(route.path, pathname);
        if (!params) continue;
        const handlers = route.handlers as Record<string, unknown>;
        const method = request.method === "HEAD" ? "GET" : request.method;
        const handler = handlers[method] as Handler | undefined;
        if (typeof handler !== "function") {
          const allow = Object.keys(handlers).filter(key => /^[A-Z]+$/.test(key)).join(", ");
          return new Response(null, { status: 405, headers: { Allow: allow } });
        }
        const incoming = new NextRequest(request);
        const response = await requestContext.run(incoming, () => handler(incoming, { params }));
        return request.method === "HEAD"
          ? new Response(null, { status: response.status, headers: response.headers })
          : response;
      }
      return Response.json({ error: "Not found" }, { status: 404 });
    } catch (error) {
      console.error("Backend request failed", error);
      return Response.json({ error: "Request failed" }, { status: 500 });
    }
  },
};
