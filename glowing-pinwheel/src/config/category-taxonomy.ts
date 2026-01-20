/**
 * Category Taxonomy - Dual-Track Navigation System
 * 
 * Track 1: SOLUTIONS_CLUSTERS - Job-to-be-Done navigation (6 missões)
 * Track 2: CATEGORY_TAXONOMY - Technical hierarchy (8 departamentos)
 * 
 * @see implementation_plan.md for architecture details
 */

import {
    Gamepad2, Home, Briefcase, Wrench, Smartphone, Sparkles,
    Tv, Refrigerator, Laptop, Cpu, LucideIcon
} from 'lucide-react';

// =============================================
// TYPES
// =============================================

export interface SolutionCluster {
    id: string;
    name: string;
    tagline: string;
    icon: LucideIcon;
    gradient: string;
    categories: string[];
    priority: 'high' | 'medium' | 'low';
    avgTicket: number;
}

export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    priority: 'high' | 'medium' | 'low';
}

export interface Department {
    id: string;
    name: string;
    icon: LucideIcon;
    priority: 'high' | 'medium' | 'low';
    categories: CategoryItem[];
}

// =============================================
// TRACK 1: SOLUTIONS CLUSTERS (Job-to-be-Done)
// =============================================

export const SOLUTIONS_CLUSTERS: SolutionCluster[] = [
    {
        id: 'setup-gamer',
        name: 'Setup Gamer',
        tagline: 'Monte seu battlestation',
        icon: Gamepad2,
        gradient: 'from-purple-600 to-indigo-700',
        categories: [
            'monitor', 'gpu', 'console', 'headset-gamer',
            'gamepad', 'chair', 'notebook', 'smart-tv'
        ],
        priority: 'high',
        avgTicket: 4500,
    },
    {
        id: 'casa-inteligente',
        name: 'Casa Inteligente',
        tagline: 'Conecte tudo',
        icon: Home,
        gradient: 'from-cyan-500 to-blue-600',
        categories: [
            'smart-tv', 'soundbar', 'robot-vacuum', 'security-camera',
            'smart-lock', 'router', 'air-conditioner'
        ],
        priority: 'high',
        avgTicket: 3200,
    },
    {
        id: 'home-office',
        name: 'Home Office Pro',
        tagline: 'Produtividade máxima',
        icon: Briefcase,
        gradient: 'from-slate-600 to-gray-800',
        categories: [
            'notebook', 'monitor', 'printer', 'router',
            'chair', 'ups'
        ],
        priority: 'high',
        avgTicket: 3800,
    },
    {
        id: 'cozinha-pratica',
        name: 'Cozinha Prática',
        tagline: 'Menos trabalho, mais sabor',
        icon: Sparkles,
        gradient: 'from-orange-500 to-red-600',
        categories: [
            'air-fryer', 'dishwasher', 'microwave', 'espresso-machine',
            'mixer', 'range-hood', 'stove', 'builtin-oven'
        ],
        priority: 'medium',
        avgTicket: 2100,
    },
    {
        id: 'mobilidade',
        name: 'Mobilidade Tech',
        tagline: 'Leve o poder no bolso',
        icon: Smartphone,
        gradient: 'from-green-500 to-emerald-600',
        categories: [
            'smartphone', 'tablet', 'smartwatch', 'tws',
            'bluetooth-speaker', 'camera'
        ],
        priority: 'high',
        avgTicket: 2800,
    },
    {
        id: 'auto-ferramentas',
        name: 'Auto & Ferramentas',
        tagline: 'DIY e manutenção',
        icon: Wrench,
        gradient: 'from-amber-500 to-orange-600',
        categories: [
            'tire', 'car-battery', 'pressure-washer', 'drill',
            'power-strip', 'ups'
        ],
        priority: 'low',
        avgTicket: 800,
    },
];

// =============================================
// TRACK 2: DEPARTAMENTOS (Navegação Técnica)
// =============================================

