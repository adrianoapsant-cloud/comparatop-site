/**
 * ComparisonTable - Row builder for comparison table
 * 
 * SIMPLIFIED VERSION: Expects raw product data from products.ts
 * All fields are accessed directly without path fallbacks.
 */

import { formatScoreValue, formatScoreRange, formatCurrencyValue, formatCurrencyRange } from '@/lib/formatters';
import { getConfidenceLabel } from '@/lib/metrics/confidence';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import type { CompareRow, CompareCell } from './ComparisonTableClient';
import type { Product } from '@/types/category';

// Re-export types
export type { CompareRow, CompareCell };

// ============================================
// Tooltips - User-friendly explanations
// ============================================

const TOOLTIPS = {
    notaContextual: 'Nota geral de 0-10 calculada com base em navegação, app, custo-benefício e outros critérios específicos da categoria.',
    faixaNota: 'Intervalo de confiança da nota. Quanto menor a faixa, mais certeza temos sobre a nota.',
    confiancaNota: 'Nível de confiança da nota: Alta (50+ reviews), Média (10-50 reviews), Baixa (<10 reviews).',
    custoTotal: 'Custo Total de Propriedade: soma do preço de compra + manutenção + peças de reposição + energia elétrica ao longo de 5 anos.',
    faixaCusto: 'Intervalo estimado do custo total. Varia conforme uso e disponibilidade de peças no Brasil.',
    confiancaCusto: 'Confiança no cálculo: Alta (preços reais de peças), Média (estimativas), Baixa (baseado em categoria).',
    preco: 'Menor preço encontrado atualmente nos marketplaces parceiros',
    evidencia: 'Quantidade de dados usados para avaliar: Alta (muitos reviews e testes), Média (razoável), Baixa (poucos dados).',
    marca: 'Fabricante do produto.',
} as const;

// ============================================
// Helpers
// ============================================

function cell(raw: unknown, display: React.ReactNode): CompareCell {
    return { raw, display };
}

// ============================================
// Row Builder - SIMPLIFIED
// ============================================

/**
 * Build comparison rows from two raw products
 * Expects products directly from products.ts (Product type)
 */
export function buildComparisonRows(left: Product, right: Product): CompareRow[] {
    const rows: CompareRow[] = [];
    let rowId = 0;

    const addRow = (
        section: string,
        label: string,
        leftCell: CompareCell,
        rightCell: CompareCell,
        tooltip?: string
    ) => {
        rows.push({
            id: `row-${rowId++}`,
            section,
            label,
            tooltip,
            left: leftCell,
            right: rightCell,
        });
    };

    // ----------------------------------------
    // Section: Resumo
    // ----------------------------------------
    const SECTION_RESUMO = 'Resumo';

    // Nota Contextual - calculated from scores
    const leftScore = getUnifiedScore(left as any);
    const rightScore = getUnifiedScore(right as any);
    addRow(
        SECTION_RESUMO,
        'Nota Contextual',
        cell(leftScore, `${formatScoreValue(leftScore)}/10`),
        cell(rightScore, `${formatScoreValue(rightScore)}/10`),
        TOOLTIPS.notaContextual
    );

    // Faixa da Nota - direct access
    addRow(
        SECTION_RESUMO,
        'Faixa da Nota',
        cell(left.contextualScoreRange, left.contextualScoreRange ? formatScoreRange(left.contextualScoreRange) : '—'),
        cell(right.contextualScoreRange, right.contextualScoreRange ? formatScoreRange(right.contextualScoreRange) : '—'),
        TOOLTIPS.faixaNota
    );

    // Confiança Nota - direct access
    addRow(
        SECTION_RESUMO,
        'Confiança Nota',
        cell(left.contextualScoreConfidence, getConfidenceLabel(left.contextualScoreConfidence) || '—'),
        cell(right.contextualScoreConfidence, getConfidenceLabel(right.contextualScoreConfidence) || '—'),
        TOOLTIPS.confiancaNota
    );

    // ----------------------------------------
    // Section: Custo
    // ----------------------------------------
    const SECTION_CUSTO = 'Custo';

    // TCO 5 anos - from tcoTotalRange midpoint or null
    const leftTcoMid = left.tcoTotalRange ? Math.round((left.tcoTotalRange[0] + left.tcoTotalRange[1]) / 2) : null;
    const rightTcoMid = right.tcoTotalRange ? Math.round((right.tcoTotalRange[0] + right.tcoTotalRange[1]) / 2) : null;
    addRow(
        SECTION_CUSTO,
        'Custo Total (5 anos)',
        cell(leftTcoMid, leftTcoMid ? formatCurrencyValue(leftTcoMid) : '—'),
        cell(rightTcoMid, rightTcoMid ? formatCurrencyValue(rightTcoMid) : '—'),
        TOOLTIPS.custoTotal
    );

    // Faixa do Custo Total - direct access
    addRow(
        SECTION_CUSTO,
        'Faixa do Custo',
        cell(left.tcoTotalRange, left.tcoTotalRange ? formatCurrencyRange(left.tcoTotalRange) : '—'),
        cell(right.tcoTotalRange, right.tcoTotalRange ? formatCurrencyRange(right.tcoTotalRange) : '—'),
        TOOLTIPS.faixaCusto
    );

    // Confiança do Custo - direct access
    addRow(
        SECTION_CUSTO,
        'Confiança do Custo',
        cell(left.tcoConfidence, getConfidenceLabel(left.tcoConfidence) || '—'),
        cell(right.tcoConfidence, getConfidenceLabel(right.tcoConfidence) || '—'),
        TOOLTIPS.confiancaCusto
    );

    // Preço - direct from product.price
    addRow(
        SECTION_CUSTO,
        'Preço',
        cell(left.price, formatCurrencyValue(left.price)),
        cell(right.price, formatCurrencyValue(right.price)),
        TOOLTIPS.preco
    );

    // ----------------------------------------
    // Section: Confiança
    // ----------------------------------------
    const SECTION_CONF = 'Confiança';

    // Nível de Evidência - direct access with default
    const leftEvidence = left.evidenceLevel ?? 'medium';
    const rightEvidence = right.evidenceLevel ?? 'medium';
    addRow(
        SECTION_CONF,
        'Nível de Evidência',
        cell(leftEvidence, getConfidenceLabel(leftEvidence)),
        cell(rightEvidence, getConfidenceLabel(rightEvidence)),
        TOOLTIPS.evidencia
    );

    // ⚠️ REMOVED: "Sinal de Risco" - was redundant (inverse of evidence)

    // ----------------------------------------
    // Section: Geral
    // ----------------------------------------
    const SECTION_GERAL = 'Geral';

    // Marca - direct access
    addRow(
        SECTION_GERAL,
        'Marca',
        cell(left.brand, left.brand || '—'),
        cell(right.brand, right.brand || '—'),
        TOOLTIPS.marca
    );

    return rows;
}

// Legacy export for backwards compatibility
export { ComparisonTableClient as ComparisonTable } from './ComparisonTableClient';
