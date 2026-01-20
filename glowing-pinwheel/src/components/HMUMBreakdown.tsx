'use client';

/**
 * @file HMUMBreakdown.tsx
 * @description Component to display HMUM score breakdown
 * 
 * Shows the contribution of each criterion to the final score
 * with visual bars and optional warnings.
 */

import { useMemo } from 'react';
import type { Product } from '@/types/category';
import { getHMUMBreakdown, hasHMUMSupport, type HMUMResult } from '@/lib/getHMUMBreakdown';

interface HMUMBreakdownProps {
    product: Product;
    showWarnings?: boolean;
    className?: string;
}

/**
 * Display HMUM score breakdown for a product
 */
export function HMUMBreakdown({ product, showWarnings = true, className = '' }: HMUMBreakdownProps) {
    const breakdown = useMemo(() => {
        if (!hasHMUMSupport(product)) return null;
        return getHMUMBreakdown(product);
    }, [product]);

    if (!breakdown) {
        return null;
    }

    return (
        <div className={`hmum-breakdown ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Análise por Critério
                </h3>
                <span className="text-2xl font-bold text-emerald-600">
                    {breakdown.score.toFixed(1)}
                </span>
            </div>

            <div className="space-y-3">
                {breakdown.breakdown.map((item) => (
                    <CriterionBar key={item.criterionId} item={item} />
                ))}
            </div>

            {showWarnings && breakdown.warnings.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                        ⚠️ Avisos
                    </p>
                    <ul className="text-xs text-amber-700 space-y-1">
                        {breakdown.warnings.map((warning, i) => (
                            <li key={i}>• {warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            <p className="mt-4 text-xs text-gray-500">
                Score calculado via HMUM (Hybrid Multiplicative Utility Model)
            </p>
        </div>
    );
}

/**
 * Individual criterion bar
 */
function CriterionBar({ item }: { item: HMUMResult['breakdown'][0] }) {
    const percentage = (item.normalizedValue / 10) * 100;
    const hasVeto = item.flags.includes('VETO');
    const hasImputed = item.flags.includes('IMPUTED');

    const barColor = hasVeto
        ? 'bg-red-500'
        : item.normalizedValue >= 8
            ? 'bg-emerald-500'
            : item.normalizedValue >= 6
                ? 'bg-amber-500'
                : 'bg-red-400';

    return (
        <div className="criterion-bar">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                    {item.label}
                    {hasVeto && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                            VETO
                        </span>
                    )}
                    {hasImputed && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            Sem dado
                        </span>
                    )}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                    {item.normalizedValue.toFixed(1)}
                </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between mt-0.5">
                <span className="text-xs text-gray-400">
                    Peso: {(item.finalWeight * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-gray-400">
                    Contribuição: {item.contribution.toFixed(3)}
                </span>
            </div>
        </div>
    );
}

/**
 * Compact version for cards/lists
 */
export function HMUMScoreBadge({ product, className = '' }: { product: Product; className?: string }) {
    const breakdown = useMemo(() => {
        if (!hasHMUMSupport(product)) return null;
        return getHMUMBreakdown(product);
    }, [product]);

    if (!breakdown) {
        return null;
    }

    const hasVeto = breakdown.breakdown.some(b => b.flags.includes('VETO'));

    return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
            <span className={`
                px-2 py-1 text-sm font-bold rounded
                ${hasVeto ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}
            `}>
                {breakdown.score.toFixed(1)}
            </span>
            {hasVeto && (
                <span className="text-xs text-red-600">⚠️</span>
            )}
        </div>
    );
}

export default HMUMBreakdown;
