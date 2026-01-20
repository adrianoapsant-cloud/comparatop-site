"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, ArrowLeft, ShoppingBag, Minimize2 } from "lucide-react";
import { ChatCore } from "@/components/chat/ChatCore";
import { useChat } from "@/contexts/ChatContext";

/**
 * Inner component that uses searchParams
 * Wrapped in Suspense to avoid prerender errors
 */
function ChatPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { lastVisitedPage, openOverlay, messages, sendMessage } = useChat();

    // Handle query param from search bar
    useEffect(() => {
        const queryParam = searchParams.get('q');
        if (queryParam && messages.length === 0) {
            // Auto-send the query if coming from search
            sendMessage(decodeURIComponent(queryParam));
            // Clean up URL
            window.history.replaceState({}, '', '/chat');
        }
    }, [searchParams, messages.length, sendMessage]);

    const handleBackToShop = () => {
        // Navigate back and open sidebar with last message
        router.push(lastVisitedPage || "/");
        // Open sidebar after navigation
        setTimeout(() => openOverlay(), 500);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm">Voltar</span>
                    </Link>

                    <div className="w-px h-8 bg-slate-700" />

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
                                Modo Lab • Consultoria Profunda
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Minimize to sidebar button */}
                    <button
                        onClick={handleBackToShop}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">Voltar para a Loja</span>
                        <Minimize2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full">
                <ChatCore showHeader={false} className="h-[calc(100vh-64px)]" />
            </main>
        </div>
    );
}

/**
 * Immersive Chat Page - Modo Lab
 * 
 * Full-screen chat experience for deep consultations.
 * The user lands here when they need space for detailed analysis.
 */
export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
            </div>
        }>
            <ChatPageInner />
        </Suspense>
    );
}
