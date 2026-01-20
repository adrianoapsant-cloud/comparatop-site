// ============================================================================
// HOME PERSONALIZATION - Smart Shelves Strategy
// ============================================================================
// Personalização sutil da home baseada em histórico de navegação
// Mantém estrutura visual invariante, adapta apenas o conteúdo das prateleiras
// ============================================================================

import type { ScoredProduct } from '@/types/category';

// ============================================
// TYPES
// ============================================

export interface ShelfConfig {
    /** Título da prateleira */
    title: string;
    /** Subtítulo descritivo */
    subtitle: string;
    /** Ícone emoji */
    icon: string;
    /** Tipo de ordenação */
    sortBy: 'quality' | 'value' | 'recent' | 'category';
    /** Filtro de categoria (opcional) */
    categoryFilter?: string;
    /** Link para "ver mais" */
    viewAllLink: string;
    /** Texto do link */
    viewAllText: string;
    /** Mostrar ranking? */
    showRank?: boolean;
    /** Cor de destaque */
    accentColor?: string;
}

export interface HomeConfig {
    /** Estratégia aplicada */
    strategy: 'default' | 'tv_interest' | 'fridge_interest' | 'ac_interest' | 'returning';
    /** Razão pela personalização */
    reason: string;
    /** Configuração da prateleira principal (hero shelf) */
    primaryShelf: ShelfConfig;
    /** Configuração da prateleira secundária */
    secondaryShelf: ShelfConfig;
    /** Mensagem de boas-vindas personalizada (opcional) */
    welcomeMessage?: string;
}

export interface RecentCategoryHistory {
    categories: string[];
    lastVisit?: string;
    visitCount?: number;
}

// ============================================
// DEFAULT SHELF CONFIGS
// ============================================

const DEFAULT_PRIMARY_SHELF: ShelfConfig = {
    title: 'Aprovados na Auditoria',
    subtitle: 'Produtos que passaram em todos os critérios técnicos',
    icon: '🏆',
    sortBy: 'quality',
    viewAllLink: '/', // TODO: Mudar para /populares quando página existir
    viewAllText: 'Ver ranking completo',
    showRank: true,
};

const DEFAULT_SECONDARY_SHELF: ShelfConfig = {
    title: 'Melhor Custo-Benefício',
    subtitle: 'Alta performance por real investido',
    icon: '💰',
    sortBy: 'value',
    viewAllLink: '/', // TODO: Mudar para /custo-beneficio quando página existir
    viewAllText: 'Ver mais ofertas',
    showRank: true,
};

// ============================================
// CATEGORY-SPECIFIC SHELVES
// ============================================

const TV_PRIMARY_SHELF: ShelfConfig = {
    title: 'Continue sua busca em Smart TVs',
    subtitle: 'TVs que você precisa conhecer antes de decidir',
    icon: '📺',
    sortBy: 'quality',
    categoryFilter: 'tv',
    viewAllLink: '/categorias/tv',
    viewAllText: 'Ver todas as TVs',
    showRank: true,
    accentColor: 'violet',
};

const TV_SECONDARY_SHELF: ShelfConfig = {
    title: 'Ofertas Relâmpago de TV',
    subtitle: 'Os melhores preços em Smart TVs agora',
    icon: '⚡',
    sortBy: 'value',
    categoryFilter: 'tv',
    viewAllLink: '/categorias/tv?sort=value',
    viewAllText: 'Ver ofertas',
    showRank: false,
    accentColor: 'amber',
};

const FRIDGE_PRIMARY_SHELF: ShelfConfig = {
    title: 'Geladeiras Inverter em Oferta',
    subtitle: 'Economize na conta de luz com tecnologia de ponta',
    icon: '❄️',
    sortBy: 'quality',
    categoryFilter: 'fridge',
    viewAllLink: '/categorias/geladeiras',
    viewAllText: 'Ver todas as geladeiras',
    showRank: true,
    accentColor: 'blue',
};

