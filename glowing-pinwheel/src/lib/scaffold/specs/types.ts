/**
 * @file types.ts
 * @description Tipos compartilhados para scaffold specs
 */

// ============================================
// TYPES
// ============================================

export interface EnergyBaseline {
    /** Consumo kWh/mês fallback se não houver dados */
    defaultKwhMonth: number;
    /** Vida útil esperada em anos */
    lifespanYears: number;
    /** Taxa de manutenção anual (% do preço) */
    maintenanceRate: number;
}

export interface Bounds {
    /** Valor mínimo aceitável (hard limit) */
    hardMin: number;
    /** Valor máximo aceitável (hard limit) */
    hardMax: number;
    /** Valor mínimo "normal" (soft limit - gera warning) */
    softMin: number;
    /** Valor máximo "normal" (soft limit - gera warning) */
    softMax: number;
}

export interface DeterministicRule {
    /** ID único da regra */
    id: string;
    /** Descrição da regra */
    description: string;
    /** Condição para aplicar a regra */
    condition: (specs: Record<string, unknown>) => boolean;
    /** Modificador de score (ex: c1 += 0.5) */
    modifier: {
        scoreKey: string;  // c1, c2, ..., c10
        delta: number;     // valor a somar/subtrair
    };
}

export interface CategoryScaffoldSpec {
    categoryId: string;
    energy: {
        baseline: EnergyBaseline;
        /** Ordem de precedência para cálculo de consumo */
        consumptionPriority: ('inmetro' | 'label' | 'wattsUsage' | 'baseline')[];
        bounds: Bounds;
    };
    specs: Record<string, Bounds>;
    defaultScores: Record<string, number>;
    deterministicRules: DeterministicRule[];
}
