"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { BellIcon } from "lucide-react";

// Import the utility function we built earlier to get all links for a specific role
import { getAllNavLinks } from "@/components/app-shared"; 
import { ModeToggle } from "./ui/mode-toggle";

export function AppHeader() {
    const { user, isLoaded } = useUser();
    const pathname = usePathname(); // This gets the current URL path (e.g., "/dashboard/student/wallet")

    // 1. Determine the user's role
    const userRole = user?.publicMetadata?.role === "TEACHER" ? "TEACHER" : "STUDENT";

    // 2. Dynamically find the active item based on the current URL
    const activeItem = useMemo(() => {
        if (!isLoaded) return undefined;
        
        // Get the flattened list of all links for this specific user's role
        const roleLinks = getAllNavLinks(userRole);
        
        // Find the link whose path matches the current browser URL
        // If no match is found (e.g., on a dynamic route), fallback to the first item (Dashboard)
        return roleLinks.find((item) => item.path === pathname) || roleLinks[0];
    }, [isLoaded, userRole, pathname]);

    return (
        <header
            // Fixed the typo "pxx-4" to "px-4"
            className={cn(
                "px-4 mb-6 flex items-center justify-between gap-2 md:px-2"
            )}
        >
            <div className="flex items-center gap-3">
                <CustomSidebarTrigger />
                <Separator
                    className="mr-2 h-4 data-[orientation=vertical]:self-center"
                    orientation="vertical"
                />
                {/* 3. Pass the dynamically found item to your breadcrumbs */}
                {activeItem && <AppBreadcrumbs page={activeItem} />}
            </div>
            
            <div className="flex items-center gap-3">
                <Button aria-label="Notifications" size="icon" variant="ghost">
                    <BellIcon />
                </Button>
                <Separator
                    className="h-4 data-[orientation=vertical]:self-center"
                    orientation="vertical"
                />
                <ModeToggle />
                <Separator
                    className="h-4 data-[orientation=vertical]:self-center"
                    orientation="vertical"
                />
                <UserButton />
            </div>
        </header>
    );
}