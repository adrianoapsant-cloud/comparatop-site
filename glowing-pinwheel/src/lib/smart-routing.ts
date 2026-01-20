/**
 * @file smart-routing.ts
 * @description Roteamento inteligente de tráfego por categoria e tipo de produto
 * 
 * Estratégia baseada no relatório "Otimização de Afiliados e UX de Preços":
 * - Eletrônicos High-End → Amazon (confiança, Prime, tickets altos)
 * - Linha Branca → ML/Magalu (parcelamento estendido, logística para pesados)
 * 
 * @version 1.0.0
 */

import type { Platform } from './safe-links';

// ============================================================================
// CONFIGURAÇÃO DE CATEGORIAS
// ============================================================================

/**
 * Categorias sensíveis a parcelamento (Linha Branca e alto ticket)
 * Prioridade: ML/Magalu → Amazon
 * 
 * Baseado em: category-taxonomy.ts
 * - Departamentos: refrigeration, kitchen, cleaning
 * - Lógica: Items pesados (entrega especial) + alto parcelamento preferido
 */
const PARCELAMENTO_SENSITIVE: string[] = [
    // Refrigeração & Clima (refrigeration)
    'refrigerator', 'fridge',           // Geladeiras
    'freezer',                           // Freezers
    'minibar',                           // Frigobares
    'wine-cooler',                       // Adegas
    'air-conditioner', 'air_conditioner',// Ar-Condicionado
    'fan',                               // Ventiladores

    // Cozinha (kitchen) - Grandes eletros
    'stove',                             // Fogões/Cooktops
    'builtin-oven',                      // Fornos embutidos
    'dishwasher',                        // Lava-louças
    'range-hood',                        // Coifas

    // Lavanderia & Limpeza (cleaning) - Grandes eletros
    'washer',                            // Lavadoras
    'washer-dryer',                      // Lava e Seca
    'pressure-washer',                   // Lavadoras de pressão
];

/**
 * Categorias sensíveis a marca/preço (Eletrônicos)
 * Prioridade: Amazon → ML
 * 
 * Baseado em: category-taxonomy.ts
 * - Departamentos: mobile, computing, components, gaming, video-audio
 * - Lógica: Prime delivery + reviews + menor preço à vista preferido
 */
const PRICE_BRAND_SENSITIVE: string[] = [
    // Mobile & Wearables (mobile)
    'smartphone',                        // Smartphones
    'tablet',                            // Tablets
    'smartwatch',                        // Smartwatches
    'tws',                               // Fones TWS
    'bluetooth-speaker',                 // Caixas Bluetooth

    // Computadores (computing)
    'notebook',                          // Notebooks
    'monitor',                           // Monitores
    'printer',                           // Impressoras
    'router',                            // Roteadores

    // Componentes PC (components)
    'cpu',                               // Processadores
    'gpu',                               // Placas de Vídeo
    'motherboard',                       // Placas-Mãe
    'ram',                               // Memória RAM
    'ssd',                               // SSDs
    'psu',                               // Fontes
    'case',                              // Gabinetes

    // Gaming (gaming)
    'console',                           // Consoles
    'headset-gamer',                     // Headsets Gamer
    'gamepad',                           // Gamepads
    'chair',                             // Cadeiras Gamer

    // Vídeo & Áudio (video-audio)
    'smart-tv', 'tv',                    // Smart TVs
    'soundbar',                          // Soundbars
    'projector',                         // Projetores
    'tvbox',                             // TV Box/Sticks

    // Pequenos Eletros (kitchen - pequenos) → Amazon converte melhor
    'microwave',                         // Micro-ondas
    'air-fryer',                         // Air Fryers
    'espresso-machine',                  // Cafeteiras
    'mixer',                             // Batedeiras
    'water-purifier',                    // Purificadores

    // Limpeza pequena
    'robot-vacuum',                      // Robôs Aspiradores
    'stick-vacuum',                      // Aspiradores verticais

    // Utilities - Segurança e DIY
    'security-camera',                   // Câmeras de Segurança
    'smart-lock',                        // Fechaduras Digitais
    'ups',                               // Nobreaks
    'power-strip',                       // Filtros de Linha
    'drill',                             // Parafusadeiras
    'camera',                            // Câmeras fotográficas

    // Auto (utility)
    'tire',                              // Pneus
    'car-battery',                       // Baterias
];

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * Determina a plataforma primária para uma categoria
 * 
 * @param categoryId - ID da categoria do produto
 * @returns Plataforma recomendada como destino primário
 * 
 * @example
 * getPrimaryPlatform('fridge') // => 'mercadolivre'
 * getPrimaryPlatform('tv') // => 'amazon'
 */
export function getPrimaryPlatform(categoryId: string): Platform {
    const normalizedCategory = categoryId.toLowerCase();

    // Linha Branca → ML/Magalu (melhor parcelamento)
    if (PARCELAMENTO_SENSITIVE.includes(normalizedCategory)) {
        return 'mercadolivre';
    }

    // Eletrônicos → Amazon (confiança, Prime)
    if (PRICE_BRAND_SENSITIVE.includes(normalizedCategory)) {
        return 'amazon';
    }

    // Default: Amazon (maior confiança geral)
    return 'amazon';
}

/**
 * Determina a plataforma secundária (fallback) para uma categoria
 * 
 * @param categoryId - ID da categoria do produto
 * @returns Plataforma secundária
 */
export function getSecondaryPlatform(categoryId: string): Platform {
    const primary = getPrimaryPlatform(categoryId);
    return primary === 'amazon' ? 'mercadolivre' : 'amazon';
}

