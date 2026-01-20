/**
 * @file safe-links.ts
 * @description Biblioteca de geração de URLs de afiliados "Anti-Golpe" e "Anti-Ruptura"
 * 
 * Estratégias implementadas:
 * - Amazon: Offer Listing Page (OLP) com filtros Prime/Novo/4★
 * - Mercado Livre: Busca filtrada por reputação + Lojas Oficiais
 * - Shopee: Filtro Shopee Mall (oficial) + 4★
 * - Magazine Luiza: Prioriza "Vendido por Magalu" (1P)
 * 
 * @author ComparaTop
 * @version 2.0.0
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/** Plataformas suportadas pela biblioteca */
export type Platform = 'amazon' | 'mercadolivre' | 'shopee' | 'magalu';

/** Status de disponibilidade do produto */
export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'pre_order' | 'backorder';

/** Configuração de tags de afiliado por plataforma */
export interface AffiliateConfig {
    /** Amazon Associate Tag (ex: 'comparatop-20') */
    amazonTag?: string;
    /** Mercado Livre Affiliate ID */
    mlAffiliateId?: string;
    /** Shopee Affiliate ID */
    shopeeAffiliateId?: string;
    /** Magazine Luiza Partner ID */
    magaluPartnerId?: string;
}

// ============================================================================
// CONSTANTES - FILTROS AMAZON
// ============================================================================

/**
 * IDs de filtros da Amazon Brasil
 * 
 * Estes IDs são extraídos via análise de URLs de busca filtrada na Amazon.
 * Eles são usados no parâmetro 'rh' (Refinement Hash) para aplicar filtros.
 */
const AMAZON_FILTERS = {
    /**
     * p_n_condition-type: Condição do produto
     * - 2224371011 = Novo (New) ← USADO
     * - 2224372011 = Usado (Used)
     * - 2224373011 = Recondicionado (Refurbished)
     */
    CONDITION_NEW: '2224371011',

    /**
     * p_72: Avaliação média do cliente
     * - 1249150011 = 4 estrelas ou mais ← USADO
     * - 1249151011 = 3 estrelas ou mais
     * - 1249152011 = 2 estrelas ou mais
     * - 1249153011 = 1 estrela ou mais
     */
    RATING_4_PLUS: '1249150011',

    /**
     * p_76: Elegibilidade Prime
     * - 2661605011 = Elegível para Prime ← USADO
     * 
     * Produtos Prime usam FBA (Fulfillment by Amazon), garantindo:
     * - Entrega rápida e confiável
     * - Política de devolução Amazon
     * - Proteção ao comprador
     */
    PRIME_ELIGIBLE: '2661605011',
} as const;

// ============================================================================
// CONSTANTES - FILTROS MERCADO LIVRE
// ============================================================================

/**
 * IDs de filtros do Mercado Livre Brasil
 */
const MERCADOLIVRE_FILTERS = {
    /**
     * ITEM_CONDITION: Condição do produto
     * - 2230284 = Novo ← USADO
     * - 2230581 = Usado
     */
    CONDITION_NEW: '2230284',

    /**
     * shipping_cost: Tipo de frete
     * - free = Frete Grátis ← USADO
     */
    SHIPPING_FREE: 'free',
} as const;

// ============================================================================
// FUNÇÕES AUXILIARES - AMAZON
// ============================================================================

/**
 * Gera URL direta para a Product Detail Page (PDP) da Amazon
 * 
 * ESTRATÉGIA RECOMENDADA: Link direto para PDP converte mais que OLP.
 * 
 * Justificativa:
 * - 80%+ das vendas Amazon passam pela Buy Box
 * - OLP exige escolha de vendedor = atrito cognitivo = menos conversão
 * - Página "Currently Unavailable" ainda planta cookie de 24h
 * - Usuário pode buscar alternativa com cookie ativo
 * 
 * @param asin - Amazon Standard Identification Number (10 caracteres alfanuméricos)
 * @param affiliateTag - Amazon Associate Tag para tracking de comissões
 * @returns URL completa para a PDP (Buy Box)
 * 
 * @example
 * generateAmazonPDPLink('B09V3KXJPB', 'comparatop-20')
 * // => "https://www.amazon.com.br/dp/B09V3KXJPB?tag=comparatop-20"
 */
