/**
 * @file JsonLd.tsx
 * @description Componentes de JSON-LD Structured Data para SEO
 * 
 * Schemas implementados:
 * - Product (com AggregateRating)
 * - BreadcrumbList
 * - FAQPage
 * - ItemList (categorias)
 * - Article (comparações)
 * - Organization (site)
 * - WebSite (busca)
 * 
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import React from 'react';

// ============================================================================
// TIPOS
// ============================================================================

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface ProductData {
    name: string;
    image: string;
    description: string;
    sku: string;
    brand: string;
    category?: string;
    url?: string;
    price?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    ratingValue?: number;
    reviewCount?: number;
}

export interface ArticleData {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: string;
    url: string;
}

export interface ItemListData {
    name: string;
    items: Array<{
        name: string;
        url: string;
        image?: string;
        position: number;
    }>;
}

// ============================================================================
// COMPONENTE BASE
// ============================================================================

interface JsonLdScriptProps {
    data: object;
}

function JsonLdScript({ data }: JsonLdScriptProps): React.ReactElement {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data, null, 0),
            }}
        />
    );
}

// ============================================================================
// ORGANIZATION SCHEMA
// ============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';

export function OrganizationJsonLd(): React.ReactElement {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ComparaTop',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description: 'Comparador de produtos com análises imparciais e recomendações inteligentes.',
        sameAs: [
            'https://twitter.com/comparatop',
            'https://www.instagram.com/comparatop',
            'https://www.youtube.com/@comparatop',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contato@comparatop.com.br',
        },
    };

    return <JsonLdScript data={data} />;
}

// ============================================================================
// WEBSITE SCHEMA (com busca)
// ============================================================================

export function WebSiteJsonLd(): React.ReactElement {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ComparaTop',
        url: BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/busca?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return <JsonLdScript data={data} />;
}

// ============================================================================
// BREADCRUMB SCHEMA
// ============================================================================

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps): React.ReactElement {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return <JsonLdScript data={data} />;
}

// ============================================================================
// PRODUCT SCHEMA
// ============================================================================

interface ProductJsonLdProps {
    product: ProductData;
}

export function ProductJsonLd({ product }: ProductJsonLdProps): React.ReactElement {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        sku: product.sku,
        brand: {
            '@type': 'Brand',
            name: product.brand,
        },
    };

    // Categoria (opcional)
    if (product.category) {
        data.category = product.category;
    }

    // URL (opcional)
    if (product.url) {
        data.url = product.url;
    }

    // Avaliação agregada (opcional)
    if (product.ratingValue && product.reviewCount) {
        data.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue.toString(),
            bestRating: '10',
            worstRating: '0',
            reviewCount: product.reviewCount.toString(),
        };
    }

    // AggregateOffer - signals we are a comparison aggregator, not a retailer
    if (product.price) {
        const lowPrice = product.price;
        const highPrice = Math.round(product.price * 1.2); // +20% margin for price range
        const defaultSellers = ['Amazon', 'Mercado Livre', 'Shopee'];

        data.offers = {
            '@type': 'AggregateOffer',
            priceCurrency: product.currency || 'BRL',
            lowPrice: lowPrice.toFixed(2),
            highPrice: highPrice.toFixed(2),
            offerCount: defaultSellers.length,
            availability: `https://schema.org/${product.availability || 'InStock'}`,
            // Individual seller offers
            offers: defaultSellers.map(store => ({
                '@type': 'Offer',
                name: store,
                price: lowPrice.toFixed(2),
                priceCurrency: product.currency || 'BRL',
                availability: `https://schema.org/${product.availability || 'InStock'}`,
                itemCondition: 'https://schema.org/NewCondition',
                seller: {
                    '@type': 'Organization',
                    name: store,
                },
            })),
        };
    }

    return <JsonLdScript data={data} />;
}

// ============================================================================
// FAQ SCHEMA
// ============================================================================

interface FAQJsonLdProps {
    faqs: FAQItem[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps): React.ReactElement {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return <JsonLdScript data={data} />;
}

// ============================================================================
// ITEMLIST SCHEMA (Categorias)
// ============================================================================

interface ItemListJsonLdProps {
    data: ItemListData;
}

export function ItemListJsonLd({ data: listData }: ItemListJsonLdProps): React.ReactElement {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: listData.name,
        itemListElement: listData.items.map(item => ({
            '@type': 'ListItem',
            position: item.position,
            name: item.name,
            url: item.url,
            ...(item.image && { image: item.image }),
        })),
    };

    return <JsonLdScript data={data} />;
}

// ============================================================================
// ARTICLE SCHEMA (Comparações)
// ============================================================================

interface ArticleJsonLdProps {
    article: ArticleData;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps): React.ReactElement {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.headline,
        description: article.description,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: {
            '@type': 'Person',
            name: article.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'ComparaTop',
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url,
        },
    };

    return <JsonLdScript data={data} />;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    JsonLdScript,
    type JsonLdScriptProps,
    type BreadcrumbJsonLdProps,
    type ProductJsonLdProps,
    type FAQJsonLdProps,
    type ItemListJsonLdProps,
    type ArticleJsonLdProps,
};
