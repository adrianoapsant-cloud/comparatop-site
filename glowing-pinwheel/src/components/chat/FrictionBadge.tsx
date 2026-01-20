"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { getFrictionSummary } from "@/lib/immunity/client-telemetry";

interface FrictionBadgeProps {
    onHelp: (message: string) => void;
}

const COOLDOWN_MS = 120000; // 2 minutes
const FRICTION_THRESHOLD = 60;
const HELP_MESSAGE = "Estou com dificuldade nessa página. Pode me orientar onde clicar e o que comparar?";

/**
 * FrictionBadge - Shows when user friction is detected (rage clicks, confusion scroll)
 * Offers a quick CTA to get help from the assistant
 */
export function FrictionBadge({ onHelp }: FrictionBadgeProps) {
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
                (now - lastShown > COOLDOWN_MS);

            if (shouldShow && !visible) {
                setVisible(true);
                setLastShown(now);
            }
        };

        const interval = setInterval(checkFriction, 1000);
        return () => clearInterval(interval);
    }, [visible, lastShown]);

    const handleHelp = () => {
        setVisible(false);
        onHelp(HELP_MESSAGE);
    };

    const handleDismiss = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="px-4 py-2 bg-amber-900/40 border-b border-amber-700/40 animate-fadeIn">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="font-medium">
                        Fricção detectada
                    </span>
                    <span className="text-amber-500/70 text-[10px]">
                        (score: {frictionScore})
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleHelp}
                        className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-100 bg-amber-800/50 hover:bg-amber-700/50 px-2 py-1 rounded transition-colors"
                    >
                        <HelpCircle className="w-3 h-3" />
                        Quer ajuda?
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="text-amber-500/60 hover:text-amber-400 text-xs px-1"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
