/**
 * @file marketplace-bestsellers/adapters/mercadolivre.ts
 * @description Adapter do Mercado Livre para sistema unificado de Best Sellers
 * 
 * @version 1.0.0
 */

import type {
    MarketplaceAdapter,
    CategoryMarketplaceConfig,
    UnifiedProduct
} from '../types';

// ============================================================================
// TIPOS DA API ML
// ============================================================================

interface MLSearchResult {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    sold_quantity: number;
    thumbnail: string;
    permalink: string;
    condition: string;
    shipping: {
        free_shipping: boolean;
    };
    seller: {
        id: number;
        nickname: string;
    };
    official_store_id?: number;
    official_store_name?: string;
    available_quantity?: number;
}

interface MLSearchResponse {
    results: MLSearchResult[];
    paging: {
        total: number;
        limit: number;
        offset: number;
    };
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Max items per API request (ML limit is 50) */
const ML_PAGE_LIMIT = 50;

/** Delay between paginated requests (ms) to avoid rate limiting */
const PAGINATION_DELAY_MS = 500;

/** Cache duration: 24 hours (daily update is safe) */
const CACHE_DURATION_SECONDS = 86400;

// ============================================================================
// ADAPTER
// ============================================================================

export class MercadoLivreAdapter implements MarketplaceAdapter {
    readonly platform = 'mercadolivre' as const;

    private accessToken?: string;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || process.env.ML_ACCESS_TOKEN;
    }

    isConfigured(): boolean {
        // ML API pública funciona sem token para alguns endpoints
        // Mas para server-side requests consistentes, precisa de token
        return !!this.accessToken;
    }

    /**
     * Busca best sellers com paginação automática
     * 
     * @param config - Configuração da categoria
     * @param limit - Número total de produtos desejados (pode ser >50)
     * @returns Lista de produtos
     */
    async fetchBestSellers(
        config: CategoryMarketplaceConfig,
        limit: number = 20
    ): Promise<UnifiedProduct[]> {
        const { categoryId, minPriceFloor, searchKeyword } = config;

        // Se limite <= 50, uma única request
        if (limit <= ML_PAGE_LIMIT) {
            return this.fetchPage(categoryId, searchKeyword, minPriceFloor, limit, 0);
        }

        // Paginação automática para >50 produtos
        return this.fetchWithPagination(categoryId, searchKeyword, minPriceFloor, limit);
    }

    /**
     * Busca com paginação automática (para >50 produtos)
     * Inclui rate limiting para evitar banimento
     */
    private async fetchWithPagination(
        categoryId: string | undefined,
        searchKeyword: string | undefined,
        minPriceFloor: number,
        totalLimit: number
    ): Promise<UnifiedProduct[]> {
        const allProducts: UnifiedProduct[] = [];
        let offset = 0;
        const maxPages = Math.ceil(totalLimit / ML_PAGE_LIMIT);

        console.log(`[ML Adapter] Fetching ${totalLimit} products with pagination (${maxPages} pages)`);

        for (let page = 0; page < maxPages && allProducts.length < totalLimit; page++) {
            const pageLimit = Math.min(ML_PAGE_LIMIT, totalLimit - allProducts.length);

            const products = await this.fetchPage(
                categoryId,
                searchKeyword,
                minPriceFloor,
                pageLimit,
                offset
            );

            allProducts.push(...products);
            offset += ML_PAGE_LIMIT;

            // Rate limiting: delay between pages (except last)
            if (page < maxPages - 1 && products.length > 0) {
                await this.delay(PAGINATION_DELAY_MS);
            }

            // Stop if no more results
            if (products.length < pageLimit) {
                console.log(`[ML Adapter] No more results at page ${page + 1}`);
                break;
            }
        }

        console.log(`[ML Adapter] Total fetched: ${allProducts.length} products`);
        return allProducts.slice(0, totalLimit);
    }

    /**
     * Busca uma única página de resultados
     */
    private async fetchPage(
        categoryId: string | undefined,
        searchKeyword: string | undefined,
        minPriceFloor: number,
        limit: number,
        offset: number
    ): Promise<UnifiedProduct[]> {
        const url = new URL('https://api.mercadolibre.com/sites/MLB/search');

        if (categoryId) {
            url.searchParams.set('category', categoryId);
        } else if (searchKeyword) {
            url.searchParams.set('q', searchKeyword);
        }

        url.searchParams.set('sort', 'sold_quantity');
        url.searchParams.set('condition', 'new');
        url.searchParams.set('limit', Math.min(limit * 2, ML_PAGE_LIMIT).toString());
        url.searchParams.set('offset', offset.toString());

        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'User-Agent': 'ComparaTop/1.0',
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            const response = await fetch(url.toString(), {
                headers,
                next: { revalidate: CACHE_DURATION_SECONDS }, // Cache de 24h
            });

            if (!response.ok) {
                console.error(`[ML Adapter] API Error: ${response.status}`);
                return [];
            }

            const data: MLSearchResponse = await response.json();

            // Filtra por preço mínimo e normaliza
            const products: UnifiedProduct[] = data.results
                .filter(item => item.price >= minPriceFloor)
                .slice(0, limit)
                .map(item => this.normalizeProduct(item));

            return products;

        } catch (error) {
            console.error('[ML Adapter] Fetch error:', error);
            return [];
        }
    }

    private normalizeProduct(item: MLSearchResult): UnifiedProduct {
        return {
            marketplaceId: item.id,
            source: 'mercadolivre',
            title: item.title,
            price: item.price,
            originalPrice: item.original_price,
            soldQuantity: item.sold_quantity,
            imageUrl: item.thumbnail?.replace('http://', 'https://') || '',
            permalink: item.permalink,
            freeShipping: item.shipping?.free_shipping ?? false,
            isOfficialStore: !!item.official_store_id,
            storeName: item.official_store_name || item.seller?.nickname,
            inStock: (item.available_quantity ?? 1) > 0,
            fetchedAt: new Date(),
        };
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