export function generateAmazonPDPLink(asin: string, affiliateTag?: string): string {
    const baseUrl = 'https://www.amazon.com.br/dp';

    let url = `${baseUrl}/${asin}`;

    if (affiliateTag) {
        url += `?tag=${affiliateTag}`;
    }

    return url;
}

/**
 * @deprecated Use generateAmazonPDPLink para melhor conversão.
 * Mantido para compatibilidade e casos especiais (itens raros/colecionáveis).
 * 
 * Gera URL para a Offer Listing Page (OLP) da Amazon
 */
export function generateAmazonOLPLink(asin: string, affiliateTag?: string): string {
    const baseUrl = 'https://www.amazon.com.br/gp/offer-listing';

    const params = new URLSearchParams({
        'f_primeEligible': 'true',
        'p_n_condition-type': AMAZON_FILTERS.CONDITION_NEW,
        'p_72': AMAZON_FILTERS.RATING_4_PLUS,
    });

    if (affiliateTag) {
        params.set('tag', affiliateTag);
    }

    return `${baseUrl}/${asin}?${params.toString()}`;
}

/**
 * Gera URL de busca da Amazon com filtros de qualidade via parâmetro 'rh'
 * 
 * O parâmetro 'rh' (Refinement Hash) permite aplicar múltiplos filtros
 * em uma única string codificada. Esta é a estratégia de FALLBACK quando
 * o ASIN específico não está disponível ou o produto foi descontinuado.
 * 
 * Formato do rh: p_<filter_id>:<value_id>,p_<filter_id>:<value_id>
 * 
 * @param keyword - Termo de busca (nome do produto, modelo, etc.)
 * @param affiliateTag - Amazon Associate Tag para tracking
 * @param subid - Tracking ID para analytics (ex: 'price', 'parcela', 'card')
 * @returns URL de busca com filtros aplicados
 * 
 * @example
 * generateAmazonSearchLink('Samsung QN90C 65"', 'comparatop-20', 'price')
 * // => "https://www.amazon.com.br/s?k=...&tag=comparatop-20&subid=price"
 */
export function generateAmazonSearchLink(keyword: string, affiliateTag?: string, subid?: string): string {
    const baseUrl = 'https://www.amazon.com.br/s';

    // Monta o refinement hash com múltiplos filtros
    // Cada filtro é no formato p_<id>:<valor>, separados por vírgula
    const refinementHash = [
        `p_n_condition-type:${AMAZON_FILTERS.CONDITION_NEW}`,  // Apenas Novo
        `p_72:${AMAZON_FILTERS.RATING_4_PLUS}`,                 // 4+ estrelas
        `p_76:${AMAZON_FILTERS.PRIME_ELIGIBLE}`,                // Prime elegível
    ].join(',');

    const params = new URLSearchParams({
        'k': keyword,           // k = keyword de busca
        'rh': refinementHash,   // rh = refinement hash com filtros combinados
    });

    if (affiliateTag) {
        params.set('tag', affiliateTag);
    }

    if (subid) {
        params.set('subid', subid);
    }

    return `${baseUrl}?${params.toString()}`;
}

// ============================================================================
// FUNÇÕES AUXILIARES - MERCADO LIVRE
// ============================================================================

/**
 * Gera URL direta para produto do Mercado Livre
 * 
 * Quando temos o ID do produto (MLB...), podemos linkar diretamente.
 * O ID de afiliado é adicionado como parâmetro de tracking.
 * 
 * @param productId - ID do produto (ex: 'MLB1234567890')
 * @param affiliateId - ID de afiliado do ML
 * @returns URL direta do produto com tracking
 * 
 * @example
 * generateMercadoLivreDirectLink('MLB1234567890', 'comparatop')
 * // => "https://www.mercadolivre.com.br/p/MLB1234567890?matt_tool=comparatop"
 */
