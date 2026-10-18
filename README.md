# af_md

AfriMind Tech&AI Consulting Agency — full-stack Next.js site with LMS, admin panel, portfolio, training, chatbot assistant, and demo request system.

## Stack

- Next.js 14 · TypeScript · Tailwind CSS · Framer Motion
- Neon Functions · Neon PostgreSQL · Neon Object Storage · Prisma · JWT auth

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Neon (API, database, uploads) + Vercel (frontend) setup.

Local development uses separate frontend and backend processes; see the deployment guide. Optional local Postgres:

```bash
docker compose up -d
cp .env.example .env
npm run db:setup && npm run dev
```

## Scripts

- `npm run dev:clean` — dev server with fresh `.next` cache
- `npm run db:reset-progress` — reset student course progress

## Admin

Default admin (after seed): `admin@afrimindai.com`
