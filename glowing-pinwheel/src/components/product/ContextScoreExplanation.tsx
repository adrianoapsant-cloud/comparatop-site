'use client';

/**
 * @file ContextScoreExplanation.tsx
 * @description User-facing component to explain contextual scoring
 * 
 * v2.1.0 Updates:
 * - Shows BASE score (from general_use) as primary
 * - Shows DELTA when a specific context is selected
 * - Clear visual distinction between base and contextual scores
 * 
 * @version 2.1.0 (Unified HMUM as Single Engine)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ThumbsUp,
    ThumbsDown,
    AlertTriangle,
    XCircle,
    Sparkles,
    Info,
    TrendingUp,
    TrendingDown,
    Minus,
} from 'lucide-react';

import type { UnifiedScoringResult, UnifiedBreakdownItem } from '@/lib/scoring/unified-processor';

// ============================================
// TYPES
// ============================================

export interface ContextScoreExplanationProps {
    /** Unified scoring result */
    result: UnifiedScoringResult;
    /** Context names for display */
    contextNames?: string[];
    /** Available contexts for switching */
    availableContexts?: { id: string; name: string; icon?: string }[];
    /** Callback when contexts change (now accepts array) */
    onContextChange?: (contextIds: string[]) => void;
    /** Currently selected context IDs (now array for multi-select) */
    selectedContextIds?: string[];
    /** Compact mode for smaller displays */
    compact?: boolean;
}

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * Progress bar for attribute utility.
 */
function UtilityProgress({
    label,
    utility,
    value,
    isStrength,
}: {
    label: string;
    utility: number;
    value: unknown;
    isStrength: boolean;
}) {
    const percent = Math.round(utility * 100);

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {label}
                    </span>
                    <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                        {formatValue(value)}
                    </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`h-full rounded-full ${isStrength
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                            : 'bg-gradient-to-r from-amber-400 to-red-500'
                            }`}
                    />
                </div>
            </div>
            <span className={`text-sm font-bold w-10 text-right ${isStrength ? 'text-emerald-600' : 'text-red-500'
                }`}>
                {percent}%
            </span>
        </div>
    );
}

/**
 * Format raw value for display.
 */
function formatValue(value: unknown): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'number') {
        if (value > 1000) return value.toLocaleString('pt-BR');
        return value.toString();
    }
    return String(value);
}

/**
 * Fatal incompatibility alert.
 */
