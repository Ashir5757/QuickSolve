import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function onboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await currentUser()
  
  if (!user) {
    redirect("/")
  }

  return (
 <div className="bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-primary/.2),transparent)]">
    {children}
 </div>
  )
}