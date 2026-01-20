"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Brain, X, Maximize2, Minimize2, Columns2, PanelRightClose } from "lucide-react";
import { ChatCore } from "@/components/chat/ChatCore";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

/**
 * Engineer Assistant - Multi-Mode Chat Panel
 * 
 * Supports 3 layout modes:
 * 1. Overlay - Floating sidebar that covers content
 * 2. Split - Fixed panel that pushes content to the left
 * 3. Focus - Full-screen immersive mode (uses /chat route)
 */
export function EngineerAssistant() {
    const router = useRouter();
    const pathname = usePathname();
    const {
        layoutMode,
        setLayoutMode,
        openOverlay,
        openSplit,
        close,
        toggleSplit,
        setLastVisitedPage,
        isOpen
    } = useChat();

    const [showNudge, setShowNudge] = useState(false);
    const [nudgeDismissed, setNudgeDismissed] = useState(false);

    // Don't show on /chat page (that's the focus mode route)
    const isImmersivePage = pathname === "/chat";

    // Show nudge after 3 seconds (only once per session)
    useEffect(() => {
        if (nudgeDismissed || isImmersivePage || isOpen) return;

        const timer = setTimeout(() => {
            setShowNudge(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [nudgeDismissed, isImmersivePage, isOpen]);

    // Track last visited page for "back to shop" functionality
    useEffect(() => {
        if (!isImmersivePage && pathname) {
            setLastVisitedPage(pathname);
        }
    }, [pathname, isImmersivePage, setLastVisitedPage]);

    const dismissNudge = () => {
        setShowNudge(false);
        setNudgeDismissed(true);
    };

    const handleFocusMode = () => {
        close();
        router.push("/chat");
    };

    // Don't render on immersive page
    if (isImmersivePage) return null;

    return (
        <>
            {/* Floating Action Button - Only when closed */}
            {layoutMode === "closed" && (
                <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
                    {/* Nudge Balloon */}
                    {showNudge && (
                        <div className="animate-in slide-in-from-right-5 fade-in duration-500 flex items-center gap-2 bg-slate-800 border border-violet-500/30 rounded-2xl rounded-br-sm px-4 py-3 shadow-2xl max-w-[260px]">
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">
                                    🧠 Dúvida técnica?
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Pergunte ao Engenheiro.
                                </p>
                            </div>
                            <button
                                onClick={dismissNudge}
                                className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                                aria-label="Fechar"
                            >
                                <X className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                        </div>
                    )}

                    {/* FAB Button */}
                    <button
                        onClick={() => {
                            openOverlay();
                            dismissNudge();
                        }}
                        className="group w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 shadow-2xl shadow-violet-500/30 flex items-center justify-center hover:scale-105 transition-all duration-200 ring-2 ring-violet-400/20"
                        aria-label="Abrir Consultor Técnico"
                    >
                        <Brain className="w-7 h-7 text-white" />

                        {/* Online Indicator */}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </span>

                        {/* Hover Tooltip */}
                        <div className="absolute right-full mr-4 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                            <span className="text-violet-400 font-medium">Engenheiro Sênior</span>
                            <span className="text-slate-400 text-xs block">Clique para consultar</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Chat Panel - Overlay or Split Mode */}
            {(layoutMode === "overlay" || layoutMode === "split") && (
                <>
                    {/* Backdrop for overlay mode */}
                    {layoutMode === "overlay" && (
                        <div
                            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                            onClick={close}
                        />
                    )}

                    {/* Chat Panel */}
                    <div
                        className={cn(
                            "fixed top-0 right-0 h-full z-50 flex flex-col",
                            "bg-gradient-to-b from-slate-900 to-slate-950",
                            "border-l border-slate-700/50",
                            "transition-all duration-300 ease-in-out",
                            // Width based on mode
                            layoutMode === "overlay" && "w-[380px] md:w-[420px] shadow-2xl",
                            layoutMode === "split" && "w-[420px] md:w-[480px]"
                        )}
                    >
                        {/* Header with Window Controls */}
                        <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur">
                            <div className="flex items-center justify-between">
                                {/* Avatar and Status */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center ring-2 ring-violet-500/20">
                                        <Brain className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-semibold text-sm">Engenheiro Sênior</h2>
                                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                            {layoutMode === "split" ? "Modo Split" : "Online"}
                                        </p>
                                    </div>
                                </div>

                                {/* Window Controls */}
                                <div className="flex items-center gap-1">
                                    {/* Toggle Split */}
                                    <button
                                        onClick={toggleSplit}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            layoutMode === "split"
                                                ? "bg-violet-600/30 text-violet-300"
                                                : "hover:bg-slate-700/50 text-slate-400 hover:text-white"
                                        )}
                                        title={layoutMode === "split" ? "Voltar para Overlay" : "Dividir Tela"}
                                    >
                                        {layoutMode === "split" ? (
                                            <PanelRightClose className="w-4 h-4" />
                                        ) : (
                                            <Columns2 className="w-4 h-4" />
                                        )}
                                    </button>

                                    {/* Focus/Expand */}
                                    <button
                                        onClick={handleFocusMode}
                                        className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg transition-colors"
                                        title="Modo Foco (Tela Cheia)"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>

                                    {/* Close/Minimize */}
                                    <button
                                        onClick={close}
                                        className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg transition-colors"
                                        title="Minimizar"
                                    >
                                        <Minimize2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Core */}
                        <ChatCore showHeader={false} className="flex-1" />
                    </div>
                </>
            )}

            {/* Focus Mode - Full Screen (inline, not route) */}
            {layoutMode === "focus" && (
                <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
                    {/* Focus Header */}
                    <div className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center ring-2 ring-violet-500/20">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-white font-semibold">
                                        Engenheiro Sênior
                                    </h1>
                                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                        Modo Foco • Consultoria Profunda
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Exit Focus */}
                            <button
                                onClick={() => setLayoutMode("split")}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm"
                            >
                                <Columns2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Dividir Tela</span>
                            </button>
                            <button
                                onClick={close}
                                className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 max-w-4xl mx-auto w-full">
                        <ChatCore showHeader={false} className="h-full" />
                    </div>
                </div>
            )}
        </>
    );
}
