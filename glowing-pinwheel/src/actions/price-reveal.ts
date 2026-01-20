/**
 * @file price-reveal.ts
 * @description Server Action para revelar preços sob demanda (Click-to-Reveal)
 * 
 * Esta é a camada de proteção de dados (Data Moat) contra bots de IA.
 * O preço e link de afiliado só são expostos quando um usuário real
 * interage com a página, impedindo que SearchGPT/Google SGE "roubem"
 * a informação e respondam sem enviar tráfego.
 * 
 * Padrão: Click-to-Reveal
 * - HTML inicial: Sem preços, sem links <a>
 * - Após interação: Dados carregados via Server Action
 */

'use server';

import { generateSafeLink, type Platform } from '@/lib/safe-links';

// ============================================================================
// TIPOS
// ============================================================================

/** Resposta da ação de revelar preço */
export interface PriceRevealResponse {
    /** Preço atual do produto */
    price: number;
    /** Preço original (antes do desconto, se houver) */
    originalPrice?: number;
    /** Moeda (default: BRL) */
    currency: string;
    /** Status de disponibilidade */
    inStock: boolean;
    /** URL segura blindada (via safe-links.ts) */
    safeUrl: string;
    /** Nome do vendedor */
    sellerName: string;
    /** Plataforma de origem */
    platform: Platform;
    /** Timestamp da verificação */
    verifiedAt: string;
    /** Mensagem de erro (se houver) */
    error?: string;
}

/** Input para a ação */
export interface PriceRevealInput {
    /** ID do produto no nosso sistema */
    productId?: string;
    /** ASIN da Amazon */
    asin?: string;
    /** Termo de busca (fallback) */
    keyword?: string;
    /** Plataforma preferida */
    platform?: Platform;
}

// ============================================================================
// DADOS MOCKADOS (Temporário)
// ============================================================================

/**
 * Base de dados mockada para desenvolvimento
 * 
 * TODO: Substituir por chamadas reais às APIs:
 * - Amazon Product Advertising API (PAAPI 5.0)
 * - Mercado Livre API
 * - Shopee Affiliate API
 * - Magazine Luiza API (se disponível)
 */
const MOCK_PRICES: Record<string, {
    price: number;
    originalPrice?: number;
    inStock: boolean;
    sellerName: string;
    platform: Platform;
}> = {
    // Samsung QN90C 65"
    'B09V3KXJPB': {
        price: 5999.00,
        originalPrice: 7499.00,
        inStock: true,
        sellerName: 'Amazon',
        platform: 'amazon',
    },
    // Samsung QN90C 55"
    'B09V3KXJPC': {
        price: 4499.00,
        originalPrice: 5499.00,
        inStock: true,
        sellerName: 'Amazon',
        platform: 'amazon',
    },
    // LG C3 65"
    'B0BVXF72HV': {
        price: 5299.00,
        inStock: true,
        sellerName: 'Amazon',
        platform: 'amazon',
    },
    // Produto genérico (fallback)
    'default': {
        price: 2999.00,
        inStock: true,
        sellerName: 'Amazon',
        platform: 'amazon',
    },
};

// ============================================================================
// SERVER ACTION PRINCIPAL
// ============================================================================

/**
 * Server Action para revelar o preço de um produto
 * 
 * Esta função é chamada pelo componente PriceRevealButton quando o
 * usuário interage (hover/click). Ela retorna o preço atual e a URL
 * segura para compra.
 * 
 * @param input - Identificadores do produto (productId, asin, ou keyword)
 * @returns Dados do preço incluindo URL blindada
 * 
 * @example
 * // No componente client
 * const data = await revealPrice({ asin: 'B09V3KXJPB' });
 * console.log(data.price);    // 5999.00
 * console.log(data.safeUrl);  // https://amazon.com.br/gp/offer-listing/...
 */
export async function revealPrice(input: PriceRevealInput): Promise<PriceRevealResponse> {
    try {
        // Simula latência de rede (remover em produção)
        await new Promise(resolve => setTimeout(resolve, 300));

        // ========================================================================
        // TODO: INTEGRAÇÃO COM APIs REAIS
        // ========================================================================
        // 
        // Aqui você deve chamar a API da plataforma correspondente:
        //
        // 1. AMAZON - Product Advertising API (PAAPI 5.0)
        //    const amazonClient = new ProductAdvertisingAPIv1.DefaultApi();
        //    const response = await amazonClient.getItems({
        //      ItemIds: [input.asin],
        //      Resources: ['Offers.Listings.Price', 'Offers.Listings.Availability'],
        //    });
        //
        // 2. MERCADO LIVRE - API Pública
        //    const response = await fetch(
        //      `https://api.mercadolibre.com/items/${input.productId}`
        //    );
        //    const data = await response.json();
        //
        // 3. SHOPEE - Affiliate API
        //    const response = await shopeeClient.getProductInfo({
        //      itemId: input.productId,
        //    });
        //
        // 4. MAGAZINE LUIZA - API (verificar disponibilidade)
        //    Pode ser necessário web scraping ou parceria direta
        //
        // ========================================================================

        // Determina o identificador a usar
        const identifier = input.asin || input.productId || 'default';

        // Busca dados mockados (substituir por API real)
        const mockData = MOCK_PRICES[identifier] || MOCK_PRICES['default'];

        // Determina a plataforma
        const platform = input.platform || mockData.platform;

        // Gera a URL segura usando safe-links.ts
        // IMPORTANTE: Nunca expor o link cru da loja
        const safeUrl = generateSafeLink(
            platform,
            identifier,
            input.keyword, // Fallback keyword para busca
            getAffiliateTag(platform), // Tag de afiliado por plataforma
        );

        // Monta resposta
        const response: PriceRevealResponse = {
            price: mockData.price,
            originalPrice: mockData.originalPrice,
            currency: 'BRL',
            inStock: mockData.inStock,
            safeUrl,
            sellerName: mockData.sellerName,
            platform,
            verifiedAt: new Date().toISOString(),
        };

        return response;

    } catch (error) {
        // Log do erro (em produção, enviar para serviço de monitoramento)
        console.error('[revealPrice] Erro ao buscar preço:', error);

        // Retorna resposta de erro
        return {
            price: 0,
            currency: 'BRL',
            inStock: false,
            safeUrl: '#',
            sellerName: 'Indisponível',
            platform: input.platform || 'amazon',
            verifiedAt: new Date().toISOString(),
            error: 'Não foi possível verificar o preço. Tente novamente.',
        };
    }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Retorna a tag de afiliado para cada plataforma
 * 
 * TODO: Mover para variáveis de ambiente (.env.local)
 */
function getAffiliateTag(platform: Platform): string {
    const tags: Record<Platform, string> = {
        amazon: process.env.AMAZON_AFFILIATE_TAG || 'comparatop-20',
        mercadolivre: process.env.ML_AFFILIATE_ID || 'comparatop',
        shopee: process.env.SHOPEE_AFFILIATE_ID || '',
        magalu: process.env.MAGALU_PARTNER_ID || '',
    };

    return tags[platform];
}
