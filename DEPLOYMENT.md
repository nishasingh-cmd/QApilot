# QAPilot — Deployment Guide

Complete step-by-step guide for deploying QAPilot to production using Vercel (frontend), Render (backend), MongoDB Atlas, and Redis Cloud.

---

## Prerequisites

- GitHub account with the QAPilot repository
- [Vercel account](https://vercel.com)
- [Render account](https://render.com)
- [MongoDB Atlas account](https://cloud.mongodb.com)
- [Redis Cloud account](https://redis.com/redis-enterprise-cloud)
- GitHub OAuth application

---

## Step 1 — MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` (all IPs) for cloud hosting
4. Click **Connect → Drivers → Node.js** and copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/qapilot?retryWrites=true&w=majority
   ```
5. Save this as `MONGO_URI`

---

## Step 2 — Redis Cloud

1. Create a free database at [redis.com](https://redis.com/redis-enterprise-cloud)
2. Copy the **Public Endpoint** and **Password**
3. Format: `redis://:<password>@<host>:<port>`
4. Save this as `REDIS_URL`

---

## Step 3 — GitHub OAuth Application

1. Go to **GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App**
2. Set:
   - **Homepage URL**: `https://your-frontend.vercel.app`
   - **Callback URL**: `https://your-backend.onrender.com/api/github/callback`
3. Copy **Client ID** and generate a **Client Secret**
4. Save as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

---

## Step 4 — Deploy Backend (Render)

1. Connect your GitHub repo at [dashboard.render.com](https://dashboard.render.com)
2. Click **New → Web Service** → select `QApilot` repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Node Version**: `20`
4. Add all environment variables from `.env.example` (see `ENVIRONMENT.md`)
5. Deploy — note your service URL: `https://qapilot-api.onrender.com`

> **Tip**: Use `render.yaml` to automate this via Render Blueprints.

---

## Step 5 — Deploy Frontend (Vercel)

1. Import your GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL = https://qapilot-api.onrender.com
   ```
6. Deploy — note your URL: `https://qapilot.vercel.app`

> **Important**: Go back to Render and set `FRONTEND_URL=https://qapilot.vercel.app`

---

## Step 6 — Post-Deployment Verification

Run these checks after deployment:

```bash
# Backend health
curl https://qapilot-api.onrender.com/api/health/live
# Expected: {"alive":true,"timestamp":"..."}

# Readiness check (DB + Redis connected)
curl https://qapilot-api.onrender.com/api/health/ready
# Expected: {"ready":true,"checks":{"database":true,"redis":true}}

# Root ping
curl https://qapilot-api.onrender.com/
# Expected: QAPilot API Running 🚀
```

---

## Railway Alternative

Railway can host both frontend and backend:

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`
5. Set env vars: `railway variables set KEY=VALUE`

---

## Custom Domain

### Vercel Frontend
- Dashboard → Project → Settings → Domains → Add your domain
- Add CNAME record: `www CNAME cname.vercel-dns.com`

### Render Backend
- Dashboard → Service → Settings → Custom Domain
- Add A record pointing to Render's IP

---

## Troubleshooting

| Issue | Solution |
|---|---|
| CORS error on frontend | Ensure `FRONTEND_URL` matches your Vercel URL exactly (no trailing slash) |
| MongoDB connection timeout | Whitelist `0.0.0.0/0` in Atlas Network Access |
| Redis not connecting | Check Redis Cloud endpoint format: `redis://:<pass>@<host>:<port>` |
| GitHub OAuth callback error | Verify `GITHUB_REDIRECT_URI` matches exactly what's registered in GitHub |
| Render service sleeping | Free tier sleeps after 15min inactivity — upgrade to Starter plan |