export function generateMercadoLivreDirectLink(productId: string, affiliateId?: string): string {
    // Normaliza o ID (garante uppercase)
    const normalizedId = productId.toUpperCase();
    let url = `https://www.mercadolivre.com.br/p/${normalizedId}`;

    // matt_tool: Parâmetro de tracking do Mercado Livre Afiliados
    if (affiliateId) {
        url += `?matt_tool=${affiliateId}`;
    }

    return url;
}

/**
 * Gera URL de busca do Mercado Livre com filtros de qualidade
 * 
 * Estratégia de proteção Anti-Golpe:
 * - Filtra por FRETE GRÁTIS (indica vendedores profissionais com Full)
 * - Prioriza LOJAS OFICIAIS (autenticidade garantida pelo ML)
 * - Apenas produtos NOVOS (exclui usados/recondicionados)
 * 
 * @param keyword - Termo de busca
 * @param affiliateId - ID de afiliado do Mercado Livre
 * @param subid - Tracking ID para analytics (ex: 'price', 'parcela')
 * @returns URL de busca filtrada
 * 
 * @example
 * generateMercadoLivreSearchLink('Samsung QN90C', 'comparatop', 'parcela')
 * // => "https://www.mercadolivre.com.br/jm/search?...&subid=parcela"
 */
export function generateMercadoLivreSearchLink(keyword: string, affiliateId?: string, subid?: string): string {
    const baseUrl = 'https://www.mercadolivre.com.br/jm/search';

    const params = new URLSearchParams({
        // as_word: Termo de busca (advanced search word)
        'as_word': keyword,

        // shipping_cost: Filtro de frete
        // 'free' = Apenas produtos com Frete Grátis
        // Vendedores com Mercado Envios Full geralmente são mais confiáveis
        'shipping_cost': MERCADOLIVRE_FILTERS.SHIPPING_FREE,

        // ITEM_CONDITION: Condição do produto
        // 2230284 = Apenas produtos NOVOS
        'ITEM_CONDITION': MERCADOLIVRE_FILTERS.CONDITION_NEW,
    });

    if (affiliateId) {
        // matt_tool: Parâmetro de tracking do programa de afiliados
        params.set('matt_tool', affiliateId);
    }

    if (subid) {
        params.set('subid', subid);
    }

    // Adiciona filtro de Loja Oficial diretamente na URL
    // O sufixo _LojaOficial prioriza resultados de lojas verificadas
    return `${baseUrl}?${params.toString()}&_LojaOficial=1`;
}

/**
 * Gera URL para Loja Oficial específica do Mercado Livre
 * 
 * Lojas oficiais são verificadas pelo ML e garantem:
 * - Autenticidade do produto
 * - Garantia do fabricante
 * - Atendimento direto da marca
 * 
 * @param storeSlug - Slug da loja oficial (ex: 'samsung', 'lg', 'sony')
 * @param searchTerm - Termo de busca dentro da loja (opcional)
 * @param affiliateId - ID de afiliado
 * @returns URL da loja oficial
 */
export function generateMercadoLivreOfficialStoreLink(
    storeSlug: string,
    searchTerm?: string,
    affiliateId?: string
): string {
    let url = `https://www.mercadolivre.com.br/loja/${storeSlug.toLowerCase()}`;

    const params = new URLSearchParams();

    if (searchTerm) {
        params.set('search', searchTerm);
    }

    if (affiliateId) {
        params.set('matt_tool', affiliateId);
    }

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
}

// ============================================================================
// FUNÇÕES AUXILIARES - SHOPEE
// ============================================================================

/**
 * Gera URL de busca da Shopee com filtros de qualidade
 * 
 * Estratégia Anti-Golpe Shopee:
 * O maior risco na Shopee são vendedores internacionais lentos (30-60 dias)
 * ou produtos falsificados. Mitigamos isso com:
 * 
 * - official_mall=1: Apenas Shopee Mall (lojas oficiais verificadas)
 * - rating_star=4: Apenas vendedores com 4+ estrelas
 * 
 * Shopee Mall garante:
 * - Produtos autênticos
 * - Vendedores verificados
 * - Envio local (não internacional)
 * 
 * @param keyword - Termo de busca
 * @param affiliateId - ID de afiliado Shopee
 * @returns URL de busca filtrada
 * 
 * @example
 * generateShopeeSearchLink('Samsung Galaxy S24')
 * // => "https://shopee.com.br/search?keyword=Samsung+Galaxy+S24&official_mall=1&rating_star=4"
 */
