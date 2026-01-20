/**
 * Product Template Generator
 * 
 * Generates empty product structures with CORRECT criteria
 * for each category. This prevents "leakage" from copying
 * products of other categories.
 * 
 * Usage: generateProductTemplate('smartphone', 'samsung-galaxy-a56-5g')
 */

// ============================================
// CATEGORY CRITERIA DEFINITIONS
// Each category has its own 10 Dores with specific weights
// ============================================

export const CATEGORY_CRITERIA: Record<string, Array<{
    id: string;
    name: string;
    shortName: string;
    weight: number;
    icon: string;
    color: string;
}>> = {
    'tv': [
        { id: 'c1', name: 'Custo-Benefício', shortName: 'Custo', weight: 0.15, icon: 'dollarSign', color: 'emerald' },
        { id: 'c2', name: 'Processamento', shortName: 'CPU', weight: 0.12, icon: 'cpu', color: 'blue' },
        { id: 'c3', name: 'Confiabilidade', shortName: 'Confiança', weight: 0.08, icon: 'shield', color: 'slate' },
        { id: 'c4', name: 'Fluidez do Sistema', shortName: 'Sistema', weight: 0.10, icon: 'smartphone', color: 'purple' },
        { id: 'c5', name: 'Gaming', shortName: 'Gaming', weight: 0.18, icon: 'gamepad2', color: 'green' },
        { id: 'c6', name: 'Brilho', shortName: 'Brilho', weight: 0.08, icon: 'sun', color: 'yellow' },
        { id: 'c7', name: 'Pós-Venda', shortName: 'Suporte', weight: 0.07, icon: 'headphones', color: 'teal' },
        { id: 'c8', name: 'Som', shortName: 'Som', weight: 0.08, icon: 'volume2', color: 'orange' },
        { id: 'c9', name: 'Conectividade', shortName: 'Conexões', weight: 0.07, icon: 'wifi', color: 'indigo' },
        { id: 'c10', name: 'Design', shortName: 'Design', weight: 0.07, icon: 'palette', color: 'pink' },
    ],
    'robot-vacuum': [
        { id: 'c1', name: 'Navegação & Mapeamento', shortName: 'Navegação', weight: 0.25, icon: 'radar', color: 'cyan' },
        { id: 'c2', name: 'Software & Conectividade', shortName: 'App/Voz', weight: 0.15, icon: 'smartphone', color: 'purple' },
        { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', weight: 0.15, icon: 'droplet', color: 'blue' },
        { id: 'c4', name: 'Engenharia de Escovas', shortName: 'Escovas', weight: 0.10, icon: 'sparkles', color: 'emerald' },
        { id: 'c5', name: 'Altura e Acessibilidade', shortName: 'Altura', weight: 0.10, icon: 'ruler', color: 'orange' },
        { id: 'c6', name: 'Manutenibilidade', shortName: 'Peças', weight: 0.08, icon: 'wrench', color: 'slate' },
        { id: 'c7', name: 'Bateria e Autonomia', shortName: 'Bateria', weight: 0.05, icon: 'battery', color: 'green' },
        { id: 'c8', name: 'Acústica', shortName: 'Ruído', weight: 0.05, icon: 'volume2', color: 'amber' },
        { id: 'c9', name: 'Base de Carregamento', shortName: 'Base', weight: 0.05, icon: 'home', color: 'red' },
        { id: 'c10', name: 'Recursos de IA', shortName: 'IA', weight: 0.02, icon: 'brain', color: 'pink' },
    ],
    'smartphone': [
        { id: 'c1', name: 'Autonomia Real', shortName: 'Bateria', weight: 0.20, icon: 'battery', color: 'green' },
        { id: 'c2', name: 'Estabilidade de Software', shortName: 'Software', weight: 0.15, icon: 'smartphone', color: 'purple' },
        { id: 'c3', name: 'Custo-Benefício & Revenda', shortName: 'Custo', weight: 0.15, icon: 'dollarSign', color: 'emerald' },
        { id: 'c4', name: 'Câmera Social', shortName: 'Câmera', weight: 0.10, icon: 'camera', color: 'blue' },
        { id: 'c5', name: 'Resiliência Física', shortName: 'Dureza', weight: 0.10, icon: 'shield', color: 'slate' },
        { id: 'c6', name: 'Qualidade de Tela', shortName: 'Tela', weight: 0.08, icon: 'monitor', color: 'cyan' },
        { id: 'c7', name: 'Pós-Venda & Peças', shortName: 'Suporte', weight: 0.08, icon: 'wrench', color: 'orange' },
        { id: 'c8', name: 'Conectividade', shortName: '5G/WiFi', weight: 0.07, icon: 'wifi', color: 'indigo' },
        { id: 'c9', name: 'Armazenamento', shortName: 'Storage', weight: 0.05, icon: 'hardDrive', color: 'amber' },
        { id: 'c10', name: 'Recursos Úteis', shortName: 'Extras', weight: 0.02, icon: 'sparkles', color: 'pink' },
    ],
    'fridge': [
        { id: 'c1', name: 'Custo-Benefício', shortName: 'Custo', weight: 0.15, icon: 'dollarSign', color: 'emerald' },
        { id: 'c2', name: 'Eficiência Energética', shortName: 'Energia', weight: 0.15, icon: 'zap', color: 'yellow' },
        { id: 'c3', name: 'Capacidade', shortName: 'Litros', weight: 0.12, icon: 'box', color: 'blue' },
        { id: 'c4', name: 'Sistema de Refrigeração', shortName: 'Frio', weight: 0.12, icon: 'thermometer', color: 'cyan' },
        { id: 'c5', name: 'Confiabilidade', shortName: 'Durável', weight: 0.10, icon: 'shield', color: 'slate' },
        { id: 'c6', name: 'Nível de Ruído', shortName: 'Ruído', weight: 0.08, icon: 'volume2', color: 'orange' },
        { id: 'c7', name: 'Pós-Venda', shortName: 'Suporte', weight: 0.10, icon: 'headphones', color: 'teal' },
        { id: 'c8', name: 'Recursos Smart', shortName: 'Smart', weight: 0.06, icon: 'wifi', color: 'purple' },
        { id: 'c9', name: 'Design', shortName: 'Design', weight: 0.06, icon: 'palette', color: 'pink' },
        { id: 'c10', name: 'Funcionalidades', shortName: 'Extras', weight: 0.06, icon: 'sparkles', color: 'amber' },
    ],
    'air_conditioner': [
        { id: 'c1', name: 'Custo-Benefício', shortName: 'Custo', weight: 0.15, icon: 'dollarSign', color: 'emerald' },
        { id: 'c2', name: 'Eficiência Energética', shortName: 'Energia', weight: 0.15, icon: 'zap', color: 'yellow' },
        { id: 'c3', name: 'Capacidade BTU', shortName: 'BTU', weight: 0.12, icon: 'thermometer', color: 'cyan' },
        { id: 'c4', name: 'Durabilidade', shortName: 'Durável', weight: 0.10, icon: 'shield', color: 'slate' },
        { id: 'c5', name: 'Silêncio', shortName: 'Ruído', weight: 0.12, icon: 'volumeX', color: 'blue' },
        { id: 'c6', name: 'Tecnologia Inverter', shortName: 'Inverter', weight: 0.10, icon: 'refreshCw', color: 'green' },
        { id: 'c7', name: 'Pós-Venda', shortName: 'Suporte', weight: 0.08, icon: 'headphones', color: 'teal' },
        { id: 'c8', name: 'Filtros', shortName: 'Filtros', weight: 0.06, icon: 'wind', color: 'purple' },
        { id: 'c9', name: 'Conectividade', shortName: 'Smart', weight: 0.06, icon: 'wifi', color: 'indigo' },
        { id: 'c10', name: 'Design', shortName: 'Design', weight: 0.06, icon: 'palette', color: 'pink' },
    ],
};

// ============================================
// TEMPLATE GENERATOR
// ============================================

/**
 * Generate a product template with correct criteria for the category
 * This PREVENTS copying from other categories and getting wrong criteria
 */
export function generateProductTemplate(categoryId: string, productId: string): string {
    const criteria = CATEGORY_CRITERIA[categoryId];

    if (!criteria) {
        throw new Error(`Unknown category: ${categoryId}. Available: ${Object.keys(CATEGORY_CRITERIA).join(', ')}`);
    }

    // Generate scores object with placeholders
    const scoresLines = criteria.map(c =>
        `        ${c.id}: 0.0,  // ${c.name} (${(c.weight * 100).toFixed(0)}%)`
    ).join('\n');

    // Generate scoreReasons object
    const scoreReasonsLines = criteria.map(c =>
        `        ${c.id}: '',  // Justificativa para ${c.name}`
    ).join('\n');

    return `
// ============================================
// TEMPLATE PARA: ${categoryId.toUpperCase()}
// Critérios específicos desta categoria - NÃO COPIE DE OUTRA!
// ============================================
{
    id: '${productId}',
    categoryId: '${categoryId}',
    name: 'PREENCHER',
    shortName: 'PREENCHER',
    brand: 'PREENCHER',
    model: 'PREENCHER',
    price: 0,
    asin: 'PREENCHER',
    imageUrl: '/images/products/${productId}.svg',
    status: 'published',
    benefitSubtitle: 'PREENCHER',

    // === SCORES: ${categoryId.toUpperCase()} ===
    // Critérios específicos desta categoria:
${criteria.map(c => `    // ${c.id}: ${c.name} (${(c.weight * 100).toFixed(0)}%)`).join('\n')}
    scores: {
${scoresLines}
    },

    scoreReasons: {
${scoreReasonsLines}
    },

    voc: {
        totalReviews: 0,
        averageRating: 0.0,
        oneLiner: 'PREENCHER',
        summary: 'PREENCHER',
        pros: ['PREENCHER', 'PREENCHER', 'PREENCHER'],
        cons: ['PREENCHER', 'PREENCHER', 'PREENCHER'],
        sources: [
            { name: 'Amazon Brasil', url: 'https://...', count: 0 },
        ],
    },

    painPointsSolved: ['PREENCHER', 'PREENCHER', 'PREENCHER'],

    featureBenefits: [
        { icon: 'PREENCHER', title: 'PREENCHER', description: 'PREENCHER' },
        { icon: 'PREENCHER', title: 'PREENCHER', description: 'PREENCHER' },
        { icon: 'PREENCHER', title: 'PREENCHER', description: 'PREENCHER' },
        { icon: 'PREENCHER', title: 'PREENCHER', description: 'PREENCHER' },
    ],

    offers: [],
    badges: [],
    lastUpdated: '${new Date().toISOString().split('T')[0]}',
    gallery: [],
    mainCompetitor: null,
}
`;
}

/**
 * Get category criteria for validation
 */
export function getCategoryCriteria(categoryId: string) {
    return CATEGORY_CRITERIA[categoryId] || null;
}

/**
 * Validate that a product's scores match its category criteria
 */
export function validateProductCriteria(product: { categoryId: string; scores: Record<string, number> }): {
    valid: boolean;
    errors: string[];
} {
    const criteria = CATEGORY_CRITERIA[product.categoryId];
    if (!criteria) {
        return { valid: false, errors: [`Unknown category: ${product.categoryId}`] };
    }

    const errors: string[] = [];
    const expectedIds = new Set(criteria.map(c => c.id));
    const actualIds = new Set(Object.keys(product.scores).filter(k => k.startsWith('c')));

    // Check for missing criteria
    for (const id of expectedIds) {
        if (!actualIds.has(id)) {
            errors.push(`Missing score for ${id}`);
        }
    }

    // Check for extra criteria (from wrong category)
    for (const id of actualIds) {
        if (!expectedIds.has(id)) {
            errors.push(`Extra score ${id} not in ${product.categoryId} criteria`);
        }
    }

    return { valid: errors.length === 0, errors };
}