const FRIDGE_SECONDARY_SHELF: ShelfConfig = {
    title: 'Melhor Custo por Litro',
    subtitle: 'Máxima capacidade pelo melhor preço',
    icon: '💧',
    sortBy: 'value',
    categoryFilter: 'fridge',
    viewAllLink: '/categorias/geladeiras?sort=value',
    viewAllText: 'Comparar preços',
    showRank: true,
    accentColor: 'cyan',
};

const AC_PRIMARY_SHELF: ShelfConfig = {
    title: 'Ar Condicionado Inverter',
    subtitle: 'Até 70% de economia na conta de energia',
    icon: '🌬️',
    sortBy: 'quality',
    categoryFilter: 'air_conditioner',
    viewAllLink: '/categorias/ar-condicionado',
    viewAllText: 'Ver todos os ACs',
    showRank: true,
    accentColor: 'sky',
};

const AC_SECONDARY_SHELF: ShelfConfig = {
    title: 'Mais Silenciosos do Mercado',
    subtitle: 'Perfeitos para quartos de dormir',
    icon: '🤫',
    sortBy: 'quality',
    categoryFilter: 'air_conditioner',
    viewAllLink: '/categorias/ar-condicionado?filter=silent',
    viewAllText: 'Ver modelos silenciosos',
    showRank: false,
    accentColor: 'indigo',
};

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Determina a configuração personalizada da Home baseado no histórico do usuário
 * 
 * Lógica de Personalização:
 * 1. Verifica categorias visitadas recentemente (via cookie/sessionStorage)
 * 2. Se visitou TV → Mostra prateleiras de TV
 * 3. Se visitou Geladeiras → Mostra prateleiras de geladeiras
 * 4. Se visitou AC → Mostra prateleiras de AC
 * 5. Fallback → Destaques gerais
 * 
 * @param history - Histórico de categorias visitadas
 * @returns Configuração personalizada da home
 */
export function getHomePersonalization(
    history: RecentCategoryHistory | null
): HomeConfig {
    // No history? Default experience
    if (!history || !history.categories || history.categories.length === 0) {
        return {
            strategy: 'default',
            reason: 'Primeiro acesso ou sem histórico de navegação',
            primaryShelf: DEFAULT_PRIMARY_SHELF,
            secondaryShelf: DEFAULT_SECONDARY_SHELF,
        };
    }

    // Get most recent category
    const recentCategory = history.categories[0];

    // TV interest
    if (recentCategory === 'tv' || history.categories.includes('tv')) {
        return {
            strategy: 'tv_interest',
            reason: `Usuário demonstrou interesse em TVs (última visita: ${recentCategory})`,
            primaryShelf: TV_PRIMARY_SHELF,
            secondaryShelf: TV_SECONDARY_SHELF,
            welcomeMessage: 'Continuando sua pesquisa de TVs...',
        };
    }

    // Fridge interest
    if (recentCategory === 'fridge' || history.categories.includes('fridge')) {
        return {
            strategy: 'fridge_interest',
            reason: `Usuário demonstrou interesse em Geladeiras (última visita: ${recentCategory})`,
            primaryShelf: FRIDGE_PRIMARY_SHELF,
            secondaryShelf: FRIDGE_SECONDARY_SHELF,
            welcomeMessage: 'Continuando sua pesquisa de Geladeiras...',
        };
    }

    // AC interest
    if (recentCategory === 'air_conditioner' || history.categories.includes('air_conditioner')) {
        return {
            strategy: 'ac_interest',
            reason: `Usuário demonstrou interesse em Ar Condicionado (última visita: ${recentCategory})`,
            primaryShelf: AC_PRIMARY_SHELF,
            secondaryShelf: AC_SECONDARY_SHELF,
            welcomeMessage: 'Continuando sua pesquisa de Ar Condicionado...',
        };
    }

    // Returning user but different category
    if (history.visitCount && history.visitCount > 1) {
        return {
            strategy: 'returning',
            reason: 'Usuário retornando com categorias variadas',
            primaryShelf: {
                ...DEFAULT_PRIMARY_SHELF,
                title: 'Novidades para Você',
                subtitle: 'Produtos atualizados desde sua última visita',
                icon: '✨',
            },
            secondaryShelf: DEFAULT_SECONDARY_SHELF,
            welcomeMessage: 'Bem-vindo de volta! Veja o que há de novo.',
        };
    }

    // Default fallback
    return {
        strategy: 'default',
        reason: 'Categoria não mapeada para personalização',
        primaryShelf: DEFAULT_PRIMARY_SHELF,
        secondaryShelf: DEFAULT_SECONDARY_SHELF,
    };
}

