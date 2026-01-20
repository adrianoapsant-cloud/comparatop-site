/**
 * @file engineering-schema.ts
 * @description Schema Zod para o módulo "Unknown Unknowns" (Engenharia Oculta)
 * 
 * Este schema define falhas de design, riscos de compatibilidade e detalhes
 * técnicos ocultos que o marketing não revela. Compatível com Vercel AI SDK.
 * 
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const SeverityLevel = z.enum(['CRITICAL', 'WARNING', 'INFO'])
    .describe('Nível de severidade do problema técnico. CRITICAL = produto pode não funcionar. WARNING = funciona com limitações. INFO = bom saber.');

export type SeverityLevel = z.infer<typeof SeverityLevel>;

// ============================================
// MAIN SCHEMA
// ============================================

/**
 * Schema para um item de "Unknown Unknown"
 * Cada item representa um problema técnico oculto que o consumidor
 * geralmente só descobre depois da compra.
 */
export const UnknownUnknownItemSchema = z.object({
    id: z.string()
        .describe('Identificador único do item (slug kebab-case). Ex: region-lock, dark-floor-bug'),

    severity: SeverityLevel
        .describe('Nível de severidade: CRITICAL (produto inutilizável), WARNING (funciona com problemas), INFO (informativo)'),

    topic: z.string()
        .describe('Título curto e técnico do problema. Ex: "Bloqueio Regional (Region Lock)", "O Bug do Piso Escuro"'),

    userQuestion: z.string()
        .describe('A pergunta comum do consumidor que origina este problema. Ex: "Comprei versão chinesa, funciona no Brasil?"'),

    technicalFact: z.string()
        .describe('Explicação técnica da causa raiz do problema. Linguagem de engenharia, sem marketing.'),

    riskAnalysis: z.string()
        .describe('Análise do impacto real se o problema ocorrer. Qual é o pior cenário? Produto "bricked"? Redução de funcionalidade?'),

    mitigationStrategy: z.string()
        .describe('A solução técnica ou workaround. O "pulo do gato" que resolve ou mitiga o problema.'),

    fixabilityScore: z.number().min(1).max(10)
        .describe('Score de 1-10 indicando quão fácil é resolver. 1 = impossível, 10 = trivial (DIY simples).'),

    systemFlag: z.string().optional()
        .describe('Flag de lógica condicional para automação. Ex: IF sku_region == "CN" THEN alert_hard_lock'),

    affectedBrands: z.array(z.string()).optional()
        .describe('Lista de marcas afetadas por este problema. Se vazio, assume-se que afeta a categoria inteira.'),

    sources: z.array(z.string()).optional()
        .describe('Fontes técnicas que comprovam o problema. Links para fóruns, Reddit, vídeos técnicos.'),

    safetyWarning: z.string().optional()
        .describe('Aviso de segurança importante. Exibido em destaque para alertar sobre práticas perigosas.'),
});

export type UnknownUnknownItem = z.infer<typeof UnknownUnknownItemSchema>;

// ============================================
// COLLECTION SCHEMA (Por Categoria)
// ============================================

/**
 * Schema para a coleção de Unknown Unknowns de uma categoria
 */
export const CategoryUnknownUnknownsSchema = z.object({
    categoryId: z.string()
        .describe('ID da categoria (deve corresponder a category-taxonomy.ts). Ex: robot-vacuum, tv, fridge'),

    categoryName: z.string()
        .describe('Nome amigável da categoria. Ex: Robôs Aspiradores, Smart TVs'),

    lastUpdated: z.string()
        .describe('Data da última atualização no formato ISO. Ex: 2026-01-18'),

    items: z.array(UnknownUnknownItemSchema)
        .describe('Lista de problemas técnicos ocultos para esta categoria'),
});

export type CategoryUnknownUnknowns = z.infer<typeof CategoryUnknownUnknownsSchema>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Retorna o ícone Lucide correspondente à severidade
 */
export function getSeverityIcon(severity: SeverityLevel): 'octagon' | 'triangle-alert' | 'info' {
    switch (severity) {
        case 'CRITICAL': return 'octagon';
        case 'WARNING': return 'triangle-alert';
        case 'INFO': return 'info';
    }
}

/**
 * Retorna as classes de cor correspondentes à severidade
 */
export function getSeverityColors(severity: SeverityLevel): {
    icon: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
} {
    switch (severity) {
        case 'CRITICAL':
            return {
                icon: 'text-rose-600 dark:text-rose-400',
                bg: 'bg-rose-50 dark:bg-rose-950/20',
                border: 'border-rose-200 dark:border-rose-800',
                text: 'text-rose-700 dark:text-rose-300',
                badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
            };
        case 'WARNING':
            return {
                icon: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-950/20',
                border: 'border-amber-200 dark:border-amber-800',
                text: 'text-amber-700 dark:text-amber-300',
                badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
            };
        case 'INFO':
            return {
                icon: 'text-slate-500 dark:text-slate-400',
                bg: 'bg-slate-50 dark:bg-slate-800/50',
                border: 'border-slate-200 dark:border-slate-700',
                text: 'text-slate-600 dark:text-slate-400',
                badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
            };
    }
}

/**
 * Retorna o label de fixabilidade baseado no score
 */
export function getFixabilityLabel(score: number): string {
    if (score >= 8) return 'Fácil';
    if (score >= 5) return 'Moderado';
    if (score >= 3) return 'Difícil';
    return 'Muito Difícil';
}
