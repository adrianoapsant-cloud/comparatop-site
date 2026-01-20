'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ThumbsUp, ThumbsDown, Bot, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// AI REVIEW SECTION - Displays Gemini-generated analysis
// ============================================
// Uses EXACT 10 criteria from our scoring protocol
// Shows detailed breakdown with scores per criterion

interface CriterionScore {
    id: string;
    label: string;
    score: number;
    reason?: string;
}

interface AIReviewData {
    scores: Record<string, number>;
    computed: {
        qs: number;
        vs: number;
        gs: number;
        overall: number;
    };
    verdict: {
        headline: string;
        summary: string;
    };
    pros: string[];
    cons: string[];
    idealFor: string[];
    avoidIf: string[];
    scoreReasons?: Record<string, string>;
    sources?: string[];
}

interface AIReviewSectionProps {
    productId: string;
    productName: string;
    categoryId?: string;
    className?: string;
}

// Criteria labels for display
const CRITERIA_LABELS: Record<string, string> = {
    c1: 'Custo-Benefício',
    c2: 'Processamento',
    c3: 'Confiabilidade',
    c4: 'Fluidez',
    c5: 'Gaming',
    c6: 'Brilho',
    c7: 'Pós-Venda',
    c8: 'Som',
    c9: 'Conectividade',
    c10: 'Design',
};

export function AIReviewSection({ productId, productName, categoryId, className }: AIReviewSectionProps) {
    const [review, setReview] = useState<AIReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fromCache, setFromCache] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchReview();
    }, [productId]);

    const fetchReview = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/reviews/${productId}`);

            if (!response.ok) {
                throw new Error('Falha ao carregar análise');
            }

            const data = await response.json();

            if (data.review) {
                setReview(data.review as AIReviewData);
                setFromCache(data.metadata?.fromCache || false);
            }
        } catch (err) {
            setError('Não foi possível carregar a análise IA');
            console.error('AI Review fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <section className={cn('py-6', className)}>
                <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-gray-100 rounded mt-1 animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <p className="text-xs text-text-muted mt-4 animate-pulse">
                        ⏳ Analisando com Gemini 2.5 Flash...
                    </p>
                </div>
            </section>
        );
    }

    // Error state
    if (error || !review) {
        return null; // Hide on error
    }

    const overallScore = review.computed?.overall || 7.0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('py-6', className)}
        >
            <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-display font-semibold text-text-primary flex items-center gap-2">
                            Análise IA
                            <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                Gemini 2.5
                            </span>
                        </h3>
                        <p className="text-xs text-text-muted">
                            {fromCache ? '✓ Análise verificada' : '⚡ Gerado agora'}
                        </p>
                    </div>

                    {/* Score Badge */}
                    <div className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-xl',
                        overallScore >= 8 ? 'bg-emerald-100 text-emerald-700' :
                            overallScore >= 6 ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                    )}>
                        <span className="text-xl font-bold">{overallScore.toFixed(1)}</span>
                        <span className="text-[10px] font-medium">/10</span>
                    </div>
                </div>

                {/* Headline */}
                <h4 className="font-display text-lg font-semibold text-text-primary mb-2">
                    {review.verdict?.headline || 'Análise do Produto'}
                </h4>

                {/* Summary */}
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {review.verdict?.summary || ''}
                </p>

                {/* Score Bars - Compact Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    {Object.entries(review.scores || {}).slice(0, 10).map(([id, score]) => (
                        <div key={id} className="bg-white rounded-lg p-2 border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-text-muted uppercase truncate">
                                    {CRITERIA_LABELS[id] || id}
                                </span>
                                <span className={cn(
                                    'text-xs font-bold',
                                    (score as number) >= 8 ? 'text-emerald-600' :
                                        (score as number) >= 6 ? 'text-amber-600' :
                                            'text-red-600'
                                )}>
                                    {(score as number).toFixed(1)}
                                </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(score as number) * 10}%` }}
                                    className={cn(
                                        'h-full rounded-full',
                                        (score as number) >= 8 ? 'bg-emerald-500' :
                                            (score as number) >= 6 ? 'bg-amber-500' :
                                                'bg-red-500'
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Computed Scores Row */}
                {review.computed && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                            QS: {review.computed.qs?.toFixed(1) || '-'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                            VS: {review.computed.vs?.toFixed(1) || '-'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                            GS: {review.computed.gs?.toFixed(1) || '-'}
                        </span>
                    </div>
                )}

                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* Pros */}
                    <div className="bg-emerald-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <ThumbsUp size={16} className="text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">
                                Pontos Fortes
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {(review.pros || []).slice(0, 4).map((pro, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-emerald-800">
                                    <span className="text-emerald-500 mt-0.5">✓</span>
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cons */}
                    <div className="bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <ThumbsDown size={16} className="text-amber-600" />
                            <span className="text-sm font-semibold text-amber-700">
                                Pontos de Atenção
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {(review.cons || []).slice(0, 4).map((con, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                                    <span className="text-amber-500 mt-0.5">!</span>
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Ideal For / Avoid If */}
                {(review.idealFor?.length > 0 || review.avoidIf?.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {review.idealFor?.map((item, idx) => (
                            <span key={`ideal-${idx}`} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                👤 {item}
                            </span>
                        ))}
                        {review.avoidIf?.map((item, idx) => (
                            <span key={`avoid-${idx}`} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full">
                                ⚠️ {item}
                            </span>
                        ))}
                    </div>
                )}

                {/* Expandable Details */}
                {review.scoreReasons && Object.keys(review.scoreReasons).length > 0 && (
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                        {showDetails ? (
                            <>
                                Ocultar detalhes <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                Ver justificativas <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                )}

                {showDetails && review.scoreReasons && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-2 pt-4 border-t border-gray-100"
                    >
                        {Object.entries(review.scoreReasons).map(([id, reason]) => (
                            <div key={id} className="text-xs text-text-secondary">
                                <span className="font-medium text-text-primary">
                                    {CRITERIA_LABELS[id] || id}:
                                </span>{' '}
                                {reason}
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Disclosure */}
                <p className="text-[10px] text-text-muted mt-4 text-center">
                    Análise gerada por IA usando a metodologia ComparaTop com 10 critérios.
                    {review.sources && review.sources.length > 0 && ` Fontes: ${review.sources.slice(0, 2).join(', ')}`}
                </p>
            </div>
        </motion.section>
    );
}
