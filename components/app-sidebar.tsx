"use client";

import { useUser } from "@clerk/nextjs";
import { LogoIcon } from "@/components/logo"; 
import { Button } from "@/components/ui/button";
import FileUpload01 from "@/components/file-upload-01"; 
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { NavGroup } from "@/components/nav-group";
import { LatestChange } from "@/components/latest-change";
import { PlusIcon, SearchIcon, VideoIcon } from "lucide-react";


import {
    studentNavGroups,
    teacherNavGroups,
    sharedSettingsGroup,
    footerNavLinks
} from "@/components/app-shared"; // Adjust this path if you saved them elsewhere
import { useState } from "react";

export function AppSidebar() {
    const { user, isLoaded } = useUser();
    const [open, setOpen] = useState(false);
    // 1. Determine the user's role
    // Defaulting to STUDENT if no role is found. Adjust this if you store roles differently!
    const userRole = user?.publicMetadata?.role === "TEACHER" ? "TEACHER" : "STUDENT";

    // 2. Select the correct navigation groups based on the role
    const activeNavGroups = userRole === "TEACHER" ? teacherNavGroups : studentNavGroups;

    // 3. Combine with the settings group so it appears at the bottom of the content
    const allContentGroups = [...activeNavGroups, sharedSettingsGroup];

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="h-14 justify-center">
                <SidebarMenuButton render={<a href="/" />}>
                    <LogoIcon />
                    <span className="font-medium">QuickSolve</span>
                </SidebarMenuButton>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenuItem className="flex items-center gap-2">
                        {/* Dynamic Quick Action Button */}
                        <SidebarMenuButton
                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                            tooltip={userRole === "TEACHER" ? "Start Session" : "New Request"}
                        >
                            {userRole === "TEACHER" ? <VideoIcon /> : <PlusIcon />}
                            <span>{userRole === "TEACHER" ? "Start Session" :
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger>Upload Problem</DialogTrigger>
                                    <DialogContent>
                                        <FileUpload01 onSuccess={() => setOpen(false)}/>
                                    </DialogContent>
                                </Dialog>
                            }</span>
                        </SidebarMenuButton>


                        <Button
                            aria-label="Search platform"
                            className="size-8 group-data-[collapsible=icon]:opacity-0"
                            size="icon"
                            variant="outline"
                        >
                            <SearchIcon />
                            <span className="sr-only">Search platform</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarGroup>

                {/* 4. Map over the combined role-specific groups */}
                {!isLoaded ? (
                    <div className="p-4 text-sm text-muted-foreground animate-pulse">Loading navigation...</div>
                ) : (
                    allContentGroups.map((group, index) => (
                        <NavGroup key={`sidebar-group-${index}`} {...group} />
                    ))
                )}
            </SidebarContent>

            <SidebarFooter>
                <LatestChange />
                <SidebarMenu className="mt-2">
                    {footerNavLinks.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                className="text-muted-foreground"
                                isActive={item.isActive}
                                size="sm"
                                render={<a href={item.path} />}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}