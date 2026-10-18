import { defineConfig } from "@neon/config/v1";

const optionalEnv = Object.fromEntries(
  ["OPENAI_API_KEY", "NEXT_PUBLIC_SITE_URL", "SMTP_HOST", "TWILIO_ACCOUNT_SID"]
    .flatMap(key => process.env[key] ? [[key, process.env[key]!]] : [])
);

export default defineConfig({
  buckets: { "course-uploads": { access: "private" } },
  functions: {
    api: {
      name: "Afrimind_AI API",
      source: "./build/neon",
      bundler: "none",
      env: {
        NODE_ENV: "production",
        JWT_SECRET: process.env.JWT_SECRET!,
        ORIGIN_SECRET: process.env.ORIGIN_SECRET!,
        ...optionalEnv,
      },
    },
  },
});
