import { initTRPC } from '@trpc/server';
import { Context } from './context';

// we are providing trpc context to prisma so that we can use CRUD function on our postgres db
// context includes prisma etc
const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
// think of procedure as trpc function that can either be query, mutation or subscription with the appropriate endpoint
// connected to the client and db
export const publicProcedure = t.procedure; // procedure contains the context and can use ctx during function usage