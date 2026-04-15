"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";

export const navLinks = [
	{
		label: "Pricing",
		href: "/pricing",
	},
	{
		label: "Contact",
		href: "/contact",
	},
];

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-auto w-full max-w-5xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-4xl md:shadow":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
					{
						"md:px-2": scrolled,
					}
				)}
			>
				<a
					className="flex items-center gap-2 rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50  tracking-tight"
					href="/"
				>
					<Logo className="h-4" />
				</a>

				<div className="hidden items-center gap-4 md:flex">
					<div className="mr-2 flex gap-1">
						{navLinks.map((link) => (
							<Button key={link.label} size="sm" variant="ghost" render={<a href={link.href} />} nativeButton={false}>
								{link.label}
							</Button>
						))}
					</div>
					<ModeToggle />

					<Show when="signed-out">
						<SignInButton mode="modal" forceRedirectUrl="/dashboard">
							<Button size="sm" variant="outline">
								Log In
							</Button>
						</SignInButton>

						<SignUpButton mode="modal" forceRedirectUrl="/onboarding">
							<Button size="sm">
								Get Started
							</Button>
						</SignUpButton>
					</Show>


					<Show when="signed-in">
						<Button size="sm" >
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					</Show>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}