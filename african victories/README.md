# Tanzania Tourism Website

Professional website scaffold for Tanzanian tourist activities. Features:
- Next.js frontend with i18n (English + Swahili)
- Prisma + PostgreSQL schema for trips, destinations, operators, activities
- API routes for searching trips
- Tailwind CSS for professional styling

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migrations (or use `prisma db push`):

```bash
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Run the dev server:

```bash
npm run dev
```

Notes
- This scaffold is a starting point. Replace sample content and images with real content.
- For production, configure a managed Postgres instance and add environment variables.

Admin

1. Set `ADMIN_PASSWORD` and `JWT_SECRET` in your `.env` file (copy from `.env.example`).
2. Start the dev server and visit `/admin/login` to sign in.
3. The admin panel allows creating, editing and deleting trips (protected by the admin password).

Bookings API

- Public: `POST /api/bookings` — create a booking. Required fields: `tripId`, `name`, `email`. Optional: `phone`, `seats`, `message`.
- Admin: `GET /api/admin/bookings` — list bookings (requires admin login).

Images & uploads

- Admin upload endpoint: `POST /api/admin/uploads` — accepts multipart/form-data with `file` field. If Cloudinary credentials are set in environment, files are uploaded to Cloudinary and the response contains `url`, `publicId`, and `provider`. Otherwise files are saved to `public/uploads` and response contains `url` and `provider: local`.
- Admin can delete images using `DELETE /api/admin/trips/:id/images/:imageId` (removes DB record; will remove local file and cloudinary asset when possible).
- Trips APIs include `images` in responses. The UI includes a lightbox and images use lazy-loading.

Testing

- Local quick test (requires Node.js and Postgres):

```bash
# set DATABASE_URL in .env (or use local Postgres with defaults)
npm install
npx prisma generate
npx prisma migrate dev --name finalize
node prisma/seed.js
npm test
```

- CI: A GitHub Actions workflow is included at `.github/workflows/ci.yml` which runs migrations, seeds and tests.

Docker / Deployment

- Build and run with Docker Compose (local production-like environment):

```bash
docker compose build
docker compose up
```

The Compose setup starts a Postgres database, applies migrations, runs the seed script and starts the Next.js server on port 3000.

For single-container production (build image and push to registry), use the provided `Dockerfile`:

```bash
docker build -t your-registry/tanzania-site:latest .
docker push your-registry/tanzania-site:latest
```

Notes
- Ensure `DATABASE_URL`, `ADMIN_PASSWORD`, and `JWT_SECRET` are set in production environment variables. To enable Cloudinary uploads set `CLOUDINARY_*` vars.
- The CI relies on a running Postgres service and will seed the DB before running tests.
