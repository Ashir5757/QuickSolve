import React from "react";
import { UserButton } from "@clerk/nextjs";
import { AppShell } from "@/components/app-shell";

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <AppShell>
                {children}
            </AppShell>
        </main>

    );
}