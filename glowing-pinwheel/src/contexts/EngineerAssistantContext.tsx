"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface EngineerAssistantContextType {
    isOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
    initialQuery: string | null;
    openWithQuery: (query: string) => void;
    clearQuery: () => void;
}

const EngineerAssistantContext = createContext<EngineerAssistantContextType | null>(null);

export function EngineerAssistantProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState<string | null>(null);

    const openChat = useCallback(() => setIsOpen(true), []);
    const closeChat = useCallback(() => setIsOpen(false), []);
    const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

    const openWithQuery = useCallback((query: string) => {
        setInitialQuery(query);
        setIsOpen(true);
    }, []);

    const clearQuery = useCallback(() => setInitialQuery(null), []);

    return (
        <EngineerAssistantContext.Provider value={{
            isOpen,
            openChat,
            closeChat,
            toggleChat,
            initialQuery,
            openWithQuery,
            clearQuery
        }}>
            {children}
        </EngineerAssistantContext.Provider>
    );
}

export function useEngineerAssistant() {
    const context = useContext(EngineerAssistantContext);
    if (!context) {
        throw new Error("useEngineerAssistant must be used within EngineerAssistantProvider");
    }
    return context;
}
