import test from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import backend from "../backend/index";
import { routes } from "../backend/routes";
import { createToken } from "../lib/session";
import { proxyBackend } from "../lib/backend-proxy";
import { uploadKey } from "../lib/storage";
import { prisma } from "../lib/db";

process.env.ORIGIN_SECRET = "test-origin-secret";
process.env.JWT_SECRET = "test-configured-secret";

function request(url: string, init: RequestInit = {}) {
  return new Request(`http://localhost${url}`, { ...init,
    headers: { "x-secret": "test-origin-secret", ...init.headers },
  });
}

test("native Function rejects callers without the server secret", async () => {
  const response = await backend.fetch(new Request("http://localhost/api/health"));
  assert.equal(response.status, 401);
});

test("route dispatch preserves 404, 405 and logout cookies", async () => {
  assert.equal((await backend.fetch(request("/api/unknown"))).status, 404);
  const unsupported = await backend.fetch(request("/api/auth/logout"));
  assert.equal(unsupported.status, 405);
  assert.match(unsupported.headers.get("allow")!, /POST/);
  const logout = await backend.fetch(request("/api/auth/logout", { method: "POST" }));
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get("set-cookie")!, /afrimind_session=;/);
  assert.match(logout.headers.get("set-cookie")!, /Max-Age=0/i);
});

test("concurrent requests do not share session cookies", async () => {
  const users = ["alice", "bob"].map(id => ({ id, email: `${id}@example.test`, firstName: id,
    lastName: "Test", role: "LEARNER" as const, emailVerified: true, phoneVerified: true }));
  const originalLookup = prisma.user.findUnique;
  prisma.user.findUnique = (async ({ where }: { where: { id: string } }) => {
    await new Promise(resolve => setTimeout(resolve, where.id === "alice" ? 20 : 1));
    return users.find(user => user.id === where.id);
  }) as unknown as typeof prisma.user.findUnique;
  try {
  const responses = await Promise.all(users.map(async user => {
    const token = await createToken(user);
    const response = await backend.fetch(request("/api/auth/me", { headers: { cookie: `afrimind_session=${token}` } }));
    return response.json();
  }));
  assert.deepEqual(responses.map(body => body.user.id), ["alice", "bob"]);
  assert.equal((await backend.fetch(request("/api/auth/me"))).status, 401);
  } finally { prisma.user.findUnique = originalLookup; }
});

test("every source route is registered", async () => {
  async function walk(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    return (await Promise.all(entries.map(entry => entry.isDirectory()
      ? walk(path.join(directory, entry.name))
      : Promise.resolve(entry.name === "route.ts" ? [path.join(directory, entry.name)] : [])))).flat();
  }
  const files = await walk("backend/routes");
  const expected = files.map(file => "/api/" + path.relative("backend/routes", path.dirname(file))).sort();
  assert.deepEqual(routes.map(route => route.path).sort(), expected);
});

test("proxy forwards query, body and cookies and overwrites caller-supplied origin secret", async () => {
  process.env.NEON_BACKEND_URL = "https://backend.example.test";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "https://backend.example.test/api/profile?tab=details");
    assert.equal(init?.method, "PUT");
    assert.equal(new Headers(init?.headers).get("x-secret"), "test-origin-secret");
    assert.equal(new Headers(init?.headers).get("cookie"), "afrimind_session=test");
    assert.equal(new TextDecoder().decode(init?.body as ArrayBuffer), '{"firstName":"Test"}');
    assert.equal(init?.redirect, "manual");
    return new Response("ok", { headers: { "set-cookie": "session=value; HttpOnly; Path=/" } });
  };
  try {
    const response = await proxyBackend(new Request("https://frontend.example.test/api/profile?tab=details", {
      method: "PUT", headers: { "x-secret": "attacker", cookie: "afrimind_session=test" }, body: '{"firstName":"Test"}',
    }));
    assert.equal(await response.text(), "ok");
    assert.match(response.headers.get("set-cookie")!, /HttpOnly/);
  } finally { globalThis.fetch = originalFetch; }
});

test("storage preserves legacy URLs and rejects traversal", () => {
  assert.equal(uploadKey("/uploads/courses/abc/lesson.pdf"), "courses/abc/lesson.pdf");
  for (const url of ["/uploads/../secret", "/uploads/a/../../secret", "https://example.test/file", "/uploads/a\\secret"]) {
    assert.throws(() => uploadKey(url));
  }
});
