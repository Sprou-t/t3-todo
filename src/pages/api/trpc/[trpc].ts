// This file defines the API handler for tRPC in a Next.js application.It connects your 
// tRPC router and context to the Next.js API route system, enabling type - safe backend 
// calls from your frontend.
import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/router/index';
import { createContext } from '../../../server/context';

// API handler for tRPC
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
});