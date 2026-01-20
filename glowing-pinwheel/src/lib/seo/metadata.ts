/**
 * @file metadata.ts
 * @description Helpers para gerar Metadata do Next.js de forma consistente
 * 
 * Centraliza geração de title, description, canonical, OG e Twitter.
 * Usa ProductVM e routes.ts como fonte única (SSOT).
 */

import type { Metadata } from 'next';
import type { ProductVM } from '@/lib/viewmodels/productVM';
import { productUrl, categoryUrl, compareUrl } from '@/lib/routes';

const SITE_NAME = 'ComparaTop';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';
const DEFAULT_OG_IMAGE = '/og-default.png';

// ============================================
// HELPERS
// ============================================

/**
 * Gera URL absoluta
 */
function absoluteUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
}

/**
 * Gera image URL para OG
 */
function ogImage(imageUrl?: string): string {
    if (!imageUrl) return absoluteUrl(DEFAULT_OG_IMAGE);
    return absoluteUrl(imageUrl);
}

// ============================================
// HOME METADATA
// ============================================

export function homeMetadata(): Metadata {
    return {
        title: `${SITE_NAME} - Compare Produtos e Encontre o Melhor Custo-Benefício`,
        description: 'Análises editoriais imparciais de tecnologia e eletrodomésticos. Compare TVs, geladeiras, ar-condicionados e mais para tomar a melhor decisão de compra.',
        alternates: {
            canonical: BASE_URL,
        },
        openGraph: {
            title: `${SITE_NAME} - Compare Produtos e Economize`,
            description: 'Análises editoriais imparciais para ajudar você a escolher o melhor produto.',
            url: BASE_URL,
            siteName: SITE_NAME,
            type: 'website',
            images: [
                {
                    url: ogImage(),
                    width: 1200,
                    height: 630,
                    alt: SITE_NAME,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: SITE_NAME,
            description: 'Compare produtos e encontre o melhor custo-benefício',
            images: [ogImage()],
        },
    };
}

// ============================================
// CATEGORY (PLP) METADATA
// ============================================

export interface CategoryMetadataOptions {
    categorySlug: string;
    categoryName: string;
    productCount: number;
}

export function categoryMetadata(opts: CategoryMetadataOptions): Metadata {
    const { categorySlug, categoryName, productCount } = opts;
    const canonicalPath = categoryUrl(categorySlug, true);

    return {
        title: `${categoryName} - Melhores ${categoryName} de 2026 | ${SITE_NAME}`,
        description: `Compare ${productCount} ${categoryName.toLowerCase()} com análises editoriais detalhadas. Encontre o melhor custo-benefício para sua necessidade.`,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: `Melhores ${categoryName} de 2026`,
            description: `Compare e escolha entre ${productCount} produtos analisados pela nossa equipe editorial.`,
            url: canonicalPath,
            siteName: SITE_NAME,
            type: 'website',
            images: [
                {
                    url: ogImage(),
                    width: 1200,
                    height: 630,
                    alt: `${categoryName} - ${SITE_NAME}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Melhores ${categoryName} | ${SITE_NAME}`,
            description: `${productCount} produtos analisados`,
            images: [ogImage()],
        },
    };
}

// ============================================
// PRODUCT (PDP) METADATA
// ============================================

export interface ProductMetadataOptions {
    vm: ProductVM;
    categoryName: string;
    shouldIndex?: boolean;
}

export function productMetadata(opts: ProductMetadataOptions): Metadata {
    const { vm, categoryName, shouldIndex = true } = opts;
    const canonicalPath = productUrl(vm, true);
    const description = vm.raw.benefitSubtitle ||
        `Análise editorial completa do ${vm.name}. Compare preços, especificações e veja se vale a pena.`;

    return {
        title: `${vm.name} | Análise Completa | ${SITE_NAME}`,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        robots: shouldIndex
            ? { index: true, follow: true }
            : { index: false, follow: false },
        openGraph: {
            title: vm.name,
            description,
            url: canonicalPath,
            siteName: SITE_NAME,
            type: 'article',
            images: [
                {
                    url: ogImage(vm.imageUrl),
                    width: 1200,
                    height: 630,
                    alt: `${vm.name} - Análise ${SITE_NAME}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: vm.name,
            description,
            images: [ogImage(vm.imageUrl)],
        },
    };
}

// ============================================
// COMPARE (VS) METADATA
// ============================================

export interface CompareMetadataOptions {
    productAName: string;
    productBName: string;
    slugs: string[];
    imageUrl?: string;
    shouldIndex?: boolean;
}

export function compareMetadata(opts: CompareMetadataOptions): Metadata {
    const { productAName, productBName, slugs, imageUrl, shouldIndex = true } = opts;
    const canonicalPath = compareUrl(slugs, true);
    const title = `${productAName} vs ${productBName} - Comparativo Completo`;
    const description = `Compare ${productAName} e ${productBName}. Análise detalhada de especificações, preços e avaliações editoriais.`;

    return {
        title: `${title} | ${SITE_NAME}`,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        robots: shouldIndex
            ? { index: true, follow: true }
            : { index: false, follow: false },
        openGraph: {
            title,
            description,
            url: canonicalPath,
            siteName: SITE_NAME,
            type: 'article',
            images: [
                {
                    url: ogImage(imageUrl),
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage(imageUrl)],
        },
    };
}
