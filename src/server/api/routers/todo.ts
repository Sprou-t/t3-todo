import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
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
        })
    // create: protectedProcedure
    //     .input(z.object({ name: z.string().min(1) }))
    //     .mutation(async ({ ctx, input }) => {
    //         return ctx.db.post.create({
    //             data: {
    //                 name: input.name,
    //                 createdBy: { connect: { id: ctx.session.user.id } },
    //             },
    //         });
    //     }),

    // getLatest: protectedProcedure.query(async ({ ctx }) => {
    //     const post = await ctx.db.post.findFirst({
    //         orderBy: { createdAt: "desc" },
    //         where: { createdBy: { id: ctx.session.user.id } },
    //     });

    //     return post ?? null;
    // }),

    // getSecretMessage: protectedProcedure.query(() => {
    //     return "you can now see this secret message!";
    // }),
});
