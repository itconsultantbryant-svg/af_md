# af_md

AfriMind Tech&AI Consulting Agency — full-stack Next.js site with LMS, admin panel, portfolio, training, chatbot assistant, and demo request system.

## Stack

- Next.js 14 · TypeScript · Tailwind CSS · Framer Motion
- Prisma · SQLite · JWT auth

## Setup

```bash
npm install
cp .env.example .env   # configure DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma db push
npx prisma db seed
npm run dev
```

## Scripts

- `npm run dev:clean` — dev server with fresh `.next` cache
- `npm run db:reset-progress` — reset student course progress

## Admin

Default admin (after seed): `admin@afrimindai.com`
