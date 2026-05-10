import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/api/webhooks/clerk', '/sign-in(.*)', '/sign-up(.*)', '/pricing(.*)', '/contact(.*)']);
const isTeacherRoute = createRouteMatcher(["/dashboard/teacher(.*)"]);
const isStudentRoute = createRouteMatcher(["/dashboard/student(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isGenericDashboard = createRouteMatcher(["/dashboard"]);
export default clerkMiddleware(async (auth, req) => {
  // 1. Handle Public Routes
  if (isPublicRoute(req)) return;

  // 2. Protect Private Routes
  // We call protect() directly from the auth object provided by clerkMiddleware
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // 3. Extract Session Data
  const { sessionClaims, userId } = await auth();

  // Define the structure of your metadata
  interface CustomJwtPayload {
    metadata?: {
      role?: string;
      onboardingCompleted?: boolean;
    };
  }

  const metadata = (sessionClaims as unknown as CustomJwtPayload)?.metadata || {};
  const role = metadata.role;
  const onboardingCompleted = metadata.onboardingCompleted === true;

  // 4. Role-Based Traffic Control
  
  // If not onboarded, force them to the onboarding page
  if (userId && !onboardingCompleted && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Prevent students from accessing teacher routes
  if (isTeacherRoute(req) && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }

  // Prevent teachers from accessing student routes
  if (isStudentRoute(req) && role === "TEACHER") {
    return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
  }

  if (isGenericDashboard(req)) {
    const target = role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student";
    return NextResponse.redirect(new URL(target, req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};