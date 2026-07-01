import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

/** Runtime proxy so BACKEND_URL works without a rebuild (build-time rewrites miss late env vars). */
async function proxyToBackend(request: NextRequest): Promise<NextResponse | null> {
  if (!backendUrl) return null;

  const targetUrl = `${backendUrl}${request.nextUrl.pathname}${request.nextUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === "host") return;
    headers.set(key, value);
  });

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers(upstream.headers);
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Backend API unavailable",
        hint: "The Render API is unreachable. Remove BACKEND_URL on Vercel and set DATABASE_URL directly, or redeploy the Render service.",
      },
      { status: 502 }
    );
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    backendUrl &&
    (pathname.startsWith("/api/") || pathname.startsWith("/uploads/"))
  ) {
    const proxied = await proxyToBackend(request);
    if (proxied) return proxied;
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
    const session = await verifyToken(token);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=admin", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/uploads/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
