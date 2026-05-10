import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../root"; 
import { createTRPCContext } from "../../trpc-config";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

// You MUST export both GET and POST for tRPC to work in Next.js
export { handler as GET, handler as POST };