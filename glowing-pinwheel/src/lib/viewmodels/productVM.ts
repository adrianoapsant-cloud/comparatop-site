/**
 * @file productVM.ts
 * @description ProductViewModel - Transforma dados brutos em ViewModel unificado
 * 
 * Este ViewModel é o ÚNICO formato que componentes devem consumir.
 * Elimina duplicação de lógica de formatação e cálculo entre páginas.
 * 
 * @see src/lib/schemas/product.ts - Schema que valida os dados
 * @see src/lib/services/productService.ts - Serviço que usa este ViewModel
 */

import { type ProductValidated, validateProduct } from '@/lib/schemas/product';
import { getBaseScore } from '@/lib/getBaseScore';

// ============================================
// TYPES
// ============================================

/**
 * Status de saúde do produto
 */
export type ProductHealth = 'OK' | 'WARN' | 'FAIL';

/**
 * Issue de integridade do produto
 */
export interface ProductHealthIssue {
    code: string;
    message: string;
    severity: 'error' | 'warning';
}

/**
 * URLs canônicas do produto
 */
export interface ProductCanonicalURLs {
    /** URL da página de produto */
    pdp: string;
    /** URL da categoria */
    category: string;
    /** URL para comparação (template) */
    compare: string;
}

/**
 * Preços formatados
 */
export interface ProductDisplayPrices {
    /** Preço principal formatado (ex: "R$ 4.199") */
    current: string;
    /** Preço numérico */
    value: number;
    /** Menor preço entre ofertas */
    lowest?: string;
    /** Maior preço entre ofertas */
    highest?: string;
}

/**
 * ProductViewModel - Representação unificada para UI
 */
export interface ProductVM {
    // === IDENTIFICAÇÃO ===
    id: string;
    slug: string;
    categoryId: string;
    categorySlug: string;

    // === DISPLAY ===
    name: string;
    shortName: string;
    brand: string;
    model?: string;
    imageUrl?: string;

    // === URLS CANÔNICAS ===
    canonical: ProductCanonicalURLs;

    // === PREÇOS ===
    price: ProductDisplayPrices;

    // === SCORES ===
    score: {
        /** Score numérico (0-10) */
        value: number;
        /** Score formatado (ex: "8.3") */
        display: string;
        /** Label do score (ex: "Muito Bom") */
        label: string;
        /** Cor do score (CSS class) */
        colorClass: string;
    };

    // === BADGES ===
    badges: string[];
    hasBadge: (badge: string) => boolean;

    // === OFERTAS ===
    offers: Array<{
        store: string;
        storeSlug: string;
        price: number;
        priceDisplay: string;
        url: string;
        affiliateUrl?: string;
        inStock: boolean;
    }>;
    bestOffer?: {
        store: string;
        price: number;
        priceDisplay: string;
        url: string;
    };

    // === INTEGRIDADE ===
    health: ProductHealth;
    healthIssues: ProductHealthIssue[];

    // === DADOS BRUTOS (para componentes que precisam) ===
    raw: ProductValidated;
}

// ============================================
// HELPERS
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';

/**
 * Formata preço em BRL
 */
function formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

/**
 * Converte categoryId para slug de URL
 */
function categoryIdToSlug(categoryId: string): string {
    const mapping: Record<string, string> = {
        'tv': 'smart-tvs',
        'fridge': 'geladeiras',
        'air_conditioner': 'ar-condicionado',
        'washer': 'lavadoras',
        'robot-vacuum': 'robo-aspirador',
        // Adicionar mais conforme necessário
    };
    return mapping[categoryId] || categoryId;
}

/**
 * Calcula label e cor do score
 */
function getScoreMetadata(score: number): { label: string; colorClass: string } {
    if (score >= 9.0) return { label: 'Excelente', colorClass: 'text-emerald-600' };
    if (score >= 8.0) return { label: 'Muito Bom', colorClass: 'text-green-600' };
    if (score >= 7.0) return { label: 'Bom', colorClass: 'text-lime-600' };
    if (score >= 6.0) return { label: 'Regular', colorClass: 'text-yellow-600' };
    if (score >= 5.0) return { label: 'Abaixo da Média', colorClass: 'text-orange-600' };
    return { label: 'Fraco', colorClass: 'text-red-600' };
}

/**
 * Verifica integridade do produto
 * 
 * Lógica de status:
 * - 'draft': Campos comerciais faltantes (imagem/ofertas) geram WARNING
 * - 'published': Campos comerciais faltantes geram ERROR (bloqueiam CI)
 */
