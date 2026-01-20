/**
 * @file ProductJsonLd.tsx
 * @description Dynamic JSON-LD Structured Data for Product Pages
 * 
 * SEO Infrastructure: Injects schema.org structured data for:
 * - Product (name, image, brand, offers)
 * - AggregateRating / Review (editorial score)
 * - FAQPage (dynamically generated from specs)
 * - BreadcrumbList (navigation hierarchy)
 * 
 * This increases visibility in Google SERPs:
 * - Rich snippets with ratings and prices
 * - "People Also Ask" sections with FAQs
 * - Enhanced breadcrumb display
 */

import React from 'react';
import type { Product as ProductType } from '@/types/category';

// ============================================================================
// TYPES
// ============================================================================

interface ProductJsonLdProps {
    product: ProductType;
    categoryName: string;
    categorySlug: string;
    computedScore?: number;
    baseUrl?: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

// ============================================================================
// FAQ GENERATION - "A Grande Sacada"
// ============================================================================

/**
 * Generate dynamic FAQ items based on product specs and category
 * These appear in Google's "People Also Ask" sections
 */
function generateProductFAQs(product: ProductType, categoryName: string, computedScore?: number): FAQItem[] {
    const faqs: FAQItem[] = [];
    const specs = product.technicalSpecs || product.specs || {};
    const name = product.shortName || product.name;

    // ============================================
    // TV-SPECIFIC FAQs
    // ============================================
    if (product.categoryId === 'tv') {
        // Gaming FAQ
        const refreshRate = specs.refreshRate as number;
        const hasVRR = specs.hasVRR as boolean;
        if (refreshRate) {
            const isGoodForGaming = refreshRate >= 120;
            faqs.push({
                question: `A ${name} é boa para games?`,
                answer: isGoodForGaming
                    ? `Sim! A ${name} possui taxa de atualização de ${refreshRate}Hz${hasVRR ? ' e suporte a VRR (Variable Refresh Rate)' : ''}, sendo classificada como "${refreshRate >= 144 ? 'Excelente' : 'Muito Boa'}" para games.`
                    : `A ${name} possui ${refreshRate}Hz, adequada para jogos casuais, mas gamers competitivos podem preferir modelos com 120Hz ou mais.`
            });
        }

        // Panel Type FAQ
        const panelType = specs.panelType as string;
        if (panelType) {
            const panelDescriptions: Record<string, string> = {
                'OLED': 'preto perfeito e contraste infinito, ideal para filmes e ambientes escuros',
                'QLED': 'cores vibrantes e alto brilho, excelente para ambientes iluminados',
                'Mini LED': 'excelente controle de iluminação local e HDR impressionante',
                'LED': 'bom custo-benefício com qualidade de imagem sólida',
                'NeoQLED': 'tecnologia Mini LED da Samsung com pretos profundos e alto brilho',
            };
            faqs.push({
                question: `Qual a tecnologia de painel da ${name}?`,
                answer: `A ${name} utiliza painel ${panelType}, que oferece ${panelDescriptions[panelType] || 'qualidade de imagem de alta qualidade'}.`
            });
        }

        // HDR FAQ
        const hasDolbyVision = specs.hasDolbyVision as boolean;
        const hasHDR10Plus = specs.hasHDR10Plus as boolean;
        if (hasDolbyVision || hasHDR10Plus) {
            faqs.push({
                question: `A ${name} suporta HDR?`,
                answer: `Sim, a ${name} suporta ${[
                    hasDolbyVision ? 'Dolby Vision' : '',
                    hasHDR10Plus ? 'HDR10+' : '',
                    'HDR10'
                ].filter(Boolean).join(', ')}, garantindo imagens com alto contraste e cores vívidas em conteúdo compatível.`
            });
        }
    }

    // ============================================
    // FRIDGE-SPECIFIC FAQs
    // ============================================
    if (product.categoryId === 'fridge') {
        const capacity = specs.capacityLitres as number;
        const inverter = specs.inverterTechnology as boolean;
        const frostFree = specs.frostFree as boolean;

        if (capacity) {
            const familySize = capacity >= 500 ? 'famílias grandes (5+ pessoas)' :
                capacity >= 400 ? 'famílias médias (3-4 pessoas)' :
                    capacity >= 300 ? 'casais ou famílias pequenas' :
                        'solteiros ou casais';
            faqs.push({
                question: `Para quantas pessoas a ${name} é indicada?`,
                answer: `Com capacidade de ${capacity} litros, a ${name} é ideal para ${familySize}.`
            });
        }

        if (inverter !== undefined) {
            faqs.push({
                question: `A ${name} é econômica?`,
                answer: inverter
                    ? `Sim! A ${name} possui tecnologia Inverter, que ajusta a velocidade do compressor conforme a necessidade, consumindo até 40% menos energia que modelos convencionais.`
                    : `A ${name} possui motor convencional. Para maior economia, considere modelos com tecnologia Inverter.`
            });
        }

        if (frostFree !== undefined) {
            faqs.push({
                question: `A ${name} é Frost Free?`,
                answer: frostFree
                    ? `Sim, a ${name} é Frost Free, eliminando a necessidade de degelo manual e mantendo temperatura uniforme.`
                    : `A ${name} não possui sistema Frost Free, necessitando degelo periódico.`
            });
        }
    }

    // ============================================
    // AIR CONDITIONER-SPECIFIC FAQs
    // ============================================
    if (product.categoryId === 'air_conditioner') {
        const btus = specs.btus as number;
        const inverterType = specs.inverterType as string;
        const noiseLevel = specs.noiseLevel as number;

        if (btus) {
            const roomSize = btus >= 18000 ? 'ambientes de 25-40m²' :
                btus >= 12000 ? 'ambientes de 15-25m²' :
                    btus >= 9000 ? 'quartos de 10-15m²' :
                        'ambientes pequenos até 10m²';
            faqs.push({
                question: `Qual tamanho de ambiente a ${name} refrigera?`,
                answer: `Com ${btus.toLocaleString('pt-BR')} BTUs, a ${name} é indicada para ${roomSize}. Considere fatores como incidência solar e quantidade de pessoas.`
            });
        }

        if (inverterType) {
            const isInverter = inverterType !== 'conventional';
            faqs.push({
                question: `A ${name} é Inverter?`,
                answer: isInverter
                    ? `Sim, a ${name} possui tecnologia ${inverterType === 'dual-inverter' ? 'Dual Inverter, a mais eficiente do mercado' : 'Inverter'}, oferecendo economia de energia de até ${inverterType === 'dual-inverter' ? '70%' : '40%'} e funcionamento mais silencioso.`
                    : `A ${name} utiliza motor convencional (liga/desliga). Para maior economia, considere modelos Inverter.`
            });
        }

        if (noiseLevel) {
            faqs.push({
                question: `A ${name} é silenciosa?`,
                answer: noiseLevel <= 24
                    ? `Sim! Com apenas ${noiseLevel}dB, a ${name} é ultra-silenciosa, ideal para quartos.`
                    : noiseLevel <= 30
                        ? `Com ${noiseLevel}dB, a ${name} tem nível de ruído moderado, adequado para a maioria dos ambientes.`
                        : `A ${name} opera a ${noiseLevel}dB, considerado audível. Ideal para salas ou áreas de serviço.`
            });
        }
    }

    // ============================================
    // GENERAL FAQs (All Categories)
    // ============================================

    // Price FAQ
    if (product.price) {
        faqs.push({
            question: `Qual o preço da ${name}?`,
            answer: `A ${name} pode ser encontrada a partir de R$ ${product.price.toLocaleString('pt-BR')} nas principais lojas online. O ComparaTop monitora preços para você encontrar a melhor oferta.`
        });
    }

    // Score FAQ
    if (computedScore) {
        const scoreDescription = computedScore >= 8.5 ? 'Excelente' :
            computedScore >= 7.5 ? 'Muito Bom' :
                computedScore >= 6.5 ? 'Bom' :
                    computedScore >= 5.5 ? 'Regular' : 'Abaixo da média';
        faqs.push({
            question: `A ${name} vale a pena?`,
            answer: `Na análise editorial do ComparaTop, a ${name} recebeu nota ${computedScore.toFixed(1)}/10 (${scoreDescription}). ${computedScore >= 8
                ? 'É uma excelente opção no segmento.'
                : computedScore >= 7
                    ? 'Oferece bom custo-benefício para a maioria dos usuários.'
                    : 'Considere avaliar alternativas antes de decidir.'
                }`
        });
    }

    // Brand FAQ
    if (product.brand) {
        faqs.push({
            question: `A ${product.brand} é uma boa marca de ${categoryName.toLowerCase()}?`,
            answer: `A ${product.brand} é uma marca reconhecida no mercado de ${categoryName.toLowerCase()}. A ${name} representa ${computedScore && computedScore >= 8
                ? 'um dos melhores modelos da marca'
                : 'uma opção sólida da fabricante'
                }, com suporte técnico disponível no Brasil.`
        });
    }

    return faqs;
}

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================

function generateProductSchema(
    product: ProductType,
    computedScore: number | undefined,
    baseUrl: string
) {
    const productUrl = `${baseUrl}/produto/${product.id}`;
    const offers = product.offers?.filter(o => o.inStock) || [];

    // Calculate price range
    const lowestPrice = offers.length > 0
        ? Math.min(...offers.map(o => o.price))
        : product.price;

    // highPrice: use max from offers, or simulate +20% margin if single price
    const highestPrice = offers.length > 1
        ? Math.max(...offers.map(o => o.price))
        : Math.round((lowestPrice || 0) * 1.2);

    // Default sellers when no offers available
    const defaultSellers = ['Amazon', 'Mercado Livre', 'Shopee'];
    const offerCount = offers.length > 0 ? offers.length : defaultSellers.length;

    // Build individual offer list for sellers
    const sellerOffers = offers.length > 0
        ? offers.map(offer => ({
            '@type': 'Offer',
            name: offer.store || 'Loja Online',
            url: offer.url,
            price: offer.price.toFixed(2),
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
                '@type': 'Organization',
                name: offer.store || 'Loja Online',
            },
        }))
        : defaultSellers.map(store => ({
            '@type': 'Offer',
            name: store,
            price: (lowestPrice || 0).toFixed(2),
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
                '@type': 'Organization',
                name: store,
            },
        }));

    return {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: product.name,
        description: product.benefitSubtitle || `Análise completa do ${product.name}`,
        image: product.imageUrl ? `${baseUrl}${product.imageUrl}` : undefined,
        brand: {
            '@type': 'Brand',
            name: product.brand,
        },
        model: product.model,
        sku: product.id,
        // AggregateOffer signals we are a comparison aggregator, not a retailer
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'BRL',
            lowPrice: (lowestPrice || 0).toFixed(2),
            highPrice: highestPrice.toFixed(2),
            offerCount: offerCount,
            availability: 'https://schema.org/InStock',
            url: productUrl,
            // Individual seller offers
            offers: sellerOffers,
        },
        ...(computedScore && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: computedScore.toFixed(1),
                bestRating: '10',
                worstRating: '0',
                ratingCount: 1,
                reviewCount: 1,
            },
            review: {
                '@type': 'Review',
                author: {
                    '@type': 'Organization',
                    name: 'ComparaTop',
                    url: baseUrl,
                },
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: computedScore.toFixed(1),
                    bestRating: '10',
                    worstRating: '0',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'ComparaTop',
                    url: baseUrl,
                },
            },
        }),
    };
}

