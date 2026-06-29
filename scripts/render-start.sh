#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo ""
  echo "ERROR: DATABASE_URL is not set."
  echo ""
  echo "Render → af-md-api → Environment → Add:"
  echo "  DATABASE_URL = postgresql://user:password@host:5432/dbname"
  echo ""
  echo "Use your Render Postgres Internal URL, or a Neon connection string."
  echo "Then click Save and Manual Deploy."
  echo ""
  exit 1
fi

echo "Running database migrations..."
npx prisma db push

echo "Seeding database (idempotent)..."
npm run db:seed

PORT="${PORT:-10000}"
echo "Starting Next.js on 0.0.0.0:${PORT}..."
exec npx next start -H 0.0.0.0 -p "${PORT}"
