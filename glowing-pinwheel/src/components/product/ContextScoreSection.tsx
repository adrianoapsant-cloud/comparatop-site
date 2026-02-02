'use client';

/**
 * @file ContextScoreSection.tsx
 * @description Client-side wrapper for contextual scoring integration
 * 
 * Updated v3.0.0 - HMUM v4.0 Integration:
 * - Uses Weighted Geometric Mean instead of MAX for multi-context scoring
 * - Handles MutualExclusionError when conflicting contexts are selected
 * - Shows clear error message guiding user to deselect conflicting contexts
 */

import { useState, useMemo } from 'react';
import { ContextScoreExplanation } from './ContextScoreExplanation';
import {
    MutualExclusionError,
} from '@/lib/scoring/context-geo-restrictive';
// Use unified processor which preserves baseScore from product JSON
import {
    calculateUnifiedScore,
    getSelectableContexts,
    supportsContextualScoring,
} from '@/lib/scoring/unified-processor';
import type { Product, ScoredProduct } from '@/types/category';

export interface ContextScoreSectionProps {
    product: Product | ScoredProduct;
    initialContextId?: string;
    userSettings?: {
        voltage?: 110 | 220 | 'bivolt';
        locationType?: 'coastal' | 'inland';
    };
}

/**
 * ContextScoreSection - Client wrapper for contextual scoring
 * 
 * Architecture v3.0.0 - HMUM v4.0 (Geo-Restrictive):
 * - Uses Weighted Geometric Mean instead of MAX
 * - Properly penalizes products with critical weaknesses
 * - Prevents selection of mutually exclusive contexts (e.g., "Apartment" + "Large House")
 */
export function ContextScoreSection({
    product,
    initialContextId,
    userSettings,
}: ContextScoreSectionProps) {
    // Check if category supports HMUM
    const supportsContextual = supportsContextualScoring(product.categoryId);

    // Get selectable contexts (excludes general_use base context)
    const selectableContexts = useMemo(
        () => getSelectableContexts(product.categoryId),
        [product.categoryId]
    );

    // State for selected contexts (now array for multi-select)
    const [selectedContextIds, setSelectedContextIds] = useState<string[]>(
        initialContextId ? [initialContextId] : []
    );

    // State for mutual exclusion error
    const [exclusionError, setExclusionError] = useState<string | null>(null);

    // Calculate score with current contexts using Unified Processor
    // This preserves baseScore from product JSON (e.g., 8.11)
    const result = useMemo(() => {
        // Clear previous error
        setExclusionError(null);

        try {
            // Use unified processor which reads baseScore from product
            return calculateUnifiedScore(
                product,
                selectedContextIds,
                userSettings
            );
        } catch (error) {
            if (error instanceof MutualExclusionError) {
                // Convert IDs to friendly names
                const friendlyNames = error.conflictingContexts.map(id => {
                    const ctx = selectableContexts.find(c => c.id === id);
                    return ctx?.name || id;
                });
                // Set error state for UI display with friendly names
                setExclusionError(
                    `Você marcou "${friendlyNames.join('" e "')}" ao mesmo tempo. Esses usos são opostos — escolha apenas um.`
                );
                // Return fallback result (UnifiedScoringResult format)
                return {
                    finalScore: 0,
                    baseScore: 0,
                    contextualScore: 0,
                    delta: 0,
                    contextIds: selectedContextIds,
                    contextNames: [],
                    isFatal: false,
                    fatalReason: undefined,
                    engine: 'hmum-v4-geo' as const,
                    strengths: [],
                    weaknesses: [],
                    breakdown: [],
                    penalties: [],
                };
            }
            throw error;
        }
    }, [product, selectedContextIds, userSettings]);

    // UnifiedScoringResult já tem formato compatível com ContextScoreExplanation
    // Apenas adapta algumas propriedades menores
    const legacyResult = useMemo(() => {
        return {
            ...result,
            contextNames: selectedContextIds
                .map(id => selectableContexts.find(c => c.id === id)?.name ?? id),
        };
    }, [result, selectedContextIds, selectableContexts]);

    // Get context names for display
    const contextNames = selectedContextIds
        .map(id => selectableContexts.find(c => c.id === id)?.name ?? id)
        .filter(Boolean);

    // If category doesn't support contextual scoring, don't render
    if (!supportsContextual) {
        return null;
    }

    // Handler for context change (now receives array)
    const handleContextChange = (contextIds: string[]) => {
        setSelectedContextIds(contextIds);
        setExclusionError(null); // Clear error on new selection
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">
            {/* Error banner for mutual exclusion */}
            {exclusionError && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-amber-800">
                                Contextos Conflitantes
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                                {exclusionError}
                            </p>
                            <p className="text-xs text-amber-600 mt-2">
                                Desmarque um dos contextos abaixo para continuar.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Show eliminated product warning */}
            {result.isFatal && !exclusionError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🚫</span>
                        <div>
                            <p className="font-semibold text-red-800">
                                Produto Não Recomendado para Este Contexto
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                                {result.fatalReason}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Context selector - ALWAYS visible so user can change selections */}
            {exclusionError && selectableContexts.length > 0 && (
                <div className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                        Marque seus usos (pode combinar):
                    </label>
                    <div className="space-y-2">
                        {selectableContexts.map(ctx => {
                            const isSelected = selectedContextIds.includes(ctx.id);
                            return (
                                <label
                                    key={ctx.id}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected
                                        ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleContextChange(
                                            isSelected
                                                ? selectedContextIds.filter(id => id !== ctx.id)
                                                : [...selectedContextIds, ctx.id]
                                        )}
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
                </div>
            )}

            {/* Score explanation component - hidden during exclusion error */}
            {!exclusionError && (
                <ContextScoreExplanation
                    result={legacyResult}
                    contextNames={contextNames}
                    availableContexts={selectableContexts}
                    onContextChange={handleContextChange}
                    selectedContextIds={selectedContextIds}
                />
            )}
        </section>
    );
}

export default ContextScoreSection;

