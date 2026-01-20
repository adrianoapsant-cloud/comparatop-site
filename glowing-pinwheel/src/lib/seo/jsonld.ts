/**
 * @file jsonld.ts
 * @description JSON-LD Schema.org helpers para SEO estruturado
 * 
 * Implementa schemas seguros e mínimos, sem inventar dados.
 * Usa ProductVM como fonte única de verdade (SSOT).
 * 
 * @see https://schema.org/Product
 * @see https://schema.org/BreadcrumbList
 */

import type { ProductVM } from '@/lib/viewmodels/productVM';
import { productUrl, categoryUrl } from '@/lib/routes';

const SITE_NAME = 'ComparaTop';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';

// ============================================
// TYPES
// ============================================

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface ProductJsonLdOptions {
    /** Incluir offers apenas se preço for confiável */
    includeOffers?: boolean;
    /** Data de lastmod do produto */
    lastModified?: string;
}

// ============================================
// PRODUCT JSON-LD
// ============================================

/**
 * Gera JSON-LD para Product (PDP)
 * 
 * Schema mínimo e seguro:
 * - NÃO inclui aggregateRating/review (sem fonte real)
 * - Offers opcional (apenas se includeOffers=true E preço confiável)
 */
export function productJsonLd(
    vm: ProductVM,
    options: ProductJsonLdOptions = {}
): Record<string, unknown> {
    const { includeOffers = false, lastModified } = options;

    const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: vm.name,
        url: productUrl(vm, true),
    };

    // Brand (se existir)
    if (vm.brand) {
        jsonLd.brand = {
            '@type': 'Brand',
            name: vm.brand,
        };
    }

    // Image (se existir)
    if (vm.imageUrl) {
        jsonLd.image = vm.imageUrl.startsWith('http')
            ? vm.imageUrl
            : `${BASE_URL}${vm.imageUrl}`;
    }

    // Description (curta, do raw se existir)
    const description = vm.raw.benefitSubtitle || `${vm.name} - Análise editorial ComparaTop`;
    jsonLd.description = description;

    // SKU = slug do produto (ID interno)
    jsonLd.sku = vm.id;

    // Model (se existir no raw)
    if (vm.model) {
        jsonLd.model = vm.model;
    }

    // Category path
    jsonLd.category = vm.categorySlug;

    // Offers (APENAS se explicitamente habilitado e preço válido)
    if (includeOffers && vm.price.value > 0 && vm.bestOffer) {
        jsonLd.offers = {
            '@type': 'Offer',
            url: vm.bestOffer.url,
            priceCurrency: 'BRL',
            price: vm.bestOffer.price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: vm.bestOffer.store,
            },
            // priceValidUntil - não incluímos pois não temos data confiável
        };
    }

    // dateModified (se existir)
    if (lastModified || vm.raw.lastUpdated) {
        jsonLd.dateModified = lastModified || vm.raw.lastUpdated;
    }

    return jsonLd;
}

// ============================================
// BREADCRUMB JSON-LD
// ============================================

/**
 * Gera JSON-LD para BreadcrumbList
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        })),
    };
}

/**
 * Breadcrumb para Home
 */
export function homeBreadcrumb(): Record<string, unknown> {
    return breadcrumbJsonLd([
        { name: 'Home', url: '/' },
    ]);
}

/**
 * Breadcrumb para Categoria (PLP)
 */
export function categoryBreadcrumb(categoryName: string, categorySlug: string): Record<string, unknown> {
    return breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: categoryName, url: categoryUrl(categorySlug) },
    ]);
}

/**
 * Breadcrumb para Produto (PDP)
 */
export function productBreadcrumb(
    vm: ProductVM,
    categoryName: string
): Record<string, unknown> {
    return breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: categoryName, url: categoryUrl(vm.categorySlug) },
        { name: vm.shortName, url: productUrl(vm) },
    ]);
}

/**
 * Breadcrumb para VS (Compare)
 */
export function compareBreadcrumb(
    productAName: string,
    productBName: string,
    compareUrlPath: string
): Record<string, unknown> {
    return breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: `${productAName} vs ${productBName}`, url: compareUrlPath },
    ]);
}

// ============================================
// WEBSITE JSON-LD
// ============================================

/**
 * JSON-LD para Website (Home)
 */
export function websiteJsonLd(): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: BASE_URL,
        description: 'Compare produtos e encontre o melhor custo-benefício com análises editoriais imparciais.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/busca?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

// ============================================
// ORGANIZATION JSON-LD
// ============================================

/**
 * JSON-LD para Organization
 */
export function organizationJsonLd(): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
            // Adicionar redes sociais quando existirem
        ],
    };
}

// ============================================
// HELPERS
// ============================================

/**
 * Renderiza JSON-LD como script tag
 */
export function renderJsonLd(data: Record<string, unknown>): string {
    return JSON.stringify(data);
}

/**
 * Combina múltiplos JSON-LD em array @graph
 */
export function combineJsonLd(...schemas: Record<string, unknown>[]): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@graph': schemas.map(s => {
            // Remove @context duplicado
            const { '@context': _, ...rest } = s;
            return rest;
        }),
    };
}
