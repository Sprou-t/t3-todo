# =============================================================================
# BUILD STAGE
# =============================================================================
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Create builder stage
FROM base AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Copy Prisma schema (needed for build)
COPY prisma/ ./prisma/

# Copy Next.js config
COPY next.config.ts ./
COPY src/env.ts ./src/env.ts

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN SKIP_ENV_VALIDATION=true pnpm run build

# =============================================================================
# PRODUCTION STAGE
# =============================================================================
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy generated Prisma client from builder (no need to regenerate)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built application(standalone)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Set environment variables (CHANGED: Use development for hot reloading)
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]