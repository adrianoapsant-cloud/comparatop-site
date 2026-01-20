/**
 * @file marketplace-bestsellers/types.ts
 * @description Tipos e interfaces unificados para sistema de Best Sellers multi-marketplace
 * 
 * Arquitetura:
 * - Interface comum para todos os marketplaces
 * - Adapters específicos por plataforma
 * - Smart routing baseado em categoria
 * 
 * @version 1.0.0
 */

import type { Platform } from '@/lib/safe-links';

// ============================================================================
// PRODUTO UNIFICADO
// ============================================================================

/**
 * Produto normalizado de qualquer marketplace
 */
export interface UnifiedProduct {
    /** ID único no marketplace de origem */
    marketplaceId: string;
    /** Marketplace de origem */
    source: Platform;
    /** Título do produto */
    title: string;
    /** Preço atual em R$ */
    price: number;
    /** Preço original (se em promoção) */
    originalPrice?: number;
    /** Quantidade vendida (quando disponível) */
    soldQuantity?: number;
    /** URL da imagem */
    imageUrl: string;
    /** Link do produto no marketplace */
    permalink: string;
    /** Frete grátis? */
    freeShipping: boolean;
    /** É loja oficial/verificada? */
    isOfficialStore: boolean;
    /** Nome da loja */
    storeName?: string;
    /** Avaliação média (1-5) */
    rating?: number;
    /** Número de avaliações */
    reviewCount?: number;
    /** Disponível em estoque? */
    inStock: boolean;
    /** Timestamp da coleta */
    fetchedAt: Date;
}

// ============================================================================
// CONFIGURAÇÃO DE CATEGORIA
// ============================================================================

/**
 * Configuração de categoria por marketplace
 */
export interface CategoryMarketplaceConfig {
    /** ID da categoria no marketplace */
    categoryId: string;
    /** Preço mínimo para filtrar peças/acessórios */
    minPriceFloor: number;
    /** Keyword de busca alternativa */
    searchKeyword?: string;
}

/**
 * Configuração completa de categoria para todos os marketplaces
 */
export interface UnifiedCategoryConfig {
    /** ID interno da categoria */
    id: string;
    /** Nome amigável */
    name: string;
    /** Marketplaces prioritários para esta categoria (em ordem) */
    priorityMarketplaces: Platform[];
    /** Configuração por marketplace */
    marketplaces: {
        mercadolivre?: CategoryMarketplaceConfig;
        amazon?: CategoryMarketplaceConfig;
        magalu?: CategoryMarketplaceConfig;
        shopee?: CategoryMarketplaceConfig;
    };
}

// ============================================================================
// ADAPTER INTERFACE
// ============================================================================

/**
 * Interface que todo adapter de marketplace deve implementar
 */
export interface MarketplaceAdapter {
    /** Nome do marketplace */
    readonly platform: Platform;

    /** Verifica se o adapter está configurado (tem credenciais) */
    isConfigured(): boolean;

    /**
     * Busca os produtos mais vendidos de uma categoria
     * 
     * @param config - Configuração da categoria para este marketplace
     * @param limit - Número máximo de resultados
     * @returns Lista de produtos normalizados
     */
    fetchBestSellers(
        config: CategoryMarketplaceConfig,
        limit: number
    ): Promise<UnifiedProduct[]>;
}

// ============================================================================
// RESULTADO DA BUSCA
// ============================================================================

/**
 * Resultado da busca agregada
 */
export interface AggregatedResult {
    /** Categoria buscada */
    categoryId: string;
    /** Produtos por marketplace */
    byMarketplace: Record<Platform, UnifiedProduct[]>;
    /** Top 20 consolidado (mesclando de todos os marketplaces) */
    consolidated: UnifiedProduct[];
    /** Timestamp da busca */
    fetchedAt: Date;
    /** Erros por marketplace (se houver) */
    errors: Record<Platform, string>;
}

// ============================================================================
// STATUS DE CREDENCIAIS
// ============================================================================

/**
 * Status de configuração dos marketplaces
 */
export interface MarketplaceStatus {
    platform: Platform;
    configured: boolean;
    reason?: string;
}

export function getMarketplacesStatus(): MarketplaceStatus[] {
    return [
        {
            platform: 'mercadolivre',
            configured: !!process.env.ML_ACCESS_TOKEN,
            reason: process.env.ML_ACCESS_TOKEN
                ? undefined
                : 'Necessário ML_ACCESS_TOKEN (Developer Token)',
        },
        {
            platform: 'amazon',
            configured: !!(
                process.env.AMAZON_ACCESS_KEY &&
                process.env.AMAZON_SECRET_KEY &&
                process.env.AMAZON_PARTNER_TAG
            ),
            reason: process.env.AMAZON_ACCESS_KEY
                ? undefined
                : 'Necessário AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG',
        },
        {
            platform: 'magalu',
            configured: false, // Magalu não tem API pública
            reason: 'Magalu não possui API pública. Requer scraping.',
        },
        {
            platform: 'shopee',
            configured: !!process.env.SHOPEE_APP_ID,
            reason: process.env.SHOPEE_APP_ID
                ? undefined
                : 'Necessário SHOPEE_APP_ID e SHOPEE_SECRET',
        },
    ];
}
