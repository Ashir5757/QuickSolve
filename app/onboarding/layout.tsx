import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  return (
 <div className="bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-primary/.2),transparent)]">
    {children}
 </div>
  )
}