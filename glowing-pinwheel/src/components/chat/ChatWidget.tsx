"use client";

import { useState } from "react";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";

type WidgetMode = "closed" | "minimized" | "expanded";

/**
 * Floating Chat Widget
 * 
 * Connects to the AI Consultant running at localhost:3001
 * Starts minimized as a floating button, expands to iframe
 */
export function ChatWidget() {
    const [mode, setMode] = useState<WidgetMode>("closed");

    // Chat URL - in production, replace with actual domain
    const CHAT_URL = "http://localhost:3001";

    if (mode === "closed") {
        return (
            <button
                onClick={() => setMode("expanded")}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
                aria-label="Abrir Consultor AI"
            >
                <MessageCircle className="w-7 h-7 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-[10px] text-white font-bold">AI</span>
                </span>

                {/* Tooltip */}
                <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    💬 Consultor Técnico AI
                </div>
            </button>
        );
    }

    return (
        <div
            className={`fixed z-50 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transition-all duration-300 ${mode === "expanded"
                    ? "bottom-4 right-4 w-[420px] h-[600px]"
                    : "bottom-4 right-4 w-[350px] h-[60px]"
                }`}
        >
            {/* Header */}
            <div className="h-[60px] px-4 flex items-center justify-between bg-gradient-to-r from-violet-600/30 to-purple-700/30 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">Consultor Técnico</h3>
                        <p className="text-xs text-emerald-400">Online • AI ComparaTop</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setMode(mode === "expanded" ? "minimized" : "expanded")}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        aria-label={mode === "expanded" ? "Minimizar" : "Expandir"}
                    >
                        {mode === "expanded" ? (
                            <Minimize2 className="w-4 h-4 text-slate-300" />
                        ) : (
                            <Maximize2 className="w-4 h-4 text-slate-300" />
                        )}
                    </button>
                    <button
                        onClick={() => setMode("closed")}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-4 h-4 text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Chat Content (iframe) */}
            {mode === "expanded" && (
                <iframe
                    src={CHAT_URL}
                    className="w-full h-[calc(100%-60px)] border-0"
                    title="Consultor AI ComparaTop"
                />
            )}
        </div>
    );
}
