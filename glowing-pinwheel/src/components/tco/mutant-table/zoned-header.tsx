'use client';

// ============================================================================
// ZONED HEADER v2 - Matching header for ZonedRow (RESPONSIVE, NO OVERFLOW)
// ============================================================================
// 5 Zonas que correspondem ao ZonedRow sem causar scroll horizontal
// ============================================================================

import { Table } from '@tanstack/react-table';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';

interface ZonedHeaderProps {
    table: Table<ProductTcoData>;
    scoreView: ScoreViewMode;
    className?: string;
}

function SortBtn({ label, columnId, table }: { label: string; columnId: string; table: Table<ProductTcoData> }) {
    const column = table.getColumn(columnId);
    if (!column) return <span className="text-xs text-gray-500">{label}</span>;

    const sorted = column.getIsSorted();

    return (
        <button
            onClick={() => column.toggleSorting(sorted === 'asc')}
            className={cn(
                'flex items-center gap-0.5 text-xs font-medium whitespace-nowrap',
                'hover:text-blue-600 transition-colors',
                sorted ? 'text-blue-600' : 'text-gray-600'
            )}
        >
            {label}
            {sorted === 'asc' && <ChevronUp className="w-3 h-3" />}
            {sorted === 'desc' && <ChevronDown className="w-3 h-3" />}
            {!sorted && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
        </button>
    );
}

export function ZonedHeader({ table, scoreView, className }: ZonedHeaderProps) {
    return (
        <div
            className={cn(
                // MUST match ZonedRow grid exactly
                'grid gap-2 px-3 py-2 items-center',
                'bg-gray-50 border-b border-gray-200 rounded-t-xl',
                // 5 zonas: [Produto: flex-1] [Avaliação: 100px] [Financeiro: 90px] [Risco: 80px] [Ações: 70px]
                'grid-cols-[minmax(0,1fr)_100px_90px_80px_70px]',
                className
            )}
        >
            {/* ====== ZONA 1: PRODUTO ====== */}
            <SortBtn label="Produto" columnId="product" table={table} />

            {/* ====== ZONA 2: AVALIAÇÃO ====== */}
            <div className="flex flex-col items-center gap-0.5">
                <SortBtn label="Nota" columnId="score" table={table} />
                <span className="text-xs text-gray-400">
                    {scoreView === 'community' ? '⭐' : '—'}
                </span>
            </div>

            {/* ====== ZONA 3: FINANCEIRO ====== */}
            <div className="flex flex-col items-end gap-0.5">
                <SortBtn label="Preço" columnId="price" table={table} />
                <SortBtn label="TCO" columnId="tco" table={table} />
            </div>

            {/* ====== ZONA 4: RISCO/MATCH ====== */}
            <div className="flex flex-col items-center gap-0.5">
                <SortBtn label="Match" columnId="match" table={table} />
                <SortBtn label="Risco" columnId="risk" table={table} />
            </div>

            {/* ====== ZONA 5: AÇÕES ====== */}
            <div className="text-right">
                <span className="text-xs text-gray-500">Ações</span>
            </div>
        </div>
    );
}
