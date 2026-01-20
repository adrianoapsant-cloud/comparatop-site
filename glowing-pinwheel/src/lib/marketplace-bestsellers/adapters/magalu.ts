/**
 * @file marketplace-bestsellers/adapters/magalu.ts
 * @description Adapter do Magazine Luiza para sistema unificado de Best Sellers
 * 
 * NOTA: Magalu não possui API pública oficial
 * Opções para implementação:
 * 1. Scraping com Puppeteer/Playwright
 * 2. Parceria comercial para acesso a API
 * 
 * @version 1.0.0
 */

import type {
    MarketplaceAdapter,
    CategoryMarketplaceConfig,
    UnifiedProduct
} from '../types';

// ============================================================================
// ADAPTER (STUB - requer scraping ou parceria)
// ============================================================================

export class MagaluAdapter implements MarketplaceAdapter {
    readonly platform = 'magalu' as const;

    isConfigured(): boolean {
        // Magalu não tem API pública, sempre retorna false
        // Implementação futura via scraping
        return false;
    }

    async fetchBestSellers(
        config: CategoryMarketplaceConfig,
        limit: number = 20
    ): Promise<UnifiedProduct[]> {
        console.warn('[Magalu Adapter] No public API available. Scraping implementation pending.');

        // TODO: Implementar scraping quando necessário
        // Opção 1: Puppeteer no servidor
        // Opção 2: API de parceiro comercial

        return [];
    }
}
