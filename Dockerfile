# ── Stage 1: Build the frontend ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production image ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=3001

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server source (tsx needed to run TypeScript directly)
COPY server/ ./server/

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Data directory for SQLite database
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3001

CMD ["node", "--import", "tsx/esm", "server/index.ts"]