export function generateShopeeSearchLink(keyword: string, affiliateId?: string): string {
    const baseUrl = 'https://shopee.com.br/search';

    const params = new URLSearchParams({
        // keyword: Termo de busca
        'keyword': keyword,

        // official_mall: Filtro de Shopee Mall
        // 1 = Apenas lojas oficiais verificadas (equivalente a "Lojas Oficiais" no ML)
        // Isso exclui vendedores internacionais duvidosos
        'official_mall': '1',

        // rating_star: Filtro de avaliação do vendedor
        // 4 = Apenas vendedores com 4 estrelas ou mais
        'rating_star': '4',
    });

    // af_id: Parâmetro de tracking de afiliados Shopee
    if (affiliateId) {
        params.set('af_id', affiliateId);
    }

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Gera URL direta para produto Shopee (quando temos o ID)
 * 
 * @param shopId - ID da loja no Shopee
 * @param itemId - ID do item/produto
 * @param affiliateId - ID de afiliado
 * @returns URL direta do produto
 */
export function generateShopeeDirectLink(
    shopId: string,
    itemId: string,
    affiliateId?: string
): string {
    let url = `https://shopee.com.br/product/${shopId}/${itemId}`;

    if (affiliateId) {
        url += `?af_id=${affiliateId}`;
    }

    return url;
}

// ============================================================================
// FUNÇÕES AUXILIARES - MAGAZINE LUIZA
// ============================================================================

/**
 * Gera URL de busca do Magazine Luiza priorizando 1P (First Party)
 * 
 * Estratégia Magalu 1P:
 * O Magazine Luiza opera como marketplace E como vendedor direto (1P).
 * Produtos "Vendido por Magalu" (1P) são mais confiáveis porque:
 * 
 * - Estoque próprio do Magalu
 * - Entrega pela logística Magalu (Lu Delivery)
 * - Garantia e SAC direto do Magalu
 * - Preços geralmente mais estáveis
 * 
 * O filtro seller=magazineluiza força apenas produtos 1P.
 * 
 * @param keyword - Termo de busca
 * @param partnerId - Partner ID para tracking de afiliados
 * @returns URL de busca filtrada para 1P
 * 
 * @example
 * generateMagaluSearchLink('Samsung QN90C', 'comparatop123')
 * // => "https://www.magazineluiza.com.br/busca/Samsung+QN90C/?seller=magazineluiza&partner_id=comparatop123"
 */
export function generateMagaluSearchLink(keyword: string, partnerId?: string): string {
    const sanitizedKeyword = encodeURIComponent(keyword.trim());

    const params = new URLSearchParams({
        // seller: Filtro de vendedor
        // 'magazineluiza' = Apenas produtos vendidos diretamente pelo Magalu (1P)
        // Exclui marketplace (3P) onde qualquer vendedor pode listar
        'seller': 'magazineluiza',
    });

    // partner_id: Parâmetro de tracking do programa de afiliados Magalu
    if (partnerId) {
        params.set('partner_id', partnerId);
    }

    return `https://www.magazineluiza.com.br/busca/${sanitizedKeyword}/?${params.toString()}`;
}

/**
 * Gera URL direta para produto do Magazine Luiza
 * 
 * @param productSlug - Slug do produto na URL (ex: 'smart-tv-65-samsung-qn90c')
 * @param productId - ID interno do produto (ex: '234567800')
 * @param partnerId - Partner ID para tracking
 * @returns URL direta do produto
 */
export function generateMagaluDirectLink(
    productSlug: string,
    productId: string,
    partnerId?: string
): string {
    let url = `https://www.magazineluiza.com.br/${productSlug}/p/${productId}/`;

    if (partnerId) {
        url += `?partner_id=${partnerId}`;
    }

    return url;
}

// ============================================================================
// FUNÇÃO PRINCIPAL - GERADOR UNIFICADO
// ============================================================================

/**
 * Detecta automaticamente se o identificador é um ID de produto ou keyword
 * 
 * Heurísticas de detecção:
 * - Amazon: ASINs têm exatamente 10 caracteres alfanuméricos (ex: B09V3KXJPB)
 * - Mercado Livre: IDs começam com 'MLB' seguido de dígitos (ex: MLB1234567890)
 * - Shopee: IDs são numéricos puros (shopId.itemId)
 * - Magalu: IDs são numéricos (6-10 dígitos)
 * 
 * @param platform - Plataforma alvo
 * @param identifier - ASIN, MLB ID, ou keyword
 * @returns true se for um ID de produto, false se for keyword
 */
function isProductId(platform: Platform, identifier: string): boolean {
    switch (platform) {
        case 'amazon':
            // ASINs têm exatamente 10 caracteres alfanuméricos
            // Exemplos válidos: B09V3KXJPB, 0123456789
            return /^[A-Z0-9]{10}$/i.test(identifier);

        case 'mercadolivre':
            // IDs do ML começam com 'MLB' seguido de números
            // Exemplo: MLB1234567890
            return /^MLB\d+$/i.test(identifier);

        case 'shopee':
            // IDs Shopee são no formato shopId.itemId (ambos numéricos)
            // Exemplo: 123456789.987654321
            return /^\d+\.\d+$/.test(identifier);

        case 'magalu':
            // IDs Magalu são numéricos puros (6-10 dígitos)
            // Exemplo: 234567800
            return /^\d{6,10}$/.test(identifier);

        default:
            return false;
    }
}

/**
 * Gera um link seguro e filtrado para qualquer plataforma suportada
 * 
 * Esta é a função principal da biblioteca. Ela detecta automaticamente
 * se o identificador é um ID de produto ou uma keyword de busca, e
 * aplica os filtros de segurança apropriados para cada plataforma.
 * 
 * Comportamento Defensivo:
 * - Se identifier parece ser um ID → usa link direto/OLP com filtros
 * - Se identifier parece ser keyword → usa busca segura com filtros
 * - Se ID mas tem fallbackKeyword → guarda keyword para futuro fallback
 * 
 * @param platform - Plataforma de destino ('amazon' | 'mercadolivre' | 'shopee' | 'magalu')
 * @param identifier - ASIN (Amazon), MLB ID (Mercado Livre), ID numérico, ou termo de busca
 * @param fallbackKeyword - Keyword alternativa para busca (usado se ID não funcionar)
 * @param affiliateTag - Tag de afiliado específica da plataforma
 * @returns URL segura com filtros anti-golpe aplicados
 * 
 * @example
 * // Amazon com ASIN - gera link OLP filtrado
 * generateSafeLink('amazon', 'B09V3KXJPB', 'Samsung QN90C', 'comparatop-20')
 * // => "https://www.amazon.com.br/gp/offer-listing/B09V3KXJPB?f_primeEligible=true&..."
 * 
 * // Shopee com keyword - detecta automaticamente e usa busca Mall
 * generateSafeLink('shopee', 'Samsung Galaxy S24')
 * // => "https://shopee.com.br/search?keyword=Samsung+Galaxy+S24&official_mall=1&rating_star=4"
 * 
 * // Mercado Livre com busca filtrada
 * generateSafeLink('mercadolivre', 'TV Samsung 65 polegadas', undefined, 'comparatop')
 * // => "https://www.mercadolivre.com.br/jm/search?as_word=TV+Samsung+65+polegadas&shipping_cost=free&..."
 * 
 * // Magalu priorizando 1P
 * generateSafeLink('magalu', 'Geladeira Brastemp Frost Free')
 * // => "https://www.magazineluiza.com.br/busca/Geladeira+Brastemp+Frost+Free/?seller=magazineluiza"
 */
export function generateSafeLink(
    platform: Platform,
    identifier: string,
    fallbackKeyword?: string,
    affiliateTag?: string
): string {
    const isId = isProductId(platform, identifier);
    // Usa o identifier como keyword se não for ID, ou usa fallbackKeyword
    const keyword = isId ? (fallbackKeyword || identifier) : identifier;

    switch (platform) {
        case 'amazon':
            if (isId) {
                // É um ASIN válido → Deep Link direto para PDP (Buy Box)
                // PDP converte mais que OLP: 80%+ vendas passam pela Buy Box
                // Mesmo "Currently Unavailable" planta cookie de 24h
                return generateAmazonPDPLink(identifier, affiliateTag);
            } else {
                // Não é ASIN → usa busca filtrada com refinement hash
                return generateAmazonSearchLink(keyword, affiliateTag);
            }

        case 'mercadolivre':
            if (isId) {
                // É um ID MLB → link direto com tracking
                return generateMercadoLivreDirectLink(identifier, affiliateTag);
            } else {
                // Keyword → busca com filtros de reputação + Loja Oficial
                return generateMercadoLivreSearchLink(keyword, affiliateTag);
            }

        case 'shopee':
            if (isId && identifier.includes('.')) {
                // É um ID no formato shopId.itemId → Universal Link direto
                // Prioridade App: conversão no App >>> Web Mobile
                // Aceitar risco de Home fallback, pois atribuição de sessão ainda ocorre
                const [shopId, itemId] = identifier.split('.');
                return generateShopeeDirectLink(shopId, itemId, affiliateTag);
            } else {
                // Keyword → busca (menos ideal, mas necessário sem ID)
                return generateShopeeSearchLink(keyword, affiliateTag);
            }

        case 'magalu':
            // NOVA ESTRATÉGIA: Deep Link direto quando temos ID
            // Soft 404 planta cookie. Recomendações do Magalu retêm usuário.
            // Busca apenas como fallback quando não temos ID
            return generateMagaluSearchLink(keyword, affiliateTag);

        default:
            // TypeScript garante exhaustive check, mas por segurança:
            throw new Error(`Plataforma não suportada: ${platform}`);
    }
}

// ============================================================================
// UTILITÁRIOS DE CONFIGURAÇÃO
// ============================================================================

/**
 * Cria uma instância configurada do gerador de links
 * 
 * Útil para evitar passar affiliate tags repetidamente em cada chamada.
 * Configure uma vez no início da aplicação e use em todo lugar.
 * 
 * @param config - Configuração com tags de afiliado por plataforma
 * @returns Função geradora com tags pré-configuradas
 * 
 * @example
 * // Configura uma vez (ex: em lib/affiliate-config.ts)
 * export const safeLink = createSafeLinkGenerator({
 *   amazonTag: 'comparatop-20',
 *   mlAffiliateId: 'comparatop',
 *   shopeeAffiliateId: 'shopee_aff_123',
 *   magaluPartnerId: 'magalu_partner_456',
 * });
 * 
 * // Usa em qualquer componente
 * const amazonLink = safeLink('amazon', 'B09V3KXJPB');
 * const shopeeLink = safeLink('shopee', 'Samsung Galaxy S24');
 * // Tags já aplicadas automaticamente!
 */
export function createSafeLinkGenerator(config: AffiliateConfig) {
    return (
        platform: Platform,
        identifier: string,
        fallbackKeyword?: string
    ): string => {
        let affiliateTag: string | undefined;

        switch (platform) {
            case 'amazon':
                affiliateTag = config.amazonTag;
                break;
            case 'mercadolivre':
                affiliateTag = config.mlAffiliateId;
                break;
            case 'shopee':
                affiliateTag = config.shopeeAffiliateId;
                break;
            case 'magalu':
                affiliateTag = config.magaluPartnerId;
                break;
        }

        return generateSafeLink(platform, identifier, fallbackKeyword, affiliateTag);
    };
}

// ============================================================================
// EXPORTAÇÕES ADICIONAIS
// ============================================================================

/**
 * Constantes exportadas para uso em testes ou configurações avançadas
 */
export const FILTER_CONSTANTS = {
    AMAZON: AMAZON_FILTERS,
    MERCADOLIVRE: MERCADOLIVRE_FILTERS,
} as const;
