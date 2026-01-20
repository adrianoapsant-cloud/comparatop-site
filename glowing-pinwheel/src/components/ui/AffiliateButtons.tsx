/**
 * @file AffiliateButtons.tsx
 * @description Premium affiliate link buttons with tactile 3D design
 * 
 * Design specs:
 * - 4 full-width buttons in vertical stack
 * - 3D "tactile" feel via solid bottom border (darker shade)
 * - Amazon: Special double-ring effect (orange → white → orange)
 * - Mercado Livre: Yellow with dark text
 * - Shopee: Red gradient
 * - Magalu: Blue gradient
 * 
 * @author ComparaTop
 */

'use client';

import React from 'react';
import { ShoppingCart, Handshake, ShoppingBag, Heart, ExternalLink } from 'lucide-react';
import {
    generateAmazonSearchLink,
    generateMercadoLivreSearchLink,
    generateShopeeSearchLink,
    generateMagaluSearchLink,
} from '@/lib/safe-links';
import { getSmartCTALabel, getPlatformOrder, isParcelamentoSensitive } from '@/lib/smart-routing';

// ============================================================================
// TYPES
// ============================================================================

export interface AffiliateButtonProps {
    productName: string;
    categoryId?: string;  // For smart routing
    amazonUrl?: string;
    mercadoLivreUrl?: string;
    shopeeUrl?: string;
    magaluUrl?: string;
    className?: string;
}

interface ButtonConfig {
    id: string;
    name: string;
    storeName: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    textColor: string;
    hoverEffect: string;
    specialStyle?: string;
    url: string;
}

// ============================================================================
// ICONS
// ============================================================================

const AmazonIcon = () => (
    <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
);

const MercadoLivreIcon = () => (
    <Handshake className="w-6 h-6" strokeWidth={2.5} />
);

const ShopeeIcon = () => (
    <ShoppingBag className="w-6 h-6" strokeWidth={2.5} />
);

