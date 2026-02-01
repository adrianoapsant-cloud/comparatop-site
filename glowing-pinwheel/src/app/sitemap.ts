/**
 * @file sitemap.ts
 * @description Sitemap dinâmico com Indexação Progressiva e Batalhas por Categoria
 * 
 * Estratégias implementadas:
 * 1. Páginas estáticas (home, metodologia, etc.)
 * 2. Páginas de categorias
 * 3. Páginas de produtos (top N por popularidade)
 * 4. Páginas de comparação "vs" (Ringue por Categoria)
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { ALL_PRODUCTS } from '@/data/products';
import { CATEGORIES as CATEGORY_DEFINITIONS } from '@/data/categories';
import { CATEGORIES } from '@/config/categories';
import { listCategories } from '@/categories/registry';
import {
    getIndexableProducts,
    getIndexingStats,
    type ProductIndexingMetrics
} from '@/config/seo-strategy';
import {
    getCategoryBattles,
    toBattleProduct,
    BATTLE_ENGINE_CONFIG,
    type BattleProduct,
} from '@/lib/seo/battle-engine';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';

// ============================================================================
// DADOS DE CATEGORIAS - USA APENAS CATEGORIAS REGISTRADAS
// ============================================================================

/**
 * Gera lista de categorias para o sitemap usando APENAS categorias do registry
 * (categorias com páginas implementadas, não stubs ou definições futuras)
 */
function getRegisteredCategorySlugs(): Array<{ slug: string; name: string; priority: number }> {
    // Usa registry como SSOT - apenas categorias com páginas implementadas
    const activeRegistrySlugs = listCategories(); // e.g., ['robot-vacuum']

    // Mapear para slugs de URL (registry usa 'robot-vacuum', URL usa 'robos-aspiradores')
    const slugToUrlSlug: Record<string, string> = {
        'robot-vacuum': 'robos-aspiradores',
        // Adicionar mapeamentos conforme novas categorias forem implementadas
    };

    return activeRegistrySlugs.map(registrySlug => {
        const urlSlug = slugToUrlSlug[registrySlug] || registrySlug;
        const categoryDef = CATEGORIES[registrySlug];
        return {
            slug: urlSlug,
            name: categoryDef?.name || registrySlug,
            priority: 0.9,
        };
    });
}

