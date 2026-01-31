#!/usr/bin/env npx tsx
/**
 * @file generate-category-definitions.ts
 * @description P8-A: Gera CategoryDefinitions stub para 42 categorias pendentes
 * 
 * Execute: npx tsx scripts/generate-category-definitions.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CATEGORIES_FILE = path.join(PROJECT_ROOT, 'src', 'config', 'categories.ts');

// 42 categorias pendentes (excluindo as 11 já definidas)
const PENDING_CATEGORIES = [
    // TIER 2: Mobile
    { id: 'tws', name: 'Fones TWS', slug: 'fones-tws', tier: 'mobile' },
    { id: 'bluetooth-speaker', name: 'Caixas Bluetooth', slug: 'caixas-bluetooth', tier: 'mobile' },

    // TIER 3: Gaming
    { id: 'console', name: 'Consoles', slug: 'consoles', tier: 'gaming' },
    { id: 'headset-gamer', name: 'Headsets Gamer', slug: 'headsets-gamer', tier: 'gaming' },
    { id: 'gamepad', name: 'Gamepads', slug: 'gamepads', tier: 'gaming' },
    { id: 'chair', name: 'Cadeiras', slug: 'cadeiras', tier: 'gaming' },

    // TIER 4: Video/Audio
    { id: 'projector', name: 'Projetores', slug: 'projetores', tier: 'video' },
    { id: 'tvbox', name: 'TV Box', slug: 'tv-box', tier: 'video' },

    // TIER 5: Computing
    { id: 'printer', name: 'Impressoras', slug: 'impressoras', tier: 'computing' },
    { id: 'router', name: 'Roteadores', slug: 'roteadores', tier: 'computing' },

    // TIER 6: Components
    { id: 'cpu', name: 'Processadores', slug: 'processadores', tier: 'components' },
    { id: 'gpu', name: 'Placas de Vídeo', slug: 'placas-de-video', tier: 'components' },
    { id: 'motherboard', name: 'Placas-Mãe', slug: 'placas-mae', tier: 'components' },
    { id: 'ram', name: 'Memória RAM', slug: 'memoria-ram', tier: 'components' },
    { id: 'ssd', name: 'SSDs', slug: 'ssds', tier: 'components' },
    { id: 'psu', name: 'Fontes', slug: 'fontes', tier: 'components' },
    { id: 'case', name: 'Gabinetes', slug: 'gabinetes', tier: 'components' },

    // TIER 7: Refrigeration
    { id: 'freezer', name: 'Freezers', slug: 'freezers', tier: 'appliance', usesEnergy: true },
    { id: 'minibar', name: 'Frigobares', slug: 'frigobares', tier: 'appliance', usesEnergy: true },
    { id: 'wine-cooler', name: 'Adegas', slug: 'adegas', tier: 'appliance', usesEnergy: true },
    { id: 'fan', name: 'Ventiladores', slug: 'ventiladores', tier: 'appliance' },

    // TIER 8: Kitchen
    { id: 'stove', name: 'Fogões', slug: 'fogoes', tier: 'kitchen' },
    { id: 'builtin-oven', name: 'Fornos', slug: 'fornos', tier: 'kitchen' },
    { id: 'microwave', name: 'Micro-ondas', slug: 'micro-ondas', tier: 'kitchen' },
    { id: 'air-fryer', name: 'Air Fryers', slug: 'air-fryers', tier: 'kitchen' },
    { id: 'range-hood', name: 'Coifas', slug: 'coifas', tier: 'kitchen' },
    { id: 'dishwasher', name: 'Lava-Louças', slug: 'lava-loucas', tier: 'kitchen', usesEnergy: true },
    { id: 'espresso-machine', name: 'Cafeteiras', slug: 'cafeteiras', tier: 'kitchen' },
    { id: 'mixer', name: 'Batedeiras', slug: 'batedeiras', tier: 'kitchen' },
    { id: 'water-purifier', name: 'Purificadores', slug: 'purificadores', tier: 'kitchen' },
    { id: 'food-mixer', name: 'Mixers', slug: 'mixers', tier: 'kitchen' },

    // TIER 9: Cleaning
    { id: 'washer-dryer', name: 'Lava e Seca', slug: 'lava-e-seca', tier: 'appliance', usesEnergy: true },
    { id: 'stick-vacuum', name: 'Aspiradores', slug: 'aspiradores', tier: 'cleaning' },
    { id: 'pressure-washer', name: 'Lavadoras Pressão', slug: 'lavadoras-pressao', tier: 'cleaning' },

    // TIER 10: Home/Security
    { id: 'security-camera', name: 'Câmeras Segurança', slug: 'cameras-seguranca', tier: 'home' },
    { id: 'smart-lock', name: 'Fechaduras Digitais', slug: 'fechaduras-digitais', tier: 'home' },

    // TIER 11: Utilities
    { id: 'ups', name: 'Nobreaks', slug: 'nobreaks', tier: 'utilities' },
    { id: 'power-strip', name: 'Filtros de Linha', slug: 'filtros-de-linha', tier: 'utilities' },
    { id: 'camera', name: 'Câmeras', slug: 'cameras', tier: 'mobile' },

    // TIER 12: Auto
    { id: 'tire', name: 'Pneus', slug: 'pneus', tier: 'auto' },
    { id: 'car-battery', name: 'Baterias', slug: 'baterias', tier: 'auto' },
    { id: 'drill', name: 'Parafusadeiras', slug: 'parafusadeiras', tier: 'tools' },
];

// Criteria templates by tier (generic/stub)
const CRITERIA_TEMPLATES: Record<string, { id: string; label: string; weight: number; group: string; description: string }[]> = {
    default: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.10, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Valor pelo preço.' },
    ],
    gaming: [
        { id: 'c1', label: 'Performance', weight: 0.18, group: 'QS', description: 'Desempenho em jogos.' },
        { id: 'c2', label: 'Recursos Gaming', weight: 0.15, group: 'QS', description: 'Features para gamers.' },
        { id: 'c3', label: 'Conforto', weight: 0.12, group: 'QS', description: 'Ergonomia e conforto.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Construção robusta.' },
        { id: 'c5', label: 'Latência', weight: 0.10, group: 'QS', description: 'Tempo de resposta.' },
        { id: 'c6', label: 'Compatibilidade', weight: 0.08, group: 'GS', description: 'Suporte a plataformas.' },
        { id: 'c7', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'Wireless/cabo.' },
        { id: 'c8', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética gamer.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.08, group: 'VS', description: 'Valor.' },
    ],
    components: [
        { id: 'c1', label: 'Performance', weight: 0.20, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.10, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Valor.' },
    ],
    appliance: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Tamanho/volume.' },
        { id: 'c2', label: 'Eficiência', weight: 0.15, group: 'QS', description: 'Consumo energia.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Vida útil.' },
        { id: 'c5', label: 'Praticidade', weight: 0.10, group: 'GS', description: 'Facilidade uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível sonoro.' },
        { id: 'c7', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'Smart/WiFi.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Valor.' },
    ],
    kitchen: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Valor.' },
    ],
};

// Reference prices by category
const REFERENCE_PRICES: Record<string, number> = {
    'tws': 1500,
    'bluetooth-speaker': 1000,
    'console': 4000,
    'headset-gamer': 800,
    'gamepad': 400,
    'chair': 2000,
    'projector': 5000,
    'tvbox': 500,
    'printer': 1500,
    'router': 600,
    'cpu': 3000,
    'gpu': 5000,
    'motherboard': 2000,
    'ram': 600,
    'ssd': 800,
    'psu': 800,
    'case': 600,
    'freezer': 4000,
    'minibar': 1500,
    'wine-cooler': 3000,
    'fan': 400,
    'stove': 3000,
    'builtin-oven': 3500,
    'microwave': 800,
    'air-fryer': 600,
    'range-hood': 1500,
    'dishwasher': 4000,
    'espresso-machine': 2000,
    'mixer': 800,
    'water-purifier': 1500,
    'food-mixer': 400,
    'washer-dryer': 5000,
    'stick-vacuum': 2000,
    'pressure-washer': 1500,
    'security-camera': 800,
    'smart-lock': 1000,
    'ups': 1500,
    'power-strip': 150,
    'camera': 5000,
    'tire': 600,
    'car-battery': 600,
    'drill': 800,
};

function getCriteriaForTier(tier: string): typeof CRITERIA_TEMPLATES['default'] {
    return CRITERIA_TEMPLATES[tier] || CRITERIA_TEMPLATES['default'];
}

function generateDefinition(cat: typeof PENDING_CATEGORIES[0]): string {
    const criteria = getCriteriaForTier(cat.tier);
    const varName = cat.id.replace(/-/g, '_').toUpperCase() + '_CATEGORY';

    return `
// ============================================
// ${cat.name.toUpperCase()} - P8 Stub (maturity: stub)
// ============================================

export const ${varName}: CategoryDefinition = {
    id: '${cat.id}',
    name: '${cat.name}',
    nameSingular: '${cat.name.replace(/s$/, '')}',
    slug: '${cat.slug}',
    description: 'Compare os melhores ${cat.name.toLowerCase()}.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
${criteria.map(c => `        { id: '${c.id}', label: '${c.label}', weight: ${c.weight}, group: '${c.group}', description: '${c.description}' },`).join('\n')}
    ],
};
`;
}

function generateCategoriesRegistryEntry(cat: typeof PENDING_CATEGORIES[0]): string {
    const varName = cat.id.replace(/-/g, '_').toUpperCase() + '_CATEGORY';
    return `    '${cat.id}': ${varName},`;
}

function generateReferencePricesEntries(): string {
    return Object.entries(REFERENCE_PRICES)
        .map(([id, price]) => `    '${id}': ${price},`)
        .join('\n');
}

// ============================================
// MAIN
// ============================================

console.log('🚀 Gerando CategoryDefinitions para 42 categorias...\n');

// Read current file
let content = fs.readFileSync(CATEGORIES_FILE, 'utf-8');

// Check if already has maturity field (avoid duplication)
if (content.includes("maturity: 'stub'")) {
    console.log('⚠️  Stubs já existem em categories.ts, pulando geração');
    process.exit(0);
}

// Generate definitions
const definitions = PENDING_CATEGORIES.map(generateDefinition).join('\n');

// Generate registry entries
const registryEntries = PENDING_CATEGORIES.map(generateCategoriesRegistryEntry).join('\n');

// Generate reference prices
const pricesEntries = generateReferencePricesEntries();

// Find insertion points and update
// 1. Insert definitions before CATEGORIES registry
const categoriesMarker = "export const CATEGORIES: Record<string, CategoryDefinition> = {";
content = content.replace(categoriesMarker, definitions + '\n' + categoriesMarker);

// 2. Add to CATEGORIES registry (before closing brace)
const registryCloseMatch = content.match(/export const CATEGORIES[^}]+\{[^}]+\};/s);
if (registryCloseMatch) {
    const oldRegistry = registryCloseMatch[0];
    const newRegistry = oldRegistry.replace(
        /\};\s*$/,
        `    // P8: 42 stubs de categorias
${registryEntries}
};`
    );
    content = content.replace(oldRegistry, newRegistry);
}

// 3. Add reference prices
const pricesMarker = "export const REFERENCE_PRICES: Record<string, number> = {";
const pricesCloseMatch = content.match(/export const REFERENCE_PRICES[^}]+\{[^}]+\};/s);
if (pricesCloseMatch) {
    const oldPrices = pricesCloseMatch[0];
    const newPrices = oldPrices.replace(
        /\};\s*$/,
        `    // P8: 42 stubs
${pricesEntries}
};`
    );
    content = content.replace(oldPrices, newPrices);
}

// Write updated file
fs.writeFileSync(CATEGORIES_FILE, content, 'utf-8');

console.log(`✅ ${PENDING_CATEGORIES.length} CategoryDefinitions geradas`);
console.log(`✅ Registry CATEGORIES atualizado`);
console.log(`✅ REFERENCE_PRICES atualizado`);
console.log(`\n📁 Arquivo: ${CATEGORIES_FILE}`);
