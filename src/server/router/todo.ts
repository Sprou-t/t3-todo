// define router for Todo model
import { publicProcedure, createTRPCRouter } from '../trpc';
import { z } from 'zod'; // type validation for user input

//.query and .mutation are trpc functions. they accept the context as argument and understand that we are using prisma

export const todoRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        // use prisma functions here to retrieve items from db
        return await ctx.prisma.todo.findMany()
    }),
    // .input accepts a z object to validate the arguments from input
    // .mutation is used for POST/PUT/DELETE operations
    create: publicProcedure.input(z.object({
        title: z.string(), description: z.string().optional(),
    })
    ).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.todo.create({
            data: input,
        })
    })
})