function generateFAQSchema(faqs: FAQItem[]) {
    if (faqs.length === 0) return null;

    return {
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
}

function generateBreadcrumbSchema(
    product: ProductType,
    categoryName: string,
    categorySlug: string,
    baseUrl: string
) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: categoryName,
                item: `${baseUrl}/${categorySlug}`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.brand,
                item: `${baseUrl}/${categorySlug}?brand=${product.brand.toLowerCase()}`,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: product.shortName || product.name,
                item: `${baseUrl}/produto/${product.id}`,
            },
        ],
    };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProductJsonLd({
    product,
    categoryName,
    categorySlug,
    computedScore,
    baseUrl = 'https://comparatop.com.br',
}: ProductJsonLdProps) {
    // Generate all schema components
    const faqs = generateProductFAQs(product, categoryName, computedScore);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            generateProductSchema(product, computedScore, baseUrl),
            generateBreadcrumbSchema(product, categoryName, categorySlug, baseUrl),
            ...(faqs.length > 0 ? [generateFAQSchema(faqs)] : []),
        ].filter(Boolean),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd, null, 0),
            }}
        />
    );
}

// ============================================================================
// HELPER EXPORTS
// ============================================================================

/**
 * Get category info for JSON-LD
 */
export function getCategoryInfo(categoryId: string): { name: string; slug: string } {
    const categories: Record<string, { name: string; slug: string }> = {
        'tv': { name: 'Smart TVs', slug: 'tvs' },
        'fridge': { name: 'Geladeiras', slug: 'geladeiras' },
        'air_conditioner': { name: 'Ar-Condicionado', slug: 'ar-condicionado' },
        'washer': { name: 'Máquinas de Lavar', slug: 'lavadoras' },
    };
    return categories[categoryId] || { name: 'Produtos', slug: 'produtos' };
}

export default ProductJsonLd;
