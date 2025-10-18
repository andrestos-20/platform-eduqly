import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllModules, getModuleById, updateModule, createModule } from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  modules: router({
    list: publicProcedure.query(() => getAllModules()),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getModuleById(input.id)),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        instructor: z.string().optional(),
        duration: z.string().optional(),
        format: z.string().optional(),
        description: z.string().optional(),
        files: z.array(z.object({
          id: z.string(),
          type: z.enum(["video", "audio", "pdf", "powerpoint", "iframe"]),
          name: z.string(),
          url: z.string().optional(),
          iframeCode: z.string().optional(),
          uploadedAt: z.string(),
        })).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateModule(id, data as any);
      }),
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        instructor: z.string(),
        duration: z.string(),
        format: z.string(),
        description: z.string(),
        files: z.array(z.object({
          id: z.string(),
          type: z.enum(["video", "audio", "pdf", "powerpoint", "iframe"]),
          name: z.string(),
          url: z.string().optional(),
          iframeCode: z.string().optional(),
          uploadedAt: z.string(),
        })) as any,
      }))
      .mutation(({ input }) => createModule(input)),
  }),
});

export type AppRouter = typeof appRouter;

