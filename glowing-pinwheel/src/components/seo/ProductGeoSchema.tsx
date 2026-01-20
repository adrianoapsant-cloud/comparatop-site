/**
 * @file ProductGeoSchema.tsx
 * @description Componente de GEO (Generative Engine Optimization) para Schema.org
 * 
 * Este componente gera JSON-LD dinâmico otimizado para motores de IA como
 * Perplexity, SearchGPT e Google AI Overviews. Ele sinaliza "Frescor" e
 * "Autoridade" para que a IA priorize nossa citação.
 * 
 * Estratégias GEO implementadas:
 * - availabilityStarts: Timestamp atual → "Verifiquei agora"
 * - priceValidUntil: +24h → Força reindexação amanhã
 * - speakable: Aponta para #ai-verdict → IA lê este trecho
 * 
 * @see https://schema.org/Product
 * @see https://schema.org/Offer
 */

'use client';

import React from 'react';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Props do componente ProductGeoSchema
 * 
 * Interface simplificada conforme especificação.
 * O campo safeUrl nas ofertas deve vir já processado pelo safe-links.ts
 */
export interface GeoSchemaProps {
    product: {
        /** Nome completo do produto */
        name: string;
        /** URL da imagem principal */
        image: string;
        /** Descrição SEO do produto */
        description: string;
        /** Marca/fabricante */
        brand: string;
        /** SKU ou código único */
        sku: string;
        /** Quantidade de reviews/avaliações */
        reviewCount: number;
        /** Nota média (0-10 ou 0-5, será exibida como fornecida) */
        ratingValue: number;
    };
    offers: Array<{
        /** Preço em reais (ou moeda especificada) */
        price: number;
        /** Código da moeda (ex: 'BRL', 'USD') */
        currency: string;
        /** Nome do vendedor (ex: "Amazon", "Shopee Oficial") */
        sellerName: string;
        /** Status de disponibilidade */
        status: 'in_stock' | 'out_of_stock';
        /** URL segura já processada pelo safe-links.ts */
        safeUrl: string;
    }>;
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Mapeia o status interno para a URL Schema.org de disponibilidade
 * 
 * @param status - Status interno ('in_stock' | 'out_of_stock')
 * @returns URL Schema.org de disponibilidade
 * 
 * @see https://schema.org/ItemAvailability
 */
function mapStatusToSchemaUrl(status: 'in_stock' | 'out_of_stock'): string {
    // Mapeamento direto do status para URL Schema.org
    const statusMap = {
        'in_stock': 'https://schema.org/InStock',
        'out_of_stock': 'https://schema.org/OutOfStock',
    } as const;

    return statusMap[status];
}

/**
 * Gera timestamp ISO 8601 do momento atual
 * 
 * SINAL DE FRESCOR #1: availabilityStarts
 * Quando a IA vê uma data recente, ela entende que verificamos
 * o estoque naquele exato momento. Isso prioriza nossa citação.
 * 
 * @returns Data/hora atual em formato ISO 8601
 */
function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Gera data de validade do preço (+24 horas)
 * 
 * SINAL DE FRESCOR #2: priceValidUntil
 * Ao definir que o preço expira amanhã, criamos "urgência algorítmica".
 * O bot de IA é forçado a voltar para reindexar, aumentando nossa
 * frequência de crawling e mantendo dados sempre frescos.
 * 
 * @returns Data de amanhã em formato YYYY-MM-DD
 */
function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Formato YYYY-MM-DD (ISO 8601 date only)
    return tomorrow.toISOString().split('T')[0];
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * ProductGeoSchema - Componente de Schema.org otimizado para IA
 * 
 * Renderiza apenas uma tag <script type="application/ld+json">
 * com o Schema.org JSON-LD do produto. Não renderiza nada visual.
 * 
 * @example
 * import { ProductGeoSchema } from '@/components/seo/ProductGeoSchema';
 * import { generateSafeLink } from '@/lib/safe-links';
 * 
 * <ProductGeoSchema
 *   product={{
 *     name: 'Samsung QN90C 65"',
 *     image: 'https://example.com/qn90c.jpg',
 *     description: 'Smart TV Neo QLED 4K com tecnologia...',
 *     brand: 'Samsung',
 *     sku: 'QN65QN90CAGXZD',
 *     reviewCount: 127,
 *     ratingValue: 8.4,
 *   }}
 *   offers={[
 *     {
 *       price: 5999.00,
 *       currency: 'BRL',
 *       sellerName: 'Amazon',
 *       status: 'in_stock',
 *       safeUrl: generateSafeLink('amazon', 'B09V3KXJPB', 'Samsung QN90C', 'comparatop-20'),
 *     },
 *   ]}
 * />
 */
export function ProductGeoSchema({ product, offers }: GeoSchemaProps): React.ReactElement {
    // Gera timestamps dinâmicos (Render Time)
    const availabilityStarts = getCurrentTimestamp();
    const priceValidUntil = getTomorrowDate();

    // Filtra apenas ofertas em estoque para o schema principal
    // (ofertas out_of_stock ainda são incluídas mas marcadas como OutOfStock)
    const validOffers = offers.filter(offer => offer.status === 'in_stock');

    // Calcula range de preços para AggregateOffer
    const prices = validOffers.map(o => o.price);
    const lowPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const highPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Constrói o Schema completo
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',

        // ========== INFORMAÇÕES BÁSICAS ==========
        'name': product.name,
        'image': product.image,
        'description': product.description,
        'sku': product.sku,

        // Marca/fabricante
        'brand': {
            '@type': 'Brand',
            'name': product.brand,
        },

        // ========== AVALIAÇÃO AGREGADA ==========
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': product.ratingValue.toString(),
            'bestRating': '10',
            'worstRating': '0',
            'reviewCount': product.reviewCount.toString(),
        },