/**
 * Verifica se a categoria é sensível a parcelamento
 * 
 * @param categoryId - ID da categoria
 * @returns true se a categoria prioriza parcelamento
 */
export function isParcelamentoSensitive(categoryId: string): boolean {
    return PARCELAMENTO_SENSITIVE.includes(categoryId.toLowerCase());
}

/**
 * Retorna a ordem de exibição das plataformas para botões de CTA
 * 
 * @param categoryId - ID da categoria do produto
 * @returns Array ordenado de plataformas por prioridade
 * 
 * @example
 * getPlatformOrder('fridge') // => ['mercadolivre', 'amazon', 'magalu', 'shopee']
 * getPlatformOrder('tv') // => ['amazon', 'mercadolivre', 'shopee', 'magalu']
 */
export function getPlatformOrder(categoryId: string): Platform[] {
    const primary = getPrimaryPlatform(categoryId);

    if (primary === 'mercadolivre') {
        // Linha Branca: prioriza ML e Magalu (logística pesados)
        return ['mercadolivre', 'magalu', 'amazon', 'shopee'];
    }

    // Eletrônicos: prioriza Amazon
    return ['amazon', 'mercadolivre', 'shopee', 'magalu'];
}

/**
 * Gera labels de CTA contextualizados por categoria
 * 
 * @param categoryId - ID da categoria
 * @param platform - Plataforma do botão
 * @returns Label do botão otimizado para conversão
 */
export function getSmartCTALabel(categoryId: string, platform: Platform): string {
    const isParcelamento = isParcelamentoSensitive(categoryId);

    switch (platform) {
        case 'amazon':
            return isParcelamento ? 'Ver na Amazon' : 'Ver Melhor Preço';
        case 'mercadolivre':
            return isParcelamento ? 'Ver Parcelas no ML' : 'Ver no Mercado Livre';
        case 'magalu':
            return isParcelamento ? 'Parcelar no Magalu' : 'Ver no Magalu';
        case 'shopee':
            return 'Ver na Shopee';
        default:
            return 'Ver Oferta';
    }
}

// ============================================================================
// HIGH-TICKET QUALIFIED CLICK STRATEGY
// ============================================================================

/**
 * Limite de preço para considerar um produto "High-Ticket"
 * Produtos acima desse valor usam estratégia de Qualified Click
 */
const HIGH_TICKET_THRESHOLD = 1000; // R$ 1.000,00

/**
 * Verifica se um produto é High-Ticket (>R$1000)
 * 
 * High-Ticket products use Qualified Click strategy:
 * - Show "A partir de R$ X.XXX" instead of hiding prices
 * - Use "Verificar Preço" CTAs instead of "Ver Oferta"
 * - Expected result: 12x higher EPC (R$2.45 vs R$0.20)
 * 
 * @param price - Preço do produto em R$
 * @returns true se produto é high-ticket
 */
export function isHighTicket(price: number): boolean {
    return price >= HIGH_TICKET_THRESHOLD;
}

/**
 * Formata preço em BRL para exibição
 */
export function formatPriceBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Gera CTA qualificado com preço para High-Ticket products
 * 
 * Estratégia baseada no relatório "High-Ticket Affiliation":
 * - Blind Click: 25% CTR, 0.1% conversion → EPC R$0.20
 * - Qualified Click: 8% CTR, 1.5% conversion → EPC R$2.45
 * 
 * @param price - Preço do produto
 * @param categoryId - ID da categoria
 * @param platform - Plataforma de destino
 * @returns CTA qualificado com preço (ex: "Verificar Preço • R$ 4.200")
 */
export function getQualifiedCTA(
    price: number,
    categoryId: string,
    platform: Platform
): string {
    const isHT = isHighTicket(price);
    const isParcelamento = isParcelamentoSensitive(categoryId);

    // Produtos baratos usam CTA padrão
    if (!isHT) {
        return getSmartCTALabel(categoryId, platform);
    }

    // High-Ticket: CTAs qualificados com preço
    const priceFormatted = formatPriceBRL(price);

    switch (platform) {
        case 'amazon':
            return `Verificar Preço na Amazon`;
        case 'mercadolivre':
            return isParcelamento
                ? `Ver Parcelas no ML • ${priceFormatted}`
                : `Verificar Preço no ML`;
        case 'magalu':
            return isParcelamento
                ? `Parcelar no Magalu • ${priceFormatted}`
                : `Verificar no Magalu`;
        case 'shopee':
            return 'Verificar na Shopee';
        default:
            return `Verificar Preço • ${priceFormatted}`;
    }
}

/**
 * Gera texto "A partir de" para High-Ticket products
 * 
 * @param price - Preço base do produto
 * @returns Texto formatado (ex: "A partir de R$ 3.899")
 */
export function getAPartirDeText(price: number): string | null {
    if (!isHighTicket(price)) {
        return null; // Não exibe para produtos baratos
    }
    return `A partir de ${formatPriceBRL(price)}`;
}

// ============================================================================
// TIPOS EXPORTADOS
// ============================================================================

export interface RoutingDecision {
    primaryPlatform: Platform;
    secondaryPlatform: Platform;
    isParcelamentoSensitive: boolean;
    platformOrder: Platform[];
}

/**
 * Retorna decisão completa de roteamento para um produto
 * 
 * @param categoryId - ID da categoria
 * @returns Objeto com todas as decisões de roteamento
 */
export function getRoutingDecision(categoryId: string): RoutingDecision {
    return {
        primaryPlatform: getPrimaryPlatform(categoryId),
        secondaryPlatform: getSecondaryPlatform(categoryId),
        isParcelamentoSensitive: isParcelamentoSensitive(categoryId),
        platformOrder: getPlatformOrder(categoryId),
    };
}

