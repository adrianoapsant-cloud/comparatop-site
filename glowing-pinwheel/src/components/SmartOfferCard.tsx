'use client';

/**
 * @file SmartOfferCard.tsx
 * @description Card de oferta inteligente com comparação visual de preço vs parcelamento
 * 
 * Implementa a recomendação do relatório "Otimização de Afiliados e UX de Preços":
 * - Mostra preço à vista vs parcelamento lado a lado
 * - Destaca vencedor de cada métrica
 * - Labels de CTA contextualizados por categoria
 * 
 * @version 1.0.0
 */

import { memo, useState } from 'react';
import { ExternalLink, Truck, CreditCard, Tag, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Platform } from '@/lib/safe-links';
import { generateAmazonSearchLink, generateMercadoLivreSearchLink, generateShopeeSearchLink, generateMagaluSearchLink } from '@/lib/safe-links';
import { getSmartCTALabel, isParcelamentoSensitive, getQualifiedCTA } from '@/lib/smart-routing';

// ============================================================================
// TYPES
// ============================================================================

export interface OfferData {
    platform: Platform;
    priceSpot: number;          // Preço à vista
    installments?: number;      // Número de parcelas
    installmentValue?: number;  // Valor da parcela
    shipping: 'free' | number;  // Grátis ou valor do frete
    inStock: boolean;
    affiliateTag?: string;
    affiliateUrl?: string;      // URL de afiliado direto (se disponível, usa em vez de gerar busca)
    productId?: string;         // ASIN, MLB ID, etc.
    productKeyword?: string;    // Fallback keyword
}

