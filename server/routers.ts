import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllModules, getModuleById, updateModule, createModule, verifyAdminCredentials, getAdminByEmail, getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, verifyStudentCredentials } from "./db";
import { storagePut } from "./storage";

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

  admin: router({
    login: publicProcedure
      .input(z.object({ email: z.string().email(), ra: z.string() }))
      .mutation(async ({ input }) => {
        
        const isValid = await verifyAdminCredentials(input.email, input.ra);
        if (!isValid) {
          throw new Error("Email ou RA inválido");
        }
        const admin = await getAdminByEmail(input.email);
        return {
          success: true,
          admin: admin,
        };
      }),
    students: router({
      list: publicProcedure.query(() => getAllStudents()),
      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => getStudentById(input.id)),
      create: publicProcedure
        .input(z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          isActive: z.enum(["true", "false"]).optional(),
        }))
        .mutation(({ input }) => createStudent(input as any)),
      update: publicProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          password: z.string().optional(),
          isActive: z.enum(["true", "false"]).optional(),
        }))
        .mutation(({ input }) => {
          const { id, ...data } = input;
          return updateStudent(id, data as any);
        }),
      delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(({ input }) => deleteStudent(input.id)),
    }),
  }),

  student: router({
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input }) => {
        const student = await verifyStudentCredentials(input.email, input.password);
        if (!student) {
          throw new Error("Email ou senha inválidos");
        }
        return {
          success: true,
          student: student,
        };
      }),
  }),

  modules: router({
    list: publicProcedure.query(() => getAllModules()),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getModuleById(input.id)),
    uploadAudio: publicProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded file data
        contentType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Decode base64 to buffer
          const buffer = Buffer.from(input.fileData, 'base64');
          
          // Upload to storage
          const timestamp = Date.now();
          const storagePath = `audio/${timestamp}-${input.fileName}`;
          const result = await storagePut(storagePath, buffer, input.contentType || 'audio/mpeg');
          
          return {
            success: true,
            url: result.url,
            key: result.key,
          };
        } catch (error) {
          console.error('Error uploading audio:', error);
          throw new Error(`Falha ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }),
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

