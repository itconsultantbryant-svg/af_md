/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1";
const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");

const nextConfig = {
  ...(isVercel ? {} : { output: "standalone" }),

  /** Proxy API + uploads to Render when frontend runs on Vercel */
  async rewrites() {
    if (!isVercel || !backendUrl) return [];
    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
    ];
  },

  /** CORS for direct API access to Render backend (optional) */
  async headers() {
    if (isVercel || !frontendUrl) return [];
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: frontendUrl },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
