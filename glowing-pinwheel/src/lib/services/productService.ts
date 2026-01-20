/**
 * @file productService.ts
 * @description Product Service - Camada única de leitura de produtos
 * 
 * Este serviço é o ÚNICO ponto de entrada para páginas obterem dados de produtos.
 * Garante que todos os produtos passem por validação e transformação unificada.
 * 
 * @see src/lib/schemas/product.ts - Schema de validação
 * @see src/lib/viewmodels/productVM.ts - ViewModel de transformação
 */

import { ALL_PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';
import { toProductVM, toProductVMs, type ProductVM } from '@/lib/viewmodels/productVM';

// ============================================
// CACHE
// ============================================

/**
 * Cache simples em memória para evitar recálculos
 * Em produção, considerar usar unstable_cache do Next.js
 */
const productCache = new Map<string, ProductVM>();
const categoryCache = new Map<string, ProductVM[]>();

let cacheInitialized = false;

/**
 * Inicializa o cache com todos os produtos
 */
function initializeCache(): void {
    if (cacheInitialized) return;

    // Transformar todos os produtos em VMs
    for (const product of ALL_PRODUCTS) {
        const vm = toProductVM(product);
        if (vm) {
            productCache.set(vm.id, vm);
            productCache.set(vm.slug, vm);
        }
    }

    // Agrupar por categoria
    for (const [, vm] of productCache) {
        const categoryId = vm.categoryId;
        if (!categoryCache.has(categoryId)) {
            categoryCache.set(categoryId, []);
        }
        // Evitar duplicatas
        const existing = categoryCache.get(categoryId)!;
        if (!existing.some(p => p.id === vm.id)) {
            existing.push(vm);
        }
    }

    cacheInitialized = true;
}

/**
 * Força reconstrução do cache (usar após atualizações de dados)
 */
export function invalidateProductCache(): void {
    productCache.clear();
    categoryCache.clear();
    cacheInitialized = false;
}

// ============================================
// MAIN API
// ============================================

/**
 * Obtém produto por slug
 * 
 * @param slug - Slug do produto (ex: "samsung-qn90c-65")
 * @returns ProductVM ou null se não encontrado
 */
export function getProductBySlug(slug: string): ProductVM | null {
    initializeCache();
    return productCache.get(slug) || null;
}

/**
 * Obtém produto por ID
 * 
 * @param id - ID do produto (neste modelo, igual ao slug)
 * @returns ProductVM ou null se não encontrado
 */
export function getProductById(id: string): ProductVM | null {
    return getProductBySlug(id);
}

/**
 * Obtém todos os produtos de uma categoria
 * 
 * @param categorySlug - Slug da categoria (ex: "smart-tvs") ou categoryId (ex: "tv")
 * @returns Array de ProductVMs
 */
export function getProductsByCategory(categorySlug: string): ProductVM[] {
    initializeCache();

    // Tentar por categoryId direto primeiro
    const byId = categoryCache.get(categorySlug);
    if (byId) return byId;

    // Tentar converter slug para categoryId
    const slugToId: Record<string, string> = {
        'smart-tvs': 'tv',
        'geladeiras': 'fridge',
        'ar-condicionado': 'air_conditioner',
        'lavadoras': 'washer',
        'robo-aspirador': 'robot-vacuum',
        'smartphones': 'smartphone',
        'smartwatches': 'smartwatch',
    };

    const categoryId = slugToId[categorySlug] || categorySlug;
    return categoryCache.get(categoryId) || [];
}

/**
 * Obtém múltiplos produtos para comparação
 * 
 * @param idsOrSlugs - Array de IDs ou slugs
 * @returns Array de ProductVMs (apenas os encontrados)
 */
export function getProductsForCompare(idsOrSlugs: string[]): ProductVM[] {
    initializeCache();

    return idsOrSlugs
        .map(id => productCache.get(id))
        .filter((vm): vm is ProductVM => vm != null);
}

/**
 * Obtém todos os produtos
 * 
 * @returns Array de todos os ProductVMs
 */
export function getAllProducts(): ProductVM[] {
    initializeCache();

    // Evitar duplicatas do cache (que tem ambos id e slug)
    const seen = new Set<string>();
    const result: ProductVM[] = [];

    for (const [, vm] of productCache) {
        if (!seen.has(vm.id)) {
            seen.add(vm.id);
            result.push(vm);
        }
    }

    return result;
}

/**
 * Busca produtos por termo
 * 
 * @param query - Termo de busca
 * @returns Array de ProductVMs que correspondem
 */
export function searchProducts(query: string): ProductVM[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    return getAllProducts().filter(vm => {
        const searchable = [
            vm.name,
            vm.shortName,
            vm.brand,
            vm.model || '',
            vm.categoryId,
        ].join(' ').toLowerCase();

        return searchable.includes(normalizedQuery);
    });
}

/**
 * Obtém produtos com filtros
 */
export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minScore?: number;
    badges?: string[];
    healthStatus?: 'OK' | 'WARN' | 'FAIL';
}

export function getFilteredProducts(filters: ProductFilters): ProductVM[] {
    let products = getAllProducts();

    if (filters.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price.value >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price.value <= filters.maxPrice!);
    }
    if (filters.minScore !== undefined) {
        products = products.filter(p => p.score.value >= filters.minScore!);
    }
    if (filters.badges && filters.badges.length > 0) {
        products = products.filter(p =>
            filters.badges!.some(badge => p.hasBadge(badge))
        );
    }
    if (filters.healthStatus) {
        products = products.filter(p => p.health === filters.healthStatus);
    }

    return products;
}

// ============================================
// HELPERS DE CATEGORIA
// ============================================

/**
 * Obtém definição de categoria por ID ou slug
 */
export function getCategoryDefinition(idOrSlug: string) {
    // Tentar por ID direto
    if (CATEGORIES[idOrSlug]) {
        return CATEGORIES[idOrSlug];
    }

    // Tentar converter slug para ID
    const slugToId: Record<string, string> = {
        'smart-tvs': 'tv',
        'geladeiras': 'fridge',
        'ar-condicionado': 'air_conditioner',
        'lavadoras': 'washer',
        'robo-aspirador': 'robot-vacuum',
        'smartphones': 'smartphone',
        'smartwatches': 'smartwatch',
    };

    const categoryId = slugToId[idOrSlug];
    if (categoryId && CATEGORIES[categoryId]) {
        return CATEGORIES[categoryId];
    }

    return null;
}

// ============================================
// ESTATÍSTICAS
// ============================================

export interface ProductStats {
    total: number;
    byHealth: {
        ok: number;
        warn: number;
        fail: number;
    };
    byCategory: Record<string, number>;
}

/**
 * Obtém estatísticas de todos os produtos
 */
export function getProductStats(): ProductStats {
    const products = getAllProducts();

    const stats: ProductStats = {
        total: products.length,
        byHealth: { ok: 0, warn: 0, fail: 0 },
        byCategory: {},
    };

    for (const product of products) {
        // Por health
        if (product.health === 'OK') stats.byHealth.ok++;
        else if (product.health === 'WARN') stats.byHealth.warn++;
        else stats.byHealth.fail++;

        // Por categoria
        stats.byCategory[product.categoryId] = (stats.byCategory[product.categoryId] || 0) + 1;
    }

    return stats;
}
