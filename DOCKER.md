# QAPilot — Docker Guide

Instructions for running QAPilot locally and in production with Docker.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- `.env` file created from `.env.example`

---

## Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/nishasingh-cmd/QApilot.git
cd QApilot

# 2. Create your environment file
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker-compose up

# 4. Visit the app
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# API docs: http://localhost:5000/api/health
```

---

## Service Architecture

```
┌─────────────────────────────────────────────────┐
│                  qapilot_net                      │
│                                                   │
│  ┌──────────┐    ┌──────────┐    ┌────────────┐  │
│  │  client  │    │  server  │    │   mongo    │  │
│  │ :5173    │───▶│  :5000   │───▶│   :27017   │  │
│  └──────────┘    └──────────┘    └────────────┘  │
│                       │                           │
│                  ┌──────────┐                     │
│                  │  redis   │                     │
│                  │  :6379   │                     │
│                  └──────────┘                     │
└─────────────────────────────────────────────────┘
```

---

## Individual Container Commands

```bash
# Build client image only
docker build -f Dockerfile -t qapilot-client .

# Build server image only
docker build -f server/Dockerfile -t qapilot-server .

# Run server image standalone
docker run -p 5000:5000 --env-file .env qapilot-server
```

---

## Production Deployment with Docker

```bash
# Start production stack (includes Nginx)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f server
docker-compose logs -f mongo

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

---

## Data Volumes

| Volume | Purpose | Location |
|---|---|---|
| `mongo_data` | MongoDB database files | Docker managed |
| `redis_data` | Redis persistence (RDB snapshots) | Docker managed |

```bash
# List all volumes
docker volume ls

# Inspect volume location
docker volume inspect qapilot_mongo_data

# Backup MongoDB data
docker exec qapilot_mongo mongodump --out /backup
docker cp qapilot_mongo:/backup ./mongodb-backup
```

---

## Health Checks

All containers include health checks:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' qapilot_server

# Manual health check
curl http://localhost:5000/api/health/live   # Liveness
curl http://localhost:5000/api/health/ready  # Readiness
```

---

## Rebuilding After Code Changes

```bash
# Rebuild and restart a specific service
docker-compose up --build server

# Rebuild everything
docker-compose up --build
```

---

## Environment Variables in Docker

The `docker-compose.yml` reads from your `.env` file automatically via `env_file: .env`.

For production, either:
1. Pass env vars via the deployment platform (Render, Railway, ECS)
2. Use Docker secrets for sensitive values

---

## Troubleshooting

| Issue | Command | Solution |
|---|---|---|
| Port conflict | `docker-compose ps` | Change port mapping in compose file |
| MongoDB won't start | `docker-compose logs mongo` | Check disk space / volume permissions |
| Redis memory error | `docker stats` | Set `maxmemory` in Redis config |
| Server exits immediately | `docker-compose logs server` | Check `.env` values and MongoDB URI |