function FatalAlert({ reason }: { reason: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg"
        >
            <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-lg">Produto Incompatível</h4>
                    <p className="text-red-100 text-sm mt-1">{reason}</p>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Penalty badge.
 */
function PenaltyBadge({ reason, impact }: { reason: string; impact: number }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-xs text-amber-800 dark:text-amber-200">
                {reason}
            </span>
            <span className="text-xs font-bold text-amber-600 ml-auto">
                -{impact}%
            </span>
        </div>
    );
}

/**
 * Delta indicator component.
 */
function DeltaIndicator({ delta }: { delta: number }) {
    if (Math.abs(delta) < 0.1) {
        return (
            <div className="flex items-center gap-1 text-slate-500">
                <Minus className="w-4 h-4" />
                <span className="text-sm font-medium">Sem alteração</span>
            </div>
        );
    }

    const isPositive = delta > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive
        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
        : 'text-red-600 bg-red-50 dark:bg-red-900/30';

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${colorClass}`}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-bold">
                {isPositive ? '+' : ''}{delta.toFixed(1)}
            </span>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * ContextScoreExplanation - User-friendly score explanation
 * 
 * Now shows:
 * - Base score (from general_use) as primary
 * - Contextual score + delta when a context is selected
 */
export function ContextScoreExplanation({
    result,
    contextNames,
    availableContexts = [],
    onContextChange,
    selectedContextIds = [],
    compact = false,
}: ContextScoreExplanationProps) {
    const [isExpanded, setIsExpanded] = useState(!compact);

    // Determine if we're showing base or contextual score
    const isShowingContext = selectedContextIds.length > 0;
    const displayScore = isShowingContext ? result.contextualScore : result.baseScore;
    const showDelta = isShowingContext && Math.abs(result.delta) >= 0.1;

    // Handle checkbox toggle
    const handleContextToggle = (contextId: string) => {
        if (!onContextChange) return;
        const newIds = selectedContextIds.includes(contextId)
            ? selectedContextIds.filter(id => id !== contextId)
            : [...selectedContextIds, contextId];
        onContextChange(newIds);
    };

    // If fatal, show only the alert
    if (result.isFatal && result.fatalReason) {
        return (
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                Score Base: {result.baseScore.toFixed(1)}/10
                            </span>
                        </div>
                    </div>
                    <FatalAlert reason={result.fatalReason} />
                </div>
            </div>
        );
    }

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 6) return 'text-green-600 dark:text-green-400';
        if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    // Get score bg
    const getScoreBg = (score: number) => {
        if (score >= 8) return 'from-emerald-500/10 to-emerald-600/5';
        if (score >= 6) return 'from-green-500/10 to-green-600/5';
        if (score >= 4) return 'from-yellow-500/10 to-yellow-600/5';
        return 'from-red-500/10 to-red-600/5';
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {/* Header with Score */}
            <div className={`bg-gradient-to-r ${getScoreBg(displayScore)} p-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                {isShowingContext ? 'Score Contextual' : 'Score Contextual'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {isShowingContext ? (
                                    <>
                                        Contextos: <span className="font-medium text-purple-600 dark:text-purple-400">
                                            {result.contextNames?.join(', ') || contextNames?.join(', ')}
                                        </span>
                                    </>
                                ) : (
                                    <>Marque seus usos para ver score personalizado</>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-3">
                            <span className={`text-3xl font-black ${getScoreColor(displayScore)}`}>
                                {displayScore.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-500">/10</span>
                        </div>
                        {/* Show delta if context is selected */}
                        {showDelta && (
                            <div className="mt-1">
                                <DeltaIndicator delta={result.delta} />
                            </div>
                        )}
                    </div>
                </div>

                {availableContexts.length > 0 && onContextChange && (
                    <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                        <label className="text-xs text-slate-500 block mb-2">
                            Marque seus usos (pode combinar):
                        </label>
                        <div className="space-y-2">
                            {availableContexts.map(ctx => {
                                const isSelected = selectedContextIds.includes(ctx.id);
                                return (
                                    <label
                                        key={ctx.id}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected
                                            ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
                                            : 'bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleContextToggle(ctx.id)}
                                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-lg">{ctx.icon}</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {ctx.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        {selectedContextIds.length > 1 && (
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Modo Híbrido: exigências máximas de cada perfil, sem concessões
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Expand/Collapse Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <span>Ver detalhes da avaliação</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {/* Strengths */}
                            {result.strengths.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ThumbsUp className="w-4 h-4 text-emerald-500" />
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                            Pontos Fortes
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        {result.strengths.slice(0, 3).map((item) => (
                                            <UtilityProgress
                                                key={item.id}
                                                label={item.label}
                                                utility={item.utility}
                                                value={item.value}
                                                isStrength={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Weaknesses */}
                            {result.weaknesses.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ThumbsDown className="w-4 h-4 text-red-500" />
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                            Pontos Fracos
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        {result.weaknesses.slice(0, 3).map((item) => (
                                            <UtilityProgress
                                                key={item.id}
                                                label={item.label}
                                                utility={item.utility}
                                                value={item.value}
                                                isStrength={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Penalties */}
                            {result.penalties.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                            Penalidades
                                        </h4>
                                    </div>
                                    <div className="space-y-1.5">
                                        {result.penalties.map((penalty, i) => (
                                            <PenaltyBadge
                                                key={i}
                                                reason={penalty.reason}
                                                impact={penalty.impact}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Engine Info */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Info className="w-3 h-3" />
                                    <span>
                                        Motor: {result.engine === 'hmum-v4-geo'
                                            ? 'HMUM v4.0 (Geo-Restrictive)'
                                            : result.engine === 'hmum'
                                                ? 'HMUM v3.0 (Unificado)'
                                                : 'Legado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// COMPACT VERSION
// ============================================

/**
 * Compact version for sidebars or cards.
 */
export function ContextScoreCompact({
    result,
    contextName,
}: {
    result: UnifiedScoringResult;
    contextName?: string;
}) {
    if (result.isFatal) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Incompatível
                </span>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        if (score >= 6) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (score >= 4) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    return (
        <div className={`rounded-lg px-3 py-2 flex items-center justify-between ${getScoreColor(result.baseScore)}`}>
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 opacity-70" />
                <span className="text-sm font-medium">
                    {contextName ?? 'Score'}
                </span>
            </div>
            <span className="text-lg font-black">
                {result.baseScore.toFixed(1)}
            </span>
        </div>
    );
}

export default ContextScoreExplanation;
