# Quick Start Checklist

## Local Development (First Time)
- [ ] Install Node.js 18+ LTS
- [ ] Clone this repo or extract the project
- [ ] `npm install` — install dependencies
- [ ] `cp .env.example .env` — create env file
- [ ] Edit `.env` with your database URL or leave defaults to use local Postgres
- [ ] `npx prisma generate` — generate Prisma client
- [ ] `npx prisma migrate dev --name init` — create/migrate database
- [ ] `node prisma/seed.js` — seed sample data
- [ ] `npm run dev` — start dev server at http://localhost:3000
- [ ] `npm test` — run tests (optional)

## Admin Access (Local)
- URL: http://localhost:3000/admin/login
- Default password: "changeme" (from `.env.example`)
- Change this in production!

## Docker (No Node.js Install Needed)
```bash
docker compose build
docker compose up
```
App runs at http://localhost:3000
Database auto-migrates and seeds

## Production Deployment Options
1. **Vercel** (easiest for Next.js)
2. **Railway** (simple full-stack)
3. **Heroku** (if you have an account)
4. **Self-hosted** (VPS, DigitalOcean, AWS, etc.)
5. **Kubernetes** (for scale)

See `DEPLOYMENT.md` for detailed instructions for each.

## Key Files
- `package.json` — dependencies and scripts
- `prisma/schema.prisma` — database schema
- `pages/` — Next.js pages and API routes
- `components/` — reusable React components
- `.env.example` — template environment variables
- `Dockerfile` & `docker-compose.yml` — container setup
- `.github/workflows/ci.yml` — GitHub Actions CI pipeline
- `DEPLOYMENT.md` — production deployment guide

## Support
- Main README: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- Tests: `npm test`
- Lint: `npm run lint` (optional)
