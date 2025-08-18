# Docker Optimization Notes - T3 Stack

## Overview

Optimized T3 stack Docker image from 1.22GB to 338MB (72% reduction).

## Image Size Minimization Techniques

### 1. Multi-Stage Build

**Before:** Single stage with all build tools in final image
**After:** Separate build and runtime stages

```dockerfile
FROM node:20-alpine AS builder  # Build stage with all tools
FROM node:20-alpine AS runner   # Runtime stage with minimal tools
```

### 2. Next.js Standalone Output

**Before:** Full node_modules in production (hundreds of MB)
**After:** Self-contained standalone output

```typescript
// next.config.ts
const config = {
  output: "standalone", // ← Creates minimal runtime
};
```

### 3. Selective File Copying

**Before:** Copy entire project directory
**After:** Copy only runtime-essential files

```dockerfile
# Only copy what's needed for runtime
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
```

### 4. Alpine Linux Base Image

**Before:** `node:20` (Debian-based, ~200MB)
**After:** `node:20-alpine` (Alpine-based, ~129MB)

```dockerfile
FROM node:20-alpine AS runner  # 71MB smaller base
```

### 5. Fresh Alpine for Runner Stage

**Before:** Inherit from `base` stage (includes pnpm + build tools)
**After:** Fresh Alpine (only Node.js runtime)

```dockerfile
# Before: FROM base AS runner (includes 36MB of unnecessary tools)
# After:  FROM node:20-alpine AS runner (only Node.js)
```

### 6. Non-Root User

**Before:** Run as root (security risk)
**After:** Create minimal system user

```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

### 7. Optimized Layer Ordering

**Before:** Copy everything then install dependencies
**After:** Copy package files first, install, then copy source

```dockerfile
# Copy lock files first (better layer caching)
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Then copy source code
COPY . .
```

### 8. Prisma Client Optimization

**Before:** Full Prisma installation in runtime
**After:** Only generated Prisma client

```dockerfile
# Only copy the generated client, not full Prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
```

### 9. Environment Variable Optimization

**Before:** Multiple ENV statements
**After:** Minimal, essential environment variables only

```dockerfile
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
```

### 10. Build Cache Optimization

**Before:** No cache strategy
**After:** Leverage Docker layer caching

```dockerfile
# Dependencies layer (cached unless package files change)
COPY package*.json ./
RUN pnpm install --frozen-lockfile

# Source code layer (cached unless source changes)
COPY . .
```

## Size Reduction Breakdown

| **Optimization**    | **Size Saved** | **Technique**              |
| ------------------- | -------------- | -------------------------- |
| Multi-stage build   | ~500MB         | Separate build/runtime     |
| Standalone output   | ~300MB         | Next.js standalone mode    |
| Alpine base image   | ~71MB          | Smaller Linux distribution |
| Fresh Alpine runner | ~36MB          | No build tools in runtime  |
| Selective copying   | ~200MB         | Only essential files       |
| **Total Savings**   | **~1.1GB**     | **72% reduction**          |

## Next.js Standalone Output Explained

### What is Standalone Output?

Next.js standalone output creates a **self-contained application** that includes only the necessary files to run your app in production. It's like creating a "portable" version of your Next.js application.

### How It Works

```typescript
// next.config.ts
const config = {
  output: "standalone", // ← This is the magic setting
};
```

When you build with `output: "standalone"`, Next.js:

1. **Analyzes your application** - Determines which files are actually needed at runtime
2. **Creates a standalone directory** - Copies only essential files to `.next/standalone/`
3. **Generates a server.js** - Creates a minimal server file that runs your app
4. **Includes only runtime dependencies** - No build tools, dev dependencies, or unused code

### What Gets Included in Standalone

```
.next/standalone/
├── server.js              # ← Minimal Next.js server
├── package.json           # ← Minimal package info
├── .next/                 # ← Only runtime build files
│   ├── static/           # ← Static assets
│   └── server/           # ← Server-side code
└── node_modules/         # ← Only runtime dependencies
    └── .prisma/          # ← Prisma client (if using Prisma)
```

### What Gets Excluded

❌ **Build tools** (webpack, babel, etc.)  
❌ **Development dependencies** (typescript, eslint, etc.)  
❌ **Source code** (your .ts/.js files)  
❌ **Configuration files** (next.config.ts, tsconfig.json, etc.)  
❌ **Unused dependencies** (anything not imported in runtime)

### Before vs After Standalone

**Before (Traditional Build):**

```
/app/
├── node_modules/          # ← 500MB+ (all dependencies)
│   ├── react/            # ← Runtime (needed)
│   ├── next/             # ← Runtime (needed)
│   ├── typescript/       # ← Build tool (not needed)
│   ├── webpack/          # ← Build tool (not needed)
│   └── 1000+ other deps  # ← Many unused
├── src/                  # ← Source code (not needed)
├── .next/                # ← Build output
└── package.json          # ← Full package info
```

**After (Standalone):**

```
/app/
├── server.js             # ← Minimal server (50KB)
├── package.json          # ← Minimal info (1KB)
├── .next/               # ← Only runtime files
│   └── static/          # ← Static assets
└── node_modules/        # ← Only runtime deps (50MB)
    └── .prisma/         # ← Prisma client
```

### Why This Saves So Much Space

1. **No Build Tools** - webpack, babel, typescript, etc. (~200MB saved)
2. **No Dev Dependencies** - eslint, prettier, testing tools, etc. (~100MB saved)
3. **No Source Code** - Your .ts/.js files aren't needed at runtime
4. **No Unused Dependencies** - Only imports that are actually used

### How to Use Standalone in Docker

```dockerfile
# Build stage
FROM node:20-alpine AS builder
# ... install dependencies and build
RUN pnpm run build  # ← Creates .next/standalone/

# Runtime stage
FROM node:20-alpine AS runner
# Copy only the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Run the standalone server
CMD ["node", "server.js"]
```

### Benefits Beyond Size

1. **Faster Container Startup** - Less files to process
2. **Better Security** - No build tools or source code exposed
3. **Simpler Runtime** - Only what's needed to run the app
4. **Portable** - Can run anywhere with just Node.js

### When to Use Standalone

✅ **Production deployments**  
✅ **Docker containers**  
✅ **Serverless environments**  
✅ **Any environment where size matters**

❌ **Development** - You need source code and build tools  
❌ **Debugging** - You need source maps and dev tools

### Standalone vs Traditional

| **Aspect**       | **Traditional**        | **Standalone**  |
| ---------------- | ---------------------- | --------------- |
| **Size**         | 500MB+                 | 50MB            |
| **Startup Time** | Slower                 | Faster          |
| **Security**     | Exposes source code    | Minimal surface |
| **Portability**  | Needs full Node.js env | Self-contained  |
| **Development**  | Full tooling           | Limited         |

The standalone output is the **single biggest optimization** for Next.js Docker images, reducing size by 60-80% while improving performance and security.

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
