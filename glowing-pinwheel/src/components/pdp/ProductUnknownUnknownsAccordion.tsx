/**
 * @file ProductUnknownUnknownsAccordion.tsx
 * @description Client Component - Accordion para Unknown Unknowns específicos do produto
 * 
 * Diferente do UnknownUnknownsAccordion genérico:
 * - Exibe applicationReason personalizada ("Este robô usa sensores IR...")
 * - Usa adjustedSeverity se disponível
 * - Mostra contexto específico do modelo
 * 
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    AlertTriangle,
    Info,
    AlertCircle,
    Lightbulb,
    Settings,
    CheckCircle,
    Sparkles
} from 'lucide-react';
import type { ProductUnknownUnknown } from '@/data/unknown-unknowns-filter';

// ============================================
// TYPES
// ============================================

interface ProductUnknownUnknownsAccordionProps {
    items: ProductUnknownUnknown[];
    productName: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSeverityColors(severity: 'CRITICAL' | 'WARNING' | 'INFO') {
    switch (severity) {
        case 'CRITICAL':
            return {
                bg: 'bg-rose-50 dark:bg-rose-950/30',
                border: 'border-rose-200 dark:border-rose-900/50',
                icon: 'text-rose-500',
                badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
            };
        case 'WARNING':
            return {
                bg: 'bg-amber-50 dark:bg-amber-950/30',
                border: 'border-amber-200 dark:border-amber-900/50',
                icon: 'text-amber-500',
                badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
            };
        case 'INFO':
        default:
            return {
                bg: 'bg-blue-50 dark:bg-blue-950/30',
                border: 'border-blue-200 dark:border-blue-900/50',
                icon: 'text-blue-500',
                badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
            };
    }
}

function getSeverityIcon(severity: 'CRITICAL' | 'WARNING' | 'INFO') {
    switch (severity) {
        case 'CRITICAL': return AlertCircle;
        case 'WARNING': return AlertTriangle;
        case 'INFO': default: return Info;
    }
}

function getSeverityLabel(severity: 'CRITICAL' | 'WARNING' | 'INFO') {
    switch (severity) {
        case 'CRITICAL': return 'CRÍTICO';
        case 'WARNING': return 'ALERTA';
        case 'INFO': default: return 'INFO';
    }
}

// ============================================
// ACCORDION ITEM
// ============================================

interface AccordionItemProps {
    item: ProductUnknownUnknown;
    isOpen: boolean;
    onToggle: () => void;
    productName: string;
}

function AccordionItem({ item, isOpen, onToggle, productName }: AccordionItemProps) {
    // Use adjusted severity if available
    const severity = item.adjustedSeverity || item.severity;
    const colors = getSeverityColors(severity);
    const SeverityIcon = getSeverityIcon(severity);

    return (
        <div className={`border rounded-lg overflow-hidden ${colors.border} ${colors.bg}`}>
            {/* Header - Always Visible */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SeverityIcon className={`w-5 h-5 flex-shrink-0 ${colors.icon}`} />
                    <div className="flex-1 min-w-0">
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                            {item.topic}
                        </span>
                        {/* Application reason preview */}
                        {item.applicationReason && !isOpen && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                {item.applicationReason}
                            </p>
                        )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${colors.badge}`}>
                        {getSeverityLabel(severity)}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 flex-shrink-0"
                >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </motion.div>
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

                            {/* Product-Specific Reason - HIGHLIGHTED */}
                            {item.applicationReason && (
                                <div className="bg-white dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                                Específico para {productName}
                                            </span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                                                {item.applicationReason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Technical Fact */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Fato Técnico (Causa)
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {item.technicalFact}
                                </p>
                            </div>

                            {/* Risk Analysis */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                        Análise de Risco (Impacto)
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {item.riskAnalysis}
                                </p>
                            </div>

                            {/* Mitigation - HIGHLIGHTED */}
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-4 py-3 border border-emerald-200 dark:border-emerald-900/50">
                                <div className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                            Mitigação / Solução
                                        </span>
                                        <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                                            {item.mitigationStrategy}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Fixability Score */}
                            {item.fixabilityScore !== undefined && (
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>Resolubilidade:</span>
                                    <span className="font-medium">
                                        {item.fixabilityScore}/10
                                        <span className="ml-1 text-slate-400">
                                            ({item.fixabilityScore >= 7 ? 'Fácil' : item.fixabilityScore >= 4 ? 'Médio' : 'Difícil'})
                                        </span>
                                    </span>
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
// MAIN ACCORDION
// ============================================

export function ProductUnknownUnknownsAccordion({
    items,
    productName
}: ProductUnknownUnknownsAccordionProps) {
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

    return (
        <div className="space-y-2">
            {items.map(item => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                    productName={productName}
                />
            ))}
        </div>
    );
}

export default ProductUnknownUnknownsAccordion;
