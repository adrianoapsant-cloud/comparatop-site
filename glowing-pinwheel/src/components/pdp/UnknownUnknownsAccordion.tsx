'use client';

/**
 * @file UnknownUnknownsAccordion.tsx
 * @description Componente Client para interatividade do accordion
 * Separado do Server Component para manter RSC puro
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Octagon,
    TriangleAlert,
    Info,
    ChevronDown,
    Wrench,
    AlertCircle,
    Lightbulb,
    ExternalLink,
} from 'lucide-react';
import type { UnknownUnknownItem, SeverityLevel } from '@/types/engineering-schema';
import { getSeverityColors, getFixabilityLabel } from '@/types/engineering-schema';

// ============================================
// ICON SELECTOR
// ============================================

function SeverityIcon({ severity, className }: { severity: SeverityLevel; className?: string }) {
    switch (severity) {
        case 'CRITICAL':
            return <Octagon className={className} />;
        case 'WARNING':
            return <TriangleAlert className={className} />;
        case 'INFO':
            return <Info className={className} />;
    }
}

// ============================================
// SINGLE ITEM ACCORDION
// ============================================

interface AccordionItemProps {
    item: UnknownUnknownItem;
    isOpen: boolean;
    onToggle: () => void;
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
    const colors = getSeverityColors(item.severity);
    const fixabilityLabel = getFixabilityLabel(item.fixabilityScore);

    return (
        <div className={`border rounded-lg overflow-hidden ${colors.border} ${colors.bg}`}>
            {/* Header - Always Visible */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <SeverityIcon
                        severity={item.severity}
                        className={`w-5 h-5 flex-shrink-0 ${colors.icon}`}
                    />
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                            {item.topic}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            "{item.userQuestion}"
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Severity Badge */}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                        {item.severity}
                    </span>

                    {/* Chevron */}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.div>
                </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4 border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                            {/* Technical Fact */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Fato Técnico (Causa)
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {item.technicalFact}
                                </p>
                            </div>

                            {/* Risk Analysis */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                                    <TriangleAlert className="w-3.5 h-3.5" />
                                    Análise de Risco (Impacto)
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {item.riskAnalysis}
                                </p>
                            </div>

                            {/* Mitigation Strategy - HIGHLIGHTED */}
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1.5">
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    Mitigação / Solução
                                </div>
                                <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                                    {item.mitigationStrategy}
                                </p>
                            </div>

                            {/* Footer: Fixability Score */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                <Wrench className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-500">
                                    Resolubilidade:
                                </span>
                                <span className={`text-xs font-semibold ${item.fixabilityScore >= 7 ? 'text-emerald-600' :
                                    item.fixabilityScore >= 4 ? 'text-amber-600' : 'text-rose-600'
                                    }`}>
                                    {item.fixabilityScore}/10 ({fixabilityLabel})
                                </span>
                            </div>

                            {/* Sources (if present) */}
                            {item.sources && item.sources.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {item.sources.map((source, idx) => (
                                        <a
                                            key={idx}
                                            href={source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Fonte {idx + 1}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// MAIN ACCORDION COMPONENT
// ============================================

interface UnknownUnknownsAccordionProps {
    items: UnknownUnknownItem[];
}

export function UnknownUnknownsAccordion({ items }: UnknownUnknownsAccordionProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        setOpenItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Sort by severity: CRITICAL > WARNING > INFO
    const sortedItems = [...items].sort((a, b) => {
        const order: Record<SeverityLevel, number> = { CRITICAL: 0, WARNING: 1, INFO: 2 };
        return order[a.severity] - order[b.severity];
    });

    return (
        <div className="space-y-3">
            {sortedItems.map(item => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                />
            ))}
        </div>
    );
}
