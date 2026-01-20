"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, HelpCircle, X } from "lucide-react";
import { getFrictionSummary } from "@/lib/immunity/client-telemetry";
import { useChat } from "@/contexts/ChatContext";

const COOLDOWN_MS = 120000; // 2 minutes
const FRICTION_THRESHOLD = 60;
const HELP_MESSAGE = "Estou com dificuldade nessa página. Pode me orientar onde clicar e o que comparar?";

/**
 * FrictionNudge - Floating nudge that appears outside the chat
 * when user friction is detected (rage clicks, confusion scroll)
 */
export function FrictionNudge() {
    const { openOverlay, sendMessage, isOpen } = useChat();
    const [visible, setVisible] = useState(false);
    const [lastShown, setLastShown] = useState(0);
    const [frictionScore, setFrictionScore] = useState(0);

    // Poll friction score periodically
    useEffect(() => {
        const checkFriction = () => {
            const summary = getFrictionSummary();
            setFrictionScore(summary.score);

            const now = Date.now();
            const shouldShow = summary.score >= FRICTION_THRESHOLD &&
                (now - lastShown > COOLDOWN_MS) &&
                !isOpen; // Don't show if chat is already open

            if (shouldShow && !visible) {
                setVisible(true);
                setLastShown(now);
            }
        };

        const interval = setInterval(checkFriction, 1000);
        return () => clearInterval(interval);
    }, [visible, lastShown, isOpen]);

    const handleHelp = () => {
        setVisible(false);
        openOverlay(); // Open the chat
        // Small delay to ensure chat is open before sending
        setTimeout(() => {
            sendMessage(HELP_MESSAGE);
        }, 300);
    };

    const handleDismiss = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-24 right-6 z-50 animate-slideUp">
            <div className="bg-amber-900/95 backdrop-blur-sm border border-amber-600/50 rounded-xl shadow-2xl p-4 max-w-xs">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-800/50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-amber-100 mb-1">
                            Parece que você está com dificuldade
                        </p>
                        <p className="text-xs text-amber-300/80 mb-3">
                            Posso ajudar a encontrar o que você procura?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleHelp}
                                className="flex items-center gap-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                                Sim, me ajude
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="text-xs text-amber-400/70 hover:text-amber-300 px-2"
                            >
                                Não, obrigado
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-amber-500/50 hover:text-amber-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
