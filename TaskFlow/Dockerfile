# Multi-stage Docker build for TaskFlow
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build frontend
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Build backend
FROM base AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 taskflow

# Copy built applications
COPY --from=frontend-builder --chown=taskflow:nodejs /app/frontend/build ./frontend/build
COPY --from=backend-builder --chown=taskflow:nodejs /app/backend/dist ./backend/dist
COPY --from=deps --chown=taskflow:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=taskflow:nodejs /app/backend/node_modules ./backend/node_modules

# Copy package files
COPY --chown=taskflow:nodejs package*.json ./
COPY --chown=taskflow:nodejs backend/package*.json ./backend/

USER taskflow

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "backend/dist/server.js"]