import type { ReactNode } from "react";
import { 
    LayoutDashboardIcon, 
    BookOpenIcon, 
    VideoIcon, 
    WalletIcon, 
    UsersIcon, 
    SettingsIcon, 
    HelpCircleIcon, 
    ActivityIcon, 
    SearchIcon,
    GraduationCapIcon,
    ClockIcon,
    CoinsIcon
} from "lucide-react";

export type SidebarNavItem = {
    title: string;
    path?: string;
    icon?: ReactNode;
    isActive?: boolean;
    subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
    label: string;
    items: SidebarNavItem[];
};

// ==========================================
// STUDENT NAVIGATION
// ==========================================
export const studentNavGroups: SidebarNavGroup[] = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                path: "/dashboard/student",
                icon: <LayoutDashboardIcon />,
                isActive: true,
            },
            {
                title: "My Sessions",
                path: "/dashboard/student/sessions",
                icon: <VideoIcon />,
                subItems: [
                    { title: "Upcoming", path: "/dashboard/student/sessions/upcoming" },
                    { title: "Past History", path: "/dashboard/student/sessions/history" },
                ],
            },
        ],
    },
    {
        label: "Tutoring",
        items: [
            {
                title: "Find a Tutor",
                path: "/dashboard/student/find-tutor",
                icon: <SearchIcon />,
            },
            {
                title: "Post a Request", // For your JIT bidding model
                path: "/dashboard/student/requests/new",
                icon: <BookOpenIcon />,
            },
        ],
    },
    {
        label: "Account",
        items: [
            {
                title: "Credits & Wallet",
                path: "/dashboard/student/wallet",
                icon: <WalletIcon />,
            },
        ],
    },
];

// ==========================================
// TEACHER NAVIGATION
// ==========================================
export const teacherNavGroups: SidebarNavGroup[] = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                path: "/dashboard/teacher",
                icon: <LayoutDashboardIcon />,
                isActive: true,
            },
            {
                title: "My Schedule",
                path: "/dashboard/teacher/schedule",
                icon: <ClockIcon />,
            },
        ],
    },
    {
        label: "Opportunities",
        items: [
            {
                title: "Browse Requests", 
                path: "/dashboard/teacher/requests",
                icon: <SearchIcon />,
            },
            {
                title: "Active Sessions",
                path: "/dashboard/teacher/sessions",
                icon: <VideoIcon />,
            },
            {
                title: "My Students",
                path: "/dashboard/teacher/students",
                icon: <UsersIcon />,
            },
        ],
    },
    {
        label: "Account",
        items: [
            {
                title: "Earnings",
                path: "/dashboard/teacher/earnings",
                icon: <CoinsIcon />,
            },
            {
                title: "Teacher Profile",
                path: "/dashboard/teacher/profile",
                icon: <GraduationCapIcon />,
            },
        ],
    },
];

// ==========================================
// SHARED NAVIGATION (Settings & Footer)
// ==========================================
export const sharedSettingsGroup: SidebarNavGroup = {
    label: "Settings",
    items: [
        {
            title: "Account Settings",
            path: "/settings/account",
            icon: <SettingsIcon />,
            subItems: [
                { title: "Profile", path: "/settings/profile" },
                { title: "Notifications", path: "/settings/notifications" },
                { title: "Security", path: "/settings/security" },
            ],
        },
    ],
};

export const footerNavLinks: SidebarNavItem[] = [
    {
        title: "QuickSolve Help",
        path: "/help",
        icon: <HelpCircleIcon />,
    },
    {
        title: "Platform Status",
        path: "/status",
        icon: <ActivityIcon />,
    },
];

// Utility to combine links for global searching or routing logic
export const getAllNavLinks = (role: "STUDENT" | "TEACHER"): SidebarNavItem[] => {
    const roleGroups = role === "STUDENT" ? studentNavGroups : teacherNavGroups;
    
    return [
        ...roleGroups.flatMap((group) =>
            group.items.flatMap((item) =>
                item.subItems?.length ? [item, ...item.subItems] : [item]
            )
        ),
        ...sharedSettingsGroup.items.flatMap((item) =>
            item.subItems?.length ? [item, ...item.subItems] : [item]
        ),
        ...footerNavLinks,
    ];
};