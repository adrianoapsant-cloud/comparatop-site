/**
 * @file category-constants.ts
 * @description Constantes por categoria para cálculos atuariais
 * 
 * Este arquivo define valores de referência por categoria que alimentam
 * o Motor de Scoring Atuarial (Shadow Engine).
 * 
 * Fontes:
 * - Uso médio anual: Pesquisa de mercado e PROCEL
 * - Taxas de depreciação: Tabela FIPE e mercado secundário
 * - Custo de peças: Mercado Livre + Assistências autorizadas
 * 
 * @version 1.0.0
 */

// ============================================
// TYPES
// ============================================

/**
 * Constantes específicas de uma categoria de produtos.
 */
export interface CategoryConstants {
    /** Uso médio anual em horas */
    avgAnnualUsageHours: number;

    /** Custo médio de uma "cesta de peças" de reposição (R$) */
    avgSparePartBasketPriceBRL: number;

    /** Custo médio de mão de obra para reparo (R$) */
    avgLaborCostBRL: number;

    /** Taxa de depreciação anual (0.0 a 1.0) */
    depreciationRate: number;

    /** Vida útil média esperada em anos */
    avgLifespanYears: number;

    /** Consumo médio de energia mensal (kWh) - se aplicável */
    avgMonthlyEnergyKwh?: number;

    /** Taxa de falha anual média (0.0 a 1.0) */
    avgAnnualFailureRate: number;

    /** Ícone para exibição */
    icon?: string;

    /** Nome amigável da categoria */
    displayName: string;
}

// ============================================
// CATEGORY CONSTANTS MAP
// ============================================

/**
 * Mapa de constantes por categoria (slug).
 * 
 * @example
 * const tvConstants = CATEGORY_CONSTANTS['tv'];
 * const usage = tvConstants.avgAnnualUsageHours; // 1460
 */
