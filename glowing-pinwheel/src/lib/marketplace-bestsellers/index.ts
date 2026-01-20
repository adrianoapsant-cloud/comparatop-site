/**
 * @file marketplace-bestsellers/index.ts
 * @description Orquestrador do sistema unificado de Best Sellers
 * 
 * Uso:
 * ```ts
 * import { fetchBestSellers, getMarketplaceStatuses } from '@/lib/marketplace-bestsellers';
 * 
 * const result = await fetchBestSellers('refrigerator', 20);
 * // result.consolidated = Top 20 de todos os marketplaces
 * // result.byMarketplace = Separado por marketplace
 * ```
 * 
 * @version 1.0.0
 */

import type {
    UnifiedProduct,
    AggregatedResult,
    MarketplaceAdapter,
    MarketplaceStatus,
} from './types';
import { getMarketplacesStatus } from './types';
import { getCategoryConfigById, getAllCategoryIds, UNIFIED_CATEGORIES } from './categories';
import { MercadoLivreAdapter } from './adapters/mercadolivre';
import { AmazonAdapter } from './adapters/amazon';
import { MagaluAdapter } from './adapters/magalu';
import { ShopeeAdapter } from './adapters/shopee';
import type { Platform } from '@/lib/safe-links';

// ============================================================================
// REGISTRY DE ADAPTERS
// ============================================================================

const adapters: Record<Platform, MarketplaceAdapter> = {
    mercadolivre: new MercadoLivreAdapter(),
    amazon: new AmazonAdapter(),
    magalu: new MagaluAdapter(),
    shopee: new ShopeeAdapter(),
};

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * Busca os melhores produtos de uma categoria em todos os marketplaces configurados
 * 
 * @param categoryId - ID da categoria (ex: 'refrigerator', 'smart-tv')
 * @param limit - Número de produtos por marketplace
 * @returns Resultado agregado com produtos de todos os marketplaces
 */
export async function fetchBestSellers(
    categoryId: string,
    limit: number = 20
): Promise<AggregatedResult> {
    const categoryConfig = getCategoryConfigById(categoryId);

    if (!categoryConfig) {
        throw new Error(`Categoria "${categoryId}" não configurada`);
    }

    const result: AggregatedResult = {
        categoryId,
        byMarketplace: {
            mercadolivre: [],
            amazon: [],
            magalu: [],
            shopee: [],
        },
        consolidated: [],
        fetchedAt: new Date(),
        errors: {} as Record<Platform, string>,
    };

    // Busca de cada marketplace em paralelo (apenas os prioritários)
    const promises = categoryConfig.priorityMarketplaces.map(async (platform) => {
        const adapter = adapters[platform];
        const marketplaceConfig = categoryConfig.marketplaces[platform];

        if (!marketplaceConfig) {
            return { platform, products: [] as UnifiedProduct[] };
        }

        if (!adapter.isConfigured()) {
            result.errors[platform] = 'Não configurado (credenciais ausentes)';
            return { platform, products: [] as UnifiedProduct[] };
        }

        try {
            const products = await adapter.fetchBestSellers(marketplaceConfig, limit);
            return { platform, products };
        } catch (error) {
            result.errors[platform] = error instanceof Error ? error.message : 'Erro desconhecido';
            return { platform, products: [] as UnifiedProduct[] };
        }
    });

    const allResults = await Promise.all(promises);

    // Organiza resultados por marketplace
    for (const { platform, products } of allResults) {
        result.byMarketplace[platform] = products;
    }

    // Consolida Top 20 (mescla e ordena por soldQuantity)
    const allProducts = Object.values(result.byMarketplace).flat();
    result.consolidated = allProducts
        .sort((a, b) => (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0))
        .slice(0, limit);

    return result;
}

/**
 * Verifica o status de configuração de todos os marketplaces
 */
export function getMarketplaceStatuses(): MarketplaceStatus[] {
    return getMarketplacesStatus();
}

/**
 * Lista todas as categorias disponíveis
 */
export function getAvailableCategories() {
    return UNIFIED_CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        priorityMarketplaces: c.priorityMarketplaces,
    }));
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export { UNIFIED_CATEGORIES, getCategoryConfigById, getAllCategoryIds } from './categories';
export type {
    UnifiedProduct,
    AggregatedResult,
    UnifiedCategoryConfig,
    MarketplaceAdapter,
    MarketplaceStatus,
} from './types';
