'use client';

// ============================================================================
// HYBRID TABLE HEADER - Sticky Header with Smart Sort Dropdowns
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Features: Dropdown menus for granular sorting in grouped columns
// ============================================================================

import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { ArrowUpDown, Shield, Star, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';
import { SortDropdown, type ActiveSortMetric } from './SortDropdown';

// ============================================
// SHARED GRID - Used by both Header and Cards
// ============================================
export const HYBRID_GRID_COLS = 'grid-cols-[40%_15%_20%_15%_auto]';

// ============================================
// SORT OPTIONS
// ============================================

const FINANCIAL_OPTIONS = [
    { id: 'tco', label: 'Melhor TCO', description: 'Custo total de propriedade' },
    { id: 'price', label: 'Preço de Compra', description: 'Valor inicial do produto' },
];

const EVALUATION_OPTIONS = [
    { id: 'score', label: 'Nota Técnica', description: 'Avaliação especialista ComparaTop' },
    { id: 'communityScore', label: 'Nota da Comunidade', description: 'Popularidade e reviews' },
];

const RISK_OPTIONS = [
    { id: 'risk', label: 'Nível de Risco', description: 'Score SCRS da marca' },
    { id: 'match', label: 'Match %', description: 'Compatibilidade com perfil' },
];

// ============================================
// TYPES
// ============================================

interface HybridTableHeaderProps {
    table: Table<ProductTcoData>;
    scoreView: ScoreViewMode;
    activeSort?: ActiveSortMetric;
    onActiveSortChange?: (metric: ActiveSortMetric) => void;
    className?: string;
}

/** Simple sort button for single-metric columns */
function SortButton({
    label,
    columnId,
    table,
    align = 'center',
    icon,
}: {
    label: string;
    columnId: string;
    table: Table<ProductTcoData>;
    align?: 'left' | 'center' | 'right';
    icon?: React.ReactNode;
}) {
    const column = table.getColumn(columnId);
    const isSorted = column?.getIsSorted();

    return (
        <button
            onClick={() => column?.toggleSorting(isSorted === 'asc')}
            className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-lg',
                'text-sm font-semibold transition-colors',
                'hover:bg-white/60',
                isSorted ? 'text-indigo-700 bg-white/50' : 'text-slate-600',
                align === 'left' && 'justify-start',
                align === 'center' && 'justify-center',
                align === 'right' && 'justify-end'
            )}
        >
            {icon}
            <span>{label}</span>
            <ArrowUpDown className={cn(
                'w-3.5 h-3.5',
                isSorted ? 'text-indigo-500' : 'text-slate-400'
            )} />
        </button>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function HybridTableHeader({
    table,
    scoreView,
    activeSort,
    onActiveSortChange,
    className
}: HybridTableHeaderProps) {
    // Internal state if not controlled
    const [internalFinancial, setInternalFinancial] = useState<string>('price');
    const [internalEvaluation, setInternalEvaluation] = useState<string>('score');
    const [internalRisk, setInternalRisk] = useState<string>('risk');

    const handleFinancialChange = (optionId: string) => {
        setInternalFinancial(optionId);
        onActiveSortChange?.(optionId as ActiveSortMetric);
    };

    const handleEvaluationChange = (optionId: string) => {
        setInternalEvaluation(optionId);
        onActiveSortChange?.(optionId as ActiveSortMetric);
    };

    const handleRiskChange = (optionId: string) => {
        setInternalRisk(optionId);
        onActiveSortChange?.(optionId as ActiveSortMetric);
    };

    return (
        <div
            className={cn(
                'grid gap-2 px-4 py-3 items-center',
                'bg-white/60 backdrop-blur-sm',
                'border-b border-white/40',
                'rounded-t-2xl',
                'sticky top-0 z-10',
                HYBRID_GRID_COLS,
                className
            )}
        >
            {/* Column 1: Produto (Simple Sort) */}
            <SortButton
                label="Produto"
                columnId="product"
                table={table}
                align="left"
            />

            {/* Column 2: Avaliação (Dropdown: Nota Técnica / Comunidade) */}
            <div className="flex justify-center">
                <SortDropdown
                    label="Avaliação"
                    options={scoreView === 'community' ? EVALUATION_OPTIONS : [EVALUATION_OPTIONS[0]]}
                    activeOption={internalEvaluation}
                    onSelect={handleEvaluationChange}
                    table={table}
                    icon={<Shield className="w-4 h-4 text-blue-500" />}
                />
            </div>

            {/* Column 3: Preço e TCO (Dropdown) */}
            <div className="flex justify-center">
                <SortDropdown
                    label="Preço e TCO"
                    options={FINANCIAL_OPTIONS}
                    activeOption={internalFinancial}
                    onSelect={handleFinancialChange}
                    table={table}
                    icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                />
            </div>

            {/* Column 4: Risco/Match (Dropdown) */}
            <div className="flex justify-center">
                <SortDropdown
                    label="Risco/Match"
                    options={RISK_OPTIONS}
                    activeOption={internalRisk}
                    onSelect={handleRiskChange}
                    table={table}
                />
            </div>

            {/* Column 5: Ações */}
            <div className="text-center text-sm font-semibold text-slate-600">
                Ações
            </div>
        </div>
    );
}

export default HybridTableHeader;
