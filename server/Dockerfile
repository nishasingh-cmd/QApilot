FROM node:20-alpine

WORKDIR /app/server

# Install dependencies first (layer cache)
COPY server/package.json server/package-lock.json* ./

# If server has its own package.json, otherwise copy root
RUN npm install --production 2>/dev/null || true

# Copy all server source files
COPY server/ .

# Set production env
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Healthcheck so Docker knows when API is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health/live || exit 1

CMD ["node", "index.js"]
