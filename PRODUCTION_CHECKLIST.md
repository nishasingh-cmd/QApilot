# QAPilot — Production Deployment Checklist

Work through this checklist before going live. Each item must be verified.

---

## ✅ Environment & Configuration

- [ ] `.env` is NOT committed to the repository
- [ ] `.env.example` is up to date with all required variables
- [ ] `NODE_ENV` is set to `production`
- [ ] `JWT_SECRET` is 64+ random characters (not the example value)
- [ ] `COOKIE_SECRET` is unique and random
- [ ] `FRONTEND_URL` matches the exact Vercel deployment URL
- [ ] `GITHUB_REDIRECT_URI` matches the exact registered callback URL
- [ ] All required AI API keys are set
- [ ] `MONGO_URI` points to Atlas (not localhost)
- [ ] `REDIS_URL` points to Redis Cloud (not localhost)

---

## ✅ Security

- [ ] Helmet / security headers are active (`securityMiddleware.js`)
- [ ] Rate limiting is active (150 req/min per IP)
- [ ] NoSQL injection sanitization is active
- [ ] CORS only allows your production frontend origin
- [ ] JWT expiry is configured (`JWT_EXPIRES_IN`)
- [ ] Cookies are set with `httpOnly`, `secure`, `sameSite` in production
- [ ] No hardcoded secrets anywhere in source code
- [ ] GitHub webhook signature validation is enabled

---

## ✅ Database

- [ ] MongoDB Atlas cluster is running
- [ ] Database user has read/write permissions only (not admin)
- [ ] Atlas Network Access allows your backend IP or `0.0.0.0/0`
- [ ] Indexes are created on all queried fields (see model files)
- [ ] Database name in URI matches expected: `/qapilot`
- [ ] Backup is configured (Atlas automated backups enabled)

---

## ✅ Redis

- [ ] Redis Cloud instance is running
- [ ] Connection string includes password if AUTH enabled
- [ ] BullMQ queues are functional (check `/api/health/workers`)
- [ ] Redis persistence (RDB/AOF) is configured

---

## ✅ Backend (Render)

- [ ] Service is deployed and running
- [ ] Start command: `node server/index.js`
- [ ] Build command: `npm install`
- [ ] Health check path: `/api/health/live`
- [ ] Auto-deploy on push to `main` is enabled
- [ ] All env vars are set in Render dashboard
- [ ] Service logs show no startup errors

---

## ✅ Frontend (Vercel)

- [ ] Deployment is successful (no build errors)
- [ ] `VITE_API_URL` points to Render backend URL
- [ ] SPA routing works (direct URL access returns `index.html`)
- [ ] Assets are loading with `Cache-Control: immutable`
- [ ] No console errors in browser DevTools

---

## ✅ GitHub OAuth

- [ ] OAuth App is registered in GitHub
- [ ] Callback URL matches `GITHUB_REDIRECT_URI` exactly
- [ ] OAuth flow works end-to-end (login → redirect → dashboard)

---

## ✅ CI/CD

- [ ] `.github/workflows/ci.yml` is present
- [ ] CI passes on `main` branch (check Actions tab)
- [ ] Docker build passes in CI
- [ ] No failing lint warnings blocking deploys

---

## ✅ Health & Monitoring

- [ ] `GET /api/health/live` → `{"alive": true}`
- [ ] `GET /api/health/ready` → `{"ready": true}`
- [ ] `GET /api/health/database` → `{"status": "healthy"}`
- [ ] `GET /api/health/redis` → `{"status": "healthy"}`
- [ ] `/dashboard/system` page loads with live metrics

---

## ✅ Performance

- [ ] Frontend bundle is under 1 MB gzipped
- [ ] Static assets have `Cache-Control: immutable`
- [ ] API response time < 500ms for common endpoints
- [ ] MongoDB indexes exist on `userId`, `repositoryId`, `status` fields

---

## ✅ Backup Strategy

- [ ] MongoDB Atlas: Enable **Continuous Backup** or **Scheduled Snapshots**
- [ ] Redis: Enable **RDB persistence** (saves every 60s if 1+ key changed)
- [ ] Document the restore procedure (see DOCKER.md for manual backup steps)
- [ ] Test restore from backup at least once before go-live

---

## ✅ Final Smoke Tests

Run these after deploying to production:

```bash
# 1. API is reachable
curl https://api.yourdomain.com/api/health/live

# 2. Database is connected
curl https://api.yourdomain.com/api/health/ready

# 3. CORS is correct (from browser network tab)
# Check for Access-Control-Allow-Origin header

# 4. Auth flow
# - Register a new account
# - Connect GitHub
# - Trigger a repository scan
# - Check dashboard for findings

# 5. Billing flow
# - Visit /dashboard/billing
# - Verify subscription is shown
```

---

> **Sign-off**: All items above checked → QAPilot is ready for production traffic. 🚀
