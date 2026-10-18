import { createServer } from "node:http";
import backend from "./index";

const port = Number(process.env.BACKEND_PORT || 3001);
createServer(async (incoming, outgoing) => {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of incoming) chunks.push(Buffer.from(chunk));
    const headers = new Headers();
    for (const [key, value] of Object.entries(incoming.headers)) {
      if (Array.isArray(value)) value.forEach(item => headers.append(key, item));
      else if (value !== undefined) headers.set(key, value);
    }
    const response = await backend.fetch(new Request(`http://localhost:${port}${incoming.url}`, {
      method: incoming.method,
      headers,
      body: incoming.method === "GET" || incoming.method === "HEAD" ? undefined : Buffer.concat(chunks),
    }));
    outgoing.statusCode = response.status;
    response.headers.forEach((value, key) => { if (key !== "set-cookie") outgoing.setHeader(key, value); });
    const cookies = response.headers.getSetCookie();
    if (cookies.length) outgoing.setHeader("set-cookie", cookies);
    if (response.body) for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) outgoing.write(chunk);
    outgoing.end();
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500).end();
  }
}).listen(port, "127.0.0.1", () => console.log(`Neon API development server: http://localhost:${port}`));
