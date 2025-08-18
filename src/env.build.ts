// Simplified environment config for build time
export const env = {
    DATABASE_URL: process.env.DATABASE_URL || "dummy",
    AUTH_SECRET: process.env.AUTH_SECRET || "dummy",
    NODE_ENV: process.env.NODE_ENV || "development",
}; 