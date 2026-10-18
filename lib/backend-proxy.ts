export async function proxyBackend(request: Request): Promise<Response> {
  const backend = process.env.NEON_BACKEND_URL;
  const secret = process.env.ORIGIN_SECRET;
  if (!backend || !secret) {
    return Response.json({ error: "Backend is not configured" }, { status: 503 });
  }
  const incoming = new URL(request.url);
  const target = new URL(backend);
  target.pathname = incoming.pathname;
  target.search = incoming.search;
  const headers = new Headers(request.headers);
  for (const name of ["host", "connection", "content-length", "transfer-encoding"]) headers.delete(name);
  headers.set("x-secret", secret);
  headers.set("accept-encoding", "identity");
  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
    });
    const responseHeaders = new Headers(upstream.headers);
    for (const name of ["connection", "transfer-encoding", "content-encoding", "content-length"]) responseHeaders.delete(name);
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json({ error: "Backend unavailable" }, { status: 502 });
  }
}
