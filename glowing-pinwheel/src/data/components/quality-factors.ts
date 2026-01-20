/**
 * @file quality-factors.ts
 * @description Mapeamento de Quality Factors (πMarca, πTech) por produto
 * 
 * Baseado no relatório "Diferenciação Qualidade Componentes por Marca"
 * que analisa BOM (Bill of Materials) e confiabilidade de componentes.
 * 
 * Fórmula: VUE = VUE_Base × πMarca × πTech × πAmbiente
 * 
 * @version 1.0.0
 */

import type {
    BrandQualityTier,
    BrandQualityMapping,
    ProductQualityFactors,
    DisplayTechnology,
    CompressorTechnology,
} from './types';

import {
    BRAND_QUALITY_FACTORS,
    DISPLAY_TECH_FACTORS,
    COMPRESSOR_TECH_FACTORS,
} from './types';

// ============================================
// MAPEAMENTO DE MARCAS → TIERS (TVs)
// ============================================

export const TV_BRAND_QUALITY_MAP: BrandQualityMapping[] = [
    // Elite Tier (1.20x)
    { brand: 'Sony', categoryId: 'tv', tier: 'elite', notes: 'Capacitores Rubycon/Chemicon 105°C exclusivos' },
    { brand: 'Panasonic', categoryId: 'tv', tier: 'elite', notes: 'Design térmico superdimensionado' },

    // Premium Tier (1.05x)
    { brand: 'Samsung', categoryId: 'tv', tier: 'premium', notes: 'Mix Samwha/Rubycon em modelos high-end' },
    { brand: 'LG', categoryId: 'tv', tier: 'premium', notes: 'Placas de fonte discretas, QC rigoroso' },

    // Standard Tier (0.90x) - Not used for specific products below

    // Budget Tier (0.80x)
    { brand: 'TCL', categoryId: 'tv', tier: 'budget', notes: 'Capacitores Aishi/CapXon, IPB comum' },
    { brand: 'Hisense', categoryId: 'tv', tier: 'budget', notes: 'Integração vertical limita custos' },
    { brand: 'Philco', categoryId: 'tv', tier: 'budget', notes: 'ODM chinês com componentes Tier 3' },
    { brand: 'AOC', categoryId: 'tv', tier: 'budget', notes: 'Foco em custo, componentes variáveis' },

    // Generic Tier (0.60x)
    { brand: 'Multilaser', categoryId: 'tv', tier: 'generic', notes: 'Sem rastreabilidade de componentes' },
    { brand: 'Britânia', categoryId: 'tv', tier: 'generic', notes: 'Alto risco de mortalidade infantil' },
    { brand: 'HQ', categoryId: 'tv', tier: 'generic', notes: 'Capacitores 85°C, solda de baixa qualidade' },
    { brand: 'Semp', categoryId: 'tv', tier: 'generic', notes: 'ODM sem controle de qualidade consistente' },
];

// ============================================
// MAPEAMENTO DE MARCAS → TIERS (Geladeiras)
// ============================================

export const FRIDGE_BRAND_QUALITY_MAP: BrandQualityMapping[] = [
    // Elite Tier (1.20x)
    { brand: 'Liebherr', categoryId: 'fridge', tier: 'elite', notes: 'Compressores Embraco premium, isolamento superior' },
    { brand: 'Bosch', categoryId: 'fridge', tier: 'elite', notes: 'Engenharia alemã, componentes de longa vida' },

    // Premium Tier (1.05x)
    { brand: 'Brastemp', categoryId: 'fridge', tier: 'premium', notes: 'Whirlpool Brasil, compressores Embraco' },
    { brand: 'Electrolux', categoryId: 'fridge', tier: 'premium', notes: 'Mix de Embraco/próprio, bom histórico' },
    { brand: 'Samsung', categoryId: 'fridge', tier: 'premium', notes: 'Compressores GMCC em modelos altos' },

    // Standard Tier (0.90x)
    { brand: 'Consul', categoryId: 'fridge', tier: 'standard', notes: 'Whirlpool entrada, Embraco em alguns modelos' },
    { brand: 'LG', categoryId: 'fridge', tier: 'standard', notes: 'Linear Inverter problemático <2022' },

    // Budget Tier (0.80x)
    { brand: 'Midea', categoryId: 'fridge', tier: 'budget', notes: 'Compressores Jianbei/Donper' },
    { brand: 'Philco', categoryId: 'fridge', tier: 'budget', notes: 'ODM chinês, componentes variáveis' },
];

