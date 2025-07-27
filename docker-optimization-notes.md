# Docker Optimization Notes - T3 Stack

## Overview

Optimized T3 stack Docker image from 1.22GB to 338MB (72% reduction).

## Critical Bugs Encountered & Solutions

### Bug 1: Volume Override Issue

**Problem:**

```yaml
# docker-compose.dev.yml
volumes:
  - .:/app # ← This OVERRIDES container's /app directory
```

**Error:** `Cannot find module '/app/server.js'`

**Root Cause:** Volume mount `.:/app` replaced the container's built files with local directory (which doesn't have `server.js`).

**Solution:** Remove volume mount for production use.

### Bug 2: NODE_ENV Conflict

**Problem:**

```dockerfile
ENV NODE_ENV=production  # ← Dockerfile setting
```

```env
NODE_ENV=development      # ← .env file setting
```

**Error:** Environment validation conflicts

**Solution:** Remove NODE_ENV from Dockerfile, let docker-compose override it.

### Bug 3: Docker Compose Build vs Image Conflict

**Problem:**

```yaml
build: . # ← Builds new image
image: t3-todo-app:latest # ← Uses existing image
```

**Error:** Docker Compose was building new image instead of using working one

**Solution:** Remove `build` section, use only `image` for production.

### Bug 4: NextAuth UntrustedHost Error

**Problem:** NextAuth.js v5 requires explicit host trust

**Error:** `UntrustedHost: Host must be trusted`

**Solution:** Add `AUTH_URL=http://localhost:3000` to environment variables.

## Why Use `node:20-alpine` Instead of `base` for Runner?

### The Issue with Using `base`

```dockerfile
FROM base AS runner  # ← Would include unnecessary build tools
```

**`base` stage contains:**

- Node.js runtime (needed)
- **pnpm package manager (31MB)** ← Unnecessary at runtime
- **Build tools (5MB)** ← Unnecessary at runtime

### The Solution: Use `node:20-alpine`

```dockerfile
FROM node:20-alpine AS runner  # ← Fresh Alpine with just Node.js
```

**`node:20-alpine` contains:**

- Node.js runtime (needed)
- **No pnpm** (not needed at runtime)
- **No build tools** (not needed at runtime)

### Why No Data Loss?

**All application data comes from `COPY` commands, not the base image:**

```dockerfile
# Copy built application (standalone)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
```

**Everything your app needs is copied:**

- ✅ `server.js` (Next.js standalone server)
- ✅ All static assets (`public/`)
- ✅ All build output (`.next/standalone/`)
- ✅ Prisma client (`.prisma/`)

### Size Savings

| **Component**     | **Using `base`** | **Using `node:20-alpine`** | **Savings** |
| ----------------- | ---------------- | -------------------------- | ----------- |
| Node.js runtime   | 129MB            | 129MB                      | 0MB         |
| pnpm              | 31MB             | 0MB                        | **31MB**    |
| Build tools       | 5MB              | 0MB                        | **5MB**     |
| **Total savings** |                  |                            | **36MB**    |

### Why This Works

1. **Standalone output contains everything** - Next.js creates self-contained app
2. **Prisma client is self-contained** - Includes all database drivers
3. **Runtime is minimal** - Only need Node.js + your app + Prisma client

## Final Optimized Dockerfile

```dockerfile
# BUILD STAGE
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma/ ./prisma/
COPY next.config.ts ./
COPY src/env.ts ./src/env.ts
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN SKIP_ENV_VALIDATION=true pnpm run build

# PRODUCTION STAGE
FROM node:20-alpine AS runner  # ← Fresh Alpine, not base
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["node", "server.js"]
```

## Key Lessons

1. **Volume mounts can override container files** - Be careful with `.:/app` mounts
2. **Environment variable quotes matter** - Remove quotes from .env values
3. **Multi-stage builds are essential** - Separate build and runtime stages
4. **Use fresh Alpine for runner** - Don't inherit unnecessary build tools
5. **Standalone output is crucial** - Next.js standalone mode dramatically reduces size

## Results

- **Before:** 1.22GB
- **After:** 338MB (72% reduction)
- **Build time:** ~47s
- **Runtime:** Only Node.js + Prisma client + standalone output
