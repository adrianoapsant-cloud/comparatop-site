'use client';

// ============================================================================
// ZONED ROW v2 - Desktop Row-Card Layout (RESPONSIVE, NO OVERFLOW)
// ============================================================================
// 5 Zonas: Produto | Avaliação | Financeiro | Risco/Match | Ações
// Layout: Grid responsivo que NÃO causa scroll horizontal em 768px+
// ============================================================================

import { Row, flexRender } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import type { ProductTcoData } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';

// ============================================
// COLUMN IDS MAPPING
// ============================================
// Zona 1 - Produto:     'product'
// Zona 2 - Avaliação:   'score' (técnica), 'communityScore' (condicional)
// Zona 3 - Financeiro:  'price', 'tco'
// Zona 4 - Risco/Match: 'match', 'risk'
// Zona 5 - Ações:       'actions'
// ============================================

interface ZonedRowProps {
    row: Row<ProductTcoData>;
    scoreView: ScoreViewMode;
    className?: string;
}

/**
 * Helper: Get cell by column ID
 */
function getCell(row: Row<ProductTcoData>, columnId: string) {
    return row.getVisibleCells().find(c => c.column.id === columnId);
}

export function ZonedRow({ row, scoreView, className }: ZonedRowProps) {
    const productCell = getCell(row, 'product');
    const scoreCell = getCell(row, 'score');
    const communityCell = getCell(row, 'communityScore');
    const priceCell = getCell(row, 'price');
    const tcoCell = getCell(row, 'tco');
    const matchCell = getCell(row, 'match');
    const riskCell = getCell(row, 'risk');
    const actionsCell = getCell(row, 'actions');

    return (
        <div
            className={cn(
                // Layout: 5 zonas com larguras flexíveis
                // [Produto: flex-1] [Avaliação: ~100px] [Financeiro: ~90px] [Risco: ~80px] [Ações: 70px]
                'grid gap-2 p-3 items-center',
                'border-b border-gray-100 last:border-b-0',
                'hover:bg-gray-50/50 transition-colors',
                // Grid responsivo: Produto shrink, outros fixos mas pequenos
                'grid-cols-[minmax(0,1fr)_100px_90px_80px_70px]',
                className
            )}
        >
            {/* ====== ZONA 1: PRODUTO ====== */}
            {/* Imagem + Nome + Marca + Badges - truncate se necessário */}
            <div className="min-w-0 overflow-hidden">
                {productCell && flexRender(
                    productCell.column.columnDef.cell,
                    productCell.getContext()
                )}
            </div>

            {/* ====== ZONA 2: AVALIAÇÃO ====== */}
            {/* Nota Técnica sempre; Comunidade condicional (empilhados) */}
            <div className="flex flex-col items-center gap-0.5 min-w-0">
                {/* Nota Técnica - sempre visível */}
                <div className="shrink-0">
                    {scoreCell && flexRender(
                        scoreCell.column.columnDef.cell,
                        scoreCell.getContext()
                    )}
                </div>
                {/* Comunidade - condicional com placeholder para estabilidade */}
                <div className="h-4 flex items-center justify-center">
                    {scoreView === 'community' && communityCell ? (
                        <span className="text-xs">
                            {flexRender(communityCell.column.columnDef.cell, communityCell.getContext())}
                        </span>
                    ) : (
                        <span className="text-gray-300 text-xs">—</span>
                    )}
                </div>
            </div>

            {/* ====== ZONA 3: FINANCEIRO ====== */}
            {/* Preço + TCO empilhados */}
            <div className="flex flex-col items-end gap-0.5 min-w-0">
                {/* Preço */}
                <div className="text-sm font-medium truncate">
                    {priceCell && flexRender(priceCell.column.columnDef.cell, priceCell.getContext())}
                </div>
                {/* TCO */}
                <div className="text-xs text-gray-500 truncate">
                    {tcoCell && flexRender(tcoCell.column.columnDef.cell, tcoCell.getContext())}
                </div>
            </div>

            {/* ====== ZONA 4: RISCO/MATCH ====== */}
            {/* Compactos, empilhados */}
            <div className="flex flex-col items-center gap-0.5 min-w-0">
                {/* Match */}
                <div className="shrink-0">
                    {matchCell && flexRender(matchCell.column.columnDef.cell, matchCell.getContext())}
                </div>
                {/* Risco */}
                <div className="shrink-0">
                    {riskCell && flexRender(riskCell.column.columnDef.cell, riskCell.getContext())}
                </div>
            </div>

            {/* ====== ZONA 5: AÇÕES ====== */}
            {/* Sininho + Detalhes - sempre visível, alinhado à direita */}
            <div className="flex justify-end shrink-0">
                {actionsCell && flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
            </div>
        </div>
    );
}
