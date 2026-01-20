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
            weight: 0.15,  // Reduced from 0.20 to fix weight sum
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
            weight: 0.10,  // Reduced from 0.15 to fix weight sum
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

// ============================================
// SMARTPHONES - 10 Dores Brasil (Jan 2026)
// ============================================

export const SMARTPHONE_CATEGORY: CategoryDefinition = {
    id: 'smartphone',
    name: 'Smartphones',
    nameSingular: 'Smartphone',
    slug: 'smartphones',
    description: 'Compare os melhores smartphones com foco em autonomia real, custo-benefício e câmera social.',
    icon: 'Smartphone',
    criteria: [
        { id: 'c1', label: 'Autonomia Real', weight: 0.20, group: 'QS', description: 'Duração real da bateria, eficiência e carregamento.', icon: 'Battery' },
        { id: 'c2', label: 'Software', weight: 0.15, group: 'QS', description: 'Interface fluida, updates e ausência de bloatware.', icon: 'Cpu' },
        { id: 'c3', label: 'Custo-Benefício', weight: 0.15, group: 'VS', description: 'Retenção de valor e liquidez de revenda.', icon: 'TrendingUp' },
        { id: 'c4', label: 'Câmera Social', weight: 0.10, group: 'QS', description: 'Qualidade para Instagram/TikTok, OIS e noturnas.', icon: 'Camera' },
        { id: 'c5', label: 'Resiliência', weight: 0.10, group: 'QS', description: 'IP67/68, Gorilla Glass e construção robusta.', icon: 'Shield' },
        { id: 'c6', label: 'Tela', weight: 0.08, group: 'QS', description: 'Brilho para sol forte, 120Hz AMOLED.', icon: 'MonitorSmartphone' },
        { id: 'c7', label: 'Pós-Venda', weight: 0.08, group: 'VS', description: 'Garantia nacional e rede de assistência.', icon: 'HeadphonesIcon' },
        { id: 'c8', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'NFC obrigatório, 5G/4G estável, eSIM.', icon: 'Wifi' },
        { id: 'c9', label: 'Armazenamento', weight: 0.05, group: 'GS', description: 'Mínimo 128GB, UFS rápida, MicroSD.', icon: 'HardDrive' },
        { id: 'c10', label: 'Recursos', weight: 0.02, group: 'GS', description: 'IA útil, som estéreo, modo desktop.', icon: 'Sparkles' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral versátil.', icon: '⚖️', weightOverrides: {} },
        { id: 'social', name: 'Redes Sociais', description: 'Foco em câmera.', icon: '📸', weightOverrides: { c4: 0.20, c6: 0.12, c1: 0.15 } },
        { id: 'battery', name: 'Bateria', description: 'Máxima autonomia.', icon: '🔋', weightOverrides: { c1: 0.30, c4: 0.06 } },
        { id: 'budget', name: 'Econômico', description: 'Custo-benefício.', icon: '💰', weightOverrides: { c3: 0.25, c7: 0.12, c4: 0.05 } },
    ],
};

// ============================================
// ROBÔS ASPIRADORES - PARR-BR Criteria (Jan 2026)
// Baseado em roborock-q7-l5.json e wap-robot-w400
// ============================================

export const ROBOT_VACUUM_CATEGORY: CategoryDefinition = {
    id: 'robot-vacuum',
    name: 'Robôs Aspiradores',
    nameSingular: 'Robô Aspirador',
    slug: 'robos-aspiradores',
    description: 'Compare os melhores robôs aspiradores com LiDAR, mop e autoesvaziamento.',
    icon: 'Bot',
    criteria: [
        // Critérios baseados em roborock-q7-l5.json productDna
        { id: 'c1', label: 'Navegação & Mapeamento', weight: 0.25, group: 'QS', description: 'LiDAR, vSLAM ou aleatória. Mapeamento 3D e zonas.', icon: 'Radar' },
        { id: 'c2', label: 'Software & Conectividade', weight: 0.15, group: 'QS', description: 'App, Alexa/Google, agendamento e controle.', icon: 'Smartphone' },
        { id: 'c3', label: 'Sistema de Mop', weight: 0.15, group: 'QS', description: 'Estático, vibratório, controle de fluxo.', icon: 'Droplet' },
        { id: 'c4', label: 'Engenharia de Escovas', weight: 0.10, group: 'QS', description: 'Anti-emaranhamento, borracha ou cerdas.', icon: 'Sparkles' },
        { id: 'c5', label: 'Altura e Acessibilidade', weight: 0.10, group: 'QS', description: 'Altura em cm, passa sob móveis.', icon: 'Ruler' },
        { id: 'c6', label: 'Manutenibilidade', weight: 0.08, group: 'VS', description: 'Disponibilidade de peças no Brasil.', icon: 'Wrench' },
        { id: 'c7', label: 'Bateria e Autonomia', weight: 0.05, group: 'QS', description: 'Minutos de operação, Recharge & Resume.', icon: 'Battery' },
        { id: 'c8', label: 'Acústica', weight: 0.05, group: 'GS', description: 'Ruído em dB durante operação.', icon: 'Volume2' },
        { id: 'c9', label: 'Base de Carregamento', weight: 0.05, group: 'QS', description: 'Autoesvaziamento, lavagem de mop.', icon: 'Home' },
        { id: 'c10', label: 'Recursos de IA', weight: 0.02, group: 'GS', description: 'Detecção de objetos, câmera, sensores 3D.', icon: 'Brain' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'pets', name: 'Donos de Pets', description: 'Foco em escovas anti-emaranhamento.', icon: '🐕', weightOverrides: { c4: 0.20, c1: 0.20, c7: 0.08 } },
        { id: 'hands-off', name: 'Zero Manutenção', description: 'Autoesvaziamento e autonomia.', icon: '🙌', weightOverrides: { c9: 0.15, c7: 0.10, c3: 0.10 } },
        { id: 'budget', name: 'Econômico', description: 'Custo-benefício básico.', icon: '💰', weightOverrides: { c6: 0.15, c1: 0.15, c9: 0.02 } },
    ],
};

/**
 * All available categories indexed by ID
 */
export const CATEGORIES: Record<string, CategoryDefinition> = {
    tv: TV_CATEGORY,
    fridge: FRIDGE_CATEGORY,
    air_conditioner: AC_CATEGORY,
    smartphone: SMARTPHONE_CATEGORY,
    'robot-vacuum': ROBOT_VACUUM_CATEGORY,
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
    smartphone: 5000,    // R$ 5.000 is "expensive" for a smartphone
};

/**
 * Get reference price for a category
 */
export function getReferencePrice(categoryId: string): number {
    return REFERENCE_PRICES[categoryId] ?? 10000;
}