const FERRAMENTAS = [
    { slug: 'calculadora-btu', name: 'Calculadora de BTU', priority: 0.8 },
    { slug: 'tv-cabe-estante', name: 'TV Cabe na Estante', priority: 0.7 },
    { slug: 'geladeira-passa-porta', name: 'Geladeira Passa na Porta', priority: 0.7 },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Converte produto para métricas de indexação
 */
function toIndexingMetrics(product: typeof ALL_PRODUCTS[number]): ProductIndexingMetrics {
    let popularityScore = 50;

    if (product.offers && product.offers.length > 0) {
        popularityScore += product.offers.length * 10;
    }
    if (product.price && product.price < 2000) {
        popularityScore += 15;
    } else if (product.price && product.price < 5000) {
        popularityScore += 10;
    }
    if (product.badges?.includes('editors-choice')) {
        popularityScore += 20;
    }
    if (product.badges?.includes('best-value')) {
        popularityScore += 15;
    }

    popularityScore = Math.min(100, Math.max(0, popularityScore));

    return {
        id: product.id,
        slug: product.id,
        popularityScore,
        hasFullContent: Boolean(product.benefitSubtitle && product.scores),
        offerCount: product.offers?.length || 0,
    };
}

/**
 * Agrupa produtos por categoria
 */
function groupProductsByCategory(products: typeof ALL_PRODUCTS): Map<string, BattleProduct[]> {
    const grouped = new Map<string, BattleProduct[]>();

    for (const product of products) {
        if (!product.categoryId) continue;

        const battleProduct = toBattleProduct(product);

        if (!grouped.has(product.categoryId)) {
            grouped.set(product.categoryId, []);
        }
        grouped.get(product.categoryId)!.push(battleProduct);
    }

    return grouped;
}

// ============================================================================
// GERAÇÃO DE BATALHAS POR CATEGORIA (Ringue)
// ============================================================================

/**
 * Gera todas as batalhas indexáveis usando o sistema de "Ringue por Categoria"
 * 
 * Algoritmo:
 * 1. Agrupa produtos por categoria
 * 2. Para cada categoria, pega top 20 produtos
 * 3. Gera combinações (20*19/2 = 190 batalhas máx por categoria)
 * 4. Filtra pelo INDEXING_THRESHOLD
 * 
 * Resultado: sitemap limpo e semanticamente correto
 */
function generateAllBattles(): Array<{ slug: string; categoryId: string; score: number }> {
    const productsByCategory = groupProductsByCategory(ALL_PRODUCTS);
    const allBattles: Array<{ slug: string; categoryId: string; score: number }> = [];

    // Obter categorias registradas (SSOT) - usa registry
    const registeredCategoryIds = new Set(listCategories()); // e.g., Set(['robot-vacuum'])

    let totalStats = {
        categories: 0,
        skippedCategories: 0,
        totalBattles: 0,
        indexableBattles: 0,
    };

    // Iterar sobre cada categoria
    for (const [categoryId, products] of productsByCategory) {
        // Skip categorias não registradas para evitar 404s
        if (!registeredCategoryIds.has(categoryId)) {
            totalStats.skippedCategories++;
            console.log(`[Sitemap] Skipping unregistered category: ${categoryId}`);
            continue;
        }

        totalStats.categories++;

        // Gerar batalhas para esta categoria (apenas indexáveis)
        const categoryBattles = getCategoryBattles(products, true);

        for (const battle of categoryBattles) {
            allBattles.push({
                slug: battle.slug,
                categoryId,
                score: battle.score,
            });
            totalStats.indexableBattles++;
        }

        totalStats.totalBattles += (products.length * (products.length - 1)) / 2;
    }

    console.log('[Sitemap] Batalhas por Categoria:', {
        categories: totalStats.categories,
        skippedCategories: totalStats.skippedCategories,
        totalPossibleBattles: totalStats.totalBattles,
        indexableBattles: totalStats.indexableBattles,
        threshold: BATTLE_ENGINE_CONFIG.INDEXING_THRESHOLD,
        productsPerCategory: BATTLE_ENGINE_CONFIG.PRODUCTS_PER_CATEGORY,
    });

    // Ordenar por score global (maior primeiro)
    return allBattles.sort((a, b) => b.score - a.score);
}

// ============================================================================
// FUNÇÃO PRINCIPAL DO SITEMAP
// ============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date().toISOString();

    // =========================================
    // 1. PÁGINAS ESTÁTICAS
    // =========================================
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/metodologia`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/comparar`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/lab`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ];

    // =========================================
    // 2. PÁGINAS DE CATEGORIAS
    // =========================================
    const registeredCategories = getRegisteredCategorySlugs();
    const categoryPages: MetadataRoute.Sitemap = registeredCategories.map(category => ({
        url: `${BASE_URL}/categorias/${category.slug}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: category.priority,
    }));

    // =========================================
    // 3. PÁGINAS DE FERRAMENTAS
    // =========================================
    const toolPages: MetadataRoute.Sitemap = FERRAMENTAS.map(tool => ({
        url: `${BASE_URL}/ferramentas/${tool.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: tool.priority,
    }));

    // =========================================
    // 4. PÁGINAS DE PRODUTOS (Indexação Progressiva)
    // =========================================
    const allProductMetrics = ALL_PRODUCTS.map(toIndexingMetrics);
    const indexableProducts = getIndexableProducts(allProductMetrics);

    const stats = getIndexingStats(allProductMetrics);
    console.log('[Sitemap] Produtos:', {
        phase: stats.phase,
        total: stats.total,
        indexable: stats.indexable,
        limit: stats.limit,
    });

    const productPages: MetadataRoute.Sitemap = indexableProducts.map(product => ({
        url: `${BASE_URL}/produto/${product.slug}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // =========================================
    // 5. PÁGINAS DE COMPARAÇÃO "VS" (Ringue por Categoria)
    // =========================================
    const allBattles = generateAllBattles();

    const battlePages: MetadataRoute.Sitemap = allBattles.map(battle => ({
        url: `${BASE_URL}/vs/${battle.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // =========================================
    // COMBINAR TUDO
    // =========================================
    const totalPages = [
        ...staticPages,
        ...categoryPages,
        ...toolPages,
        ...productPages,
        ...battlePages,
    ];

    console.log('[Sitemap] Total de páginas:', {
        static: staticPages.length,
        categories: categoryPages.length,
        tools: toolPages.length,
        products: productPages.length,
        battles: battlePages.length,
        total: totalPages.length,
    });

    return totalPages;
}
