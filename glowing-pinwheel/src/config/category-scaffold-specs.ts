/**
 * @file category-scaffold-specs.ts
 * @description Especificações por categoria para o scaffolder
 * 
 * Define baselines de energia, lifespan, e regras determinísticas de score
 * para cada categoria suportada.
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

export interface EnergyBounds {
    /** Valor mínimo aceitável (hard limit) */
    hardMin: number;
    /** Valor máximo aceitável (hard limit) */
    hardMax: number;
    /** Valor mínimo "normal" (soft limit - gera warning) */
    softMin: number;
    /** Valor máximo "normal" (soft limit - gera warning) */
    softMax: number;
}

export interface SpecBounds {
    /** Potência de sucção (Pa) */
    suctionPa?: EnergyBounds;
    /** Altura (cm) */
    heightCm?: EnergyBounds;
    /** Bateria (mAh) */
    batteryMah?: EnergyBounds;
    /** Ruído (dB) */
    noiseDb?: EnergyBounds;
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
        bounds: EnergyBounds;
    };
    specs: SpecBounds;
    deterministicRules: DeterministicRule[];
}

// ============================================
// ROBOT VACUUM SCAFFOLD SPEC
// ============================================

export const ROBOT_VACUUM_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'robot-vacuum',
    energy: {
        baseline: {
            defaultKwhMonth: 3.0,  // Robôs aspiradores consomem ~30W x 3h/dia
            lifespanYears: 5,
            maintenanceRate: 0.05,  // 5% ao ano (escovas, filtros)
        },
        consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
        bounds: {
            hardMin: 0.5,
            hardMax: 30,
            softMin: 1.5,
            softMax: 10,
        },
    },
    specs: {
        suctionPa: {
            hardMin: 500,
            hardMax: 20000,
            softMin: 1000,
            softMax: 12000,
        },
        heightCm: {
            hardMin: 5,
            hardMax: 15,
            softMin: 7,
            softMax: 11,
        },
        batteryMah: {
            hardMin: 1000,
            hardMax: 10000,
            softMin: 2000,
            softMax: 6000,
        },
    },
    deterministicRules: [
        {
            id: 'lidar-navigation-bonus',
            description: 'LiDAR melhora navegação (c1) em +1.0',
            condition: (specs) => {
                const nav = String(specs.navigationType || '').toLowerCase();
                return nav === 'lidar' || nav === 'vslam';
            },
            modifier: { scoreKey: 'c1', delta: 1.0 },
        },
        {
            id: 'auto-empty-base-bonus',
            description: 'Base auto-esvaziante melhora base (c9) em +1.5',
            condition: (specs) => {
                return specs.hasSelfEmpty === true || specs.hasAutoEmpty === true;
            },
            modifier: { scoreKey: 'c9', delta: 1.5 },
        },
        {
            id: 'ultra-slim-height-bonus',
            description: 'Altura <= 8cm melhora altura (c5) em +0.5',
            condition: (specs) => {
                const height = Number(specs.heightCm || specs.height);
                return !isNaN(height) && height <= 8;
            },
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
    ],
};

// ============================================
// REGISTRY
// ============================================

export const CATEGORY_SCAFFOLD_SPECS: Record<string, CategoryScaffoldSpec> = {
    'robot-vacuum': ROBOT_VACUUM_SCAFFOLD_SPEC,
};

/**
 * Obtém spec de scaffold para uma categoria
 */
export function getCategoryScaffoldSpec(categoryId: string): CategoryScaffoldSpec | null {
    return CATEGORY_SCAFFOLD_SPECS[categoryId] || null;
}