// ============================================
// MAPEAMENTO DE MARCAS → TIERS (Ar-Condicionado)
// Based on: "Análise Qualidade Componentes Ar e Notebooks"
// ============================================

export const AC_BRAND_QUALITY_MAP: BrandQualityMapping[] = [
    // Elite Tier (1.20x)
    { brand: 'Daikin', categoryId: 'ac', tier: 'elite', notes: 'Tecnologia Scroll, engenharia japonesa premium' },
    { brand: 'Fujitsu', categoryId: 'ac', tier: 'elite', notes: 'Compressores robustos, design para ambientes extremos' },

    // Premium Tier (1.05x)
    { brand: 'Gree', categoryId: 'ac', tier: 'premium', notes: 'Compressores Landa próprios, margens térmicas superiores' },
    { brand: 'LG', categoryId: 'ac', tier: 'premium', notes: 'Dual Inverter robusto, bom histórico' },
    { brand: 'Samsung', categoryId: 'ac', tier: 'premium', notes: 'Wind-Free technology, qualidade consistente' },

    // Standard Tier (0.90x)
    { brand: 'Midea', categoryId: 'ac', tier: 'standard', notes: 'Compressores GMCC, custo-benefício equilibrado' },
    { brand: 'Carrier', categoryId: 'ac', tier: 'standard', notes: 'GMCC, boa disponibilidade de peças' },
    { brand: 'Springer', categoryId: 'ac', tier: 'standard', notes: 'Whirlpool Brasil, GMCC' },
    { brand: 'Consul', categoryId: 'ac', tier: 'standard', notes: 'Whirlpool entrada, GMCC' },
    { brand: 'Elgin', categoryId: 'ac', tier: 'standard', notes: 'GMCC, foco em residencial' },

    // Budget Tier (0.80x)
    { brand: 'Philco', categoryId: 'ac', tier: 'budget', notes: 'Compressores Rechi, menor tolerância térmica' },
    { brand: 'Agratto', categoryId: 'ac', tier: 'budget', notes: 'OEM chinês, peças difíceis após garantia' },
    { brand: 'Britânia', categoryId: 'ac', tier: 'budget', notes: 'Compressores variáveis, QC inconsistente' },

    // Generic Tier (0.60x)
    { brand: 'Multilaser', categoryId: 'ac', tier: 'generic', notes: 'Importação direta, suporte pós-venda limitado' },
];

// ============================================
// MAPEAMENTO DE MARCAS → TIERS (Lavadoras)
// Based on: "Análise Crítica Componentes Lavadoras Automáticas"
// ============================================

export const WASHER_BRAND_QUALITY_MAP: BrandQualityMapping[] = [
    // Elite Tier (1.20x)
    // No elite tier in Brazil market

    // Premium Tier (1.05x)
    { brand: 'LG', categoryId: 'washer', tier: 'premium', notes: 'Direct Drive, tecnologia superior, reparo caro' },
    { brand: 'Samsung', categoryId: 'washer', tier: 'premium', notes: 'Inverter robusto, histórico de cruzeta' },

    // Standard Tier (0.90x)
    { brand: 'Brastemp', categoryId: 'washer', tier: 'standard', notes: 'Mecânica lendária, tanques selados recentes' },
    { brand: 'Consul', categoryId: 'washer', tier: 'standard', notes: 'Whirlpool entrada, peças abundantes' },
    { brand: 'Electrolux', categoryId: 'washer', tier: 'standard', notes: 'Líder em Design for Repair, TCO baixo' },
    { brand: 'Midea', categoryId: 'washer', tier: 'standard', notes: 'Storm Wash, inverter acessível' },

    // Budget Tier (0.80x)
    { brand: 'Philco', categoryId: 'washer', tier: 'budget', notes: 'OEM genérico, peças difíceis' },
    { brand: 'Colormaq', categoryId: 'washer', tier: 'budget', notes: 'Simplicidade radical, gabinete propenso a ferrugem' },
];

// ============================================
// MAPEAMENTO DE MARCAS → TIERS (Notebooks)
// Based on: "Análise Qualidade Notebooks Brasil VUE"
// ============================================

