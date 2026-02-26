# Deployment & Testing Guide

This document covers local testing, Docker deployment, and production host setup for the Tanzania Tourism website.

## Local Testing (Development)

### Prerequisites
- Node.js 18+ (LTS recommended)
- PostgreSQL 14+ running locally or remote
- npm or yarn

### Setup Steps

1. Install dependencies:
```bash
npm install
```

2. Configure `.env`:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and admin credentials
```

3. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name finalize
```

4. Seed the database with sample data:
```bash
node prisma/seed.js
```

5. Run tests:
```bash
npm test
```

6. Start development server:
```bash
npm run dev
```

The app runs at `http://localhost:8080`. Visit `/admin/login` to test the admin panel (default password in `.env`).

## Docker Deployment (Local Production-like)

### Prerequisites
- Docker & Docker Compose installed

### Build & Run

```bash
docker compose build
docker compose up
```

This will:
- Start a PostgreSQL container
- Apply database migrations
- Seed the database
- Start the Next.js app on port 3000

The database is persisted in a Docker volume `db_data`. To reset:
```bash
docker compose down -v
```

## Production Deployment

### Environment Variables

All production deployments require these `.env` variables:
```
DATABASE_URL=postgresql://user:password@host:5432/name
ADMIN_PASSWORD=your_strong_password
JWT_SECRET=your_random_secret_key_min_32_chars
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Cloudinary for images
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Option 1: Vercel (Recommended for Next.js)

1. Push your code to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Set environment variables in Vercel dashboard.
4. For database, use Vercel Postgres or link an external Postgres instance.
5. Vercel will auto-deploy on push to main branch.

```bash
# Or deploy via CLI:
npm i -g vercel
vercel
```

### Option 2: Railway (Full Stack)

1. Go to https://railway.app and create a project.
2. Add PostgreSQL service and Next.js service.
3. Link the repository to the Next.js service.
4. Set environment variables in Railway dashboard.
5. Connect the Postgres URL to the app.

### Option 3: Heroku (Deprecated but still works)

1. Install Heroku CLI: `brew install heroku` or download from https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add Postgres: `heroku addons:create heroku-postgresql:standard-0`
5. Set env vars: `heroku config:set ADMIN_PASSWORD=xxx JWT_SECRET=yyy`
6. Deploy: `git push heroku main`

### Option 4: Self-Hosted / VPS (AWS, DigitalOcean, Linode, etc.)

1. SSH into your server (Ubuntu 20.04+ recommended).
2. Install Node.js and PostgreSQL:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib
```

3. Clone the repo and setup:
```bash
git clone https://github.com/your-org/tanzania-tourism-site.git
cd tanzania-tourism-site
npm ci --production
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
```

4. Start with PM2 or similar process manager:
```bash
npm i -g pm2
pm2 start "npm run start" --name "tanzania-site"
pm2 startup
pm2 save
```

5. Reverse proxy with Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. Enable HTTPS with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
# Update Nginx config with SSL paths
```

### Option 5: Docker Swarm / Kubernetes

Build and push image to registry:
```bash
docker build -t your-registry/tanzania-site:latest .
docker push your-registry/tanzania-site:latest
```

For Kubernetes, create a deployment and service manifest (template):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tanzania-site
spec:
  replicas: 2
  selector:
    matchLabels:
      app: tanzania-site
  template:
    metadata:
      labels:
        app: tanzania-site
    spec:
      containers:
      - name: app
        image: your-registry/tanzania-site:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: admin-password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
---
apiVersion: v1
kind: Service
metadata:
  name: tanzania-site-svc
spec:
  type: LoadBalancer
  selector:
    app: tanzania-site
  ports:
  - port: 80
    targetPort: 3000
```

## CI/CD

A GitHub Actions workflow is provided at `.github/workflows/ci.yml`. On every push to `main`:
1. Dependencies are installed
2. Prisma client is generated
3. Database is migrated
4. Database is seeded
5. Tests run
6. Build is verified

To enable: ensure `.github/workflows/ci.yml` exists and GitHub Actions are enabled in your repo settings.

## Monitoring & Maintenance

### Database Backups
- Vercel Postgres: automatic daily backups
- Railway: automatic backups included
- Self-hosted: use `pg_dump`:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Logs
- Vercel: View in dashboard
- Railway: View in dashboard
- Heroku: `heroku logs --tail`
- Self-hosted: Check PM2 logs or systemd journal

### Updates
To update the app in production:
```bash
# Pull latest code
git pull origin main

# Install/update deps
npm ci --production

# Run migrations
npx prisma migrate deploy

# Restart
# (deploy process varies by platform)
```

## Troubleshooting

- **Database connection errors**: Ensure `DATABASE_URL` is correct and Postgres is running
- **Admin login fails**: Check `ADMIN_PASSWORD` matches `.env`
- **Cloudinary not uploading**: Verify `CLOUDINARY_*` env vars are set correctly
- **Images not loading**: Check remote patterns in `next.config.js` match your image URLs

## Support

For issues or questions:
- Check the main `README.md`
- Review API docs in the README
- Check GitHub Issues in the repo
