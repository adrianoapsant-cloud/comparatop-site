/**
 * Offer Link Resolver
 * 
 * Single source of truth for product purchase links.
 * Always returns at least one link (internal ComparaTop page).
 */

export type OfferLink = {
    /** Link type: internal (ComparaTop) or affiliate (external) */
    kind: 'internal' | 'affiliate';
    /** Display label */
    label: string;
    /** URL (absolute for external, relative for internal) */
    url: string;
    /** Price in BRL (optional) */
    priceBRL?: number;
    /** Merchant/store name (optional) */
    merchant?: string;
    /** Rel attribute for external links */
    rel?: string;
};

export interface ProductForOffers {
    id: string;
    name: string;
    price?: number;
    offers?: Array<{
        affiliateUrl?: string;
        url?: string;
        store?: string;
        price?: number;
        inStock?: boolean;
    }>;
}

/**
 * Resolve all available purchase links for a product.
 * 
 * Priority:
 * 1. Internal ComparaTop link (always present)
 * 2. Affiliate links (if available)
 * 
 * @param product - Product with id, name, and optional offers
 * @returns Array of OfferLink (always at least 1)
 */
export function resolveOfferLinks(product: ProductForOffers): OfferLink[] {
    const links: OfferLink[] = [];

    // 1. Always add internal ComparaTop link
    links.push({
        kind: 'internal',
        label: 'Ver oferta',
        url: `/produto/${product.id}`,
        priceBRL: product.price,
        merchant: 'ComparaTop'
    });

    // 2. Add affiliate links if available
    if (product.offers && product.offers.length > 0) {
        for (const offer of product.offers) {
            const affiliateUrl = offer.affiliateUrl || offer.url;
            if (affiliateUrl && offer.inStock !== false) {
                links.push({
                    kind: 'affiliate',
                    label: offer.store || 'Loja',
                    url: affiliateUrl,
                    priceBRL: offer.price,
                    merchant: offer.store,
                    rel: 'nofollow sponsored'
                });
            }
        }
    }

    return links;
}

/**
 * Format a single product's links as markdown.
 * 
 * @example
 * "→ **LG C3**: [Ver oferta](/produto/lg-c3-65) | [Amazon](https://...)"
 */
export function formatProductLinks(product: ProductForOffers): string {
    const links = resolveOfferLinks(product);

    const linkParts = links.map(link => {
        if (link.kind === 'internal') {
            return `[${link.label}](${link.url})`;
        } else {
            return `[${link.merchant || link.label}](${link.url})`;
        }
    });

    return `→ **${product.name}**: ${linkParts.join(' | ')}`;
}

/**
 * Build the "🛒 Onde comprar" section for multiple products.
 * 
 * @param products - Array of products (at least 1)
 * @returns Formatted markdown section
 */
export function buildOndeComprarSection(products: ProductForOffers[]): string {
    if (products.length === 0) return '';

    const lines = [
        '🛒 **Onde comprar**',
        '',
        ...products.map(p => formatProductLinks(p))
    ];

    return lines.join('\n');
}
