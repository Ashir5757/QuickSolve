import type React from "react";

export const LogoIcon = (props: React.ComponentProps<"svg">) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Lightning Bolt Icon representing "Quick Solve" */}
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

export const Logo = (props: React.ComponentProps<"svg">) => (
    <svg
        fill="currentColor"
        viewBox="0 0 140 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        {/* Lightning Bolt Icon */}
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        
        {/* QuickSolve Text */}
        <text 
            x="28" 
            y="17" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="600" 
            fontSize="23"
            letterSpacing="-0.5"
        >
            QuickSolve
        </text>
    </svg>
);