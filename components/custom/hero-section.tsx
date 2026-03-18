import Link from "next/link"
import { ArrowRight, PlayCircle, Star, CheckCircle2, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-6 md:pt-10 lg:pt-8 pb-10 md:pb-12">
      
      {/* FIXED BACKGROUND: Added 'image:' prefix and fixed the background-size syntax */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[image:radial-gradient(#1f2937_1px,transparent_1px)]"></div> 
   
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 opacity-20 dark:opacity-30">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 to-transparent blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        {/* On tablet (md), the gap is reduced slightly so it doesn't feel disconnected */}
        <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-8">
          
          <div className="animate-in fade-in slide-in-from-bottom-8 flex flex-col justify-center duration-1000 md:max-w-2xl md:mx-auto lg:mx-0">
            
            <Badge variant="outline" className="text-sm shadow-sm backdrop-blur-md w-fit mb-6">
              <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-primary"></span>
              Live 1-on-1 Micro-Tutoring
            </Badge>

            {/* FIXED RESPONSIVE TEXT: Scales smoothly from 4xl -> 5xl -> 6xl */}
            <h1 className="flex flex-col mb-6 text-4xl md:text-5xl lg:text-6xl tracking-tight">
              <span>Learn anything.</span>
              <span className="font-bold text-muted-foreground/80">Anytime with</span>
              <span className="mt-3 text-primary text-5xl md:text-6xl lg:text-7xl"> <span className="font-bold">Quick</span>Solve</span>
            </h1>

            <p className="mb-10 max-w-lg leading-relaxed text-muted-foreground text-lg md:text-xl">
              Don't let a single roadblock ruin your momentum. Connect with top-tier student experts in seconds and conquer your exams.
            </p>

            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="h-12 md:h-14 px-8 text-base">
                <Link href="/find-tutor">
                  Find a Tutor <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 md:h-14 px-8 text-base">
                <Link href="/how-it-works">
                  <PlayCircle className="mr-2 h-5 w-5 text-foreground" /> Watch Demo
                </Link>
              </Button>
            </div>

            {/* Clean Social Proof */}
            <div className="border-border/50 flex max-w-sm items-center gap-4 border-t pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex -space-x-3">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-zinc-800 text-xs text-white">AA</AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-zinc-600 text-xs text-white">JD</AvatarFallback>
                </Avatar>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/10 shadow-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  5.0 Rated Tutors
                </div>
                <p>Trusted by university students</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Mock UI */}
          <div className="animate-in fade-in slide-in-from-right-8 relative mx-auto w-full max-w-[520px] delay-150 duration-1000 mt-8 lg:mt-0">
            
            {/* Mac-Style Card Window */}
            <Card className="border-border/40 relative z-10 overflow-hidden rounded-md bg-background/95 shadow-2xl backdrop-blur-xl">
              
              {/* Mac Window Header Dots */}
              <div className="border-border/40 flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                <div className="ml-2 flex items-center text-xs font-medium text-muted-foreground">
                  <Terminal className="mr-1 h-3 w-3" /> session_active
                </div>
              </div>

              <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Next.js Debugging</h3>
                    <p className="text-sm text-muted-foreground">Tutor • 12:45 PM</p>
                  </div>
                </div>
                <Badge variant="secondary" className="border-green-500/20 bg-green-500/10 text-green-600 shadow-sm hover:bg-green-500/20">
                  <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span> Live
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4 pb-6">
                <div className="border-border/30 rounded-xl rounded-tl-none border bg-muted/60 p-4 leading-relaxed text-sm text-foreground shadow-sm">
                  <span className="mb-1 block font-semibold text-primary">Tutor message:</span> 
                  "I see the issue. You are getting a hydration error because of the nested tags. Let's fix line 42."
                </div>
                
                {/* Developer Code Block */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0d1117] p-4 font-mono text-sm text-zinc-300 shadow-inner">
                  <p><span className="text-pink-400">export</span> <span className="text-blue-400">default</span> <span className="text-pink-400">function</span> <span className="text-yellow-200">App</span>() {'{'}</p>
                  <p className="pl-4"><span className="text-pink-400">return</span> (</p>
                  <p className="pl-8 text-green-400/80">// Fixed hydration bug here</p>
                  <p className="pl-8">&lt;<span className="text-blue-400">div</span>&gt;Perfect code&lt;/<span className="text-blue-400">div</span>&gt;</p>
                  <p className="pl-4">)</p>
                  <p>{'}'}</p>
                </div>
              </CardContent>
            </Card>

            {/* FIXED FLOATING BOUNDARIES: On small/medium screens, it pulls in slightly so it doesn't cause horizontal scrolling */}
            <Card className="border-border/40 absolute -bottom-6 left-2 sm:-left-6 md:-bottom-8 md:-left-8 z-50 flex animate-bounce items-center gap-4 rounded-md bg-background/95 p-4 md:p-5 shadow-2xl backdrop-blur-md">
              <div className="rounded-full bg-primary/10 p-2">
                <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-foreground">Problem Solved!</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">in under 15 minutes</p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </section>
  )
}