'use client';

/**
 * @file HMUMDebugger.tsx
 * @description Visual Debug Component for HMUM Evaluation
 * 
 * This component provides a "laboratory" view to:
 * 1. Switch between contexts and see score changes
 * 2. Visualize utility breakdown for each attribute
 * 3. Identify fatal constraints and penalties
 * 
 * @usage
 * Place at /admin/hmum-lab or embed in product page for debugging.
 * 
 * @version 2.0.0 (HMUM Architecture)
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronDown,
    Zap,
    Info,
} from 'lucide-react';

import type { EvaluationResult, CategoryHMUMConfig, UserContext } from '@/lib/scoring/hmum-types';
import { evaluateProductContext } from '@/lib/scoring/hmum-engine';
import { mapProductToHMUM } from '@/lib/scoring/hmum-adapter';
import type { Product, ScoredProduct } from '@/types/category';

// ============================================
// TYPES
// ============================================

export interface HMUMDebuggerProps {
    /** Product to evaluate (legacy format) */
    product: Product | ScoredProduct;
    /** HMUM configuration for the category */
    categoryConfig: CategoryHMUMConfig;
    /** Initial context to display */
    initialContextId?: string;
    /** User's infrastructure settings */
    userSettings?: {
        voltage?: 110 | 220 | 'bivolt';
        locationType?: 'coastal' | 'inland';
    };
}

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * Score display with color gradient.
 */
function ScoreDisplay({ score, isIncompatible }: { score: number; isIncompatible: boolean }) {
    // Color gradient: 0-4 red, 4-6 yellow, 6-8 green, 8-10 emerald
    const getScoreColor = (s: number) => {
        if (isIncompatible) return 'from-red-600 to-red-800';
        if (s >= 8) return 'from-emerald-500 to-emerald-700';
        if (s >= 6) return 'from-green-500 to-green-700';
        if (s >= 4) return 'from-yellow-500 to-yellow-700';
        return 'from-red-500 to-red-700';
    };

    return (
        <div className={`
            relative overflow-hidden rounded-2xl p-6 text-center
            bg-gradient-to-br ${getScoreColor(score)}
            shadow-lg
        `}>
            {isIncompatible ? (
                <div className="flex flex-col items-center gap-2">
                    <XCircle className="w-12 h-12 text-white/90" />
                    <span className="text-4xl font-bold text-white">INCOMPATÍVEL</span>
                </div>
            ) : (
                <>
                    <span className="text-6xl font-black text-white drop-shadow-lg">
                        {score.toFixed(1)}
                    </span>
                    <span className="block text-white/80 text-sm mt-1">de 10</span>
                </>
            )}
        </div>
    );
}

/**
 * Utility bar for attribute visualization.
 */
function UtilityBar({
    label,
    utility,
    weight,
    contribution,
    rawValue,
}: {
    label: string;
    utility: number;
    weight: number;
    contribution: number;
    rawValue: unknown;
}) {
    const utilityPercent = Math.round(utility * 100);
    const weightPercent = Math.round(weight * 100);

    // Color based on utility
    const getBarColor = (u: number) => {
        if (u >= 0.8) return 'bg-emerald-500';
        if (u >= 0.6) return 'bg-green-500';
        if (u >= 0.4) return 'bg-yellow-500';
        if (u >= 0.2) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </span>
                <span className="text-slate-500 text-xs">
                    raw: {String(rawValue ?? 'N/A')} | peso: {weightPercent}%
                </span>
            </div>

            {/* Utility bar */}
            <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${utilityPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`absolute left-0 top-0 h-full ${getBarColor(utility)} rounded-full`}
                />
                <span className="absolute right-2 top-0 h-full flex items-center text-xs font-bold text-white drop-shadow">
                    {utilityPercent}%
                </span>
            </div>

            {/* Contribution indicator */}
            <div className="flex justify-end mt-0.5">
                <span className="text-xs text-slate-400">
                    contribuição: {(contribution * 100).toFixed(1)}%
                </span>
            </div>
        </div>
    );
}

/**
 * Warning/Penalty badge.
 */
