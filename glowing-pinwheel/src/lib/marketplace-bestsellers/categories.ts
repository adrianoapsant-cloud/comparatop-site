/**
 * @file marketplace-bestsellers/categories.ts
 * @description Configuração unificada de categorias para todos os marketplaces
 * 
 * Define quais marketplaces são prioritários para cada categoria
 * e os IDs/pisos de preço específicos de cada plataforma.
 * 
 * @version 1.0.0
 */

import type { UnifiedCategoryConfig } from './types';

/**
 * Configuração completa de todas as categorias
 * 
 * IMPORTANTE:
 * - priorityMarketplaces: ordem de prioridade para buscar (baseado em Smart Routing)
 * - Linha Branca → ML/Magalu primeiro (melhor parcelamento)
 * - Eletrônicos → Amazon primeiro (Prime, reviews, preço)
 */
export const UNIFIED_CATEGORIES: UnifiedCategoryConfig[] = [
    // ========================================================================
    // LINHA BRANCA (Prioridade ML/Magalu)
    // ========================================================================
    {
        id: 'refrigerator',
        name: 'Geladeiras',
        priorityMarketplaces: ['mercadolivre', 'magalu', 'amazon'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB181294', minPriceFloor: 1500 },
            amazon: { categoryId: '16225547011', minPriceFloor: 1500 }, // Browse Node
            magalu: { categoryId: 'geladeiras', minPriceFloor: 1500, searchKeyword: 'geladeira frost free' },
        },
    },
    {
        id: 'washer',
        name: 'Lavadoras',
        priorityMarketplaces: ['mercadolivre', 'magalu', 'amazon'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB182390', minPriceFloor: 1500 },
            amazon: { categoryId: '16225548011', minPriceFloor: 1500 },
            magalu: { categoryId: 'lavadoras', minPriceFloor: 1500 },
        },
    },
    {
        id: 'washer-dryer',
        name: 'Lava e Seca',
        priorityMarketplaces: ['mercadolivre', 'magalu', 'amazon'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB270799', minPriceFloor: 2500 },
            amazon: { categoryId: '16225549011', minPriceFloor: 2500 },
        },
    },
    {
        id: 'air-conditioner',
        name: 'Ar-Condicionado',
        priorityMarketplaces: ['mercadolivre', 'magalu', 'amazon'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB5054', minPriceFloor: 1200 },
            amazon: { categoryId: '16276880011', minPriceFloor: 1200 },
            magalu: { categoryId: 'ar-condicionado', minPriceFloor: 1200 },
        },
    },
    {
        id: 'freezer',
        name: 'Freezers',
        priorityMarketplaces: ['mercadolivre', 'magalu'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB181295', minPriceFloor: 1200 },
        },
    },
    {
        id: 'stove',
        name: 'Fogões',
        priorityMarketplaces: ['mercadolivre', 'magalu', 'amazon'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1578', minPriceFloor: 800 },
            amazon: { categoryId: '16225550011', minPriceFloor: 800 },
        },
    },
    {
        id: 'dishwasher',
        name: 'Lava-Louças',
        priorityMarketplaces: ['mercadolivre', 'magalu'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB5686', minPriceFloor: 1500 },
        },
    },

    // ========================================================================
    // ELETRÔNICOS (Prioridade Amazon)
    // ========================================================================
    {
        id: 'smart-tv',
        name: 'Smart TVs',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1002', minPriceFloor: 800 },
            amazon: { categoryId: '16243822011', minPriceFloor: 800 }, // TVs
            shopee: { categoryId: '100017', minPriceFloor: 800 },
        },
    },
    {
        id: 'notebook',
        name: 'Notebooks',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1652', minPriceFloor: 1500 },
            amazon: { categoryId: '16364756011', minPriceFloor: 1500 },
            shopee: { categoryId: '100036', minPriceFloor: 1500 },
        },
    },
    {
        id: 'smartphone',
        name: 'Smartphones',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1055', minPriceFloor: 500 },
            amazon: { categoryId: '16243803011', minPriceFloor: 500 },
            shopee: { categoryId: '100018', minPriceFloor: 500 },
        },
    },
    {
        id: 'monitor',
        name: 'Monitores',
        priorityMarketplaces: ['amazon', 'mercadolivre'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1714', minPriceFloor: 400 },
            amazon: { categoryId: '16364755011', minPriceFloor: 400 },
        },
    },
    {
        id: 'tablet',
        name: 'Tablets',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1659', minPriceFloor: 600 },
            amazon: { categoryId: '16364754011', minPriceFloor: 600 },
        },
    },
    {
        id: 'smartwatch',
        name: 'Smartwatches',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB352679', minPriceFloor: 200 },
            amazon: { categoryId: '16243823011', minPriceFloor: 200 },
        },
    },
    {
        id: 'console',
        name: 'Consoles',
        priorityMarketplaces: ['amazon', 'mercadolivre'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB186456', minPriceFloor: 1000 },
            amazon: { categoryId: '16243807011', minPriceFloor: 1000 },
        },
    },
    {
        id: 'soundbar',
        name: 'Soundbars',
        priorityMarketplaces: ['amazon', 'mercadolivre'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB3697', minPriceFloor: 300 },
            amazon: { categoryId: '16243824011', minPriceFloor: 300 },
        },
    },

    // ========================================================================
    // PEQUENOS ELETROS (Prioridade Amazon)
    // ========================================================================
    {
        id: 'air-fryer',
        name: 'Air Fryers',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB264586', minPriceFloor: 200 },
            amazon: { categoryId: '16225551011', minPriceFloor: 200 },
        },
    },
    {
        id: 'microwave',
        name: 'Micro-ondas',
        priorityMarketplaces: ['amazon', 'mercadolivre'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1580', minPriceFloor: 300 },
            amazon: { categoryId: '16225552011', minPriceFloor: 300 },
        },
    },
    {
        id: 'espresso-machine',
        name: 'Cafeteiras',
        priorityMarketplaces: ['amazon', 'mercadolivre'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB30915', minPriceFloor: 150 },
            amazon: { categoryId: '16225553011', minPriceFloor: 150 },
        },
    },
    {
        id: 'robot-vacuum',
        name: 'Robôs Aspiradores',
        priorityMarketplaces: ['amazon', 'mercadolivre', 'shopee'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB432478', minPriceFloor: 500 },
            amazon: { categoryId: '16225554011', minPriceFloor: 500 },
        },
    },
    {
        id: 'stick-vacuum',
        name: 'Aspiradores Verticais',
        priorityMarketplaces: ['amazon', 'mercadolivre'],
        marketplaces: {
            mercadolivre: { categoryId: 'MLB1712', minPriceFloor: 200 },
            amazon: { categoryId: '16225555011', minPriceFloor: 200 },
        },
    },
];

/**
 * Busca configuração de categoria por ID
 */
export function getCategoryConfigById(categoryId: string): UnifiedCategoryConfig | undefined {
    return UNIFIED_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Lista todas as categorias configuradas
 */
export function getAllCategoryIds(): string[] {
    return UNIFIED_CATEGORIES.map(c => c.id);
}
