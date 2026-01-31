/**
 * Radar Dimension Extraction
 * 
 * Auto-extracts radar chart dimensions from product.scores
 * Maps score keys (c1, c2, etc) to human-readable dimension names
 */

import type { Product } from '@/types/category';

export interface RadarDimension {
    name: string;
    score: number;
    weight: number;
}

// Dimension name mappings by category
const DIMENSION_NAMES: Record<string, Record<string, string>> = {
    'robot-vacuum': {
        c1: 'Navegação',
        c2: 'App/Conectividade',
        c3: 'Sistema de Mop',
        c4: 'Escovas',
        c5: 'Altura/Perfil',
        c6: 'Manutenibilidade',
        c7: 'Bateria/Autonomia',
        c8: 'Acústica',
        c9: 'Base de Carregamento',
        c10: 'Recursos de IA',
    },
    'tv': {
        c1: 'Qualidade de Imagem',
        c2: 'HDR/Contraste',
        c3: 'Taxa de Atualização',
        c4: 'Smart TV/Sistema',
        c5: 'Áudio Integrado',
        c6: 'Conectividade',
        c7: 'Ângulo de Visão',
        c8: 'Gaming',
        c9: 'Design/Acabamento',
        c10: 'Consumo Energético',
    },
    'air-conditioner': {
        c1: 'Capacidade de Refrigeração',
        c2: 'Eficiência Energética',
        c3: 'Nível de Ruído',
        c4: 'Distribuição de Ar',
        c5: 'Controle/App',
        c6: 'Facilidade de Instalação',
        c7: 'Manutenção/Filtros',
        c8: 'Durabilidade',
    },
    'fridge': {
        c1: 'Capacidade',
        c2: 'Eficiência Energética',
        c3: 'Tecnologia de Refrigeração',
        c4: 'Organização Interna',
        c5: 'Nível de Ruído',
        c6: 'Recursos Smart',
        c7: 'Design',
        c8: 'Durabilidade',
    },
    'smartphone': {
        c1: 'Performance',
        c2: 'Câmera',
        c3: 'Bateria',
        c4: 'Tela',
        c5: 'Design',
        c6: 'Software/UI',
        c7: 'Áudio',
        c8: 'Conectividade',
    },
    'smartwatch': {
        c1: 'Performance',
        c2: 'Sensores de Saúde',
        c3: 'Bateria',
        c4: 'Tela',
        c5: 'Design',
        c6: 'Fitness Tracking',
        c7: 'Conectividade',
        c8: 'App/Ecossistema',
    },
    'headphone': {
        c1: 'Qualidade de Som',
        c2: 'Cancelamento de Ruído',
        c3: 'Conforto',
        c4: 'Bateria',
        c5: 'Microfone',
        c6: 'Conectividade',
        c7: 'Build Quality',
        c8: 'App/Codecs',
    },
};

// Default names for unknown categories
const DEFAULT_DIMENSION_NAMES: Record<string, string> = {
    c1: 'Critério 1',
    c2: 'Critério 2',
    c3: 'Critério 3',
    c4: 'Critério 4',
    c5: 'Critério 5',
    c6: 'Critério 6',
    c7: 'Critério 7',
    c8: 'Critério 8',
    c9: 'Critério 9',
    c10: 'Critério 10',
};

/**
 * Extract radar dimensions from product.scores
 * Converts { c1: 8.5, c2: 7.2, ... } to RadarDimension[]
 */
export function extractRadarDimensions(product: Product): RadarDimension[] {
    const scores = product.scores;
    if (!scores || typeof scores !== 'object') {
        return [];
    }

    const categoryId = product.categoryId || 'robot-vacuum';
    const nameMap = DIMENSION_NAMES[categoryId] || DEFAULT_DIMENSION_NAMES;

    const dimensions: RadarDimension[] = [];

    // Extract c1, c2, ... cn scores
    for (const [key, value] of Object.entries(scores)) {
        if (key.startsWith('c') && typeof value === 'number') {
            const name = nameMap[key] || key;
            dimensions.push({
                name,
                score: value,
                weight: 1, // Equal weight by default
            });
        }
    }

    // Sort by key (c1, c2, c3...)
    dimensions.sort((a, b) => {
        const aKey = Object.entries(nameMap).find(([_, v]) => v === a.name)?.[0] || a.name;
        const bKey = Object.entries(nameMap).find(([_, v]) => v === b.name)?.[0] || b.name;
        return aKey.localeCompare(bKey);
    });

    return dimensions;
}

/**
 * Check if product has enough dimensions for radar chart
 * Minimum 3 dimensions required
 */
export function hasValidRadarDimensions(product: Product): boolean {
    const dimensions = extractRadarDimensions(product);
    return dimensions.length >= 3;
}
