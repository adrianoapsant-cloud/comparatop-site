/**
 * @file ml-bestsellers.ts
 * @description Fetcher de Top 20 Best Sellers do Mercado Livre com filtros de limpeza
 * 
 * Problema: Listas de "mais vendidos" vêm "sujas" com peças de reposição
 * Solução: Filtro de preço mínimo + categoria folha + condição "Novo"
 * 
 * @see https://developers.mercadolibre.com.ar/pt_br/items-e-buscas
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURAÇÃO DE CATEGORIAS
// ============================================================================

/**
 * Configuração de categoria para busca de best sellers
 */
export interface MLCategoryConfig {
    /** Nome interno da categoria (ex: 'lavadora') */
    categoryId: string;
    /** Nome amigável para display */
    categoryName: string;
    /** ID da categoria FOLHA no ML (não usar categoria raiz!) */
    mlCategoryId: string;
    /** Preço mínimo para filtrar peças/acessórios */
    minPriceFloor: number;
}

/**
 * Configuração de categorias com IDs do Mercado Livre e pisos de preço
 * 
 * IMPORTANTE: Use sempre a CATEGORIA FOLHA do ML, não a raiz
 * Para encontrar IDs: https://api.mercadolibre.com/sites/MLB/categories
 */
export const ML_CATEGORY_CONFIG: MLCategoryConfig[] = [
    // ========== REFRIGERAÇÃO & CLIMA ==========
    {
        categoryId: 'refrigerator',
        categoryName: 'Geladeiras',
        mlCategoryId: 'MLB181294', // Geladeiras e Freezers > Refrigeradores e Freezers > Geladeiras
        minPriceFloor: 1500,
    },
    {
        categoryId: 'freezer',
        categoryName: 'Freezers',
        mlCategoryId: 'MLB181295', // Geladeiras e Freezers > Freezers Verticais/Horizontais
        minPriceFloor: 1200,
    },
    {
        categoryId: 'air-conditioner',
        categoryName: 'Ar-Condicionado',
        mlCategoryId: 'MLB5054', // Ar Condicionado > Split
        minPriceFloor: 1200,
    },

    // ========== LAVANDERIA ==========
    {
        categoryId: 'washer',
        categoryName: 'Lavadoras',
        mlCategoryId: 'MLB182390', // Lavadoras e Secadoras > Lavadoras
        minPriceFloor: 1500,
    },
    {
        categoryId: 'washer-dryer',
        categoryName: 'Lava e Seca',
        mlCategoryId: 'MLB270799', // Lavadoras e Secadoras > Lava e Seca
        minPriceFloor: 2500,
    },

    // ========== COZINHA - GRANDES ELETROS ==========
    {
        categoryId: 'stove',
        categoryName: 'Fogões',
        mlCategoryId: 'MLB1578', // Fogões
        minPriceFloor: 800,
    },
    {
        categoryId: 'builtin-oven',
        categoryName: 'Fornos',
        mlCategoryId: 'MLB1579', // Fornos e Fogões de Embutir
        minPriceFloor: 800,
    },
    {
        categoryId: 'dishwasher',
        categoryName: 'Lava-Louças',
        mlCategoryId: 'MLB5686', // Lava-Louças
        minPriceFloor: 1500,
    },
    {
        categoryId: 'microwave',
        categoryName: 'Micro-ondas',
        mlCategoryId: 'MLB1580', // Fornos de Micro-ondas
        minPriceFloor: 300,
    },

    // ========== COZINHA - PEQUENOS ELETROS ==========
    {
        categoryId: 'air-fryer',
        categoryName: 'Air Fryers',
        mlCategoryId: 'MLB264586', // Fritadeiras Elétricas sem Óleo
        minPriceFloor: 200,
    },
    {
        categoryId: 'espresso-machine',
        categoryName: 'Cafeteiras',
        mlCategoryId: 'MLB30915', // Cafeteiras
        minPriceFloor: 150,
    },

    // ========== LIMPEZA ==========
    {
        categoryId: 'robot-vacuum',
        categoryName: 'Robôs Aspiradores',
        mlCategoryId: 'MLB432478', // Robôs Aspiradores
        minPriceFloor: 500,
    },
    {
        categoryId: 'stick-vacuum',
        categoryName: 'Aspiradores',
        mlCategoryId: 'MLB1712', // Aspiradores de Pó
        minPriceFloor: 200,
    },

    // ========== VÍDEO & ÁUDIO ==========
    {
        categoryId: 'smart-tv',
        categoryName: 'Smart TVs',
        mlCategoryId: 'MLB1002', // TVs
        minPriceFloor: 800,
    },
    {
        categoryId: 'soundbar',
        categoryName: 'Soundbars',
        mlCategoryId: 'MLB3697', // Soundbars
        minPriceFloor: 300,
    },

    // ========== COMPUTAÇÃO ==========
    {
        categoryId: 'notebook',
        categoryName: 'Notebooks',
        mlCategoryId: 'MLB1652', // Notebooks
        minPriceFloor: 1500,
    },
    {
        categoryId: 'monitor',
        categoryName: 'Monitores',
        mlCategoryId: 'MLB1714', // Monitores
        minPriceFloor: 400,
    },

    // ========== MOBILE ==========
    {
        categoryId: 'smartphone',
        categoryName: 'Smartphones',
        mlCategoryId: 'MLB1055', // Celulares e Smartphones
        minPriceFloor: 500,
    },
    {
        categoryId: 'tablet',
        categoryName: 'Tablets',
        mlCategoryId: 'MLB1659', // Tablets
        minPriceFloor: 600,
    },
    {
        categoryId: 'smartwatch',
        categoryName: 'Smartwatches',
        mlCategoryId: 'MLB352679', // Smartwatches
        minPriceFloor: 200,
    },

    // ========== GAMING ==========
    {
        categoryId: 'console',
        categoryName: 'Consoles',
        mlCategoryId: 'MLB186456', // Consoles
        minPriceFloor: 1000,
    },
];

