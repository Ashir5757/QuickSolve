import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, GraduationCap, ArrowRight, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function OnboardingSelector() {
  const user = await currentUser()
  
  if (!user) {
    redirect("/")
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      
      {/* 1. MAGIC UI AESTHETIC: Animated Floating Background Orbs */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="absolute h-[500px] w-[500px] animate-[spin_20s_linear_infinite] rounded-full bg-gradient-to-tr from-primary/30 to-transparent blur-[120px]" />
        <div className="absolute h-[600px] w-[400px] animate-[spin_25s_linear_infinite_reverse] rounded-full bg-gradient-to-bl from-blue-500/20 to-transparent blur-[120px]" />
      </div>

      {/* Grid Pattern overlay for texture */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[image:radial-gradient(#1f2937_1px,transparent_1px)] opacity-50"></div>

      <div className="z-10 mb-12 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="mx-auto mb-4 flex w-fit items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
          <Sparkles className="mr-2 h-4 w-4" /> Account Created Successfully
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Welcome to QuickSolve, {user.firstName || "there"}!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          How do you want to use the platform today? <br className="hidden sm:block"/>
          <span className="text-sm font-medium text-primary">(You can always switch roles later!)</span>
        </p>
      </div>

      <div className="z-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        
        {/* STUDENT MAGIC CARD */}
        <Link href="/onboarding/student" className="group relative block h-full">
          {/* Glowing Hover Border Behind Card */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-blue-500 opacity-0 blur transition duration-500 group-hover:opacity-30 dark:group-hover:opacity-50" />
          
          <Card className="relative h-full overflow-hidden border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/10">
                <BookOpen className="h-10 w-10 text-foreground transition-colors group-hover:text-primary" />
              </div>
              <CardTitle className="mb-2 text-3xl">I want to Learn</CardTitle>
              <CardDescription className="px-4 text-base leading-relaxed text-muted-foreground">
                Find expert tutors, book 1-on-1 micro-sessions, and conquer your exams with confidence.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-10">
              <span className="flex items-center text-sm font-semibold text-primary">
                Set up Student Profile <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* TUTOR MAGIC CARD */}
        <Link href="/onboarding/tutor" className="group relative block h-full">
          {/* Glowing Hover Border Behind Card */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-green-500 to-primary opacity-0 blur transition duration-500 group-hover:opacity-30 dark:group-hover:opacity-50" />
          
          <Card className="relative h-full overflow-hidden border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted transition-transform duration-500 group-hover:scale-110 group-hover:bg-green-500/10">
                <GraduationCap className="h-10 w-10 text-foreground transition-colors group-hover:text-green-500" />
              </div>
              <CardTitle className="mb-2 text-3xl">I want to Teach</CardTitle>
              <CardDescription className="px-4 text-base leading-relaxed text-muted-foreground">
                Set your own hourly rate, list your best subjects, and get paid to help your peers succeed.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-10">
              <span className="flex items-center text-sm font-semibold text-green-500">
                Set up Tutor Profile <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  )
}