export const CATEGORY_TAXONOMY: {
    departments: Department[];
    utilities: CategoryItem[];
} = {
    departments: [
        {
            id: 'mobile',
            name: 'Mobile & Wearables',
            icon: Smartphone,
            priority: 'high',
            categories: [
                { id: 'smartphone', name: 'Smartphones', slug: 'smartphones', priority: 'high' },
                { id: 'tablet', name: 'Tablets', slug: 'tablets', priority: 'medium' },
                { id: 'smartwatch', name: 'Smartwatches', slug: 'smartwatches', priority: 'medium' },
                { id: 'tws', name: 'Fones TWS', slug: 'fones-tws', priority: 'medium' },
                { id: 'bluetooth-speaker', name: 'Caixas Bluetooth', slug: 'caixas-bluetooth', priority: 'low' },
            ],
        },
        {
            id: 'computing',
            name: 'Computadores',
            icon: Laptop,
            priority: 'high',
            categories: [
                { id: 'notebook', name: 'Notebooks', slug: 'notebooks', priority: 'high' },
                { id: 'monitor', name: 'Monitores', slug: 'monitores', priority: 'high' },
                { id: 'printer', name: 'Impressoras', slug: 'impressoras', priority: 'low' },
                { id: 'router', name: 'Roteadores', slug: 'roteadores', priority: 'medium' },
            ],
        },
        {
            id: 'components',
            name: 'Componentes PC',
            icon: Cpu,
            priority: 'medium',
            categories: [
                { id: 'cpu', name: 'Processadores', slug: 'processadores', priority: 'high' },
                { id: 'gpu', name: 'Placas de Vídeo', slug: 'placas-de-video', priority: 'high' },
                { id: 'motherboard', name: 'Placas-Mãe', slug: 'placas-mae', priority: 'medium' },
                { id: 'ram', name: 'Memória RAM', slug: 'memoria-ram', priority: 'medium' },
                { id: 'ssd', name: 'SSDs', slug: 'ssds', priority: 'medium' },
                { id: 'psu', name: 'Fontes', slug: 'fontes', priority: 'low' },
                { id: 'case', name: 'Gabinetes', slug: 'gabinetes', priority: 'low' },
            ],
        },
        {
            id: 'gaming',
            name: 'Gaming',
            icon: Gamepad2,
            priority: 'high',
            categories: [
                { id: 'console', name: 'Consoles', slug: 'consoles', priority: 'high' },
                { id: 'headset-gamer', name: 'Headsets Gamer', slug: 'headsets-gamer', priority: 'medium' },
                { id: 'gamepad', name: 'Gamepads', slug: 'gamepads', priority: 'low' },
                { id: 'chair', name: 'Cadeiras', slug: 'cadeiras', priority: 'medium' },
            ],
        },
        {
            id: 'video-audio',
            name: 'Vídeo & Áudio',
            icon: Tv,
            priority: 'high',
            categories: [
                { id: 'smart-tv', name: 'Smart TVs', slug: 'smart-tvs', priority: 'high' },
                { id: 'soundbar', name: 'Soundbars', slug: 'soundbars', priority: 'medium' },
                { id: 'projector', name: 'Projetores', slug: 'projetores', priority: 'low' },
                { id: 'tvbox', name: 'TV Box/Sticks', slug: 'tv-box', priority: 'low' },
            ],
        },
        {
            id: 'refrigeration',
            name: 'Refrigeração & Clima',
            icon: Refrigerator,
            priority: 'high',
            categories: [
                { id: 'refrigerator', name: 'Geladeiras', slug: 'geladeiras', priority: 'high' },
                { id: 'freezer', name: 'Freezers', slug: 'freezers', priority: 'medium' },
                { id: 'minibar', name: 'Frigobares', slug: 'frigobares', priority: 'low' },
                { id: 'wine-cooler', name: 'Adegas', slug: 'adegas', priority: 'low' },
                { id: 'air-conditioner', name: 'Ar-Condicionado', slug: 'ar-condicionados', priority: 'high' },
                { id: 'fan', name: 'Ventiladores', slug: 'ventiladores', priority: 'low' },
            ],
        },
        {
            id: 'kitchen',
            name: 'Cozinha',
            icon: Sparkles,
            priority: 'medium',
            categories: [
                { id: 'stove', name: 'Fogões/Cooktops', slug: 'fogoes', priority: 'high' },
                { id: 'builtin-oven', name: 'Fornos', slug: 'fornos', priority: 'medium' },
                { id: 'microwave', name: 'Micro-ondas', slug: 'micro-ondas', priority: 'medium' },
                { id: 'air-fryer', name: 'Air Fryers', slug: 'air-fryers', priority: 'medium' },
                { id: 'range-hood', name: 'Coifas', slug: 'coifas', priority: 'low' },
                { id: 'dishwasher', name: 'Lava-Louças', slug: 'lava-loucas', priority: 'medium' },
                { id: 'espresso-machine', name: 'Cafeteiras', slug: 'cafeteiras', priority: 'low' },
                { id: 'mixer', name: 'Batedeiras', slug: 'batedeiras', priority: 'low' },
                { id: 'water-purifier', name: 'Purificadores', slug: 'purificadores', priority: 'low' },
                { id: 'food-mixer', name: 'Mixers Alimentares', slug: 'mixers-alimentares', priority: 'low' },
            ],
        },
        {
            id: 'cleaning',
            name: 'Lavanderia & Limpeza',
            icon: Home,
            priority: 'medium',
            categories: [
                { id: 'washer', name: 'Lavadoras', slug: 'maquinas-de-lavar', priority: 'high' },
                { id: 'washer-dryer', name: 'Lava e Seca', slug: 'lava-e-seca', priority: 'high' },
                { id: 'robot-vacuum', name: 'Robôs Aspiradores', slug: 'robos-aspiradores', priority: 'medium' },
                { id: 'stick-vacuum', name: 'Aspiradores', slug: 'aspiradores', priority: 'medium' },
                { id: 'pressure-washer', name: 'Lavadoras de Pressão', slug: 'lavadoras-pressao', priority: 'low' },
            ],
        },
    ],

    // Categorias utilitárias (sem destaque visual no menu principal)
    utilities: [
        { id: 'security-camera', name: 'Câmeras de Segurança', slug: 'cameras-seguranca', priority: 'medium' },
        { id: 'smart-lock', name: 'Fechaduras Digitais', slug: 'fechaduras-digitais', priority: 'low' },
        { id: 'ups', name: 'Nobreaks', slug: 'nobreaks', priority: 'low' },
        { id: 'power-strip', name: 'Filtros de Linha', slug: 'filtros-de-linha', priority: 'low' },
        { id: 'tire', name: 'Pneus', slug: 'pneus', priority: 'low' },
        { id: 'car-battery', name: 'Baterias', slug: 'baterias', priority: 'low' },
        { id: 'drill', name: 'Parafusadeiras', slug: 'parafusadeiras', priority: 'low' },
        { id: 'camera', name: 'Câmeras', slug: 'cameras', priority: 'medium' },
    ],
};