// ============================================
// PRODUCT FILTERING UTILITIES
// ============================================

/**
 * Filtra e ordena produtos baseado na configuração da shelf
 */
export function getProductsForShelf(
    allProducts: ScoredProduct[],
    config: ShelfConfig,
    limit: number = 8
): ScoredProduct[] {
    // Filter out any undefined/null products first
    // Note: ScoredProduct extends Product, so categoryId is at top level
    let filtered = allProducts.filter(p => p && p.categoryId);

    // Apply category filter
    if (config.categoryFilter) {
        filtered = filtered.filter(p =>
            p.categoryId === config.categoryFilter
        );
    }

    // Apply sorting
    switch (config.sortBy) {
        case 'quality':
            filtered.sort((a, b) => b.scores.quality - a.scores.quality);
            break;
        case 'value':
            filtered.sort((a, b) => b.scores.value - a.scores.value);
            break;
        case 'recent':
            // Sort by lastUpdated if available
            filtered.sort((a, b) => {
                const dateA = new Date(a.lastUpdated || '2000-01-01').getTime();
                const dateB = new Date(b.lastUpdated || '2000-01-01').getTime();
                return dateB - dateA;
            });
            break;
        default:
            break;
    }

    return filtered.slice(0, limit);
}

// ============================================
// COOKIE/STORAGE UTILITIES
// ============================================

const HISTORY_COOKIE_NAME = 'comparatop_category_history';
const MAX_HISTORY_SIZE = 5;

/**
 * Lê o histórico de categorias do cookie (Server-side)
 */
export function parseHistoryCookie(cookieValue: string | undefined): RecentCategoryHistory | null {
    if (!cookieValue) return null;

    try {
        return JSON.parse(decodeURIComponent(cookieValue));
    } catch {
        return null;
    }
}

/**
 * Atualiza o histórico de categorias (Client-side)
 */
export function updateCategoryHistory(categoryId: string): void {
    if (typeof window === 'undefined') return;

    const existingRaw = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${HISTORY_COOKIE_NAME}=`))
        ?.split('=')[1];

    const existing = parseHistoryCookie(existingRaw);
    const categories = existing?.categories || [];

    // Add new category to front, remove if exists
    const updated = [categoryId, ...categories.filter(c => c !== categoryId)]
        .slice(0, MAX_HISTORY_SIZE);

    const newHistory: RecentCategoryHistory = {
        categories: updated,
        lastVisit: new Date().toISOString(),
        visitCount: (existing?.visitCount || 0) + 1,
    };

    // Set cookie (30 days expiry)
    document.cookie = `${HISTORY_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(newHistory))}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

// ============================================
// EXPORTS
// ============================================

export {
    TV_PRIMARY_SHELF,
    TV_SECONDARY_SHELF,
    FRIDGE_PRIMARY_SHELF,
    FRIDGE_SECONDARY_SHELF,
    AC_PRIMARY_SHELF,
    AC_SECONDARY_SHELF,
    DEFAULT_PRIMARY_SHELF,
    DEFAULT_SECONDARY_SHELF,
    HISTORY_COOKIE_NAME,
};
