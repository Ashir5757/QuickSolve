import { createTRPCRouter } from "./trpc-config";
import { problemRouter } from "./routers/problem";

export const appRouter = createTRPCRouter({
  problem: problemRouter,
});

export type AppRouter = typeof appRouter;