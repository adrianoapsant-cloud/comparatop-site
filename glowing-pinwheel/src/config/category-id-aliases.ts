/**
 * @file category-id-aliases.ts
 * @description P7-2: Canonical Category IDs - reconcilia diferentes convenções de nomenclatura
 * 
 * Problema: Taxonomy usa kebab-case, CategoryDefinition usa snake_case em alguns casos
 * Solução: Mapa de aliases para IDs canônicos
 */

// ============================================
// CANONICAL CATEGORY IDS
// ============================================

/**
 * IDs canônicos são os usados em CategoryDefinition e scaffolder
 */
export type CanonicalCategoryId =
    | 'tv'
    | 'fridge'
    | 'air_conditioner'
    | 'smartphone'
    | 'robot-vacuum'
    | 'smartwatch'
    | 'laptop'
    | 'washer'
    | 'monitor'
    | 'tablet'
    | 'soundbar'
    // Futuros (conforme TARGET_53)
    | 'tws'
    | 'air-fryer'
    | 'console'
    | 'headset-gamer'
    | 'microwave'
    | 'dishwasher'
    | 'camera'
    | 'projector'
    | string;  // Permite extensão

// ============================================
// ALIASES
// ============================================

/**
 * Mapa de alias → ID canônico
 * Usado para reconciliar taxonomy com scaffolder/CategoryDefinition
 */
export const CATEGORY_ID_ALIASES: Record<string, string> = {
    // Formato: alias (taxonomy/legacy) → canonical (CategoryDefinition)

    // Vídeo & Áudio
    'smart-tv': 'tv',

    // Refrigeração
    'refrigerator': 'fridge',
    'refrigeration': 'fridge',  // Departamento, não usar como categoria

    // Ar Condicionado (kebab vs snake)
    'air-conditioner': 'air_conditioner',

    // Computação
    'notebook': 'laptop',

    // Limpeza (washer-dryer é categoria separada, não alias)
    // 'washer-dryer' permanece distinto se existir no roadmap
};

/**
 * IDs que são departamentos/agrupadores, não categorias de produto
 * Devem ser excluídos de contagens e TARGET_53
 */
export const DEPARTMENT_IDS = new Set([
    'mobile',
    'computing',
    'components',
    'gaming',
    'video-audio',
    'refrigeration',
    'kitchen',
    'cleaning',
    // Solution clusters (também são agrupadores)
    'setup-gamer',
    'casa-inteligente',
    'home-office',
    'cozinha-pratica',
    'mobilidade',
    'auto-ferramentas',
]);

// ============================================
// HELPERS
// ============================================

/**
 * Resolve um ID para seu ID canônico
 */
export function canonicalize(id: string): string {
    return CATEGORY_ID_ALIASES[id] ?? id;
}

/**
 * Verifica se um ID é departamento/agrupador
 */
export function isDepartment(id: string): boolean {
    return DEPARTMENT_IDS.has(id);
}

/**
 * Canonicaliza e filtra departamentos de uma lista de IDs
 */
export function canonicalizeAndFilter(ids: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const id of ids) {
        if (isDepartment(id)) continue;
        const canonical = canonicalize(id);
        if (!seen.has(canonical)) {
            seen.add(canonical);
            result.push(canonical);
        }
    }

    return result;
}

/**
 * Conta quantos aliases foram resolvidos
 */
export function countResolvedAliases(ids: string[]): { resolved: number; aliases: string[] } {
    const aliases: string[] = [];
    for (const id of ids) {
        if (CATEGORY_ID_ALIASES[id]) {
            aliases.push(`${id} → ${CATEGORY_ID_ALIASES[id]}`);
        }
    }
    return { resolved: aliases.length, aliases };
}
