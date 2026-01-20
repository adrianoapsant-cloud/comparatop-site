/**
 * Category Definitions - Server Data
 * 
 * @description Each category defines its own "10 Pain Criteria".
 * This is the source of truth for scoring rules.
 * 
 * IMPORTANT: Weights within each category must sum to 1.0
 */

import type { CategoryDefinition } from '@/types/category';

// ============================================
// SMART TVs
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
            label: 'Qualidade de Imagem',
            weight: 0.18,
            group: 'QS',
            description: 'Contraste, cores, HDR e processamento de imagem.',
            icon: 'Image',
        },
        {
            id: 'c2',
            label: 'Processamento de Imagem',
            weight: 0.12,
            group: 'QS',
            description: 'Upscaling, redução de ruído e tecnologias de IA.',
            icon: 'Cpu',
        },
        {
            id: 'c3',
            label: 'Confiabilidade do Hardware',
            weight: 0.10,
            group: 'QS',
            description: 'Qualidade de construção e durabilidade.',
            icon: 'Shield',
        },
        {
            id: 'c4',
            label: 'Fluidez do Sistema',
            weight: 0.08,
            group: 'QS',
            description: 'Velocidade do SO, responsividade e apps.',
            icon: 'Zap',
        },
        {
            id: 'c5',
            label: 'Desempenho em Games',
            weight: 0.10,
            group: 'QS',
            description: 'Input lag, VRR, ALLM e recursos gaming.',
            icon: 'Gamepad2',
        },
        {
            id: 'c6',
            label: 'Brilho e Reflexo',
            weight: 0.08,
            group: 'QS',
            description: 'Brilho máximo e tratamento anti-reflexo.',
            icon: 'Sun',
        },
        {
            id: 'c7',
            label: 'Custo-Benefício',
            weight: 0.14,
            group: 'VS',
            description: 'Relação entre preço e qualidade entregue.',
            icon: 'PiggyBank',
        },
        {
            id: 'c8',
            label: 'Pós-Venda e Suporte',
            weight: 0.06,
            group: 'VS',
            description: 'Garantia, assistência técnica e reputação.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c9',
            label: 'Qualidade de Som',
            weight: 0.06,
            group: 'GS',
            description: 'Áudio embutido, potência e tecnologias.',
            icon: 'Volume2',
        },
        {
            id: 'c10',
            label: 'Design e Conectividade',
            weight: 0.08,
            group: 'GS',
            description: 'Estética, portas HDMI/USB e recursos smart.',
            icon: 'MonitorSmartphone',
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
                c4: 0.12, // Fluidez +
                c1: 0.15, // Imagem -
                c9: 0.04, // Som -
            },
        },
        {
            id: 'cinema',
            name: 'Cinéfilo',
            description: 'Foco em qualidade de imagem e HDR.',
            icon: '🎬',
            weightOverrides: {
                c1: 0.25, // Imagem +
                c2: 0.15, // Processamento +
                c6: 0.12, // Brilho +
                c5: 0.05, // Gaming -
            },
        },
        {
            id: 'budget',
            name: 'Econômico',
            description: 'Máximo custo-benefício.',
            icon: '💰',
            weightOverrides: {
                c7: 0.25, // Custo-benefício +
                c8: 0.10, // Pós-venda +
                c1: 0.12, // Imagem -
                c5: 0.05, // Gaming -
            },
        },
    ],
};

// ============================================
// GELADEIRAS / REFRIGERADORES
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
            label: 'Capacidade e Espaço',
            weight: 0.15,
            group: 'QS',
            description: 'Litros totais, organização interna e flexibilidade.',
            icon: 'Package',
        },
        {
            id: 'c2',
            label: 'Eficiência Energética',
            weight: 0.18,
            group: 'VS',
            description: 'Selo Procel, consumo em kWh/mês.',
            icon: 'Leaf',
        },
        {
            id: 'c3',
            label: 'Sistema de Refrigeração',
            weight: 0.14,
            group: 'QS',
            description: 'Frost Free, Twin Cooling, tecnologia inverter.',
            icon: 'Snowflake',
        },
        {
            id: 'c4',
            label: 'Confiabilidade',
            weight: 0.10,
            group: 'QS',
            description: 'Durabilidade, histórico de falhas e garantia.',
            icon: 'Shield',
        },
        {
            id: 'c5',
            label: 'Nível de Ruído',
            weight: 0.06,
            group: 'GS',
            description: 'Decibéis em operação normal.',
            icon: 'VolumeX',
        },
        {
            id: 'c6',
            label: 'Recursos Smart',
            weight: 0.05,
            group: 'GS',
            description: 'Conectividade, display e recursos inteligentes.',
            icon: 'Wifi',
        },
        {
            id: 'c7',
            label: 'Custo-Benefício',
            weight: 0.14,
            group: 'VS',
            description: 'Preço vs. recursos e qualidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c8',
            label: 'Pós-Venda e Suporte',
            weight: 0.06,
            group: 'VS',
            description: 'Rede de assistência e reputação.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c9',
            label: 'Design e Acabamento',
            weight: 0.06,
            group: 'GS',
            description: 'Estética, material e integração na cozinha.',
            icon: 'Sparkles',
        },
        {
            id: 'c10',
            label: 'Funcionalidades Extras',
            weight: 0.06,
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
                c7: 0.20, // Custo-benefício +
                c6: 0.02, // Smart -
                c9: 0.03, // Design -
            },
        },
        {
            id: 'family',
            name: 'Família Grande',
            description: 'Máxima capacidade e organização.',
            icon: '👨‍👩‍👧‍👦',
            weightOverrides: {
                c1: 0.25, // Capacidade +
                c3: 0.18, // Refrigeração +
                c6: 0.02, // Smart -
            },
        },
    ],
};

