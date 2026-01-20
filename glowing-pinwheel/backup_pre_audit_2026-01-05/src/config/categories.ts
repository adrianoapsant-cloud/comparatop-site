/**
 * Category Configurations - Rules Database
 * 
 * @description Each category defines its exact "10 Pain Criteria" with weights.
 * This is the source of truth for all scoring calculations.
 * 
 * IMPORTANT: Weights within each category must sum to 1.0
 */

import type { CategoryDefinition } from '@/types/category';

// ============================================
// SMART TVs - Based on Strategy Table
// ============================================

export const TV_CATEGORY: CategoryDefinition = {
    id: 'tv',
    name: 'Smart TVs',
    nameSingular: 'Smart TV',
    slug: 'smart-tvs',
    description: 'Compare as melhores Smart TVs 4K e 8K do mercado brasileiro.',
    icon: 'Tv',
    criteria: [
        {
            id: 'c1',
            label: 'Custo-Benefício Real',
            weight: 0.20,
            group: 'VS', // Special flag for VS calculation
            description: 'Relação entre preço e qualidade entregue.',
            icon: 'PiggyBank',
        },
        {
            id: 'c2',
            label: 'Processamento de Imagem',
            weight: 0.15,
            group: 'QS',
            description: 'Upscaling, redução de ruído e tecnologias de IA.',
            icon: 'Cpu',
        },
        {
            id: 'c3',
            label: 'Confiabilidade/Hardware',
            weight: 0.15,
            group: 'GS',
            description: 'Qualidade de construção e durabilidade.',
            icon: 'Shield',
        },
        {
            id: 'c4',
            label: 'Fluidez do Sistema',
            weight: 0.15,
            group: 'QS',
            description: 'Velocidade do SO, responsividade e apps.',
            icon: 'Zap',
        },
        {
            id: 'c5',
            label: 'Desempenho Game',
            weight: 0.10,
            group: 'QS',
            description: 'Input lag, VRR, ALLM e recursos gaming.',
            icon: 'Gamepad2',
        },
        {
            id: 'c6',
            label: 'Brilho e Reflexo',
            weight: 0.10,
            group: 'QS',
            description: 'Brilho máximo e tratamento anti-reflexo.',
            icon: 'Sun',
        },
        {
            id: 'c7',
            label: 'Pós-Venda e Reputação',
            weight: 0.10,
            group: 'GS',
            description: 'Garantia, assistência técnica e reputação da marca.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c8',
            label: 'Qualidade de Som',
            weight: 0.05,
            group: 'QS',
            description: 'Áudio embutido, potência e tecnologias.',
            icon: 'Volume2',
        },
        {
            id: 'c9',
            label: 'Conectividade',
            weight: 0.05,
            group: 'QS',
            description: 'Portas HDMI/USB, Wi-Fi e recursos smart.',
            icon: 'Plug',
        },
        {
            id: 'c10',
            label: 'Design e Instalação',
            weight: 0.05,
            group: 'GS',
            description: 'Estética, acabamento e facilidade de instalação.',
            icon: 'Palette',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Para quem busca o melhor de tudo.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'gamer',
            name: 'Gamer',
            description: 'Prioriza input lag baixo e VRR.',
            icon: '🎮',
            weightOverrides: {
                c5: 0.25, // Gaming +
                c4: 0.15, // Fluidez =
                c2: 0.12, // Processamento -
                c8: 0.03, // Som -
            },
        },
        {
            id: 'cinema',
            name: 'Cinéfilo',
            description: 'Foco em qualidade de imagem e HDR.',
            icon: '🎬',
            weightOverrides: {
                c2: 0.22, // Processamento +
                c6: 0.15, // Brilho +
                c5: 0.05, // Gaming -
            },
        },
        {
            id: 'budget',
            name: 'Econômico',
            description: 'Máximo custo-benefício.',
            icon: '💰',
            weightOverrides: {
                c1: 0.30, // Custo-benefício +
                c7: 0.12, // Pós-venda +
                c2: 0.10, // Processamento -
            },
        },
    ],
};

// ============================================
// GELADEIRAS / REFRIGERADORES - Example Category
// ============================================