function PenaltyBadge({
    reason,
    factor,
    severity,
}: {
    reason: string;
    factor: number;
    severity: 'low' | 'medium' | 'high';
}) {
    const severityColors = {
        low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        medium: 'bg-orange-100 text-orange-800 border-orange-300',
        high: 'bg-red-100 text-red-800 border-red-300',
    };

    const penalty = Math.round((1 - factor) * 100);

    return (
        <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border
            ${severityColors[severity]}
        `}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{reason}</span>
            <span className="ml-auto font-bold text-sm">-{penalty}%</span>
        </div>
    );
}

/**
 * Fatal constraint alert.
 */
function FatalAlert({ reasons }: { reasons: { reason: string }[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-4"
        >
            <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-red-800 dark:text-red-400">
                    Produto Incompatível
                </h3>
            </div>
            <ul className="space-y-1 ml-9">
                {reasons.map((r, i) => (
                    <li key={i} className="text-red-700 dark:text-red-300 text-sm">
                        • {r.reason}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * HMUMDebugger: Visual laboratory for HMUM evaluation.
 */
export function HMUMDebugger({
    product,
    categoryConfig,
    initialContextId,
    userSettings,
}: HMUMDebuggerProps) {
    // State
    const [selectedContextId, setSelectedContextId] = useState(
        initialContextId ?? categoryConfig.contexts[0]?.id ?? 'general'
    );
    const [showBreakdown, setShowBreakdown] = useState(true);

    // Map product to HMUM format
    const hmumProduct = useMemo(
        () => mapProductToHMUM(product, categoryConfig),
        [product, categoryConfig]
    );

    // Build user context
    const userContext: UserContext = useMemo(() => ({
        contextId: selectedContextId,
        voltage: userSettings?.voltage,
        locationType: userSettings?.locationType,
    }), [selectedContextId, userSettings]);

    // Evaluate
    const evaluationResult = useMemo(() => {
        return evaluateProductContext(
            hmumProduct as Record<string, unknown>,
            categoryConfig,
            userContext,
            { debug: false }
        );
    }, [hmumProduct, categoryConfig, userContext]);

    // Get current context config
    const currentContext = categoryConfig.contexts.find(c => c.id === selectedContextId);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">
                        HMUM Debugger
                    </h2>
                </div>
                <p className="text-purple-200 text-sm mt-1">
                    {product.name}
                </p>
            </div>

            {/* Context Selector */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contexto de Uso
                </label>
                <div className="relative">
                    <select
                        value={selectedContextId}
                        onChange={(e) => setSelectedContextId(e.target.value)}
                        className="
                            w-full appearance-none bg-slate-100 dark:bg-slate-800 
                            border border-slate-300 dark:border-slate-600 
                            rounded-lg px-4 py-3 pr-10
                            text-slate-800 dark:text-slate-200
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            cursor-pointer
                        "
                    >
                        {categoryConfig.contexts.map(context => (
                            <option key={context.id} value={context.id}>
                                {context.icon} {context.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                {currentContext?.description && (
                    <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {currentContext.description}
                    </p>
                )}
            </div>

            {/* Score Display */}
            <div className="p-4">
                <ScoreDisplay
                    score={evaluationResult.displayScore}
                    isIncompatible={evaluationResult.isIncompatible}
                />
            </div>

            {/* Fatal Alerts */}
            {evaluationResult.isIncompatible && (
                <div className="px-4 pb-4">
                    <FatalAlert reasons={evaluationResult.fatalReasons} />
                </div>
            )}

            {/* Penalties Applied */}
            {!evaluationResult.isIncompatible && evaluationResult.appliedPenalties.length > 0 && (
                <div className="px-4 pb-4">
                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2 text-sm">
                        Penalidades Aplicadas
                    </h3>
                    <div className="space-y-2">
                        {evaluationResult.appliedPenalties.map((penalty, i) => (
                            <PenaltyBadge
                                key={i}
                                reason={penalty.reason}
                                factor={penalty.factor}
                                severity={penalty.severity}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Breakdown Toggle */}
            <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full px-4 py-3 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <span className="font-medium text-sm">
                        Breakdown de Utilidades
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {showBreakdown && !evaluationResult.isIncompatible && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4">
                                {evaluationResult.utilityBreakdown.map((item) => (
                                    <UtilityBar
                                        key={item.id}
                                        label={item.label}
                                        utility={item.utility}
                                        weight={item.weight}
                                        contribution={item.contribution}
                                        rawValue={item.rawValue}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Metadata Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>
                        Atributos: {evaluationResult.metadata?.attributesEvaluated ?? 0}
                    </span>
                    {evaluationResult.metadata?.missingAttributes &&
                        evaluationResult.metadata.missingAttributes.length > 0 && (
                            <span className="text-amber-600">
                                Faltando: {evaluationResult.metadata.missingAttributes.length}
                            </span>
                        )}
                    <span>
                        v{evaluationResult.metadata?.engineVersion ?? '2.0'}
                    </span>
                </div>
            </div>

            {/* Pre-penalty vs Final comparison */}
            {!evaluationResult.isIncompatible && evaluationResult.appliedPenalties.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                            Score antes das penalidades:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {(evaluationResult.prepenaltyScore * 10).toFixed(1)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-slate-600 dark:text-slate-400">
                            Score final:
                        </span>
                        <span className="font-bold text-purple-600">
                            {evaluationResult.displayScore.toFixed(1)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HMUMDebugger;
