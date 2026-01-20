'use client';

import { XCircle } from 'lucide-react';

// ============================================
// DON'T BUY IF - ANTI-SALE COMPONENT
// ============================================

interface DontBuyIfProps {
    /** List of scenarios where this product is NOT recommended */
    reasons: string[];
}

export function DontBuyIf({ reasons }: DontBuyIfProps) {
    if (!reasons || reasons.length === 0) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
                <XCircle size={18} className="text-red-600" />
                <h3 className="font-display font-semibold text-red-800 text-sm">
                    Não Compre Se:
                </h3>
            </div>
            <ul className="space-y-2">
                {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="text-red-400 font-bold">✕</span>
                        <span>{reason}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
