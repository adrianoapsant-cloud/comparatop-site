'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, FileText, XCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// AUDIT VERDICT - PROGRESSIVE DISCLOSURE
// ============================================
// Desktop: Grid 2x2 (all cards visible)
// Mobile: Accordion with expandable secondary cards

interface AuditVerdictProps {
    /** What problem this product solves */
    solution: string;
    /** Key weakness/blemish to highlight */
    attention: string;
    /** Final technical conclusion */
    conclusion: string;
    /** Overall score for visual indicator */
    score?: number;
    /** Pro points from AI (Unified Voice) */
    pros?: string[];
    /** Con points from AI (Unified Voice) */
    cons?: string[];
    /** Don't buy scenarios (integrated from DontBuyIf) */
    dontBuyReasons?: string[];
    /** Loading state - show skeleton while Gemini fetches */
    isLoading?: boolean;
}

export function AuditVerdict({
    solution,
    attention,
    conclusion,
    score,
    pros,
    cons,
    dontBuyReasons = [],
    isLoading = false,
}: AuditVerdictProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Skeleton Loading Card
    const SkeletonCard = ({ variant }: { variant: 'green' | 'amber' | 'gray' | 'red' }) => {
        const colors = {
            green: 'bg-emerald-50 border-emerald-200',
            amber: 'bg-amber-50 border-amber-200',
            gray: 'bg-slate-50 border-slate-200',
            red: 'bg-red-50 border-red-200',
        };
        return (
            <div className={cn('rounded-lg p-4 h-full border-l-4 animate-pulse', colors[variant])}>
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    };

    // Cards for grid layout
    const SolutionCard = () => (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg p-4 h-full">
            <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-semibold text-emerald-800 text-sm mb-1">
                        ✓ A Solução
                    </h3>
                    <p className="text-sm text-emerald-700">
                        {solution}
                    </p>
                    {pros && pros.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {pros.map((pro, idx) => (
                                <li key={idx} className="text-xs text-emerald-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

    const AttentionCard = () => (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 h-full">
            <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-semibold text-amber-800 text-sm mb-1">
                        ⚠️ Ponto de Atenção
                    </h3>
                    <p className="text-sm text-amber-700 font-medium">
                        {attention}
                    </p>
                    {cons && cons.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {cons.map((con, idx) => (
                                <li key={idx} className="text-xs text-amber-700 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    {con}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

    const ConclusionCard = () => (
        <div className="bg-slate-100 border-l-4 border-slate-400 rounded-r-lg p-4 h-full">
            <div className="flex items-start gap-3">
                <FileText size={20} className="text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-slate-700 text-sm mb-1">
                        Conclusão Técnica
                    </h3>
                    <p className="text-sm text-slate-600">
                        {conclusion}
                    </p>
                </div>
            </div>
        </div>
    );

    const DontBuyCard = () => {
        if (!dontBuyReasons || dontBuyReasons.length === 0) return null;
        return (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 h-full">
                <div className="flex items-start gap-3">
                    <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-red-800 text-sm mb-1">
                            Não Compre Se
                        </h3>
                        <ul className="space-y-1">
                            {dontBuyReasons.map((reason, idx) => (
                                <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                                    <span className="text-red-400 font-bold text-xs mt-0.5">✕</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    const hasDontBuyReasons = dontBuyReasons && dontBuyReasons.length > 0;

    return (
        <div className="space-y-3">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-slate-600" />
                <h2 className="font-display text-lg font-bold text-text-primary">
                    Veredito da Auditoria
                </h2>
                {/* Score always shows instantly (static data) */}
                {score && (
                    <span className={cn(
                        'ml-auto px-2 py-1 rounded-full text-xs font-bold',
                        score >= 8 ? 'bg-emerald-100 text-emerald-700' :
                            score >= 6 ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                    )}>
                        {score.toFixed(1)}/10
                    </span>
                )}
            </div>

            {/* Desktop: Grid 2x2 Layout (all visible) */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-3">
                {isLoading ? (
                    <>
                        <SkeletonCard variant="green" />
                        <SkeletonCard variant="amber" />
                        <SkeletonCard variant="gray" />
                    </>
                ) : (
                    <>
                        <SolutionCard />
                        <AttentionCard />
                        <ConclusionCard />
                        {hasDontBuyReasons && <DontBuyCard />}
                    </>
                )}
            </div>

            {/* Mobile: Progressive Disclosure */}
            <div className="lg:hidden space-y-3">
                {/* Always visible: Primary cards */}
                {isLoading ? (
                    <>
                        <SkeletonCard variant="green" />
                        <SkeletonCard variant="amber" />
                    </>
                ) : (
                    <>
                        <SolutionCard />
                        <AttentionCard />
                    </>
                )}

                {/* Expandable: Secondary cards */}
                <div
                    className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                >
                    <div className="space-y-3 pt-1">
                        <ConclusionCard />
                        {hasDontBuyReasons && <DontBuyCard />}
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        'w-full py-2.5 flex items-center justify-center gap-2',
                        'text-sm text-slate-500 hover:text-slate-700',
                        'border border-slate-200 rounded-lg hover:bg-slate-50',
                        'transition-all duration-200'
                    )}
                >
                    <span>
                        {isExpanded
                            ? 'Ocultar análise completa'
                            : 'Ver análise técnica completa e contra-indicações'}
                    </span>
                    <ChevronDown
                        size={18}
                        className={cn(
                            'transition-transform duration-300',
                            isExpanded && 'rotate-180'
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
