/**
 * @file textContext.ts
 * @description Anti-contradição: contexto único para IA
 * 
 * Garante que textos gerados pela IA estejam ancorados nos valores
 * do ProductVM, sem inventar números/ratings/preços.
 * 
 * @see src/lib/viewmodels/productVM.ts
 */

import type { ProductVM } from '@/lib/viewmodels/productVM';

// ============================================
// TYPES
// ============================================

export interface ProductTextContext {
    /** Identificação */
    productId: string;
    productName: string;
    shortName: string;
    brand: string;
    category: string;

    /** Números formatados (ÚNICA FONTE) */
    score: {
        value: string;      // "8.3"
        label: string;      // "Muito Bom"
        colorClass: string; // "text-score-good"
    };
    price: {
        current: string;    // "R$ 4.199"
        lowest?: string;
        highest?: string;
    };
    tco?: {
        monthly: string;    // "R$ 45/mês"
        fiveYear: string;   // "R$ 6.899"
    };

    /** Sub-scores (se existirem) */
    subScores: Array<{
        label: string;
        value: string;
    }>;

    /** Bullets objetivos para IA usar */
    keyFacts: string[];

    /** Health status */
    health: 'OK' | 'WARN' | 'FAIL';
    healthIssues: string[];

    /** Instruções para IA */
    instructions: string[];
}

// ============================================
// BUILDER
// ============================================

/**
 * Constrói contexto de texto para IA a partir do ProductVM
 * 
 * Este é o ÚNICO lugar de onde a IA deve tirar números.
 */
export function buildProductTextContext(vm: ProductVM): ProductTextContext {
    // Sub-scores do raw product
    const subScores: Array<{ label: string; value: string }> = [];
    if (vm.raw.scores) {
        const scoreLabels: Record<string, string> = {
            c1: 'Custo-Benefício',
            c2: 'Qualidade de Imagem',
            c3: 'Qualidade de Áudio',
            c4: 'Design & Acabamento',
            c5: 'Recursos Smart',
            c6: 'Conectividade',
            c7: 'Gaming',
            c8: 'Eficiência Energética',
            c9: 'Durabilidade',
            c10: 'Suporte & Garantia',
        };

        for (const [key, value] of Object.entries(vm.raw.scores)) {
            if (typeof value === 'number' && scoreLabels[key]) {
                subScores.push({
                    label: scoreLabels[key],
                    value: value.toFixed(1),
                });
            }
        }
    }

    // Key facts
    const keyFacts: string[] = [
        `Nota geral: ${vm.score.display}/10 (${vm.score.label})`,
        `Preço: ${vm.price.current}`,
        `Marca: ${vm.brand}`,
        `Categoria: ${vm.categorySlug}`,
    ];

    if (vm.badges.length > 0) {
        keyFacts.push(`Badges: ${vm.badges.join(', ')}`);
    }

    if (vm.healthIssues.length > 0) {
        keyFacts.push(`Atenção: ${vm.healthIssues.map(i => i.message).join('; ')}`);
    }

    // TCO - atualmente não está no ProductVM, pode ser adicionado futuramente
    // Para agora, deixamos undefined
    const tco: ProductTextContext['tco'] = undefined;

    return {
        productId: vm.id,
        productName: vm.name,
        shortName: vm.shortName,
        brand: vm.brand,
        category: vm.categorySlug,

        score: {
            value: vm.score.display,
            label: vm.score.label,
            colorClass: vm.score.colorClass,
        },
        price: {
            current: vm.price.current,
            lowest: vm.price.lowest,
            highest: vm.price.highest,
        },
        tco,

        subScores,
        keyFacts,

        health: vm.health,
        healthIssues: vm.healthIssues.map(i => i.message),

        instructions: ANTI_CONTRADICTION_INSTRUCTIONS,
    };
}

// ============================================
// INSTRUÇÕES ANTI-CONTRADIÇÃO
// ============================================

/**
 * Instruções padrão para IA ao gerar textos sobre produtos
 */
export const ANTI_CONTRADICTION_INSTRUCTIONS = [
    '⚠️ USE APENAS os números fornecidos no contexto.',
    '❌ NÃO invente notas, ratings, ou preços.',
    '❌ NÃO recalcule médias ou scores.',
    '✅ Cite os valores exatamente como fornecidos.',
    '✅ Se o contexto não tiver a informação, diga "não disponível".',
    '✅ Referencie badges e labels exatamente.',
];

/**
 * Gera prompt de sistema para IA com contexto do produto
 */
export function buildAISystemPrompt(context: ProductTextContext): string {
    return `
Você é um especialista em tecnologia do ComparaTop.

## Produto Atual
- **Nome**: ${context.productName}
- **Marca**: ${context.brand}
- **Categoria**: ${context.category}

## Números OFICIAIS (USE APENAS ESTES)
- **Nota Geral**: ${context.score.value}/10 (${context.score.label})
- **Preço**: ${context.price.current}
${context.tco ? `- **Custo Mensal**: ${context.tco.monthly}` : ''}

## Sub-scores
${context.subScores.map(s => `- ${s.label}: ${s.value}/10`).join('\n')}

## Regras OBRIGATÓRIAS
${context.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

## Health Status
- Status: ${context.health}
${context.healthIssues.length > 0 ? `- Alertas: ${context.healthIssues.join(', ')}` : ''}
`.trim();
}

/**
 * Verifica se um texto gerado contradiz os valores do contexto
 * (heurística simples)
 */
export function checkTextContradiction(
    text: string,
    context: ProductTextContext
): { hasContradiction: boolean; issues: string[] } {
    const issues: string[] = [];

    // Extrair números do texto
    const numbersInText = text.match(/\d+[,.]?\d*/g) || [];

    // Score esperado
    const expectedScore = parseFloat(context.score.value);

    for (const numStr of numbersInText) {
        const num = parseFloat(numStr.replace(',', '.'));

        // Checar se parece ser um score diferente
        if (num >= 1 && num <= 10 && Math.abs(num - expectedScore) > 0.5) {
            // Possível contradição de score
            if (text.toLowerCase().includes('nota') || text.toLowerCase().includes('score')) {
                issues.push(`Possível contradição: texto menciona "${numStr}" mas score é ${context.score.value}`);
            }
        }
    }

    return {
        hasContradiction: issues.length > 0,
        issues,
    };
}
