import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.todo.findMany()
    }),

    create: publicProcedure
        .input(z.object({
            title: z.string(), description: z.string().optional(),
        })
        ).mutation(async ({ ctx, input }) => {
            return await ctx.db.todo.create({
                data: input,
            })
        }),
    delete: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.todo.delete({
                where: { id: input.id },
            })
        }),
});
