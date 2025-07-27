import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
    new PrismaClient({
        // Configures logging behavior for Prisma:
        // In development(NODE_ENV === "development"), it logs database queries (query), errors(error), and warnings
        log:
            env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

// globalForPrisma uses globalThis(a global object in JavaScript) to store a single instance of the Prisma Client.
// necessary because, in a development environment with hot module reloading (e.g., Next.js), the file might be 
// re - imported multiple times, which could create multiple 
// Prisma Client instances.Using globalThis ensures that only one instance is created and reused.
const globalForPrisma = globalThis as unknown as {
    // cast it as unknown first as intermediate step to then assert that global thsi has prsima property
    // asserts that globalThis has a prisma property of the specified type
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};
// If value is not null or undefined, result will be value
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
