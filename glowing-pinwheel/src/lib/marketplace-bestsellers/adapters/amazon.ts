/**
 * @file marketplace-bestsellers/adapters/amazon.ts
 * @description Adapter da Amazon para sistema unificado de Best Sellers
 * 
 * NOTA: Requer credenciais PA-API (Product Advertising API)
 * - AMAZON_ACCESS_KEY
 * - AMAZON_SECRET_KEY  
 * - AMAZON_PARTNER_TAG
 * 
 * @see https://webservices.amazon.com/paapi5/documentation/
 * @version 1.0.0
 */

import type {
    MarketplaceAdapter,
    CategoryMarketplaceConfig,
    UnifiedProduct
} from '../types';

// ============================================================================
// ADAPTER (STUB - requer PA-API credentials)
// ============================================================================

export class AmazonAdapter implements MarketplaceAdapter {
    readonly platform = 'amazon' as const;

    private accessKey?: string;
    private secretKey?: string;
    private partnerTag?: string;

    constructor() {
        this.accessKey = process.env.AMAZON_ACCESS_KEY;
        this.secretKey = process.env.AMAZON_SECRET_KEY;
        this.partnerTag = process.env.AMAZON_PARTNER_TAG;
    }

    isConfigured(): boolean {
        return !!(this.accessKey && this.secretKey && this.partnerTag);
    }

    async fetchBestSellers(
        config: CategoryMarketplaceConfig,
        limit: number = 20
    ): Promise<UnifiedProduct[]> {
        if (!this.isConfigured()) {
            console.warn('[Amazon Adapter] Not configured. Set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG');
            return [];
        }

        // TODO: Implementar quando tiver credenciais PA-API
        // A PA-API requer:
        // 1. Assinatura AWS Signature v4
        // 2. Endpoint: webservices.amazon.com.br
        // 3. Operation: SearchItems com BrowseNodeId (categoria)

        console.log('[Amazon Adapter] PA-API integration pending');

        // Structural placeholder - retorna array vazio até implementação
        return [];
    }

    // Quando implementado, a normalização será:
    // private normalizeProduct(item: AmazonItem): UnifiedProduct {
    //     return {
    //         marketplaceId: item.ASIN,
    //         source: 'amazon',
    //         title: item.ItemInfo.Title.DisplayValue,
    //         price: item.Offers.Listings[0].Price.Amount,
    //         imageUrl: item.Images.Primary.Large.URL,
    //         permalink: item.DetailPageURL,
    //         freeShipping: item.Offers.Listings[0].DeliveryInfo.IsPrimeEligible,
    //         isOfficialStore: item.Offers.Listings[0].IsBuyBoxWinner,
    //         storeName: 'Amazon',
    //         rating: item.CustomerReviews.StarRating?.Value,
    //         reviewCount: item.CustomerReviews.Count,
    //         inStock: item.Offers.Listings[0].Availability.Type === 'Now',
    //         fetchedAt: new Date(),
    //     };
    // }
}
