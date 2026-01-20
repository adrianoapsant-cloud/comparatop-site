/**
 * @file partner-policy.ts
 * @description Configuração centralizada de políticas de exibição por parceiro afiliado
 * 
 * Amazon Associates Compliance:
 * - Preços estáticos são proibidos (podem ficar desatualizados)
 * - Price tracking/alerts violam ToS
 * - Comparação lado a lado com concorrentes é desencorajada
 * 
 * @version 1.0.0
 * @see https://affiliate-program.amazon.com/help/operating/agreement
 */

// ============================================================================
// TYPES
// ============================================================================

export type PartnerId = 'amazon' | 'mercadolivre' | 'magalu' | 'shopee';

/**
 * Política de exibição por parceiro
 */
export interface PartnerPolicy {
    /** Nome de exibição do parceiro */
    displayName: string;

    /** Exibir preço numérico na UI? */
    showPrice: boolean;

    /** Exibir parcelas na UI? */
    showInstallments: boolean;

    /** Permitir alertas de preço/monitoramento? */
    allowPriceAlert: boolean;

    /** Permitir comparação lado a lado com outros parceiros? */
    allowSideBySideCompare: boolean;

    /** Usar CTA neutro (sem preço no botão)? */
    neutralCta: boolean;

    /** Label padrão do CTA */
    ctaLabel: string;

    /** Mensagem quando recurso está desabilitado */
    disabledFeatureMessage?: string;
}

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

/**
 * Políticas por parceiro afiliado
 * 
 * AMAZON: Modo restrito para compliance
 * - Sem preços estáticos (podem ficar desatualizados)
 * - Sem comparação com concorrentes
 * - CTA neutro direcionando para página do produto
 */
export const PARTNER_POLICIES: Record<PartnerId, PartnerPolicy> = {
    amazon: {
        displayName: 'Amazon',
        showPrice: false,
        showInstallments: false,
        allowPriceAlert: false,
        allowSideBySideCompare: false,
        neutralCta: true,
        ctaLabel: 'Ver preço na Amazon',
        disabledFeatureMessage: 'Alertas de preço não disponíveis para Amazon.',
    },
    mercadolivre: {
        displayName: 'Mercado Livre',
        showPrice: true,
        showInstallments: true,
        allowPriceAlert: true,
        allowSideBySideCompare: true,
        neutralCta: false,
        ctaLabel: 'Ver no Mercado Livre',
    },
    magalu: {
        displayName: 'Magazine Luiza',
        showPrice: true,
        showInstallments: true,
        allowPriceAlert: true,
        allowSideBySideCompare: true,
        neutralCta: false,
        ctaLabel: 'Ver no Magalu',
    },
    shopee: {
        displayName: 'Shopee',
        showPrice: true,
        showInstallments: true,
        allowPriceAlert: true,
        allowSideBySideCompare: true,
        neutralCta: false,
        ctaLabel: 'Ver na Shopee',
    },
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtém política de um parceiro
 * @param partnerId - ID do parceiro (amazon, mercadolivre, etc.)
 * @returns Política do parceiro ou política permissiva padrão
 */
export function getPartnerPolicy(partnerId: string): PartnerPolicy {
    const normalizedId = partnerId.toLowerCase() as PartnerId;
    return PARTNER_POLICIES[normalizedId] ?? {
        displayName: partnerId,
        showPrice: true,
        showInstallments: true,
        allowPriceAlert: true,
        allowSideBySideCompare: true,
        neutralCta: false,
        ctaLabel: 'Ver oferta',
    };
}

/**
 * Verifica se um parceiro permite exibição de preço
 */
export function canShowPrice(partnerId: string): boolean {
    return getPartnerPolicy(partnerId).showPrice;
}

/**
 * Verifica se um parceiro permite alertas de preço
 */
export function canShowPriceAlert(partnerId: string): boolean {
    return getPartnerPolicy(partnerId).allowPriceAlert;
}

/**
 * Verifica se um parceiro deve usar CTA neutro
 */
export function shouldUseNeutralCta(partnerId: string): boolean {
    return getPartnerPolicy(partnerId).neutralCta;
}

/**
 * Obtém CTA label para o parceiro
 */
export function getPartnerCtaLabel(partnerId: string): string {
    return getPartnerPolicy(partnerId).ctaLabel;
}

/**
 * Verifica se é Amazon (helper para guards frequentes)
 */
export function isAmazon(partnerId: string): boolean {
    return partnerId.toLowerCase() === 'amazon';
}
