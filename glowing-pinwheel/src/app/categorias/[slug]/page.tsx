/**
 * @file page.tsx
 * @description Server Component para página de categoria (PLP)
 * 
 * SSR Strategy:
 * - generateMetadata() para SEO (canonical, OG, Twitter)
 * - Busca produtos via productService (SSOT)
 * - Renderiza JSON-LD Breadcrumb
 * - Passa initialCards serializados para CategoryPageClient
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsByCategory as productServiceGetByCategory, getScoredProductsByCategoryFromDB } from '@/lib/services';
import { selectProductCards, type ProductCardVM } from '@/lib/viewmodels/productCardVM';
import { getCategoryById } from '@/config/categories';
import { categoryMetadata } from '@/lib/seo/metadata';
import { categoryBreadcrumb, renderJsonLd } from '@/lib/seo/jsonld';
import CategoryPageClient from './CategoryPageClient';

// ============================================
// CATEGORY SLUGS MAPPING (Source of Truth)
// ============================================

const SLUG_TO_CATEGORY: Record<string, string> = {
    'smart-tvs': 'tv',
    'geladeiras': 'fridge',
    'ar-condicionados': 'air_conditioner',
    'notebooks': 'notebook',
    'smartphones': 'smartphone',
    'fones-bluetooth': 'headphones',
    'smartwatches': 'smartwatch',
    'cafeteiras': 'coffee_maker',
    'aspiradores': 'vacuum',
    'lavadoras': 'washer',
    'monitores': 'monitor',
    'soundbars': 'soundbar',
    'robos-aspiradores': 'robot-vacuum',
    'robo-aspiradores': 'robot-vacuum',
};

// ============================================
// SEO METADATA
// ============================================

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const categoryId = SLUG_TO_CATEGORY[slug] || slug;
    const category = getCategoryById(categoryId);

    if (!category) {
        return {
            title: 'Categoria não encontrada | ComparaTop',
        };
    }

    const products = productServiceGetByCategory(categoryId);

    return categoryMetadata({
        categorySlug: slug,
        categoryName: category.name,
        productCount: products.length,
    });
}

// ============================================
// STATIC PARAMS (for build-time generation)
// ============================================

export async function generateStaticParams() {
    return Object.keys(SLUG_TO_CATEGORY).map((slug) => ({
        slug,
    }));
}

// ============================================
// PAGE COMPONENT (Server)
// ============================================

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const categoryId = SLUG_TO_CATEGORY[slug] || slug;
    const category = getCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    // Fetch products via SSOT (already ProductVM[])
    const vms = productServiceGetByCategory(categoryId);

    // Filter: Only show products with health OK or WARN (not FAIL)
    // This prevents broken links to draft products with placeholder images
    const healthyVMs = vms.filter(vm => vm.health !== 'FAIL');

    // Select cards for serialization
    const initialCards: ProductCardVM[] = selectProductCards(healthyVMs);

    // ============================================
    // SUPABASE: Fetch products from database
    // ============================================
    const dbProducts = await getScoredProductsByCategoryFromDB(slug);
    console.log(`[CategoryPage] Loaded ${dbProducts.length} products from Supabase for "${slug}"`);

    // Generate JSON-LD Breadcrumb
    const breadcrumbLD = categoryBreadcrumb(category.name, slug);

    return (
        <>
            {/* JSON-LD Breadcrumb for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbLD) }}
            />

            {/* Client Component with all interactive logic */}
            <CategoryPageClient
                categoryId={categoryId}
                categorySlug={slug}
                categoryName={category.name}
                initialCards={initialCards}
                initialProducts={dbProducts.length > 0 ? dbProducts : undefined}
            />
        </>
    );
}
