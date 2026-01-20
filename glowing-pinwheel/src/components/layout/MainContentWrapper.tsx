"use client";

import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

interface MainContentWrapperProps {
    children: React.ReactNode;
}

/**
 * MainContentWrapper - Adjusts the main content area based on chat mode
 * 
 * When chat is in "split" mode, this wrapper adds margin to the right
 * to make room for the chat panel, creating a side-by-side experience.
 */
export function MainContentWrapper({ children }: MainContentWrapperProps) {
    const { isSplit, layoutMode } = useChat();

    return (
        <div
            className={cn(
                "transition-all duration-300 ease-in-out",
                // In split mode, add margin for the chat panel
                isSplit && "mr-[420px] md:mr-[480px]",
                // In focus mode, hide the main content
                layoutMode === "focus" && "hidden"
            )}
        >
            {children}
        </div>
    );
}
