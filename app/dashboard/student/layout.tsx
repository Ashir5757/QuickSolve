import React from "react";
import { Toaster } from "sonner";
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
                 <Toaster richColors position="top-right" />
            </AppShell>
        </main>

    );
}