        // ========== OFERTAS ==========
        'offers': {
            '@type': 'AggregateOffer',

            // Range de preços (apenas ofertas em estoque)
            'lowPrice': lowPrice.toFixed(2),
            'highPrice': highPrice.toFixed(2),
            'priceCurrency': offers[0]?.currency || 'BRL',

            // Quantidade de ofertas disponíveis
            'offerCount': validOffers.length.toString(),

            // ========== SINAIS DE FRESCOR (GEO) ==========

            // availabilityStarts: Timestamp do momento da verificação
            // Diz à IA: "Verifiquei o estoque neste exato segundo"
            'availabilityStarts': availabilityStarts,

            // priceValidUntil: Preço válido até amanhã
            // Cria "urgência algorítmica" - força reindexação em 24h
            'priceValidUntil': priceValidUntil,

            // Array de ofertas individuais
            'offers': offers.map(offer => ({
                '@type': 'Offer',

                // URL SEGURA (processada pelo safe-links.ts)
                // A IA indexa o caminho de redirecionamento blindado
                'url': offer.safeUrl,

                // Preço e moeda
                'price': offer.price.toFixed(2),
                'priceCurrency': offer.currency,

                // Disponibilidade mapeada para URL Schema.org
                'availability': mapStatusToSchemaUrl(offer.status),

                // Sinais de frescor por oferta
                'availabilityStarts': availabilityStarts,
                'priceValidUntil': priceValidUntil,

                // Vendedor
                'seller': {
                    '@type': 'Organization',
                    'name': offer.sellerName,
                },

                // Condição: Novo (safe-links já filtra por novos)
                'itemCondition': 'https://schema.org/NewCondition',
            })),
        },

        // ========== SPEAKABLE (GEO para Voz/Resumo) ==========
        // Indica qual parte do conteúdo a IA deve usar como resumo
        // O elemento com id="ai-verdict" será lido/citado pela IA
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': '#ai-verdict',
        },
    };

    // Renderiza apenas o script JSON-LD (sem elementos visuais)
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema, null, 0), // Minificado
            }}
        />
    );
}

// Export default para facilitar importação
export default ProductGeoSchema;