export interface SmartOfferCardProps {
    offers: OfferData[];
    categoryId: string;
    productName: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const PLATFORM_CONFIG: Record<Platform, { name: string; color: string; bgColor: string; logo: string }> = {
    amazon: {
        name: 'Amazon',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        logo: '🛒',
    },
    mercadolivre: {
        name: 'Mercado Livre',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        logo: '🤝',
    },
    shopee: {
        name: 'Shopee',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        logo: '🧡',
    },
    magalu: {
        name: 'Magalu',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        logo: '💙',
    },
};

function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Generate affiliate link with subid tracking
 * Subid format: card_<metric>_<platform>
 */
function generateTrackedLink(
    platform: Platform,
    keyword: string,
    affiliateTag?: string,
    subid?: string
): string {
    switch (platform) {
        case 'amazon':
            return generateAmazonSearchLink(keyword, affiliateTag, subid);
        case 'mercadolivre':
            return generateMercadoLivreSearchLink(keyword, affiliateTag, subid);
        case 'shopee':
            return generateShopeeSearchLink(keyword, affiliateTag);
        case 'magalu':
            return generateMagaluSearchLink(keyword, affiliateTag);
        default:
            return '#';
    }
}

// ============================================================================
// SINGLE OFFER CARD
// ============================================================================

interface SingleOfferCardProps {
    offer: OfferData;
    categoryId: string;
    isWinnerPrice: boolean;
    isWinnerInstallment: boolean;
    productName: string;
}

const SingleOfferCard = memo(function SingleOfferCard({
    offer,
    categoryId,
    isWinnerPrice,
    isWinnerInstallment,
    productName,
}: SingleOfferCardProps) {
    const config = PLATFORM_CONFIG[offer.platform];

    // Simple CTA labels per platform
    const ctaLabels: Record<Platform, string> = {
        amazon: 'Verificar Preço na Amazon',
        mercadolivre: 'Verificar Preço no ML',
        shopee: 'Verificar Preço na Shopee',
        magalu: 'Verificar Preço no Magalu',
    };
    const ctaLabel = ctaLabels[offer.platform];

    // Generate affiliate link
    const subid = 'card_simple';
    const affiliateLink = offer.affiliateUrl || generateTrackedLink(
        offer.platform,
        offer.productKeyword || productName,
        offer.affiliateTag,
        subid
    );

    return (
        <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`
                flex items-center justify-center gap-2 py-3 px-6 rounded-xl
                font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02]
                ${offer.platform === 'amazon' ? 'bg-orange-500 hover:bg-orange-600' :
                    offer.platform === 'mercadolivre' ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900' :
                        offer.platform === 'magalu' ? 'bg-blue-500 hover:bg-blue-600' :
                            'bg-orange-400 hover:bg-orange-500'}
                ${!offer.inStock ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={(e) => {
                if (!offer.inStock) {
                    e.preventDefault();
                    return;
                }
            }}
        >
            {ctaLabel}
            <ExternalLink className="w-4 h-4" />
        </a>
    );
});

// ============================================================================
// ALTERNATIVE STORES - COLLAPSIBLE
// ============================================================================

interface AlternativeStoresProps {
    platforms: Platform[];
    productName: string;
}

function AlternativeStores({ platforms, productName }: AlternativeStoresProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (platforms.length === 0) return null;

    return (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
                {isExpanded ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Ocultar outras lojas</span>
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Ver mais {platforms.length} {platforms.length === 1 ? 'loja' : 'lojas'}</span>
                    </>
                )}
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="mt-3 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {platforms.map((platform) => {
                        const config = PLATFORM_CONFIG[platform];
                        const searchLink = generateTrackedLink(platform, productName, undefined, 'alt_search');
                        return (
                            <a
                                key={platform}
                                href={searchLink}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className={`
                                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                                    border transition-all hover:shadow-sm
                                    ${platform === 'shopee' ? 'border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400' :
                                        platform === 'magalu' ? 'border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400' :
                                            platform === 'amazon' ? 'border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400' :
                                                'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400'}
                                `}
                            >
                                <span>{config.logo}</span>
                                <span>Buscar no {config.name}</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SmartOfferCard = memo(function SmartOfferCard({
    offers,
    categoryId,
    productName,
}: SmartOfferCardProps) {
    // Always show all 4 marketplaces, using offers data if available
    const allPlatforms: Platform[] = ['amazon', 'mercadolivre', 'magalu', 'shopee'];

    // Create a map of existing offers by platform
    const offerMap = new Map(offers?.map(o => [o.platform, o]) || []);

    // Generate all 4 buttons (use offer data if available, otherwise generate search link)
    const allOffers: OfferData[] = allPlatforms.map(platform => {
        const existingOffer = offerMap.get(platform);
        if (existingOffer) return existingOffer;

        // Create a placeholder offer for search
        return {
            platform,
            priceSpot: 0,
            shipping: 'free' as const,
            inStock: true,
            productKeyword: productName,
        };
    });

    // Organize in 2 columns: [Amazon, Magalu] and [ML, Shopee]
    const leftColumn = allOffers.filter(o => o.platform === 'amazon' || o.platform === 'magalu');
    const rightColumn = allOffers.filter(o => o.platform === 'mercadolivre' || o.platform === 'shopee');

    return (
        <div className="smart-offer-cards">
            {/* 2x2 Grid: Amazon/Magalu on left, ML/Shopee on right */}
            <div className="grid grid-cols-2 gap-3">
                {/* Left Column: Amazon + Magalu */}
                <div className="flex flex-col gap-3">
                    {leftColumn.map((offer) => (
                        <SingleOfferCard
                            key={offer.platform}
                            offer={offer}
                            categoryId={categoryId}
                            isWinnerPrice={false}
                            isWinnerInstallment={false}
                            productName={productName}
                        />
                    ))}
                </div>

                {/* Right Column: ML + Shopee */}
                <div className="flex flex-col gap-3">
                    {rightColumn.map((offer) => (
                        <SingleOfferCard
                            key={offer.platform}
                            offer={offer}
                            categoryId={categoryId}
                            isWinnerPrice={false}
                            isWinnerInstallment={false}
                            productName={productName}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

export default SmartOfferCard;
