'use client';

/**
 * SimplifiedPDP - Context Score Section
 * Uses category-based context profiles from config
 * Maintains dynamic score functionality when checkboxes are selected
 * Includes conflict detection for mutually exclusive contexts
 */

import React, { useState, useMemo } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import type { PDPDataContract } from '../hooks/usePDPData';
import { getContextProfiles, type ContextProfile as ConfigContextProfile, type ExclusionRule as ConfigExclusionRule } from '@/config/context-profiles';

// Context profile from mockData
interface ContextProfile {
    id: string;
    name: string;
    icon: string;
    modifier: number; // How much this context affects the score
}

// Dimension for strengths/weaknesses display
interface ScoreDimension {
    name: string;
    score: number;
    isStrength: boolean;
}

// Exclusion rules: pairs of context IDs that are mutually exclusive
interface ExclusionRule {
    contexts: [string, string];
    message: string;
}

interface SimplifiedContextScoreSectionProps {
    data: PDPDataContract;
    baseScore: number;
    contextProfiles?: ContextProfile[];
    dimensions?: ScoreDimension[];
    exclusionRules?: ExclusionRule[];
}

export function SimplifiedContextScoreSection({
    data,
    baseScore,
    contextProfiles,
    dimensions,
    exclusionRules
}: SimplifiedContextScoreSectionProps) {
    // Selected contexts (checkboxes)
    const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Get category from product data
    const categoryId = data.product?.categoryId || 'robot-vacuum';

    // Get category-specific profiles from config
    const categoryConfig = getContextProfiles(categoryId);

    // Use provided profiles or fall back to category config
    const profiles = contextProfiles ?? categoryConfig.profiles;
    const rules = exclusionRules ?? categoryConfig.exclusionRules ?? [];

    // Detect conflicts
    const conflict = useMemo(() => {
        for (const rule of rules) {
            const [a, b] = rule.contexts;
            if (selectedContexts.includes(a) && selectedContexts.includes(b)) {
                const profileA = profiles.find(p => p.id === a);
                const profileB = profiles.find(p => p.id === b);
                return {
                    rule,
                    names: [profileA?.name ?? a, profileB?.name ?? b],
                };
            }
        }
        return null;
    }, [selectedContexts, rules, profiles]);

    // Default dimensions from product scores if not provided
    const scoreDimensions = useMemo(() => {
        if (dimensions) return dimensions;

        // Extract from product.scores if available
        const productScores = data.product.scores;
        if (!productScores) return [];

        const dims: ScoreDimension[] = [];
        const nameMap: Record<string, string> = {
            c1: 'Navegação', c2: 'App/Conectividade', c3: 'Sistema de Mop',
            c4: 'Escovas', c5: 'Altura', c6: 'Manutenibilidade',
            c7: 'Bateria e Autonomia', c8: 'Acústica', c9: 'Base de Carregamento', c10: 'Recursos de IA'
        };

        Object.entries(productScores).forEach(([key, value]) => {
            if (typeof value === 'number') {
                dims.push({
                    name: nameMap[key] || key,
                    score: value,
                    isStrength: value >= 8.0
                });
            }
        });

        // Sort by score descending
        dims.sort((a, b) => b.score - a.score);
        return dims;
    }, [data.product.scores, dimensions]);

    const strengths = scoreDimensions.filter(d => d.isStrength).slice(0, 3);
    const weaknesses = scoreDimensions.filter(d => !d.isStrength).slice(0, 2);

    // Calculate contextual score based on selections
    // Uses product-specific modifiers when available, falls back to category defaults
    const contextualScore = useMemo(() => {
        if (selectedContexts.length === 0) {
            return baseScore;
        }

        // Check if product has its own contextModifiers
        const productModifiers = (data.product as any).contextModifiers as Record<string, number> | undefined;

        // Apply modifiers from selected contexts
        let modifier = 0;
        for (const contextId of selectedContexts) {
            // Priority: product-specific modifier > category profile modifier
            if (productModifiers && typeof productModifiers[contextId] === 'number') {
                modifier += productModifiers[contextId];
            } else {
                const profile = profiles.find(p => p.id === contextId);
                if (profile) {
                    modifier += profile.modifier;
                }
            }
        }

        // Apply modifier and clamp between 0-10
        const adjustedScore = Math.max(0, Math.min(10, baseScore + modifier));
        return Math.round(adjustedScore * 10) / 10;
    }, [baseScore, selectedContexts, profiles, data.product]);

    const handleToggle = (contextId: string) => {
        setSelectedContexts(prev =>
            prev.includes(contextId)
                ? prev.filter(id => id !== contextId)
                : [...prev, contextId]
        );
    };

    // Score color based on value
    const getScoreColor = (score: number) => {
        if (score >= 8.5) return 'text-emerald-600';
        if (score >= 7.0) return 'text-sky-600';
        return 'text-amber-600';
    };

    const getBarColor = (score: number) => {
        if (score >= 8.0) return 'bg-emerald-500';
        if (score >= 6.0) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">
            {/* Conflict Warning */}
            {conflict && (
                <div className="mb-4 bg-amber-50 border border-amber-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-800">Contextos Conflitantes</h4>
                            <p className="text-sm text-amber-700 mt-1">{conflict.rule.message}</p>
                            <p className="text-xs text-amber-600 mt-1">Desmarque um dos contextos abaixo para continuar.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                Score Contextual
                            </h3>
                            <p className="text-sm text-slate-500">
                                Marque seus usos para ver score personalizado
                            </p>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${getScoreColor(contextualScore)}`}>
                            {contextualScore.toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-500">/10</span>
                    </div>
                </div>

                {/* Context Checkboxes */}
                <div className="space-y-2 mb-4">
                    <p className="text-xs text-slate-500">Marque seus usos (pode combinar):</p>
                    {profiles.map(profile => (
                        <label
                            key={profile.id}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedContexts.includes(profile.id)
                                ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
                                : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedContexts.includes(profile.id)}
                                onChange={() => handleToggle(profile.id)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-lg">{profile.icon}</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {profile.name}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Expandable Details */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-2"
                >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Ver detalhes da avaliação
                </button>

                {isExpanded && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                        {/* Strengths */}
                        {strengths.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ThumbsUp size={16} className="text-emerald-600" />
                                    <span className="text-sm font-medium text-slate-700">Pontos Fortes</span>
                                </div>
                                <div className="space-y-2">
                                    {strengths.map((dim, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-32 text-sm text-slate-600 truncate">{dim.name}</span>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getBarColor(dim.score)}`}
                                                    style={{ width: `${(dim.score / 10) * 100}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-xs text-slate-500">{dim.score}</span>
                                            <span className="text-xs text-emerald-600 font-medium">{Math.round(dim.score * 10)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Weaknesses */}
                        {weaknesses.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ThumbsDown size={16} className="text-red-500" />
                                    <span className="text-sm font-medium text-slate-700">Pontos Fracos</span>
                                </div>
                                <div className="space-y-2">
                                    {weaknesses.map((dim, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-32 text-sm text-slate-600 truncate">{dim.name}</span>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getBarColor(dim.score)}`}
                                                    style={{ width: `${(dim.score / 10) * 100}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-xs text-slate-500">{dim.score}</span>
                                            <span className="text-xs text-amber-600 font-medium">{Math.round(dim.score * 10)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Engine Attribution */}
                        <p className="text-xs text-slate-400 mt-4">
                            ⊙ Motor: HMUM v3.0 (Unificado)
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default SimplifiedContextScoreSection;
