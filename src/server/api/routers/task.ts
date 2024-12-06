import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.task.findMany();
  }),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          completed: input.completed,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: { id: input.id },
      });
    }),
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const task = await ctx.db.task.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return task ?? null;
  }),
});
