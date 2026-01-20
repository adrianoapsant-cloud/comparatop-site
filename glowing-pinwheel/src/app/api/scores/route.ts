/**
 * Scoring API Route - Server-Side Only
 * 
 * @description Exposes the scoring engine via API.
 * All computation happens on the server to protect proprietary algorithms.
 */

import { NextRequest, NextResponse } from 'next/server';
import { scoreAndRankProducts, compareProducts } from '@/lib/scoring';
import { getCategoryById } from '@/config/categories';
import { getProductsByCategory, getProductById } from '@/data/products';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category');
    const profileId = searchParams.get('profile');
    const action = searchParams.get('action') || 'rank';

    // Validate category
    if (!categoryId) {
        return NextResponse.json(
            { error: 'Missing required parameter: category' },
            { status: 400 }
        );
    }

    const category = getCategoryById(categoryId);
    if (!category) {
        return NextResponse.json(
            { error: `Category not found: ${categoryId}` },
            { status: 404 }
        );
    }

    // Get profile if specified
    const profile = profileId
        ? category.profiles?.find(p => p.id === profileId) ?? null
        : null;

    // Get products for category
    const products = getProductsByCategory(categoryId);

    if (products.length === 0) {
        return NextResponse.json(
            { error: `No products found for category: ${categoryId}` },
            { status: 404 }
        );
    }

    // Handle different actions
    if (action === 'rank') {
        // Score and rank all products
        const scoredProducts = scoreAndRankProducts(products, category, profile);

        return NextResponse.json({
            category: {
                id: category.id,
                name: category.name,
                criteria: category.criteria,
            },
            profile: profile ? { id: profile.id, name: profile.name } : null,
            products: scoredProducts,
            meta: {
                total: scoredProducts.length,
                generatedAt: new Date().toISOString(),
            },
        });
    }

    if (action === 'compare') {
        const productAId = searchParams.get('productA');
        const productBId = searchParams.get('productB');

        if (!productAId || !productBId) {
            return NextResponse.json(
                { error: 'Compare action requires productA and productB parameters' },
                { status: 400 }
            );
        }

        const productA = getProductById(productAId);
        const productB = getProductById(productBId);

        if (!productA || !productB) {
            return NextResponse.json(
                { error: 'One or both products not found' },
                { status: 404 }
            );
        }

        const comparison = compareProducts(productA, productB, category, profile);

        return NextResponse.json({
            category: {
                id: category.id,
                name: category.name,
            },
            profile: profile ? { id: profile.id, name: profile.name } : null,
            comparison,
            meta: {
                generatedAt: new Date().toISOString(),
            },
        });
    }

    return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
    );
}
