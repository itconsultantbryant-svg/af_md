import { build } from "esbuild";
import { cp, mkdir, readdir, rm, writeFile, access, readFile } from "node:fs/promises";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

const root = process.cwd();
const output = path.join(root, "build/neon");
await access("node_modules/.prisma/client/libquery_engine-linux-arm64-openssl-3.0.x.so.node");
const engine = await readFile("node_modules/.prisma/client/libquery_engine-linux-arm64-openssl-3.0.x.so.node");
if (engine.subarray(0, 4).toString("hex") !== "7f454c46" || engine.readUInt16LE(18) !== 183) {
  throw new Error("Neon requires an ELF AArch64 Prisma engine.");
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await build({
  entryPoints: ["backend/index.ts"], outfile: path.join(output, "handler.cjs"),
  bundle: true, platform: "node", target: "node24", format: "cjs",
  minify: true, external: ["@prisma/client", "unpdf"],
});
await writeFile(path.join(output, "index.mjs"), 'import handler from "./handler.cjs";\nexport default handler.default;\n');
// Everything except these two runtime packages is bundled. Copy their explicit
// runtime entry points so dependency tracing cannot omit dynamic worker/engine files.
for (const file of [
  "node_modules/@prisma/client/package.json",
  "node_modules/@prisma/client/default.js",
  "node_modules/@prisma/client/index.js",
  "node_modules/@prisma/client/runtime/library.js",
]) {
  const target = path.join(output, file);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(path.join(root, file), target, { dereference: true });
}
// unpdf's text extractor includes the PDF worker and needs no native canvas.
await mkdir(path.join(output, "node_modules/unpdf"), { recursive: true });
await cp("node_modules/unpdf/dist", path.join(output, "node_modules/unpdf/dist"), { recursive: true });
await cp("node_modules/unpdf/package.json", path.join(output, "node_modules/unpdf/package.json"));
// Prisma resolves its generated client dynamically; include it explicitly.
const generated = "node_modules/.prisma/client";
await mkdir(path.join(output, generated), { recursive: true });
for (const file of await readdir(generated)) {
  if (/libquery_engine-/.test(file) && !file.includes("linux-arm64-openssl-3.0.x")) continue;
  await cp(path.join(generated, file), path.join(output, generated, file), { recursive: true });
}
let total = 0;
let compressed = 22;
async function measure(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await measure(file);
    else {
      const bytes = await readFile(file);
      total += bytes.length;
      compressed += deflateRawSync(bytes).length + 256 + 2 * Buffer.byteLength(path.relative(output, file));
    }
  }
}
await measure(output);
if (total > 64 * 1024 ** 2 || compressed > 10 * 1024 ** 2) {
  throw new Error(`Neon bundle exceeds archive limits: ${total} raw bytes, approximately ${compressed} zipped bytes.`);
}
console.log(`Neon backend packaged (Node 24, linux-arm64): ${total} bytes, estimated ZIP ${compressed} bytes.`);