// ============================================
// NOTEBOOKS / LAPTOPS
// ============================================

export const LAPTOP_CATEGORY: CategoryDefinition = {
    id: 'laptop',
    name: 'Notebooks',
    nameSingular: 'Notebook',
    slug: 'notebooks',
    description: 'Compare os melhores notebooks para trabalho, estudo e games.',
    icon: 'Laptop',
    criteria: [
        {
            id: 'c1',
            label: 'Desempenho (CPU)',
            weight: 0.16,
            group: 'QS',
            description: 'Processador, núcleos e velocidade.',
            icon: 'Cpu',
        },
        {
            id: 'c2',
            label: 'Desempenho (GPU)',
            weight: 0.12,
            group: 'QS',
            description: 'Placa de vídeo dedicada ou integrada.',
            icon: 'Monitor',
        },
        {
            id: 'c3',
            label: 'Qualidade da Tela',
            weight: 0.12,
            group: 'QS',
            description: 'Resolução, brilho, cores e taxa de atualização.',
            icon: 'MonitorSmartphone',
        },
        {
            id: 'c4',
            label: 'Bateria',
            weight: 0.10,
            group: 'QS',
            description: 'Duração real e velocidade de recarga.',
            icon: 'Battery',
        },
        {
            id: 'c5',
            label: 'Construção e Portabilidade',
            weight: 0.08,
            group: 'GS',
            description: 'Material, peso e espessura.',
            icon: 'Briefcase',
        },
        {
            id: 'c6',
            label: 'Teclado e Trackpad',
            weight: 0.06,
            group: 'GS',
            description: 'Qualidade de digitação e precisão do touchpad.',
            icon: 'Keyboard',
        },
        {
            id: 'c7',
            label: 'Custo-Benefício',
            weight: 0.14,
            group: 'VS',
            description: 'Preço vs. especificações e qualidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c8',
            label: 'Armazenamento e RAM',
            weight: 0.08,
            group: 'QS',
            description: 'SSD, expansibilidade e memória.',
            icon: 'HardDrive',
        },
        {
            id: 'c9',
            label: 'Ruído e Temperatura',
            weight: 0.06,
            group: 'GS',
            description: 'Sistema de resfriamento e ruído do cooler.',
            icon: 'Fan',
        },
        {
            id: 'c10',
            label: 'Conectividade',
            weight: 0.08,
            group: 'GS',
            description: 'Portas USB-C, HDMI, Wi-Fi 6 e Bluetooth.',
            icon: 'Plug',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso geral versátil.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'gamer',
            name: 'Gamer',
            description: 'Máximo desempenho em jogos.',
            icon: '🎮',
            weightOverrides: {
                c2: 0.22, // GPU +
                c1: 0.18, // CPU +
                c3: 0.14, // Tela +
                c4: 0.05, // Bateria -
                c5: 0.04, // Portabilidade -
            },
        },
        {
            id: 'professional',
            name: 'Profissional',
            description: 'Para produtividade e criação de conteúdo.',
            icon: '💼',
            weightOverrides: {
                c3: 0.16, // Tela +
                c4: 0.14, // Bateria +
                c5: 0.12, // Portabilidade +
                c2: 0.08, // GPU -
            },
        },
        {
            id: 'student',
            name: 'Estudante',
            description: 'Custo-benefício e portabilidade.',
            icon: '📚',
            weightOverrides: {
                c7: 0.22, // Custo-benefício +
                c4: 0.14, // Bateria +
                c5: 0.12, // Portabilidade +
                c2: 0.06, // GPU -
            },
        },
    ],
};

// ============================================
// CATEGORY REGISTRY
// ============================================

/**
 * All available categories indexed by ID
 */
export const CATEGORIES: Record<string, CategoryDefinition> = {
    tv: TV_CATEGORY,
    fridge: FRIDGE_CATEGORY,
    laptop: LAPTOP_CATEGORY,
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
