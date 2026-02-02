'use client';

// ============================================================================
// ADVANCED SORT SHEET - Mobile Sort Bottom Sheet with Grouped Options
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Mirrors Desktop Smart Headers with grouped radio sections
// ============================================================================

import { X, Check, DollarSign, Shield, Star, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActiveSortMetric } from './SortDropdown';

// ============================================
// TYPES
// ============================================

export interface SortSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    options: SortOptionItem[];
}

export interface SortOptionItem {
    id: ActiveSortMetric;
    label: string;
    description: string;
    badge?: {
        text: string;
        color: 'green' | 'amber' | 'indigo' | 'slate';
    };
}

interface AdvancedSortSheetProps {
    isOpen: boolean;
    onClose: () => void;
    activeSort: ActiveSortMetric;
    onSortChange: (sortId: ActiveSortMetric) => void;
}

// ============================================
// SORT SECTIONS CONFIG
// ============================================

const SORT_SECTIONS: SortSection[] = [
    {
        id: 'financial',
        title: 'Financeiro',
        icon: <DollarSign className="w-4 h-4" />,
        options: [
            {
                id: 'tco',
                label: 'Melhor TCO',
                description: 'Custo Total de Propriedade (economiza a longo prazo)',
                badge: { text: '🌿 Sustentável', color: 'green' },
            },
            {
                id: 'price',
                label: 'Menor Preço',
                description: 'Ordenar pelo menor valor de entrada',
            },
        ],
    },
    {
        id: 'quality',
        title: 'Qualidade & Avaliação',
        icon: <Hexagon className="w-4 h-4" />,
        options: [
            {
                id: 'score',
                label: 'Melhor Nota Técnica',
                description: 'Avaliação especialista ComparaTop',
                badge: { text: '🛡️ Especialista', color: 'indigo' },
            },
            {
                id: 'communityScore',
                label: 'Melhor Nota da Comunidade',
                description: 'Popularidade e reviews de usuários',
                badge: { text: '⭐ Reviews', color: 'amber' },
            },
        ],
    },
    {
        id: 'risk',
        title: 'Risco & Segurança',
        icon: <Shield className="w-4 h-4" />,
        options: [
            {
                id: 'risk',
                label: 'Menor Risco',
                description: 'Maior segurança e confiabilidade',
            },
            {
                id: 'match',
                label: 'Melhor Match',
                description: 'Mais adequado ao seu perfil',
                badge: { text: '🎯 Personalizado', color: 'indigo' },
            },
        ],
    },
];

// ============================================
// BADGE COLORS
// ============================================

const badgeColors = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
};

// ============================================
// COMPONENT
// ============================================

export function AdvancedSortSheet({
    isOpen,
    onClose,
    activeSort,
    onSortChange,
}: AdvancedSortSheetProps) {
    if (!isOpen) return null;

    const handleSelect = (sortId: ActiveSortMetric) => {
        onSortChange(sortId);
        onClose();
    };

    // Get active sort label for display
    const activeLabel = SORT_SECTIONS
        .flatMap(s => s.options)
        .find(o => o.id === activeSort)?.label ?? 'Nenhum';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className={cn(
                'fixed inset-x-0 bottom-0 z-50 lg:hidden',
                'bg-white rounded-t-3xl shadow-2xl',
                'flex flex-col max-h-[85vh]',
                'animate-in slide-in-from-bottom duration-300'
            )}>
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <div>
                        <h3 className="font-semibold text-lg text-slate-900">
                            Ordenar por
                        </h3>
                        <p className="text-xs text-slate-500">
                            Atual: <span className="font-medium text-indigo-600">{activeLabel}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {SORT_SECTIONS.map((section) => (
                        <div key={section.id}>
                            {/* Section Header */}
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <span className="text-slate-400">{section.icon}</span>
                                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                                    {section.title}
                                </h4>
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                                {section.options.map((option) => {
                                    const isActive = activeSort === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleSelect(option.id)}
                                            className={cn(
                                                'w-full flex items-start gap-3 p-4 rounded-xl',
                                                'text-left transition-all',
                                                isActive
                                                    ? 'bg-indigo-50 border-2 border-indigo-300'
                                                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                                            )}
                                        >
                                            {/* Radio Circle */}
                                            <div className={cn(
                                                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                                                isActive
                                                    ? 'border-indigo-600 bg-indigo-600'
                                                    : 'border-slate-300 bg-white'
                                            )}>
                                                {isActive && (
                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={cn(
                                                        'font-semibold',
                                                        isActive ? 'text-indigo-900' : 'text-slate-800'
                                                    )}>
                                                        {option.label}
                                                    </span>
                                                    {option.badge && (
                                                        <span className={cn(
                                                            'px-2 py-0.5 text-xs font-medium rounded-full border',
                                                            badgeColors[option.badge.color]
                                                        )}>
                                                            {option.badge.text}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={cn(
                                                    'text-sm mt-0.5',
                                                    isActive ? 'text-indigo-700' : 'text-slate-500'
                                                )}>
                                                    {option.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Safe area padding */}
                <div className="h-6 flex-shrink-0" />
            </div>
        </>
    );
}

// ============================================
// HELPER: Get sort label
// ============================================

export function getSortLabel(sortId: ActiveSortMetric): string {
    const option = SORT_SECTIONS
        .flatMap(s => s.options)
        .find(o => o.id === sortId);
    return option?.label ?? 'Ordenar';
}

// ============================================
// HELPER: Check if non-default sort
// ============================================

export function isCustomSort(sortId: ActiveSortMetric): boolean {
    return sortId !== null && sortId !== 'score';
}

export default AdvancedSortSheet;