// =============================================
// HELPERS
// =============================================

/**
 * Get category by ID, searching all departments and utilities
 */
export function getCategoryById(id: string): (CategoryItem & { department?: string }) | null {
    for (const dept of CATEGORY_TAXONOMY.departments) {
        const cat = dept.categories.find(c => c.id === id);
        if (cat) return { ...cat, department: dept.id };
    }
    const utility = CATEGORY_TAXONOMY.utilities.find(c => c.id === id);
    return utility || null;
}

/**
 * Get solution cluster by ID
 */
export function getClusterById(id: string): SolutionCluster | null {
    return SOLUTIONS_CLUSTERS.find(c => c.id === id) || null;
}

/**
 * Get all clusters that contain a specific category
 */
export function getClustersForCategory(categoryId: string): SolutionCluster[] {
    return SOLUTIONS_CLUSTERS.filter(c => c.categories.includes(categoryId));
}

/**
 * Get all categories as flat array
 */
export function getAllCategories(): CategoryItem[] {
    const fromDepts = CATEGORY_TAXONOMY.departments.flatMap(d => d.categories);
    return [...fromDepts, ...CATEGORY_TAXONOMY.utilities];
}

/**
 * Map user affinity (category viewed) to recommended cluster
 */
export const AFFINITY_TO_CLUSTER_MAP: Record<string, string> = {
    'gpu': 'setup-gamer',
    'monitor': 'setup-gamer',
    'console': 'setup-gamer',
    'headset-gamer': 'setup-gamer',
    'gamepad': 'setup-gamer',
    'chair': 'setup-gamer',
    'smart-tv': 'casa-inteligente',
    'soundbar': 'casa-inteligente',
    'robot-vacuum': 'casa-inteligente',
    'security-camera': 'casa-inteligente',
    'smart-lock': 'casa-inteligente',
    'router': 'casa-inteligente',
    'notebook': 'home-office',
    'printer': 'home-office',
    'ups': 'home-office',
    'smartphone': 'mobilidade',
    'tablet': 'mobilidade',
    'smartwatch': 'mobilidade',
    'tws': 'mobilidade',
    'bluetooth-speaker': 'mobilidade',
    'air-fryer': 'cozinha-pratica',
    'dishwasher': 'cozinha-pratica',
    'microwave': 'cozinha-pratica',
    'espresso-machine': 'cozinha-pratica',
    'stove': 'cozinha-pratica',
    'tire': 'auto-ferramentas',
    'car-battery': 'auto-ferramentas',
    'pressure-washer': 'auto-ferramentas',
    'drill': 'auto-ferramentas',
};

/**
 * Get recommended cluster based on user affinity
 */
export function getRecommendedCluster(affinity: string | null): string | null {
    if (!affinity) return null;
    return AFFINITY_TO_CLUSTER_MAP[affinity] || null;
}
