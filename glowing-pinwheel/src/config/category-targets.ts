/**
 * @file category-targets.ts
 * @description P7-3: Lista alvo de 53 categorias de produto
 * 
 * Derivado da taxonomy após:
 * - Remoção de departamentos/agrupadores
 * - Aplicação de aliases (canonicalização)
 * - Dedupe
 * 
 * @see reports/target-53.md para rationale detalhado
 */

// ============================================
// TARGET 53 CATEGORIES
// ============================================

/**
 * Lista canônica de 53 categorias de produto alvo
 * Ordenadas por prioridade aproximada (eletrônicos/linha branca primeiro)
 */
export const TARGET_CATEGORY_IDS: string[] = [
    // ===== TIER 1: Core Electronics & Line Branca (11 - já suportados) =====
    'tv',
    'fridge',
    'air_conditioner',
    'smartphone',
    'robot-vacuum',
    'smartwatch',
    'laptop',
    'washer',
    'monitor',
    'tablet',
    'soundbar',

    // ===== TIER 2: Alta Prioridade - Mobile & Wearables (4) =====
    'tws',                    // Fones TWS - alta demanda
    'bluetooth-speaker',      // Caixas Bluetooth

    // ===== TIER 3: Alta Prioridade - Gaming (4) =====
    'console',                // Consoles (PS5, Xbox, Switch)
    'headset-gamer',          // Headsets gamer
    'gamepad',                // Gamepads/controles
    'chair',                  // Cadeiras gamer

    // ===== TIER 4: Alta Prioridade - Vídeo & Áudio (2) =====
    'projector',              // Projetores
    'tvbox',                  // TV Box/Sticks

    // ===== TIER 5: Computação (3) =====
    'printer',                // Impressoras
    'router',                 // Roteadores
    // 'notebook' → laptop (alias)

    // ===== TIER 6: Componentes PC (7) =====
    'cpu',                    // Processadores
    'gpu',                    // Placas de vídeo
    'motherboard',            // Placas-mãe
    'ram',                    // Memória RAM
    'ssd',                    // SSDs
    'psu',                    // Fontes
    'case',                   // Gabinetes

    // ===== TIER 7: Linha Branca - Refrigeração (4) =====
    // 'refrigerator' → fridge (alias)
    'freezer',                // Freezers
    'minibar',                // Frigobares
    'wine-cooler',            // Adegas
    // 'air-conditioner' → air_conditioner (alias)
    'fan',                    // Ventiladores

    // ===== TIER 8: Linha Branca - Cozinha (10) =====
    'stove',                  // Fogões/Cooktops
    'builtin-oven',           // Fornos embutidos
    'microwave',              // Micro-ondas
    'air-fryer',              // Air Fryers
    'range-hood',             // Coifas
    'dishwasher',             // Lava-louças
    'espresso-machine',       // Cafeteiras
    'mixer',                  // Batedeiras
    'water-purifier',         // Purificadores
    'food-mixer',             // Mixers alimentares

    // ===== TIER 9: Limpeza (3) =====
    // 'washer' já está no TIER 1
    'washer-dryer',           // Lava e Seca
    'stick-vacuum',           // Aspiradores verticais
    'pressure-washer',        // Lavadoras de pressão

    // ===== TIER 10: Segurança & Casa (2) =====
    'security-camera',        // Câmeras de segurança
    'smart-lock',             // Fechaduras digitais

    // ===== TIER 11: Utilities (5) =====
    'ups',                    // Nobreaks
    'power-strip',            // Filtros de linha
    'camera',                 // Câmeras fotográficas

    // ===== TIER 12: Auto & Ferramentas (3) =====
    'tire',                   // Pneus
    'car-battery',            // Baterias
    'drill',                  // Parafusadeiras
];

// Validação: exatamente 53 categorias
if (TARGET_CATEGORY_IDS.length !== 53) {
    console.warn(`[category-targets] WARNING: TARGET_CATEGORY_IDS tem ${TARGET_CATEGORY_IDS.length} itens, esperado 53`);
}

// ============================================
// METADATA
// ============================================

export interface TargetCategoryMeta {
    displayName?: string;
    rationale: string;
    source: 'taxonomy' | 'business';
    tier: number;
}

export const TARGET_CATEGORY_META: Record<string, TargetCategoryMeta> = {
    // TIER 1 - Core (já suportados)
    'tv': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'fridge': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'air_conditioner': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'smartphone': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'robot-vacuum': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'smartwatch': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'laptop': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'washer': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'monitor': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'tablet': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },
    'soundbar': { rationale: 'Core - já suportado', source: 'taxonomy', tier: 1 },

    // TIER 2 - Mobile
    'tws': { displayName: 'Fones TWS', rationale: 'Alta demanda, specs claros', source: 'taxonomy', tier: 2 },
    'bluetooth-speaker': { displayName: 'Caixas Bluetooth', rationale: 'Complemento mobile', source: 'taxonomy', tier: 2 },

    // TIER 3 - Gaming
    'console': { displayName: 'Consoles', rationale: 'Mercado brasileiro forte', source: 'taxonomy', tier: 3 },
    'headset-gamer': { displayName: 'Headsets Gamer', rationale: 'Alta margem, specs claros', source: 'taxonomy', tier: 3 },
    'gamepad': { displayName: 'Gamepads', rationale: 'Acessório essential', source: 'taxonomy', tier: 3 },
    'chair': { displayName: 'Cadeiras', rationale: 'Alta demanda WFH/gaming', source: 'taxonomy', tier: 3 },

    // Demais categorias seguem padrão similar...
};

// ============================================
// HELPERS
// ============================================

/**
 * Verifica se uma categoria está no alvo de 53
 */
export function isTargetCategory(id: string): boolean {
    return TARGET_CATEGORY_IDS.includes(id);
}

/**
 * Retorna categorias por tier
 */
export function getCategoriesByTier(tier: number): string[] {
    return Object.entries(TARGET_CATEGORY_META)
        .filter(([_, meta]) => meta.tier === tier)
        .map(([id]) => id);
}

/**
 * Retorna próximas categorias a implementar (após tier 1)
 */
export function getNextToImplement(count: number): string[] {
    const implemented = new Set([
        'tv', 'fridge', 'air_conditioner', 'smartphone', 'robot-vacuum',
        'smartwatch', 'laptop', 'washer', 'monitor', 'tablet', 'soundbar'
    ]);
    return TARGET_CATEGORY_IDS.filter(id => !implemented.has(id)).slice(0, count);
}
