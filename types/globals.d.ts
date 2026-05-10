// types/globals.d.ts

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "STUDENT" | "TEACHER" | "ADMIN";
    };
  }
}