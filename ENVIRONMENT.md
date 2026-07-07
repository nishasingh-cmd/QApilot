# QAPilot — Environment Variables Reference

Complete reference for all environment variables used by QAPilot.

Copy `.env.example` to `.env` and fill in real values. **Never commit `.env` to version control.**

---

## Application

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` | Runtime mode: `development` or `production` |
| `PORT` | No | `5000` | Express server port |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Public URL of the React frontend (used for CORS) |
| `BACKEND_URL` | No | `http://localhost:5000` | Public URL of the Express API |

---

## Database — MongoDB

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URI` | Yes | — | MongoDB connection string |

**Local**: `mongodb://localhost:27017/qapilot`  
**Atlas**: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/qapilot?retryWrites=true&w=majority`

---

## Cache — Redis

| Variable | Required | Default | Description |
|---|---|---|---|
| `REDIS_URL` | No | `redis://127.0.0.1:6379` | Redis connection URL. If not set, background jobs run in-memory mode |

**Local**: `redis://127.0.0.1:6379`  
**Redis Cloud**: `redis://:<password>@<host>:<port>`

---

## Authentication

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | Secret key for signing JWTs. **Must be 64+ random characters.** Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | No | JWT expiry time. Default: `7d` |
| `COOKIE_SECRET` | Yes | Secret for signing cookies. Generate same as JWT_SECRET |

---

## GitHub OAuth

| Variable | Required | Description |
|---|---|---|
| `GITHUB_CLIENT_ID` | Yes | OAuth App Client ID from GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | Yes | OAuth App Client Secret |
| `GITHUB_REDIRECT_URI` | Yes | Must match exactly what's registered in GitHub. Example: `https://api.qapilot.app/api/github/callback` |
| `GITHUB_WEBHOOK_SECRET` | No | Secret for validating incoming webhook payloads |

---

## AI Providers

| Variable | Required | Description |
|---|---|---|
| `AI_PROVIDER` | Yes | Active provider: `openai`, `gemini`, or `claude` |
| `OPENAI_API_KEY` | If `AI_PROVIDER=openai` | OpenAI API key from [platform.openai.com](https://platform.openai.com) |
| `GEMINI_API_KEY` | If `AI_PROVIDER=gemini` | Google Gemini key from [Google AI Studio](https://aistudio.google.com) |
| `CLAUDE_API_KEY` | If `AI_PROVIDER=claude` | Anthropic Claude key from [console.anthropic.com](https://console.anthropic.com) |

---

## Email (Optional)

| Variable | Required | Description |
|---|---|---|
| `SMTP_HOST` | No | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | No | SMTP login email |
| `SMTP_PASS` | No | SMTP password or app-specific password |
| `EMAIL_FROM` | No | From address for system emails |

---

## Frontend (Vite)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL used by the React client. Set in Vercel dashboard. Example: `https://api.qapilot.app` |

> **Note**: Only variables prefixed with `VITE_` are exposed to the browser bundle. Never put secrets in `VITE_` variables.

---

## Production Docker (Additional)

| Variable | Required | Description |
|---|---|---|
| `MONGO_ROOT_USER` | No | MongoDB root username for Docker Compose prod |
| `MONGO_ROOT_PASSWORD` | Yes (prod Docker) | MongoDB root password |
| `REDIS_PASSWORD` | No | Redis AUTH password for production Docker |

---

## Security Checklist for Secrets

- [ ] `JWT_SECRET` is at least 64 random hex characters
- [ ] `COOKIE_SECRET` is unique and random
- [ ] `GITHUB_CLIENT_SECRET` is stored only in server env, never frontend
- [ ] AI API keys are never committed to git
- [ ] `.env` is in `.gitignore`
- [ ] Production uses separate credentials from development
