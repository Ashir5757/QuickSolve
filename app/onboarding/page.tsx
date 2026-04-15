"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { BookOpenText, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils'; 
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'tutor' | null>(null);

  const handleContinue = () => {
    if (role === 'student') {
      router.push('/onboarding/student');
    } else if (role === 'tutor') {
      router.push('/onboarding/tutor'); 
    }
  };

  return (
    // Replaced bg-slate-50 with bg-background
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-primary/.2),transparent)]">
      
      {/* Theme-compliant grid: Uses hsl(var(--border)) instead of hardcoded hex colors */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000_10%,transparent_100%)]" />

      {/* Replaced bg-white with bg-card, removed static slate shadows */}
      <Card className="relative z-10 w-full max-w-2xl shadow-2xl border bg-card/95 backdrop-blur-sm rounded-3xl p-6 sm:p-10">
        <CardHeader className="text-center pb-8 pt-6">
          <CardTitle className="text-4xl font-bold tracking-tighter text-foreground">
            Let's personalize your account
          </CardTitle>
          <CardDescription className="text-lg mt-2.5 max-w-md mx-auto">
            Choose your role to get started and unlock a world of personalized learning or teaching.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-6 sm:grid-cols-2 mt-2">
          {/* Student Role Card */}
          <div
            onClick={() => setRole('student')}
            className={cn(
              "relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300",
              role === 'student' 
                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg scale-105" 
                : "border-border hover:border-primary/50 hover:bg-muted/50 hover:-translate-y-1"
            )}
          >
            <div className={cn(
              "p-5 rounded-full mb-5 transition-colors duration-300",
              role === 'student' ? "bg-primary/10" : "bg-muted"
            )}>
              <GraduationCap className={cn(
                "w-12 h-12", 
                role === 'student' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <h3 className="font-bold text-2xl mb-2 text-foreground">I'm a Student</h3>
            <p className="text-sm text-center text-muted-foreground">
              Join interactive classes, access a curated library of learning materials, and submit your assessments with ease.
            </p>
          </div>

          {/* Teacher/Tutor Role Card */}
          <div
            onClick={() => setRole('tutor')}
            className={cn(
              "relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300",
              role === 'tutor' 
                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg scale-105" 
                : "border-border hover:border-primary/50 hover:bg-muted/50 hover:-translate-y-1"
            )}
          >
            <div className={cn(
              "p-5 rounded-full mb-5 transition-colors duration-300",
              role === 'tutor' ? "bg-primary/10" : "bg-muted"
            )}>
              <BookOpenText className={cn(
                "w-12 h-12", 
                role === 'tutor' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <h3 className="font-bold text-2xl mb-2 text-foreground">I'm a Teacher</h3>
            <p className="text-sm text-center text-muted-foreground">
              Create and manage courses, engage with students, and grade submissions using our intuitive educator tools.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col mt-6 pt-10 pb-6">
          <Button 
            className="w-full sm:w-2/3 text-lg h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95" 
            disabled={!role}
            onClick={handleContinue}
          >
            Continue
          </Button>
          <p className="text-xs text-muted-foreground mt-5 text-center px-4">
            A selection is required to proceed. You can adjust your specific account settings later from your personal dashboard.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}