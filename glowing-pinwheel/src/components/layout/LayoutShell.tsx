"use client";

import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
    children: React.ReactNode;
    header: React.ReactNode;
    footer?: React.ReactNode;
    mobileNav?: React.ReactNode;
    comparisonBar?: React.ReactNode;
    chatAssistant?: React.ReactNode;
}

/**
 * LayoutShell - Client component that manages layout based on chat mode
 * 
 * This component wraps the main content and adjusts margins/visibility
 * based on the current chat layout mode (split, focus, etc.)
 */
export function LayoutShell({
    children,
    header,
    footer,
    mobileNav,
    comparisonBar,
    chatAssistant
}: LayoutShellProps) {
    const { isSplit, layoutMode } = useChat();

    // In focus mode, hide everything except chat
    if (layoutMode === "focus") {
        return (
            <>
                {chatAssistant}
            </>
        );
    }

    return (
        <>
            {/* Header - adjusts with split mode */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isSplit && "mr-[420px] md:mr-[480px]"
            )}>
                {header}
            </div>

            {/* Main Content - adjusts with split mode */}
            <main className={cn(
                "transition-all duration-300 ease-in-out",
                isSplit && "mr-[420px] md:mr-[480px]"
            )}>
                {children}
            </main>

            {/* Footer elements - adjust with split mode */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isSplit && "mr-[420px] md:mr-[480px]"
            )}>
                {comparisonBar}
                {mobileNav}
            </div>

            {/* Chat Assistant - always on top */}
            {chatAssistant}
        </>
    );
}
