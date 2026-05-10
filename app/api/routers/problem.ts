// src/server/api/routers/problem.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/app/api/trpc-config";

export const problemRouter = createTRPCRouter({
  // Get paginated problems for teachers to browse
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // for cursor-based pagination
        status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]).optional(),
        subject: z.string().optional(),
        grade: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status, subject, grade } = input;

      // Build where clause dynamically
      const where: any = {};
      if (status) where.status = status;
      if (subject) where.subject = subject;
      if (grade) where.grade = grade;

      const problems = await ctx.db.problem.findMany({
        take: limit + 1, // Fetch one extra to check if there's more
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy: {
          createdAt: "desc", // Newest first
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (problems.length > limit) {
        const nextItem = problems.pop(); // Remove the extra item
        nextCursor = nextItem!.id;
      }

      return {
        problems,
        nextCursor,
      };
    }),

  // Get single problem details
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.problem.findUnique({
        where: { id: input.id },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }),

  // Teacher accepts a problem (creates a meeting)
  acceptProblem: protectedProcedure
    .input(
      z.object({
        problemId: z.string(),
        teacherId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { problemId, teacherId } = input;

      // Get the problem
      const problem = await ctx.db.problem.findUnique({
        where: { id: problemId },
      });

      if (!problem) throw new Error("Problem not found");
      if (problem.status !== "OPEN") throw new Error("Problem is not available");

      // Create meeting and update problem status in a transaction
      const result = await ctx.db.$transaction([
        // Update problem status
        ctx.db.problem.update({
          where: { id: problemId },
          data: { status: "IN_PROGRESS" },
        }),
        // Create meeting
        ctx.db.meeting.create({
          data: {
            roomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: "PENDING",
            teacherId,
            studentId: problem.studentId,
          },
        }),
      ]);

      return result[1]; // Return the meeting
    }),

  // Get count by status (for the header stats)
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [open, inProgress, resolved] = await Promise.all([
      ctx.db.problem.count({ where: { status: "OPEN" } }),
      ctx.db.problem.count({ where: { status: "IN_PROGRESS" } }),
      ctx.db.problem.count({ where: { status: "RESOLVED" } }),
    ]);

    return { open, inProgress, resolved };
  }),
});