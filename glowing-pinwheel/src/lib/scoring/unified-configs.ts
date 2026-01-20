/**
 * @file unified-configs.ts
 * @description Configurações unificadas para SemanticAdapter
 * 
 * IMPORTANTE: Os pesos vêm diretamente de categories.ts (10 Dores)
 * Multiplicados por 100 para compatibilidade com o sistema de pesos
 */

import type { CategoryConfig, CriterionDef, Metacategory } from './semantic-adapter';

// ============================================
// SMART TV - PESOS REAIS DAS 10 DORES
// Fonte: src/config/categories.ts
// ============================================
export const smartTvConfig: CategoryConfig = {
    categoryId: 'smart-tv',
    displayName: 'Smart TV',
    metacategoryWeights: { PERFORMANCE: 45, USABILITY: 20, CONSTRUCTION: 20, ECONOMY: 15 },

    criteria: {
        // === 10 DORES COM PESOS REAIS ===
        c1: {
            label: 'Custo-Benefício Real',
            metacategory: 'ECONOMY',
            weight: 15,  // 0.15 * 100 = 15
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c1'
        },
        c2: {
            label: 'Processamento de Imagem',
            metacategory: 'PERFORMANCE',
            weight: 15,  // 0.15 * 100 = 15
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c2'
        },
        c3: {
            label: 'Confiabilidade/Hardware',
            metacategory: 'CONSTRUCTION',
            weight: 10,  // 0.10 * 100 = 10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c3'
        },
        c4: {
            label: 'Fluidez do Sistema',
            metacategory: 'USABILITY',
            weight: 15,  // 0.15 * 100 = 15
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c4'
        },
        c5: {
            label: 'Desempenho Game',
            metacategory: 'PERFORMANCE',
            weight: 10,  // 0.10 * 100 = 10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c5'
        },
        c6: {
            label: 'Brilho e Reflexo',
            metacategory: 'PERFORMANCE',
            weight: 10,  // 0.10 * 100 = 10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c6'
        },
        c7: {
            label: 'Pós-Venda e Reputação',
            metacategory: 'CONSTRUCTION',
            weight: 10,  // 0.10 * 100 = 10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c7'
        },
        c8: {
            label: 'Qualidade de Som',
            metacategory: 'PERFORMANCE',
            weight: 5,   // 0.05 * 100 = 5
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c8'
        },
        c9: {
            label: 'Conectividade',
            metacategory: 'USABILITY',
            weight: 5,   // 0.05 * 100 = 5
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c9'
        },
        c10: {
            label: 'Design e Instalação',
            metacategory: 'CONSTRUCTION',
            weight: 5,   // 0.05 * 100 = 5
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c10'
        }
    },

    // Verdades Ocultas (desativadas - usando gráfico aranha original)
    extendedCriteria: []
};

// ============================================
// GELADEIRA - PESOS REAIS DAS 10 DORES
// ============================================
export const geladeiraConfig: CategoryConfig = {
    categoryId: 'geladeira',
    displayName: 'Geladeira',
    metacategoryWeights: { PERFORMANCE: 27, USABILITY: 8, CONSTRUCTION: 23, ECONOMY: 42 },

    criteria: {
        c1: {
            label: 'Custo-Benefício Real',
            metacategory: 'ECONOMY',
            weight: 20,  // 0.20
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c1'
        },
        c2: {
            label: 'Eficiência Energética',
            metacategory: 'ECONOMY',
            weight: 18,  // 0.18
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c2'
        },
        c3: {
            label: 'Capacidade e Espaço',
            metacategory: 'PERFORMANCE',
            weight: 15,  // 0.15
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c3'
        },
        c4: {
            label: 'Sistema de Refrigeração',
            metacategory: 'PERFORMANCE',
            weight: 12,  // 0.12
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c4'
        },
        c5: {
            label: 'Confiabilidade',
            metacategory: 'CONSTRUCTION',
            weight: 10,  // 0.10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c5'
        },
        c6: {
            label: 'Nível de Ruído',
            metacategory: 'USABILITY',
            weight: 5,   // 0.05
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c6'
        },
        c7: {
            label: 'Pós-Venda e Suporte',
            metacategory: 'CONSTRUCTION',
            weight: 8,   // 0.08
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c7'
        },
        c8: {
            label: 'Recursos Smart',
            metacategory: 'USABILITY',
            weight: 2,   // 0.02
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c8'
        },
        c9: {
            label: 'Design e Acabamento',
            metacategory: 'CONSTRUCTION',
            weight: 5,   // 0.05
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c9'
        },
        c10: {
            label: 'Funcionalidades Extras',
            metacategory: 'USABILITY',
            weight: 5,   // 0.05
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c10'
        }
    },

    // Verdades Ocultas (desativadas - usando gráfico aranha original)
    extendedCriteria: []
};