function checkProductHealth(product: ProductValidated): {
    health: ProductHealth;
    issues: ProductHealthIssue[];
} {
    const issues: ProductHealthIssue[] = [];
    const isPublished = product.status === 'published';

    // Checks críticos (FAIL sempre)
    if (!product.id || product.id.trim() === '') {
        issues.push({ code: 'MISSING_ID', message: 'ID do produto ausente', severity: 'error' });
    }
    if (!product.categoryId) {
        issues.push({ code: 'MISSING_CATEGORY', message: 'Categoria ausente', severity: 'error' });
    }
    if (!product.price || product.price <= 0) {
        issues.push({ code: 'INVALID_PRICE', message: 'Preço inválido ou zero', severity: 'error' });
    }

    // Checks de campos comerciais - severity depende do status
    const commercialSeverity = isPublished ? 'error' : 'warning';

    if (!product.imageUrl) {
        issues.push({
            code: 'MISSING_IMAGE',
            message: isPublished ? 'Imagem principal ausente (PUBLISHED requer imagem)' : 'Imagem principal ausente',
            severity: commercialSeverity
        });
    }
    if (!product.offers || product.offers.length === 0) {
        issues.push({
            code: 'NO_OFFERS',
            message: isPublished ? 'Nenhuma oferta cadastrada (PUBLISHED requer ofertas)' : 'Nenhuma oferta cadastrada',
            severity: commercialSeverity
        });
    }

    // Checks que são sempre warning
    if (!product.shortName) {
        issues.push({ code: 'MISSING_SHORT_NAME', message: 'Nome curto ausente', severity: 'warning' });
    }

    // Determinar health status
    const hasErrors = issues.some(i => i.severity === 'error');
    const hasWarnings = issues.some(i => i.severity === 'warning');

    if (hasErrors) return { health: 'FAIL', issues };
    if (hasWarnings) return { health: 'WARN', issues };
    return { health: 'OK', issues: [] };
}

// ============================================
// MAIN FUNCTION
// ============================================

export interface ToProductVMOptions {
    /** Se true, calcula score via getBaseScore. Se false, usa score do cache se existir. */
    calculateScore?: boolean;
}

/**
 * Transforma produto bruto em ViewModel unificado
 * 
 * @param rawProduct - Produto validado ou dados brutos
 * @param opts - Opções de transformação
 * @returns ProductVM pronto para consumo na UI
 */
export function toProductVM(
    rawProduct: ProductValidated | unknown,
    opts: ToProductVMOptions = {}
): ProductVM | null {
    // Validar se necessário
    let product: ProductValidated;

    if (typeof rawProduct === 'object' && rawProduct !== null && 'id' in rawProduct) {
        // Tenta validar
        const validation = validateProduct(rawProduct);
        if (!validation.success || !validation.data) {
            console.warn('[ProductVM] Produto inválido:', validation.errors);
            return null;
        }
        product = validation.data;
    } else {
        return null;
    }

    // Calcular score
    const scoreValue = opts.calculateScore !== false
        ? getBaseScore(product as never) // Cast para compatibilidade com tipo Product legado
        : Object.values(product.scores).reduce((a, b) => a + b, 0) / 10;

    const scoreMetadata = getScoreMetadata(scoreValue);
    const categorySlug = categoryIdToSlug(product.categoryId);

    // Processar ofertas
    const offers = (product.offers || []).map(offer => ({
        store: offer.store,
        storeSlug: offer.storeSlug,
        price: offer.price,
        priceDisplay: formatPrice(offer.price),
        url: offer.url,
        affiliateUrl: offer.affiliateUrl,
        inStock: offer.inStock,
    }));

    // Encontrar melhor oferta (menor preço, em estoque)
    const inStockOffers = offers.filter(o => o.inStock);
    const bestOffer = inStockOffers.length > 0
        ? inStockOffers.reduce((best, curr) => curr.price < best.price ? curr : best)
        : undefined;

    // Calcular preços
    const allPrices = offers.map(o => o.price);
    const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.price;
    const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : product.price;

    // Verificar integridade
    const { health, issues } = checkProductHealth(product);

    // Construir ViewModel
    const vm: ProductVM = {
        // Identificação
        id: product.id,
        slug: product.id, // Slug é o mesmo que ID neste modelo
        categoryId: product.categoryId,
        categorySlug,

        // Display
        name: product.name,
        shortName: product.shortName || product.name.split(' ').slice(0, 2).join(' '),
        brand: product.brand,
        model: product.model,
        imageUrl: product.imageUrl,

        // URLs canônicas
        canonical: {
            pdp: `${BASE_URL}/produto/${product.id}`,
            category: `${BASE_URL}/categorias/${categorySlug}`,
            compare: `${BASE_URL}/vs/${product.id}-vs-{rivalSlug}`,
        },

        // Preços
        price: {
            current: formatPrice(product.price),
            value: product.price,
            lowest: formatPrice(lowestPrice),
            highest: formatPrice(highestPrice),
        },

        // Scores
        score: {
            value: Math.round(scoreValue * 100) / 100,
            display: scoreValue.toFixed(1),
            label: scoreMetadata.label,
            colorClass: scoreMetadata.colorClass,
        },

        // Badges
        badges: product.badges || [],
        hasBadge: (badge: string) => (product.badges || []).includes(badge as never),

        // Ofertas
        offers,
        bestOffer: bestOffer ? {
            store: bestOffer.store,
            price: bestOffer.price,
            priceDisplay: bestOffer.priceDisplay,
            url: bestOffer.affiliateUrl || bestOffer.url,
        } : undefined,

        // Integridade
        health,
        healthIssues: issues,

        // Raw data
        raw: product,
    };

    return vm;
}

/**
 * Transforma array de produtos em ViewModels
 */
export function toProductVMs(
    products: unknown[],
    opts: ToProductVMOptions = {}
): ProductVM[] {
    return products
        .map(p => toProductVM(p, opts))
        .filter((vm): vm is ProductVM => vm !== null);
}
