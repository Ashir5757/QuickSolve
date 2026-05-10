import { initTRPC, TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma"; // Ensure this path correctly points to your Prisma client
import { auth } from "@clerk/nextjs/server";

// 1. Create the Context
// This makes database and auth available to all your procedures
export const createTRPCContext = async () => {
  const session = await auth();
  return {
    db: prisma,
    auth: session,
  };
};

// 2. Initialize tRPC with the Context type
const t = initTRPC.context<typeof createTRPCContext>().create();

// 3. Export reusable helpers
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// 4. Create the Protected Procedure middleware
// This checks if a user is logged in before allowing the code to run
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth || !ctx.auth.userId) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action" 
    });
  }
  return next({
    ctx: {
      // Infers that auth is definitely not null for protected procedures
      auth: ctx.auth,
    },
  });
});