/**
 * @file category-weights.ts
 * @description SSOT para pesos PARR por categoria.
 * 
 * Regra: TypeScript puro, sem dependências externas.
 * Versão: 1 (bumpar quando alterar pesos)
 */

// ============================================
// TYPES
// ============================================

export type CriteriaKey = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'c10';

export type Weights = Record<CriteriaKey, number>;

// ============================================
// VERSION
// ============================================

/** Incrementar quando alterar pesos */
export const WEIGHTS_VERSION = 1;

// ============================================
// DEFAULT WEIGHTS
// ============================================

/**
 * Pesos padrão quando categoria não tem config específica.
 * Soma = 1.00 (distribuição uniforme)
 */
export const DEFAULT_WEIGHTS: Weights = {
    c1: 0.10,
    c2: 0.10,
    c3: 0.10,
    c4: 0.10,
    c5: 0.10,
    c6: 0.10,
    c7: 0.10,
    c8: 0.10,
    c9: 0.10,
    c10: 0.10,
};

// ============================================
// CATEGORY-SPECIFIC WEIGHTS
// ============================================

/**
 * Pesos específicos por categoria.
 * Migrado de getBaseScore.ts (3 categorias existentes).
 * 
 * Cada categoria soma 1.00 (100%).
 */
export const CATEGORY_WEIGHTS: Record<string, Weights> = {
    // Smart TV weights
    'smart-tv': {
        c1: 0.15,  // Custo-Benefício
        c2: 0.08,  // Design
        c3: 0.12,  // Processamento
        c4: 0.18,  // Qualidade de Imagem
        c5: 0.08,  // Áudio
        c6: 0.10,  // Gaming
        c7: 0.08,  // Smart TV
        c8: 0.07,  // Conectividade
        c9: 0.07,  // Durabilidade
        c10: 0.07, // Suporte
    },

    // Robot Vacuum weights (PARR-BR)
    'robot-vacuum': {
        c1: 0.25,  // Navegação & Mapeamento (25%)
        c2: 0.15,  // Software & Conectividade (15%)
        c3: 0.15,  // Eficiência de Mop (15%)
        c4: 0.10,  // Engenharia de Escovas (10%)
        c5: 0.10,  // Restrições Físicas/Altura (10%)
        c6: 0.08,  // Manutenibilidade/Peças (8%)
        c7: 0.05,  // Autonomia/Bateria (5%)
        c8: 0.05,  // Acústica/Ruído (5%)
        c9: 0.05,  // Automação/Docks/Base (5%)
        c10: 0.02, // Recursos vs Gimmicks/IA (2%)
    },

    // Smartphone weights (10 Dores Brasil)
    'smartphone': {
        c1: 0.20,  // Autonomia Real (IARSE)
        c2: 0.15,  // Estabilidade de Software (ESMI)
        c3: 0.15,  // Custo-Benefício & Revenda (RCBIRV)
        c4: 0.10,  // Câmera Social (QFSR)
        c5: 0.10,  // Resiliência Física (RFCT)
        c6: 0.08,  // Qualidade de Tela (QDAE)
        c7: 0.08,  // Pós-Venda & Peças (EPST)
        c8: 0.07,  // Conectividade (CPI)
        c9: 0.05,  // Armazenamento (AGD)
        c10: 0.02, // Recursos Úteis (IFM)
    },
};

// ============================================
// CATEGORY ALIASES
// ============================================

/**
 * Mapeamento de aliases para categoryId canônico.
 * Resolve inconsistências encontradas na auditoria.
 */
export const CATEGORY_ALIASES: Record<string, string> = {
    // TV variants -> smart-tv
    'tv': 'smart-tv',
    'smart_tv': 'smart-tv',
    'television': 'smart-tv',
    'televisao': 'smart-tv',

    // Robot Vacuum variants -> robot-vacuum
    'robo-aspirador': 'robot-vacuum',
    'aspirador-robo': 'robot-vacuum',
    'robo_aspirador': 'robot-vacuum',
    'robovac': 'robot-vacuum',

    // Smartphone variants -> smartphone
    'celular': 'smartphone',
    'phone': 'smartphone',
    'mobile': 'smartphone',

    // Fridge variants (para futuro)
    'geladeira': 'fridge',
    'refrigerador': 'fridge',
    'refrigerator': 'fridge',

    // Air Conditioner variants (para futuro)
    'ar-condicionado': 'air-conditioner',
    'ar_condicionado': 'air-conditioner',
    'ac': 'air-conditioner',

    // Washer variants (para futuro)
    'lavadora': 'washer',
    'maquina-lavar': 'washer',
    'washing-machine': 'washer',
};