export const CATEGORY_CONSTANTS: Record<string, CategoryConstants> = {
    // ========================================
    // ELETRÔNICOS
    // ========================================

    'tv': {
        displayName: 'Smart TV',
        avgAnnualUsageHours: 1460,          // ~4h/dia
        avgSparePartBasketPriceBRL: 800,    // Placa, painel, fonte
        avgLaborCostBRL: 200,
        depreciationRate: 0.18,             // Tecnologia deprecia rápido
        avgLifespanYears: 8,
        avgMonthlyEnergyKwh: 15,
        avgAnnualFailureRate: 0.03,
        icon: '📺',
    },

    'notebook': {
        displayName: 'Notebook',
        avgAnnualUsageHours: 2000,          // ~5.5h/dia
        avgSparePartBasketPriceBRL: 600,    // Bateria, teclado, tela
        avgLaborCostBRL: 180,
        depreciationRate: 0.20,
        avgLifespanYears: 5,
        avgMonthlyEnergyKwh: 8,
        avgAnnualFailureRate: 0.05,
        icon: '💻',
    },

    'smartphone': {
        displayName: 'Smartphone',
        avgAnnualUsageHours: 1825,          // ~5h/dia
        avgSparePartBasketPriceBRL: 400,    // Tela, bateria
        avgLaborCostBRL: 120,
        depreciationRate: 0.25,             // Alta obsolescência
        avgLifespanYears: 4,
        avgMonthlyEnergyKwh: 2,
        avgAnnualFailureRate: 0.04,
        icon: '📱',
    },

    'tablet': {
        displayName: 'Tablet',
        avgAnnualUsageHours: 1000,
        avgSparePartBasketPriceBRL: 350,
        avgLaborCostBRL: 120,
        depreciationRate: 0.22,
        avgLifespanYears: 5,
        avgMonthlyEnergyKwh: 3,
        avgAnnualFailureRate: 0.04,
        icon: '📱',
    },

    'monitor': {
        displayName: 'Monitor',
        avgAnnualUsageHours: 2500,          // ~7h/dia
        avgSparePartBasketPriceBRL: 400,
        avgLaborCostBRL: 150,
        depreciationRate: 0.15,
        avgLifespanYears: 10,
        avgMonthlyEnergyKwh: 10,
        avgAnnualFailureRate: 0.02,
        icon: '🖥️',
    },

    // ========================================
    // ELETRODOMÉSTICOS - LINHA BRANCA
    // ========================================

    'fridge': {
        displayName: 'Geladeira',
        avgAnnualUsageHours: 8760,          // 24/7/365
        avgSparePartBasketPriceBRL: 600,    // Compressor, termostato
        avgLaborCostBRL: 300,
        depreciationRate: 0.08,             // Depreciação lenta
        avgLifespanYears: 15,
        avgMonthlyEnergyKwh: 35,
        avgAnnualFailureRate: 0.04,
        icon: '🧊',
    },

    'washer': {
        displayName: 'Lavadora',
        avgAnnualUsageHours: 520,           // ~10h/semana
        avgSparePartBasketPriceBRL: 450,    // Motor, placa, rolamentos
        avgLaborCostBRL: 250,
        depreciationRate: 0.10,
        avgLifespanYears: 12,
        avgMonthlyEnergyKwh: 8,
        avgAnnualFailureRate: 0.05,
        icon: '🧺',
    },

    'washer_dryer': {
        displayName: 'Lava e Seca',
        avgAnnualUsageHours: 650,
        avgSparePartBasketPriceBRL: 700,
        avgLaborCostBRL: 300,
        depreciationRate: 0.12,
        avgLifespanYears: 10,
        avgMonthlyEnergyKwh: 25,
        avgAnnualFailureRate: 0.07,         // Mais complexo, mais falhas
        icon: '🧺',
    },

    'dishwasher': {
        displayName: 'Lava-Louças',
        avgAnnualUsageHours: 730,           // 2h/dia
        avgSparePartBasketPriceBRL: 400,
        avgLaborCostBRL: 200,
        depreciationRate: 0.10,
        avgLifespanYears: 12,
        avgMonthlyEnergyKwh: 12,
        avgAnnualFailureRate: 0.04,
        icon: '🍽️',
    },

    // ========================================
    // CLIMATIZAÇÃO
    // ========================================

    'air_conditioner': {
        displayName: 'Ar-Condicionado',
        avgAnnualUsageHours: 2000,          // ~5.5h/dia (verão intenso)
        avgSparePartBasketPriceBRL: 800,    // Compressor, serpentina, placa
        avgLaborCostBRL: 350,
        depreciationRate: 0.10,
        avgLifespanYears: 12,
        avgMonthlyEnergyKwh: 80,            // Alto consumo
        avgAnnualFailureRate: 0.05,
        icon: '❄️',
    },

    'fan': {
        displayName: 'Ventilador',
        avgAnnualUsageHours: 1500,
        avgSparePartBasketPriceBRL: 80,
        avgLaborCostBRL: 60,
        depreciationRate: 0.15,
        avgLifespanYears: 8,
        avgMonthlyEnergyKwh: 5,
        avgAnnualFailureRate: 0.03,
        icon: '🌀',
    },

    // ========================================
    // COZINHA
    // ========================================

    'microwave': {
        displayName: 'Micro-ondas',
        avgAnnualUsageHours: 365,           // 1h/dia
        avgSparePartBasketPriceBRL: 250,
        avgLaborCostBRL: 150,
        depreciationRate: 0.12,
        avgLifespanYears: 10,
        avgMonthlyEnergyKwh: 8,
        avgAnnualFailureRate: 0.04,
        icon: '📦',
    },

    'air_fryer': {
        displayName: 'Air Fryer',
        avgAnnualUsageHours: 300,
        avgSparePartBasketPriceBRL: 150,
        avgLaborCostBRL: 100,
        depreciationRate: 0.15,
        avgLifespanYears: 6,
        avgMonthlyEnergyKwh: 6,
        avgAnnualFailureRate: 0.05,
        icon: '🍟',
    },

    'espresso_machine': {
        displayName: 'Cafeteira Expresso',
        avgAnnualUsageHours: 180,           // 30min/dia
        avgSparePartBasketPriceBRL: 300,
        avgLaborCostBRL: 150,
        depreciationRate: 0.12,
        avgLifespanYears: 8,
        avgMonthlyEnergyKwh: 4,
        avgAnnualFailureRate: 0.06,
        icon: '☕',
    },

    'stove': {
        displayName: 'Fogão',
        avgAnnualUsageHours: 730,
        avgSparePartBasketPriceBRL: 200,
        avgLaborCostBRL: 150,
        depreciationRate: 0.08,
        avgLifespanYears: 15,
        avgAnnualFailureRate: 0.02,
        icon: '🍳',
    },

    // ========================================
    // LIMPEZA
    // ========================================

    'robot_vacuum': {
        displayName: 'Robô Aspirador',
        avgAnnualUsageHours: 500,
        avgSparePartBasketPriceBRL: 200,
        avgLaborCostBRL: 100,
        depreciationRate: 0.18,
        avgLifespanYears: 5,
        avgMonthlyEnergyKwh: 3,
        avgAnnualFailureRate: 0.08,
        icon: '🤖',
    },

    'vacuum_cleaner': {
        displayName: 'Aspirador de Pó',
        avgAnnualUsageHours: 200,
        avgSparePartBasketPriceBRL: 120,
        avgLaborCostBRL: 80,
        depreciationRate: 0.12,
        avgLifespanYears: 8,
        avgMonthlyEnergyKwh: 2,
        avgAnnualFailureRate: 0.04,
        icon: '🧹',
    },

    // ========================================
    // ÁGUA
    // ========================================

    'water_purifier': {
        displayName: 'Purificador de Água',
        avgAnnualUsageHours: 8760,          // Sempre ligado
        avgSparePartBasketPriceBRL: 100,    // Refil é o principal
        avgLaborCostBRL: 50,
        depreciationRate: 0.10,
        avgLifespanYears: 10,
        avgMonthlyEnergyKwh: 5,
        avgAnnualFailureRate: 0.02,
        icon: '💧',
    },

    // ========================================
    // GAMING & ÁUDIO
    // ========================================

    'console': {
        displayName: 'Console de Videogame',
        avgAnnualUsageHours: 1000,
        avgSparePartBasketPriceBRL: 400,
        avgLaborCostBRL: 150,
        depreciationRate: 0.20,
        avgLifespanYears: 7,
        avgMonthlyEnergyKwh: 10,
        avgAnnualFailureRate: 0.04,
        icon: '🎮',
    },

    'soundbar': {
        displayName: 'Soundbar',
        avgAnnualUsageHours: 1000,
        avgSparePartBasketPriceBRL: 200,
        avgLaborCostBRL: 100,
        depreciationRate: 0.12,
        avgLifespanYears: 10,
        avgMonthlyEnergyKwh: 3,
        avgAnnualFailureRate: 0.02,
        icon: '🔊',
    },

    'headset_gamer': {
        displayName: 'Headset Gamer',
        avgAnnualUsageHours: 800,
        avgSparePartBasketPriceBRL: 60,
        avgLaborCostBRL: 40,
        depreciationRate: 0.20,
        avgLifespanYears: 4,
        avgAnnualFailureRate: 0.08,
        icon: '🎧',
    },

    // ========================================
    // COMPONENTES PC
    // ========================================

    'gpu': {
        displayName: 'Placa de Vídeo',
        avgAnnualUsageHours: 2500,
        avgSparePartBasketPriceBRL: 300,    // Pasta térmica, cooler
        avgLaborCostBRL: 100,
        depreciationRate: 0.25,
        avgLifespanYears: 5,
        avgMonthlyEnergyKwh: 30,
        avgAnnualFailureRate: 0.03,
        icon: '🎴',
    },

    'ssd': {
        displayName: 'SSD',
        avgAnnualUsageHours: 4000,
        avgSparePartBasketPriceBRL: 0,      // Não é reparável
        avgLaborCostBRL: 0,
        depreciationRate: 0.15,
        avgLifespanYears: 7,
        avgAnnualFailureRate: 0.01,
        icon: '💾',
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtém as constantes de uma categoria com fallback para valores padrão.
 * 
 * @param categoryId - Slug da categoria
 * @returns Constantes da categoria ou valores padrão
 */
export function getCategoryConstants(categoryId: string): CategoryConstants {
    return CATEGORY_CONSTANTS[categoryId] ?? DEFAULT_CATEGORY_CONSTANTS;
}

/**
 * Valores padrão para categorias não cadastradas.
 */
export const DEFAULT_CATEGORY_CONSTANTS: CategoryConstants = {
    displayName: 'Produto',
    avgAnnualUsageHours: 1000,
    avgSparePartBasketPriceBRL: 300,
    avgLaborCostBRL: 150,
    depreciationRate: 0.15,
    avgLifespanYears: 7,
    avgMonthlyEnergyKwh: 10,
    avgAnnualFailureRate: 0.05,
    icon: '📦',
};

/**
 * Retorna a lista de todas as categorias disponíveis.
 */
export function getAvailableCategories(): string[] {
    return Object.keys(CATEGORY_CONSTANTS);
}

/**
 * Estatísticas agregadas sobre as categorias.
 */
export const CATEGORY_STATS = {
    totalCategories: Object.keys(CATEGORY_CONSTANTS).length,
    avgDepreciationRate: Object.values(CATEGORY_CONSTANTS)
        .reduce((sum, c) => sum + c.depreciationRate, 0) / Object.keys(CATEGORY_CONSTANTS).length,
    avgLifespan: Object.values(CATEGORY_CONSTANTS)
        .reduce((sum, c) => sum + c.avgLifespanYears, 0) / Object.keys(CATEGORY_CONSTANTS).length,
} as const;
