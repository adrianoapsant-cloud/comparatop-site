/**
 * Localization Glossary - High-End Portuguese
 * 
 * @description Centralized strings for premium Brazilian Portuguese localization.
 * Based on the Verbal Identity Guide for high-end tech editorial content.
 */

export const L10N = {
    // Score Names (Full)
    scores: {
        qs: {
            full: 'Índice de Excelência',
            short: 'Nota Técnica',
            abbrev: 'IE',
            description: 'Avaliação técnica e de qualidade do produto.',
        },
        vs: {
            full: 'Coeficiente de Valor',
            short: 'Valor',
            abbrev: 'CV',
            description: 'Relação custo-benefício ponderada.',
        },
        gs: {
            full: 'Nota Global',
            short: 'Selo',
            abbrev: 'NG',
            description: 'Confiabilidade, suporte e design.',
        },
        overall: {
            full: 'Pontuação Editorial',
            short: 'Score',
            description: 'Nota final combinada de todos os critérios.',
        },
    },

    // UI Elements
    ui: {
        comparisonTray: 'Painel Comparativo',
        compareNow: 'Comparar Agora',
        clearSelection: 'Limpar Seleção',
        selectAtLeast: 'Selecione ao menos 2 produtos',
        maxProducts: (n: number) => `Máximo de ${n} produtos para comparação`,
        sameCategory: 'Compare apenas produtos da mesma categoria',
    },

    // Bundles / Ecosystem
    bundle: {
        title: 'Ecossistema Recomendado',
        subtitle: 'Expanda a Experiência',
        description: 'Conjunto curado para maximizar sua experiência.',
        cta: 'Adquirir o Conjunto Completo',
        addToBundle: 'Adicionar ao Conjunto',
        items: (n: number) => `${n} ${n === 1 ? 'item' : 'itens'}`,
        totalPrice: 'Valor do Conjunto',
        savings: 'Economia estimada',
    },

    // CTAs
    cta: {
        viewOffer: 'Ver na Amazon',
        viewOfferShort: 'Ver Preço',
        buyNow: 'Adquirir Agora',
        learnMore: 'Saiba Mais',
        addToCompare: 'Comparar',
        removeFromCompare: 'Remover',
    },

    // Badges
    badges: {
        'editors-choice': 'Escolha do Editor',
        'best-value': 'Melhor Custo-Benefício',
        'premium-pick': 'Seleção Premium',
        'budget-pick': 'Melhor Opção Acessível',
        'most-popular': 'Mais Procurado',
    },

    // Comparison Page
    comparison: {
        title: 'Análise Comparativa',
        subtitle: 'Confronto detalhado dos modelos selecionados',
        winner: 'Vencedor',
        tie: 'Empate',
        difference: 'Diferença',
        betterIn: 'Superior em',
        recommendation: 'Nossa Recomendação',
        priceComparison: 'Comparativo de Preços',
        criteriaComparison: 'Análise por Critério',
    },

    // Trust Indicators
    trust: {
        updatedAt: (date: string) => `Conteúdo revisado em ${date}`,
        pricesMayVary: 'Preços sujeitos a alteração',
        verifiedPrice: 'Preço verificado',
        editorialReview: 'Análise Editorial',
    },

    // Price Display
    price: {
        perPoint: 'Custo por ponto',
        original: 'De',
        current: 'Por',
        discount: (percent: number) => `-${percent}%`,
        availableAt: 'Disponível em',
    },
} as const;

/**
 * Get badge label from key
 */
export function getBadgeLabel(badge: string): string {
    return L10N.badges[badge as keyof typeof L10N.badges] || badge;
}

/**
 * Format price in BRL
 */
export function formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

/**
 * Format date in Brazilian format
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
}
