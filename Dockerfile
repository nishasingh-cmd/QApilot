# ─── Stage 1: Build React App ───────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build production assets
RUN npm run build

# ─── Stage 2: Serve via Nginx ────────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
