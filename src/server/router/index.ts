//  combine all your routers into a single appRouter
import { createTRPCRouter } from '../trpc';
import { todoRouter } from './todo';

// app router is the main route
export const appRouter = createTRPCRouter({
    // mounts the todoRouter under the path /todo
    // Router will handle which crud operation for which function, eg:
    // GET / api / trpc / todo.getAll will call getAll inside todoRouter
    // POST /api/trpc/todo.create will call the create mutation
    todo: todoRouter,
});

export type AppRouter = typeof appRouter;