import { cp, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { jsPDF } from "jspdf";

// Execute away from the repo so omitted runtime files cannot resolve from the
// development node_modules. Use the host engine only for this local smoke test.
const directory = await mkdtemp(path.join(tmpdir(), "afrimind-bundle-"));
try {
  await cp("build/neon", directory, { recursive: true });
  const engines = (await readdir("node_modules/.prisma/client")).filter(file => file.startsWith("libquery_engine-"));
  const native = engines.find(file => !file.includes("linux-arm64")) || engines[0];
  if (!native) throw new Error("Generate the local Prisma client before testing.");
  const pdf = new jsPDF();
  pdf.text("Afrimind migration PDF test", 10, 10);
  await writeFile(path.join(directory, "fixture.pdf"), Buffer.from(pdf.output("arraybuffer")));
  await writeFile(path.join(directory, "smoke.mjs"), `
    import assert from 'node:assert/strict';
    import { readFile } from 'node:fs/promises';
    import backend from './index.mjs';
    import { extractText } from './node_modules/unpdf/dist/index.mjs';
    const denied = await backend.fetch(new Request('https://backend.test/api/health'));
    assert.equal(denied.status, 401);
    const logout = await backend.fetch(new Request('https://backend.test/api/auth/logout', {
      method: 'POST', headers: { 'x-secret': 'bundle-test-secret' }
    }));
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);
    const pdf = await extractText(new Uint8Array(await readFile('./fixture.pdf')), { mergePages: true });
    assert.match(pdf.text, /Afrimind migration PDF test/);
    assert.equal(pdf.totalPages, 1);
    console.log('PASS isolated bundle: native-origin auth, routing, cookies, PDF extraction.');
  `);
  execFileSync(process.execPath, ["smoke.mjs"], {
    cwd: directory,
    stdio: "inherit",
    env: { ...process.env, JWT_SECRET: "bundle-test-jwt", ORIGIN_SECRET: "bundle-test-secret",
      DATABASE_URL: "postgresql://test:test@127.0.0.1:5432/test",
      PRISMA_QUERY_ENGINE_LIBRARY: path.resolve("node_modules/.prisma/client", native) },
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}