export const FRIDGE_CATEGORY: CategoryDefinition = {
    id: 'fridge',
    name: 'Geladeiras',
    nameSingular: 'Geladeira',
    slug: 'geladeiras',
    description: 'Compare as melhores geladeiras e refrigeradores do Brasil.',
    icon: 'Refrigerator',
    criteria: [
        {
            id: 'c1',
            label: 'Custo-Benefício Real',
            weight: 0.20,
            group: 'VS',
            description: 'Preço vs. recursos e qualidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c2',
            label: 'Eficiência Energética',
            weight: 0.18,
            group: 'QS',
            description: 'Selo Procel, consumo em kWh/mês.',
            icon: 'Leaf',
        },
        {
            id: 'c3',
            label: 'Capacidade e Espaço',
            weight: 0.15,
            group: 'QS',
            description: 'Litros totais, organização interna e flexibilidade.',
            icon: 'Package',
        },
        {
            id: 'c4',
            label: 'Sistema de Refrigeração',
            weight: 0.12,
            group: 'QS',
            description: 'Frost Free, Twin Cooling, tecnologia inverter.',
            icon: 'Snowflake',
        },
        {
            id: 'c5',
            label: 'Confiabilidade',
            weight: 0.10,
            group: 'GS',
            description: 'Durabilidade, histórico de falhas e garantia.',
            icon: 'Shield',
        },
        {
            id: 'c6',
            label: 'Nível de Ruído',
            weight: 0.05,
            group: 'QS',
            description: 'Decibéis em operação normal.',
            icon: 'VolumeX',
        },
        {
            id: 'c7',
            label: 'Pós-Venda e Suporte',
            weight: 0.08,
            group: 'GS',
            description: 'Rede de assistência e reputação.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c8',
            label: 'Recursos Smart',
            weight: 0.02,
            group: 'QS',
            description: 'Conectividade, display e recursos inteligentes.',
            icon: 'Wifi',
        },
        {
            id: 'c9',
            label: 'Design e Acabamento',
            weight: 0.05,
            group: 'GS',
            description: 'Estética, material e integração na cozinha.',
            icon: 'Sparkles',
        },
        {
            id: 'c10',
            label: 'Funcionalidades Extras',
            weight: 0.05,
            group: 'GS',
            description: 'Dispenser, gavetas especiais, zona flexível.',
            icon: 'Settings',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Para quem busca o melhor de tudo.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'eco',
            name: 'Econômico',
            description: 'Foco em eficiência energética e custo.',
            icon: '🌱',
            weightOverrides: {
                c2: 0.25, // Eficiência +
                c1: 0.25, // Custo-benefício +
                c8: 0.01, // Smart -
                c9: 0.02, // Design -
            },
        },
        {
            id: 'family',
            name: 'Família Grande',
            description: 'Máxima capacidade e organização.',
            icon: '👨‍👩‍👧‍👦',
            weightOverrides: {
                c3: 0.25, // Capacidade +
                c4: 0.18, // Refrigeração +
                c8: 0.01, // Smart -
            },
        },
    ],
};

// ============================================
// CATEGORY REGISTRY
// ============================================

// ============================================
// AR CONDICIONADO - Tier 1 Category
// ============================================

export const AC_CATEGORY: CategoryDefinition = {
    id: 'air_conditioner',
    name: 'Ar Condicionado',
    nameSingular: 'Ar Condicionado',
    slug: 'ar-condicionados',
    description: 'Compare os melhores ar condicionados Split e Inverter do Brasil.',
    icon: 'Wind',
    criteria: [
        { id: 'c1', label: 'Custo-Benefício', weight: 0.18, group: 'VS', description: 'Preço vs. BTUs e recursos.', icon: 'PiggyBank' },
        { id: 'c2', label: 'Eficiência Energética', weight: 0.18, group: 'QS', description: 'Selo Procel, economia na conta de luz.', icon: 'Leaf' },
        { id: 'c3', label: 'Capacidade de Refrigeração', weight: 0.12, group: 'QS', description: 'BTUs e cobertura de área.', icon: 'Snowflake' },
        { id: 'c4', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Qualidade de materiais e compressor.', icon: 'Shield' },
        { id: 'c5', label: 'Nível de Ruído', weight: 0.10, group: 'QS', description: 'Decibéis da unidade interna.', icon: 'Volume' },
        { id: 'c6', label: 'Tecnologia Inverter', weight: 0.10, group: 'QS', description: 'Inverter, Dual Inverter, convencional.', icon: 'Cpu' },
        { id: 'c7', label: 'Filtros de Ar', weight: 0.06, group: 'QS', description: 'Anti-bacteriano, ionizador, HEPA.', icon: 'Wind' },
        { id: 'c8', label: 'Facilidade de Instalação', weight: 0.06, group: 'GS', description: 'Peso, dimensões, complexidade.', icon: 'Wrench' },
        { id: 'c9', label: 'Conectividade', weight: 0.05, group: 'QS', description: 'WiFi, app, controle por voz.', icon: 'Wifi' },
        { id: 'c10', label: 'Design', weight: 0.05, group: 'GS', description: 'Estética e acabamento.', icon: 'Palette' },
    ],
};

/**
 * All available categories indexed by ID
 */
export const CATEGORIES: Record<string, CategoryDefinition> = {
    tv: TV_CATEGORY,
    fridge: FRIDGE_CATEGORY,
    air_conditioner: AC_CATEGORY,
};

/**
 * Get a category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | null {
    return CATEGORIES[id] ?? null;
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
    return Object.keys(CATEGORIES);
}

/**
 * Get all categories as array
 */
export function getAllCategories(): CategoryDefinition[] {
    return Object.values(CATEGORIES);
}

/**
 * Reference prices for VS calculation (normalized pricing)
 * These represent the "expensive" threshold for each category
 */
export const REFERENCE_PRICES: Record<string, number> = {
    tv: 15000,           // R$ 15.000 is "expensive" for a TV
    fridge: 12000,       // R$ 12.000 is "expensive" for a fridge
    air_conditioner: 5000, // R$ 5.000 is "expensive" for AC
};

/**
 * Get reference price for a category
 */
export function getReferencePrice(categoryId: string): number {
    return REFERENCE_PRICES[categoryId] ?? 10000;
}
