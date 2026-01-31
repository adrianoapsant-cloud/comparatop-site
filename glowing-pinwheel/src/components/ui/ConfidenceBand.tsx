'use client';

/**
 * ConfidenceBand - Displays a metric value with optional confidence range and level
 * 
 * Uses existing ct-* classes for consistent styling.
 * Fallback: If no range/confidence, renders as simple value display.
 * 
 * @example
 * <ConfidenceBand
 *   label="Nota Contextual"
 *   valueText="6,8/10"
 *   range={[6.3, 7.2]}
 *   rangeText="6,3–7,2"
 *   confidenceLevel="medium"
 *   confidenceNote="Baseado em VOC e specs confirmadas."
 * />
 */

import React from 'react';
import { ConfidenceLevel, getConfidenceLabel } from '@/lib/metrics/confidence';

interface ConfidenceBandProps {
    /** Label for the metric (e.g., "Nota Contextual", "TCO 5 anos") */
    label: string;
    /** Formatted value text (e.g., "6,8/10", "R$ 3.450") */
    valueText: string;
    /** Raw numeric range [min, max] for potential scale calculations */
    range?: [number, number] | null;
    /** Formatted range text (e.g., "6,3–7,2") */
    rangeText?: string | null;
    /** Confidence level for chip display */
    confidenceLevel?: ConfidenceLevel | null;
    /** Short confidence note (1 sentence) */
    confidenceNote?: string | null;
    /** Optional: show compact variant without card wrapper */
    compact?: boolean;
}

export function ConfidenceBand({
    label,
    valueText,
    range,
    rangeText,
    confidenceLevel,
    confidenceNote,
    compact = false,
}: ConfidenceBandProps) {
    const hasRange = range && rangeText;
    const hasConfidence = confidenceLevel != null;
    const hasNote = confidenceNote != null && confidenceNote.length > 0;

    // If no extra data, render minimal display
    const hasExtendedData = hasRange || hasConfidence || hasNote;

    // Confidence chip class based on level
    const confidenceChipClass = confidenceLevel
        ? `ct-chip ${confidenceLevel === 'high'
            ? 'ct-evidence--high'
            : confidenceLevel === 'low'
                ? 'ct-evidence--low'
                : 'ct-evidence--med'
        }`
        : 'ct-chip';

    // Compact variant for inline use
    if (compact) {
        return (
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-lg font-semibold text-gray-900">{valueText}</span>
                {hasRange && (
                    <span className="text-xs text-gray-500">
                        Faixa: {rangeText}
                    </span>
                )}
                {hasConfidence && (
                    <span className={confidenceChipClass}>
                        <span className="ct-chip-label">Confiança:</span>
                        <span className="ct-chip-value">{getConfidenceLabel(confidenceLevel)}</span>
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="ct-card-soft p-4 space-y-3">
            {/* Header: Label + Value */}
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-xl font-semibold text-gray-900">{valueText}</span>
            </div>

            {hasRange && (
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Faixa estimada</span>
                    <span className="font-medium">{rangeText}</span>
                </div>
            )}

            {/* Confidence Chip + Note */}
            {(hasConfidence || hasNote) && (
                <div className="flex items-start gap-2 flex-wrap">
                    {hasConfidence && (
                        <span className={confidenceChipClass}>
                            <span className="ct-chip-label">Confiança:</span>
                            <span className="ct-chip-value">{getConfidenceLabel(confidenceLevel)}</span>
                        </span>
                    )}
                    {hasNote && (
                        <span className="text-xs text-gray-500 leading-snug flex-1">
                            {confidenceNote}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================
// Formatting Helpers (pt-BR)
// ============================================

/**
 * Format a score range as text (1 decimal place)
 */
export function formatScoreRange(range: [number, number] | null | undefined): string | null {
    if (!range) return null;
    const [min, max] = range;
    return `${min.toFixed(1).replace('.', ',')}–${max.toFixed(1).replace('.', ',')}`;
}

/**
 * Format a currency range as text (BRL)
 */
export function formatCurrencyRange(range: [number, number] | null | undefined): string | null {
    if (!range) return null;
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const [min, max] = range;
    return `${formatter.format(min)}–${formatter.format(max)}`;
}

/**
 * Format a single score value (1 decimal place)
 */
export function formatScoreValue(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number' || isNaN(value)) return '—';
    return value.toFixed(1).replace('.', ',');
}

/**
 * Format a single currency value (BRL)
 */
export function formatCurrencyValue(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number' || isNaN(value)) return '—';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default ConfidenceBand;
