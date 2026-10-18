# Afrimind_AI deployment

## Architecture

- **Vercel** serves the Next.js frontend. `/api/*` and `/uploads/*` proxy to Neon using a server-only `ORIGIN_SECRET`.
- **Neon Functions** runs the existing API handlers, registered in `backend/routes.ts`. Cookie sessions are isolated per request with AsyncLocalStorage. The native Function requires the origin secret before dispatch, then handlers enforce their existing user/admin permissions.
- **Neon Postgres** stores application data through Prisma 5. Application queries use the pooled `DATABASE_URL`; schema administration uses `DATABASE_URL_UNPOOLED`.
- **Neon Object Storage** stores course files in the private `course-uploads` bucket. The media API preserves existing `/uploads/courses/...` URLs and supports range reads. Media visibility remains the same as the previous application: known file URLs can be read without a user session through the frontend.

The deployment config is `neon.ts`. Node.js 24 and a supported Neon region (use `aws-us-east-1`, near Vercel `iad1`) are required. `build:neon` packages the API and its bundled dependencies and explicit runtime files, including Prisma's Linux ARM64 engine. Frontend builds never push schemas or seed data.

## Current migration status

The Neon side is provisioned under the owner account (`org-wandering-river-19284195`):

- Project **Afrimind_AI** (`misty-breeze-97197179`, `aws-us-east-1`, PostgreSQL 18, branch `main`) holds the migrated application data.
- Neon Function **api** is deployed on the branch and connected to the project's Postgres and the private `course-uploads` object-storage bucket. It is settled behind `ORIGIN_SECRET`; the native URL returns 401 without `X-Secret`.
- `.neon` is linked to this project/branch. `.env` holds the branch database and object-storage credentials (written by `neon deploy`). `.env.local` sets `NEON_DEPLOY_PROJECT_ID`, `JWT_SECRET`, and `ORIGIN_SECRET`.
- The previous database (`ep-square-term-ahwwobhf`, project under `org-weathered-feather-21353802`, not reachable from this account) is left untouched and remains authoritative until the Vercel cutover. A backup of its connection string is in `.env.backup-live-*`.

The Vercel frontend still serves the pre-migration build (its API routes talk to the previous database directly). Complete the cutover below to move production onto this Neon backend.

## Complete the cutover

1. Redeploy the Vercel production project from the current commit so the catch-all proxy (`app/api/[...path]`, `app/uploads/[...path]`) replaces the old API routes.
2. Set on the Vercel production project: `NEON_BACKEND_URL` (branch Function URL from `neon functions get api`), `ORIGIN_SECRET` and `JWT_SECRET` (the values in `.env.local`), plus the site's existing `NEXT_PUBLIC_*` variables. Remove obsolete `BACKEND_URL`, `FRONTEND_URL`, and `DEPLOY_TARGET`. The frontend no longer needs `DATABASE_URL`.
3. Verify through Vercel: health, sign-in/out, admin access, learner data, a file upload/download, and video range playback. The native Neon URL must return 401 without `X-Secret`.
4. Re-run the data sync immediately before cutover to capture writes made since the initial copy (the migration script exports every table as CSV and reloads it; see the repository history for the one-off script), then confirm counts match.
5. After Vercel is verified, the previous database can be retired once a database and file backup are retained. Deleting repository deployment files does not delete cloud resources.

## Local development

Use Node 24. Copy `.env.example` to your local environment files only if they do not exist; preserve existing secrets. Set the pooled/direct URLs for an isolated development branch, shared secrets, and the branch's S3 credentials. `neon env pull` obtains branch variables after authentication and linking.

```bash
npm ci
npm run build:neon
npm run dev:backend  # http://localhost:3001
npm run dev          # separate terminal; Next.js on :3000
npm run test:backend
npm run test:neon-bundle # after build:neon; tests isolated deployment files
npm run lint
npm run build:vercel
```

`neon dev` can also serve the packaged directory after `build:neon`; deployment includes the Linux engine, so local database execution requires a Prisma engine for the local platform. Prefer `dev:backend`, which uses the locally generated native client.

Schema changes are explicit (`npm run db:push` for a reviewed change on a development branch). `npm run db:setup` seeds an empty development database; it is not a production migration step. Back up and test schema changes on a child branch before applying them to production.

## Workspace verification

The frontend production build, TypeScript check, and six backend tests pass. Lint passes with an existing React hook dependency warning in the course-content admin page. Local end-to-end checks passed for frontend-to-backend proxying, JSON request bodies, logout cookies, admin redirects, and a read-only health query against the existing Neon database. The Function bundle is about 9 MB compressed and 22 MB uncompressed; its build checks the Linux ARM64 engine and archive limits. PDF extraction was tested from the packaged runtime. Cloud deployment, new project creation, source-data reconciliation, object-storage provisioning/import, and live upload/login verification remain pending account access.
