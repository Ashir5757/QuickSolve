import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Zap } from "lucide-react";

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
            <main>
                {children}
            </main>

    );
}