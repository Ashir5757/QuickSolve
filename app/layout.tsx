import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono, Inter, Dancing_Script } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from "@/components/custom/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const dancingScript = Dancing_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'QuickSolve | Micro-Tutoring Platform',
  description: 'Connect with expert tutors instantly for micro-sessions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Added the QuickSolve Electric Indigo theme to Clerk
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "blue", 
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
        <body className={`${geistSans.variable} ${dancingScript.variable} ${geistMono.variable} antialiased`}>
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}