export const NOTEBOOK_BRAND_QUALITY_MAP: BrandQualityMapping[] = [
    // Elite Tier (1.20x)
    { brand: 'Apple', categoryId: 'notebook', tier: 'elite', notes: 'MacBook, design térmico e bateria superiores' },
    { brand: 'Lenovo ThinkPad', categoryId: 'notebook', tier: 'elite', notes: 'Séries T/X, durabilidade militar' },

    // Premium Tier (1.05x)
    { brand: 'Dell Latitude', categoryId: 'notebook', tier: 'premium', notes: 'Linha corporativa, peças padronizadas' },
    { brand: 'HP EliteBook', categoryId: 'notebook', tier: 'premium', notes: 'Chassi metal, design robusto' },
    { brand: 'ASUS ZenBook', categoryId: 'notebook', tier: 'premium', notes: 'Componentes premium, térmico razoável' },

    // Standard Tier (0.90x)
    { brand: 'Dell Inspiron', categoryId: 'notebook', tier: 'standard', notes: 'Dobradiças problemáticas, peças acessíveis' },
    { brand: 'Dell G15', categoryId: 'notebook', tier: 'standard', notes: 'Gamer, térmico melhor que Acer, ruidoso' },
    { brand: 'HP Pavilion', categoryId: 'notebook', tier: 'standard', notes: 'Consumidor, qualidade variável' },
    { brand: 'Lenovo IdeaPad', categoryId: 'notebook', tier: 'standard', notes: 'Consumidor, plástico mas decente' },
    { brand: 'ASUS VivoBook', categoryId: 'notebook', tier: 'standard', notes: 'Entrada premium, térmico limitado' },

    // Budget Tier (0.80x)
    { brand: 'Acer Nitro', categoryId: 'notebook', tier: 'budget', notes: 'Gamer acessível, pump-out térmico, dobradiça fraca' },
    { brand: 'Acer Aspire', categoryId: 'notebook', tier: 'budget', notes: 'Consumidor, plástico, térmico básico' },
    { brand: 'Samsung Book', categoryId: 'notebook', tier: 'budget', notes: 'Tela AMOLED frágil, trincas espontâneas' },

    // Generic Tier (0.60x)
    { brand: 'Positivo', categoryId: 'notebook', tier: 'generic', notes: 'Motion/Stilo, VRM subdimensionado, teclado fatal' },
    { brand: 'Multilaser', categoryId: 'notebook', tier: 'generic', notes: 'Legacy, componentes mínimos, SSD QLC' },
    { brand: 'Compaq', categoryId: 'notebook', tier: 'generic', notes: 'Rebadge Positivo, mesmos problemas' },
];

// ============================================
// MAPEAMENTO DE PRODUTOS ESPECÍFICOS
// ============================================

