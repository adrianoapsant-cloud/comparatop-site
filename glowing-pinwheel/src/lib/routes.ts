/**
 * @file routes.ts
 * @description Canonical Route Builders - Zero links mortos por construção
 * 
 * Este arquivo centraliza a geração de URLs canônicas para evitar
 * concatenações de string espalhadas e garantir links consistentes.
 * 
 * @see src/lib/services/productService.ts - Fonte de dados
 * @see src/lib/viewmodels/productVM.ts - ProductVM com URLs canônicas
 */

import type { ProductVM } from '@/lib/viewmodels/productVM';
import { logEvent } from '@/lib/observability/logger';

// ============================================
// CONFIGURATION
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';

/**
 * Mapping de categoryId para slug de URL
 */
const CATEGORY_SLUG_MAP: Record<string, string> = {
    'tv': 'smart-tvs',
    'fridge': 'geladeiras',
    'air_conditioner': 'ar-condicionado',
    'washer': 'lavadoras',
    'robot-vacuum': 'robo-aspirador',
};

/**
 * Mapping inverso: slug para categoryId
 */
const SLUG_TO_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_SLUG_MAP).map(([k, v]) => [v, k])
);

// ============================================
// URL BUILDERS
// ============================================

/**
 * Gera URL canônica para página de produto (PDP)
 */
export function productUrl(vmOrSlug: ProductVM | string, absolute = false): string {
    const slug = typeof vmOrSlug === 'string' ? vmOrSlug : vmOrSlug.slug;
    const path = `/produto/${slug}`;
    return absolute ? `${BASE_URL}${path}` : path;
}

/**
 * Gera URL canônica para página de categoria (PLP)
 */
export function categoryUrl(categoryIdOrSlug: string, absolute = false): string {
    // Converte categoryId para slug se necessário
    const slug = CATEGORY_SLUG_MAP[categoryIdOrSlug] || categoryIdOrSlug;
    const path = `/categorias/${slug}`;
    return absolute ? `${BASE_URL}${path}` : path;
}

/**
 * Gera URL canônica para comparação 1x1 (VS)
 */
export function compareUrl(slugs: string[], absolute = false): string {
    if (slugs.length < 2) {
        console.warn('[routes.ts] compareUrl requires at least 2 slugs');
        return '/';
    }
    // Ordenar slugs para URL canônica consistente
    const sortedSlugs = [...slugs].sort();
    const path = `/vs/${sortedSlugs.join('-vs-')}`;
    return absolute ? `${BASE_URL}${path}` : path;
}

/**
 * Gera URL para página de comparação genérica
 */
export function comparadorUrl(categorySlug?: string, absolute = false): string {
    const path = categorySlug ? `/comparar/${categorySlug}` : '/comparar';
    return absolute ? `${BASE_URL}${path}` : path;
}

/**
 * Gera URL para ferramenta específica
 */
export function toolUrl(toolSlug: string, absolute = false): string {
    const path = `/ferramentas/${toolSlug}`;
    return absolute ? `${BASE_URL}${path}` : path;
}

/**
 * Gera URL para guia/manual
 */
export function guideUrl(guideSlug: string, absolute = false): string {
    const path = `/manual/${guideSlug}`;
    return absolute ? `${BASE_URL}${path}` : path;
}

// ============================================
// HELPERS
// ============================================

/**
 * Converte categoryId para slug de URL
 */
export function categoryIdToSlug(categoryId: string): string {
    return CATEGORY_SLUG_MAP[categoryId] || categoryId;
}

/**
 * Converte slug de URL para categoryId
 */
export function slugToCategoryId(slug: string): string {
    return SLUG_TO_CATEGORY_MAP[slug] || slug;
}

/**
 * Verifica se um ProductVM é "linkável" (não deve gerar link morto)
 */
export function isLinkable(vm: ProductVM): boolean {
    // FAIL = não renderizar link
    if (vm.health === 'FAIL') {
        return false;
    }
    // WARN = permitir, mas checar campos específicos
    if (vm.health === 'WARN') {
        // Se missing slug ou missing category, ainda pode linkar para PDP
        return Boolean(vm.slug);
    }
    return true;
}

/**
 * Filtra produtos para renderização, removendo os com health FAIL
 */
export function filterPublishable(products: ProductVM[]): ProductVM[] {
    return products.filter(p => p.health !== 'FAIL');
}

/**
 * Filtra produtos e loga os removidos
 */
export function filterPublishableWithLog(
    products: ProductVM[],
    context: string
): ProductVM[] {
    const publishable: ProductVM[] = [];
    const removed: ProductVM[] = [];

    for (const p of products) {
        if (p.health === 'FAIL') {
            removed.push(p);
        } else {
            publishable.push(p);
        }
    }

    if (removed.length > 0) {
        // Log via observability system
        logEvent({
            level: 'warn',
            category: 'product_health',
            message: `${removed.length} produto(s) com health=FAIL removidos`,
            route: context,
            data: {
                count: removed.length,
                removed: removed.map(p => ({
                    slug: p.slug,
                    reasons: p.healthIssues.map(i => i.code),
                })),
            },
        });
    }

    return publishable;
}

// ============================================
// CANONICAL URL VALIDATION
// ============================================

/**
 * Normaliza slug para formato canônico
 * Usado para detectar slugs alternativos e redirecionar
 */
export function normalizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
}

/**
 * Verifica se slug recebido é o canônico
 */
export function isCanonicalSlug(received: string, canonical: string): boolean {
    return received === canonical;
}
