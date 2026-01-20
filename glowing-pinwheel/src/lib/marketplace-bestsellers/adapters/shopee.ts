/**
 * @file marketplace-bestsellers/adapters/shopee.ts
 * @description Adapter da Shopee para sistema unificado de Best Sellers
 * 
 * NOTA: A API de afiliados da Shopee é limitada
 * - SHOPEE_APP_ID
 * - SHOPEE_SECRET
 * 
 * @see https://affiliate.shopee.com.br/
 * @version 1.0.0
 */

import type {
    MarketplaceAdapter,
    CategoryMarketplaceConfig,
    UnifiedProduct
} from '../types';

// ============================================================================
// ADAPTER (STUB - requer Shopee Affiliate credentials)
// ============================================================================

export class ShopeeAdapter implements MarketplaceAdapter {
    readonly platform = 'shopee' as const;

    private appId?: string;
    private secret?: string;

    constructor() {
        this.appId = process.env.SHOPEE_APP_ID;
        this.secret = process.env.SHOPEE_SECRET;
    }

    isConfigured(): boolean {
        return !!(this.appId && this.secret);
    }

    async fetchBestSellers(
        config: CategoryMarketplaceConfig,
        limit: number = 20
    ): Promise<UnifiedProduct[]> {
        if (!this.isConfigured()) {
            console.warn('[Shopee Adapter] Not configured. Set SHOPEE_APP_ID, SHOPEE_SECRET');
            return [];
        }

        // TODO: Implementar quando tiver credenciais Affiliate API
        // A Shopee Affiliate API é mais limitada que PA-API
        // Foco em produtos promovidos/comissionados

        console.log('[Shopee Adapter] Affiliate API integration pending');

        return [];
    }
}
