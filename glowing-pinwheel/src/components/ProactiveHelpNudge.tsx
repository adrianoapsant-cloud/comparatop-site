"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { getBehaviorSignals, resetBehaviorSignals, isSignalsActive } from "@/lib/behavior/signals";

interface ProactiveHelpNudgeProps {
    /** Callback when user wants to open chat */
    onOpenChat?: (message?: string) => void;
    /** Threshold score to trigger nudge (default 60) */
    threshold?: number;
    /** Cooldown in ms (default 2 minutes) */
    cooldownMs?: number;
}

const DEFAULT_MESSAGE = "Estou com dificuldade nessa página. Pode me orientar onde clicar e o que comparar?";

/**
 * ProactiveHelpNudge - Shows a subtle help offer when user seems confused
 */
export function ProactiveHelpNudge({
    onOpenChat,
    threshold = 60,
    cooldownMs = 2 * 60 * 1000 // 2 minutes
}: ProactiveHelpNudgeProps) {
    const [show, setShow] = useState(false);
    const [lastShown, setLastShown] = useState(0);
    const [aboveThresholdSince, setAboveThresholdSince] = useState<number | null>(null);

    // Check feature flag
    const isEnabled = typeof window !== 'undefined' &&
        process.env.NEXT_PUBLIC_CHAT_PROACTIVE === '1';

    const checkConfusion = useCallback(() => {
        if (!isEnabled) return;
        if (!isSignalsActive()) return;

        const now = Date.now();

        // Check cooldown
        if (now - lastShown < cooldownMs) return;

        const signals = getBehaviorSignals();

        if (signals.confusionScore >= threshold) {
            if (aboveThresholdSince === null) {
                setAboveThresholdSince(now);
            } else if (now - aboveThresholdSince >= 3000) {
                // Above threshold for 3 seconds
                setShow(true);
                setLastShown(now);
                setAboveThresholdSince(null);
            }
        } else {
            setAboveThresholdSince(null);
        }
    }, [isEnabled, lastShown, cooldownMs, threshold, aboveThresholdSince]);

    useEffect(() => {
        if (!isEnabled) return;

        const interval = setInterval(checkConfusion, 1000);
        return () => clearInterval(interval);
    }, [isEnabled, checkConfusion]);

    const handleOpenChat = () => {
        setShow(false);
        resetBehaviorSignals();
        onOpenChat?.(DEFAULT_MESSAGE);
    };

    const handleDismiss = () => {
        setShow(false);
        setLastShown(Date.now()); // Apply cooldown on dismiss too
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-24 right-4 z-40 animate-in slide-in-from-right fade-in duration-300">
            <div className="bg-white shadow-xl rounded-2xl border border-violet-200 p-4 max-w-xs">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Fechar"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                            Posso te ajudar?
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                            Parece que você está procurando algo. Quer que eu oriente?
                        </p>
                        <button
                            onClick={handleOpenChat}
                            className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                        >
                            Abrir chat →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
