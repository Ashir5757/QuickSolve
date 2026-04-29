import type React from "react";

// Renamed back to LogoIcon for your Sidebar
export const LogoIcon = (props: React.ComponentProps<"svg">) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export const Logo = (props: React.ComponentProps<"svg">) => (
    <svg
        viewBox="0 0 160 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 20l-1-8H3l9-12 1 8h9l-9 12z" />
        <text 
            x="32" 
            y="18" 
            fontFamily="system-ui, sans-serif" 
            fontWeight="bold" 
            fontSize="22"
        >
            QuickSolve
        </text>
    </svg>
);