export const PRODUCT_QUALITY_FACTORS: ProductQualityFactors[] = [
    // ----------------------------------------
    // TVs
    // ----------------------------------------
    {
        productId: 'samsung-qn90c-65',
        brandTier: 'premium',
        displayTechnology: 'mini_led',
        // VUE = 10 × 1.05 × 1.05 = 11.02 anos
    },
    {
        productId: 'lg-c3-65',
        brandTier: 'premium',
        displayTechnology: 'oled_evo',
        // VUE = 10 × 1.05 × 1.15 = 12.07 anos
    },
    {
        productId: 'tcl-c735-65',
        brandTier: 'budget',
        displayTechnology: 'edge_led',
        // VUE = 10 × 0.80 × 0.85 = 6.8 anos (ajustado de 7.2 com πTech corrigido)
    },
    {
        productId: 'sony-x90l-65',
        brandTier: 'elite',
        displayTechnology: 'mini_led',
        // VUE = 10 × 1.20 × 1.05 = 12.6 anos
    },
    {
        productId: 'lg-b3-55',
        brandTier: 'premium',
        displayTechnology: 'oled_standard',
        // VUE = 10 × 1.05 × 0.80 = 8.4 anos
    },
    {
        productId: 'hisense-u7h-65',
        brandTier: 'budget',
        displayTechnology: 'mini_led',
        // VUE = 10 × 0.80 × 1.05 = 8.4 anos
    },

    // ----------------------------------------
    // Geladeiras
    // ----------------------------------------
    {
        productId: 'samsung-rf23-family-hub',
        brandTier: 'premium',
        compressorTechnology: 'inverter_reciprocating',
        // VUE = 14 × 1.05 × 1.20 = 17.64 anos
    },
    {
        productId: 'consul-crm50-410',
        brandTier: 'standard',
        compressorTechnology: 'reciprocating_onoff',
        // VUE = 14 × 0.90 × 1.00 = 12.6 anos
    },
    {
        productId: 'lg-french-door-linear',
        brandTier: 'standard',
        compressorTechnology: 'linear_inverter',
        // VUE = 14 × 0.90 × 0.65 = 8.19 anos (penalidade linear inverter)
    },
    {
        productId: 'brastemp-inverse-478l',
        brandTier: 'premium',
        compressorTechnology: 'inverter_reciprocating',
        // VUE = 14 × 1.05 × 1.20 = 17.64 anos
    },
    {
        productId: 'electrolux-df56-474l',
        brandTier: 'premium',
        compressorTechnology: 'reciprocating_onoff',
        // VUE = 14 × 1.05 × 1.00 = 14.7 anos
    },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtém os quality factors para um produto específico
 */
export function getProductQualityFactors(productId: string): ProductQualityFactors | undefined {
    return PRODUCT_QUALITY_FACTORS.find(p => p.productId === productId);
}

/**
 * Obtém o tier de qualidade de uma marca para uma categoria
 */
export function getBrandTier(brand: string, categoryId: string): BrandQualityTier {
    const allMaps = [
        ...TV_BRAND_QUALITY_MAP,
        ...FRIDGE_BRAND_QUALITY_MAP,
        ...AC_BRAND_QUALITY_MAP,
        ...WASHER_BRAND_QUALITY_MAP,
        ...NOTEBOOK_BRAND_QUALITY_MAP,
    ];
    const mapping = allMaps.find(
        m => m.brand.toLowerCase() === brand.toLowerCase() && m.categoryId === categoryId
    );
    return mapping?.tier ?? 'standard'; // Default to standard if not found
}

/**
 * Calcula o fator combinado de qualidade (πMarca × πTech)
 * 
 * @param productId - ID do produto
 * @param brandFallback - Marca para usar se produto não mapeado
 * @param categoryId - Categoria do produto
 * @returns Fator multiplicador para VUE_Base
 */
export function calculateQualityMultiplier(
    productId: string,
    brandFallback?: string,
    categoryId?: string
): { brandFactor: number; techFactor: number; combined: number } {
    const productFactors = getProductQualityFactors(productId);

    let brandFactor = 1.0;
    let techFactor = 1.0;

    if (productFactors) {
        // Use product-specific factors
        if (productFactors.brandFactorOverride !== undefined) {
            brandFactor = productFactors.brandFactorOverride;
        } else {
            brandFactor = BRAND_QUALITY_FACTORS[productFactors.brandTier];
        }

        if (productFactors.techFactorOverride !== undefined) {
            techFactor = productFactors.techFactorOverride;
        } else if (productFactors.displayTechnology) {
            techFactor = DISPLAY_TECH_FACTORS[productFactors.displayTechnology];
        } else if (productFactors.compressorTechnology) {
            techFactor = COMPRESSOR_TECH_FACTORS[productFactors.compressorTechnology];
        }
    } else if (brandFallback && categoryId) {
        // Fallback to brand-level mapping
        const tier = getBrandTier(brandFallback, categoryId);
        brandFactor = BRAND_QUALITY_FACTORS[tier];
    }

    return {
        brandFactor,
        techFactor,
        combined: brandFactor * techFactor,
    };
}

/**
 * Calcula VUE ajustada com quality factors
 * 
 * @param vueBase - Vida Útil Estimada base da categoria (anos)
 * @param productId - ID do produto
 * @param environmentFactor - Fator ambiental (πAmbiente), default 1.0
 * @returns VUE ajustada em anos
 */
export function calculateAdjustedVUE(
    vueBase: number,
    productId: string,
    environmentFactor: number = 1.0,
    brandFallback?: string,
    categoryId?: string
): number {
    const { combined } = calculateQualityMultiplier(productId, brandFallback, categoryId);

    // VUE = VUE_Base × πMarca × πTech × πAmbiente
    // Note: ambiente é inverso (maior = pior), então dividimos
    const adjustedVUE = vueBase * combined / environmentFactor;

    // Round to 2 decimal places
    return Math.round(adjustedVUE * 100) / 100;
}