// ============================================
// AR-CONDICIONADO - PESOS REAIS DAS 10 DORES
// ============================================
export const arCondicionadoConfig: CategoryConfig = {
    categoryId: 'ar-condicionado',
    displayName: 'Ar-Condicionado',
    metacategoryWeights: { PERFORMANCE: 32, USABILITY: 17, CONSTRUCTION: 15, ECONOMY: 36 },

    criteria: {
        c1: {
            label: 'Custo-Benefício',
            metacategory: 'ECONOMY',
            weight: 18,  // 0.18
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c1'
        },
        c2: {
            label: 'Eficiência Energética',
            metacategory: 'ECONOMY',
            weight: 18,  // 0.18
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c2'
        },
        c3: {
            label: 'Capacidade de Refrigeração',
            metacategory: 'PERFORMANCE',
            weight: 12,  // 0.12
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c3'
        },
        c4: {
            label: 'Durabilidade',
            metacategory: 'CONSTRUCTION',
            weight: 10,  // 0.10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c4'
        },
        c5: {
            label: 'Nível de Ruído',
            metacategory: 'PERFORMANCE',
            weight: 10,  // 0.10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c5'
        },
        c6: {
            label: 'Tecnologia Inverter',
            metacategory: 'PERFORMANCE',
            weight: 10,  // 0.10
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c6'
        },
        c7: {
            label: 'Filtros de Ar',
            metacategory: 'USABILITY',
            weight: 6,   // 0.06
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c7'
        },
        c8: {
            label: 'Facilidade de Instalação',
            metacategory: 'USABILITY',
            weight: 6,   // 0.06
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c8'
        },
        c9: {
            label: 'Conectividade',
            metacategory: 'USABILITY',
            weight: 5,   // 0.05
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c9'
        },
        c10: {
            label: 'Design',
            metacategory: 'CONSTRUCTION',
            weight: 5,   // 0.05
            normalization: { type: 'LINEAR', min: 0, max: 10 },
            source: 'scores',
            dataField: 'c10'
        }
    },

    extendedCriteria: []
};

// ============================================
// DEFAULT CONFIG (Fallback)
// ============================================
export const defaultConfig: CategoryConfig = {
    categoryId: 'default',
    displayName: 'Produto',
    metacategoryWeights: { PERFORMANCE: 35, USABILITY: 20, CONSTRUCTION: 25, ECONOMY: 20 },

    criteria: {
        c1: { label: 'Custo-Benefício', metacategory: 'ECONOMY', weight: 15, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c1' },
        c2: { label: 'Principal', metacategory: 'PERFORMANCE', weight: 15, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c2' },
        c3: { label: 'Confiabilidade', metacategory: 'CONSTRUCTION', weight: 12, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c3' },
        c4: { label: 'Qualidade', metacategory: 'PERFORMANCE', weight: 12, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c4' },
        c5: { label: 'Secundário 1', metacategory: 'PERFORMANCE', weight: 10, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c5' },
        c6: { label: 'Secundário 2', metacategory: 'PERFORMANCE', weight: 10, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c6' },
        c7: { label: 'Pós-Venda', metacategory: 'CONSTRUCTION', weight: 8, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c7' },
        c8: { label: 'Recursos', metacategory: 'USABILITY', weight: 6, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c8' },
        c9: { label: 'Conectividade', metacategory: 'USABILITY', weight: 6, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c9' },
        c10: { label: 'Design', metacategory: 'CONSTRUCTION', weight: 6, normalization: { type: 'LINEAR', min: 0, max: 10 }, source: 'scores', dataField: 'c10' }
    }
};

// ============================================
// REGISTRY
// ============================================
export const UNIFIED_CONFIGS: Record<string, CategoryConfig> = {
    'smart-tv': smartTvConfig,
    'tv': smartTvConfig,
    'geladeira': geladeiraConfig,
    'fridge': geladeiraConfig,
    'refrigerator': geladeiraConfig,
    'ar-condicionado': arCondicionadoConfig,
    'ar_condicionado': arCondicionadoConfig,
    'ac': arCondicionadoConfig,
    'air-conditioner': arCondicionadoConfig,
    'air_conditioner': arCondicionadoConfig,
};

export function getUnifiedConfig(categoryId: string): CategoryConfig {
    const normalized = categoryId.toLowerCase().replace(/[_\s]/g, '-');
    return UNIFIED_CONFIGS[normalized] ?? defaultConfig;
}

export function hasUnifiedConfig(categoryId: string): boolean {
    const normalized = categoryId.toLowerCase().replace(/[_\s]/g, '-');
    return normalized in UNIFIED_CONFIGS;
}
