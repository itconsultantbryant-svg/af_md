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

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. In [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect the repo — Render reads `render.yaml` and creates:
   - **af-md-db** — PostgreSQL (free tier)
   - **af-md-api** — Node web service
4. Set these **manual** environment variables on **af-md-api**:

   | Variable | Example |
   |----------|---------|
   | `JWT_SECRET` | `openssl rand -base64 32` |
   | `ADMIN_EMAIL` | `admin@afrimindai.com` |
   | `ADMIN_PASSWORD` | strong password |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
   | `FRONTEND_URL` | `https://your-app.vercel.app` |
   | `OPENAI_API_KEY` | optional |

5. Deploy. First build runs `prisma db push`, seeds admin + courses, and builds Next.js.
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

---

## Custom domain

1. Add domain on Vercel → update `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL`.
2. Redeploy both services after env changes.
