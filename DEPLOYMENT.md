# Deployment Guide

AfriMind uses a **split deployment**:

| Layer | Platform | Role |
|-------|----------|------|
| **Frontend** | [Vercel](https://vercel.com) | Next.js pages, UI, middleware |
| **Backend API** | [Render](https://render.com) | `/api/*`, database, file uploads |
| **Database** | Render PostgreSQL | Production data |

Vercel **proxies** `/api/*` and `/uploads/*` to Render so auth cookies stay on your Vercel domain.

---

## 1. Deploy backend on Render

### Step 1 — Set up PostgreSQL (required first)

Render allows **only one free PostgreSQL database per account**. The blueprint does **not** create a database — you must provide `DATABASE_URL` yourself.

**Option 1 — Use an existing Render Postgres (if you already have one)**

1. [Render Dashboard](https://dashboard.render.com) → your PostgreSQL instance.
2. Copy **Internal Database URL** (use Internal, not External, when API is on Render).
3. You will paste this as `DATABASE_URL` when deploying the web service.

**Option 2 — Create a new Render Postgres (only if you have zero free databases)**

1. **New → PostgreSQL** → name it `af-md-db`, free tier.
2. Copy the **Internal Database URL**.

**Option 3 — Neon (recommended if Render DB limit is reached)**

1. [neon.tech](https://neon.tech) → free project → copy connection string.
2. Use as `DATABASE_URL` (works from Render and Vercel).

> If blueprint sync failed with *"cannot have more than one active free tier database"*, you already have a Render Postgres — reuse its connection string (Option 1) or use Neon (Option 3).

---

### Step 2 — Deploy API with Blueprint

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect the repo — creates **af-md-api** web service only.
4. **Before the first deploy succeeds**, open **af-md-api → Environment** and add:

   | Variable | Required | Where to get it |
   |----------|----------|-----------------|
   | `DATABASE_URL` | **Yes — deploy will fail without this** | Render Postgres → **Connect** → **Internal Database URL** (or Neon connection string) |
   | `JWT_SECRET` | **Yes** | Run `openssl rand -base64 32` locally |
   | `ADMIN_EMAIL` | **Yes** | e.g. `admin@afrimindai.com` |
   | `ADMIN_PASSWORD` | **Yes** | Strong password for admin login |
   | `NEXT_PUBLIC_SITE_URL` | **Yes** | Your Vercel URL (can update after Vercel deploy) |
   | `FRONTEND_URL` | **Yes** | Same as Vercel URL |
   | `OPENAI_API_KEY` | No | Optional |

   Example `DATABASE_URL` formats:
   ```text
   # Render Postgres (Internal — use this when API is on Render)
   postgresql://afmd_user:xxxxx@dpg-xxxxx-a/afmd

   # Neon
   postgresql://user:pass@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

5. Click **Save Changes**, then **Manual Deploy** → Deploy latest commit.
6. Copy your Render service URL, e.g. `https://af-md-api.onrender.com`.
7. Verify: `GET https://af-md-api.onrender.com/api/health` → `{ "status": "ok" }`.

> **Course uploads on free tier:** Render free web services do not support persistent disks. Uploaded files are stored in the container filesystem and **may be lost on redeploy or restart**. For production uploads, upgrade the web service to a paid plan and add a disk at `/opt/render/project/src/public/uploads`, or integrate cloud storage (S3, Cloudinary, etc.).

### Option B — Manual web service

1. **New → PostgreSQL** — copy the internal connection string.
2. **New → Web Service** → connect repo.
3. Settings:
   - **Build command:** `npm run build:render`
   - **Start command:** `npm run start:render`
   - **Health check path:** `/api/health`
4. Add env vars from the table above + `DATABASE_URL` from Postgres.
5. *(Paid plan only)* Add a **persistent disk** mounted at `/opt/render/project/src/public/uploads` for durable course uploads.

---

## 2. Deploy frontend on Vercel

1. [vercel.com](https://vercel.com) → **Import** your GitHub repo.
2. Framework: **Next.js** (auto-detected).
3. **Environment variables** (Production):

   | Variable | Value |
   |----------|-------|
   | `BACKEND_URL` | `https://af-md-api.onrender.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
   | `JWT_SECRET` | **same value as Render** (middleware verifies tokens) |
   | `DATABASE_URL` | Render Postgres URL (optional; only if SSR needs DB) |

4. Deploy. Vercel runs `npm run build:vercel` (via `vercel.json`).
5. Update Render env `FRONTEND_URL` and `NEXT_PUBLIC_SITE_URL` to your final Vercel URL, then redeploy Render.

---

## 3. Local development

```bash
# Start local Postgres
docker compose up -d

# Configure env
cp .env.example .env
# DATABASE_URL=postgresql://afmd:afmd@localhost:5432/afmd

npm install
npm run db:setup
npm run dev
```

---

## Architecture

```
Browser → your-app.vercel.app
            ├── / (pages)        → Vercel Next.js
            ├── /api/*           → rewrite → Render API
            └── /uploads/*       → rewrite → Render disk

Render API → PostgreSQL
           → public/uploads (ephemeral on free tier; persistent disk on paid plan)
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 401 on admin/dashboard | Ensure `JWT_SECRET` matches on Vercel and Render |
| API 502 / timeout | Render free tier sleeps after 15 min — first request wakes it |
| Uploads missing after redeploy | Free tier has no persistent disk — upgrade to paid and mount a disk, or use cloud storage |
| CORS errors | Set `FRONTEND_URL` on Render to your exact Vercel URL |
| Build fails on Vercel | Ensure `BACKEND_URL` is set; `prisma generate` runs via `postinstall` |
| Blueprint: one free database limit | Reuse existing Render Postgres URL or use [Neon](https://neon.tech) for `DATABASE_URL` |
| Build failed: DATABASE_URL not found | Add `DATABASE_URL` in Render **Environment**, then **Manual Deploy** → Clear build cache & deploy |
| Build failed: Cannot find module tailwindcss | Redeploy latest commit; build uses `npm ci --include=dev` and Tailwind is in dependencies |

---

## Custom domain

1. Add domain on Vercel → update `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL`.
2. Redeploy both services after env changes.