// ============================================================================
// TIPOS DE RESPOSTA DA API
// ============================================================================

interface MLSearchResult {
    id: string;
    title: string;
    price: number;
    sold_quantity: number;
    thumbnail: string;
    permalink: string;
    condition: string;
    shipping: {
        free_shipping: boolean;
    };
    seller: {
        id: number;
        nickname: string;
    };
    official_store_id?: number;
    official_store_name?: string;
}

interface MLSearchResponse {
    results: MLSearchResult[];
    paging: {
        total: number;
        limit: number;
        offset: number;
    };
}

export interface CleanProduct {
    mlId: string;
    title: string;
    price: number;
    soldQuantity: number;
    thumbnail: string;
    permalink: string;
    freeShipping: boolean;
    isOfficialStore: boolean;
    officialStoreName?: string;
    sellerNickname: string;
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

/**
 * Busca os Top 20 best sellers do ML com filtros de limpeza
 * 
 * Filtros aplicados:
 * - Apenas produtos NOVOS (condition=new)
 * - Ordenado por quantidade vendida (sort=sold_quantity)
 * - Preço mínimo configurável (elimina peças/acessórios)
 * - Categoria folha específica (não usa categoria raiz)
 * 
 * @param config - Configuração da categoria
 * @param limit - Número de resultados (padrão: 20)
 * @returns Lista limpa de produtos
 * 
 * @example
 * const lavadoras = await fetchCleanTop20ML(ML_CATEGORY_CONFIG.find(c => c.categoryId === 'washer')!);
 */
export async function fetchCleanTop20ML(
    config: MLCategoryConfig,
    limit: number = 20
): Promise<CleanProduct[]> {
    const { mlCategoryId, minPriceFloor } = config;

    // Monta a URL com todos os filtros
    // Documentação: https://developers.mercadolibre.com.ar/pt_br/items-e-buscas
    const url = new URL('https://api.mercadolibre.com/sites/MLB/search');

    // Parâmetros básicos
    url.searchParams.set('category', mlCategoryId);        // Categoria folha
    url.searchParams.set('sort', 'sold_quantity');         // Ordenar por mais vendidos (sem _desc)
    url.searchParams.set('condition', 'new');              // Apenas Novos
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', '0');

    // Filtro de preço (formato correto da API pública)
    // O preço vai como query string normal, não como filtro especial
    // A filtragem de preço mínimo será feita client-side para garantir

    console.log(`[ML Best Sellers] Fetching ${config.categoryName}: ${url.toString()}`);

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ComparaTop/1.0',
            },
            // Cache de 1 hora (best sellers não mudam a cada segundo)
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[ML Best Sellers] API Error:`, response.status, errorText);
            throw new Error(`ML API error: ${response.status} ${response.statusText}`);
        }

        const data: MLSearchResponse = await response.json();

        console.log(`[ML Best Sellers] ${config.categoryName}: ${data.results?.length || 0} resultados brutos`);

        // Filtra por preço mínimo (cleaner) e transforma no formato limpo
        const cleanProducts: CleanProduct[] = data.results
            .filter(item => item.price >= minPriceFloor)  // CLEANER: Remove peças baratas
            .map(item => ({
                mlId: item.id,
                title: item.title,
                price: item.price,
                soldQuantity: item.sold_quantity,
                thumbnail: item.thumbnail?.replace('http://', 'https://') || '', // Força HTTPS
                permalink: item.permalink,
                freeShipping: item.shipping?.free_shipping ?? false,
                isOfficialStore: !!item.official_store_id,
                officialStoreName: item.official_store_name,
                sellerNickname: item.seller?.nickname ?? 'Vendedor',
            }));

        console.log(`[ML Best Sellers] ${config.categoryName}: ${cleanProducts.length} após filtro de preço (>= R$${minPriceFloor})`);

        return cleanProducts;

    } catch (error) {
        console.error(`[ML Best Sellers] Erro ao buscar ${config.categoryName}:`, error);
        return [];
    }
}

/**
 * Busca best sellers para múltiplas categorias em paralelo
 * 
 * @param categories - Array de configurações de categoria
 * @param limit - Número de resultados por categoria
 * @returns Mapa de categoryId -> produtos
 */
export async function fetchAllCategoriesBestSellers(
    categories: MLCategoryConfig[] = ML_CATEGORY_CONFIG,
    limit: number = 20
): Promise<Map<string, CleanProduct[]>> {
    const results = new Map<string, CleanProduct[]>();

    // Busca em paralelo com limite de concorrência
    const promises = categories.map(async (config) => {
        const products = await fetchCleanTop20ML(config, limit);
        return { categoryId: config.categoryId, products };
    });

    const allResults = await Promise.all(promises);

    for (const { categoryId, products } of allResults) {
        results.set(categoryId, products);
    }

    return results;
}

/**
 * Busca best sellers para uma categoria específica pelo ID interno
 * 
 * @param categoryId - ID interno da categoria (ex: 'washer')
 * @param limit - Número de resultados
 * @returns Lista de produtos ou null se categoria não encontrada
 */
export async function fetchBestSellersByCategory(
    categoryId: string,
    limit: number = 20
): Promise<CleanProduct[] | null> {
    const config = ML_CATEGORY_CONFIG.find(c => c.categoryId === categoryId);

    if (!config) {
        console.warn(`[ML Best Sellers] Categoria "${categoryId}" não configurada`);
        return null;
    }

    return fetchCleanTop20ML(config, limit);
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Retorna a configuração de todas as categorias disponíveis
 */
export function getAvailableCategories(): MLCategoryConfig[] {
    return [...ML_CATEGORY_CONFIG];
}

/**
 * Verifica se uma categoria está configurada
 */
export function isCategoryConfigured(categoryId: string): boolean {
    return ML_CATEGORY_CONFIG.some(c => c.categoryId === categoryId);
}
