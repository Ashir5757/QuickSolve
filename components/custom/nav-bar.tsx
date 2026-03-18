"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ModeToggle } from "@/components/ui/mode-toggle"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  const navLinks = [
    { name: "Find a Tutor", href: "/find-tutor" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <header className="sticky top-3 z-50 w-full border rounded bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">

        <Link href="/" >
          <span className="font-bold">Quick</span><span className="text-primary">Solve</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-primary text-foreground/80"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-2">

          {/* Added Desktop Mode Toggle Here */}
          <ModeToggle />

          <SignInButton mode="modal">
            <Button variant="ghost" >Log in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>


        <div className="flex md:hidden items-center gap-4">


          <ModeToggle />

          <UserButton />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col gap-4 px-4">
              <SheetHeader>
                <SheetTitle >
                  <span className="font-bold">Quick</span><span className="text-primary">Solve</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4 pb-6">

                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <Button variant="ghost">Log in</Button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
                  <Button>Sign Up</Button>
                </SignUpButton>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}