const MagaluIcon = () => (
    <Heart className="w-6 h-6" strokeWidth={2.5} />
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AffiliateButtons({
    productName,
    categoryId = 'tv',
    amazonUrl,
    mercadoLivreUrl,
    shopeeUrl,
    magaluUrl,
    className = '',
}: AffiliateButtonProps): React.ReactElement {

    // Generate URLs with safe-link patterns (Anti-Golpe filters)
    const generateUrl = (platform: string, customUrl?: string): string => {
        if (customUrl) return customUrl;

        switch (platform) {
            case 'amazon':
                // Filters: Prime + Novo + 4★
                return generateAmazonSearchLink(productName, 'comparatop-20');
            case 'mercadolivre':
                // Filters: Frete Grátis + Novo + Loja Oficial
                return generateMercadoLivreSearchLink(productName);
            case 'shopee':
                // Filters: Shopee Mall + 4★
                return generateShopeeSearchLink(productName);
            case 'magalu':
                // Filters: Vendido por Magalu (1P)
                return generateMagaluSearchLink(productName);
            default:
                return '#';
        }
    };

    // Get platform order based on category (Linha Branca → ML first, Eletronicos → Amazon first)
    const platformOrder = getPlatformOrder(categoryId);
    const showParcelamentoHint = isParcelamentoSensitive(categoryId);

    const buttonConfigs: Record<string, Omit<ButtonConfig, 'name' | 'url'>> = {
        amazon: {
            id: 'amazon',
            storeName: 'Amazon',
            icon: <AmazonIcon />,
            bgColor: 'bg-[#FF9900]',
            borderColor: 'border-b-[#CC7A00]',
            textColor: 'text-white',
            hoverEffect: 'hover:brightness-110 hover:-translate-y-0.5',
            specialStyle: 'ring-2 ring-white ring-offset-2 ring-offset-[#FF9900]',
        },
        mercadolivre: {
            id: 'mercadolivre',
            storeName: 'Mercado Livre',
            icon: <MercadoLivreIcon />,
            bgColor: 'bg-[#FFE600]',
            borderColor: 'border-b-[#D4C000]',
            textColor: 'text-gray-900',
            hoverEffect: 'hover:brightness-105 hover:-translate-y-0.5',
        },
        shopee: {
            id: 'shopee',
            storeName: 'Shopee',
            icon: <ShopeeIcon />,
            bgColor: 'bg-[#EE4D2D]',
            borderColor: 'border-b-[#B8391F]',
            textColor: 'text-white',
            hoverEffect: 'hover:brightness-110 hover:-translate-y-0.5',
        },
        magalu: {
            id: 'magalu',
            storeName: 'Magazine Luiza',
            icon: <MagaluIcon />,
            bgColor: 'bg-[#0086FF]',
            borderColor: 'border-b-[#0066CC]',
            textColor: 'text-white',
            hoverEffect: 'hover:brightness-110 hover:-translate-y-0.5',
        },
    };

    const urlMap: Record<string, string | undefined> = {
        amazon: amazonUrl,
        mercadolivre: mercadoLivreUrl,
        shopee: shopeeUrl,
        magalu: magaluUrl,
    };

    // Build buttons in smart order with contextual labels
    const buttons: ButtonConfig[] = platformOrder.map(platform => ({
        ...buttonConfigs[platform],
        name: getSmartCTALabel(categoryId, platform),
        url: generateUrl(platform, urlMap[platform]),
    }));

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {buttons.map((button) => (
                <a
                    key={button.id}
                    href={button.url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className={`
            flex items-center justify-between
            w-full px-5 py-4
            rounded-2xl
            border-b-4
            ${button.bgColor}
            ${button.borderColor}
            ${button.textColor}
            ${button.hoverEffect}
            ${button.specialStyle || ''}
            transition-all duration-200
            cursor-pointer
            select-none
            active:translate-y-0.5
            active:border-b-2
          `}
                >
                    {/* Left: Icon */}
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            {button.icon}
                        </div>

                        {/* Center: Text Content */}
                        <div className="flex flex-col items-start">
                            <span className="text-base font-semibold leading-tight">
                                {button.name}
                            </span>
                            <span className={`text-[13px] leading-tight ${button.id === 'mercadolivre' ? 'text-gray-700' : 'text-white/80'
                                }`}>
                                {button.storeName}
                            </span>
                        </div>
                    </div>

                    {/* Right: External Link Icon */}
                    <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-80" />
                </a>
            ))}

            {/* Compliance footer + parcelamento hint */}
            <p className="text-[10px] text-gray-500 text-center mt-1">
                {showParcelamentoHint
                    ? 'Dica: Confira parcelas no ML/Magalu para menor impacto mensal.'
                    : 'Vendido por parceiros. Preços sujeitos a alteração.'}
            </p>
        </div>
    );
}

// ============================================================================
// SINGLE BUTTON VARIANT (for individual use)
// ============================================================================

export interface SingleAffiliateButtonProps {
    platform: 'amazon' | 'mercadolivre' | 'shopee' | 'magalu';
    productName: string;
    customUrl?: string;
    className?: string;
}

export function SingleAffiliateButton({
    platform,
    productName,
    customUrl,
    className = '',
}: SingleAffiliateButtonProps): React.ReactElement {
    const configs: Record<string, Omit<ButtonConfig, 'url'>> = {
        amazon: {
            id: 'amazon',
            name: 'Conferir Desconto',
            storeName: 'Amazon',
            icon: <AmazonIcon />,
            bgColor: 'bg-[#FF9900]',
            borderColor: 'border-b-[#CC7A00]',
            textColor: 'text-white',
            hoverEffect: 'hover:brightness-110 hover:-translate-y-0.5',
            specialStyle: 'ring-2 ring-white ring-offset-2 ring-offset-[#FF9900]',
        },
        mercadolivre: {
            id: 'mercadolivre',
            name: 'Conferir Desconto',
            storeName: 'Mercado Livre',
            icon: <MercadoLivreIcon />,
            bgColor: 'bg-[#FFE600]',
            borderColor: 'border-b-[#D4C000]',
            textColor: 'text-gray-900',
            hoverEffect: 'hover:brightness-105 hover:-translate-y-0.5',
        },
        shopee: {
            id: 'shopee',
            name: 'Conferir Desconto',
            storeName: 'Shopee',
            icon: <ShopeeIcon />,
            bgColor: 'bg-[#EE4D2D]',
            borderColor: 'border-b-[#B8391F]',
            textColor: 'text-white',
            hoverEffect: 'hover:brightness-110 hover:-translate-y-0.5',
        },
        magalu: {
            id: 'magalu',
            name: 'Conferir Desconto',
            storeName: 'Magazine Luiza',
            icon: <MagaluIcon />,
            bgColor: 'bg-[#0086FF]',
            borderColor: 'border-b-[#0066CC]',
            textColor: 'text-white',
            hoverEffect: 'hover:brightness-110 hover:-translate-y-0.5',
        },
    };

    const config = configs[platform];

    // Use safe-links library with Anti-Golpe filters
    const urls: Record<string, string> = {
        amazon: generateAmazonSearchLink(productName, 'comparatop-20'),
        mercadolivre: generateMercadoLivreSearchLink(productName),
        shopee: generateShopeeSearchLink(productName),
        magalu: generateMagaluSearchLink(productName),
    };

    const url = customUrl || urls[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className={`
        flex items-center justify-between
        w-full px-5 py-4
        rounded-2xl
        border-b-4
        ${config.bgColor}
        ${config.borderColor}
        ${config.textColor}
        ${config.hoverEffect}
        ${config.specialStyle || ''}
        transition-all duration-200
        cursor-pointer
        select-none
        active:translate-y-0.5
        active:border-b-2
        ${className}
      `}
        >
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    {config.icon}
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-base font-semibold leading-tight">
                        {config.name}
                    </span>
                    <span className={`text-[13px] leading-tight ${platform === 'mercadolivre' ? 'text-gray-700' : 'text-white/80'
                        }`}>
                        {config.storeName}
                    </span>
                </div>
            </div>
            <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-80" />
        </a>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default AffiliateButtons;
