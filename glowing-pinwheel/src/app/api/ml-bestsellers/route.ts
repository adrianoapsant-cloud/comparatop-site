/**
 * API Route: Fetch ML Best Sellers
 * 
 * GET /api/ml-bestsellers?category=washer&limit=20
 * GET /api/ml-bestsellers?all=true (busca todas as categorias)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    fetchBestSellersByCategory,
    fetchAllCategoriesBestSellers,
    getAvailableCategories,
} from '@/lib/ml-bestsellers';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get('category');
    const all = searchParams.get('all') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    try {
        // Lista categorias disponíveis
        if (searchParams.get('list') === 'true') {
            return NextResponse.json({
                categories: getAvailableCategories().map(c => ({
                    categoryId: c.categoryId,
                    name: c.categoryName,
                    mlId: c.mlCategoryId,
                    minPrice: c.minPriceFloor,
                })),
            });
        }

        // Busca todas as categorias
        if (all) {
            const results = await fetchAllCategoriesBestSellers(undefined, limit);

            // Converte Map para objeto serializável
            const data: Record<string, unknown> = {};
            results.forEach((products, categoryId) => {
                data[categoryId] = products;
            });

            return NextResponse.json({
                success: true,
                categoriesCount: results.size,
                data,
            });
        }

        // Busca categoria específica
        if (category) {
            const products = await fetchBestSellersByCategory(category, limit);

            if (!products) {
                return NextResponse.json(
                    { error: `Categoria "${category}" não configurada` },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success: true,
                category,
                count: products.length,
                products,
            });
        }

        // Sem parâmetros - retorna ajuda
        return NextResponse.json({
            usage: {
                listCategories: '/api/ml-bestsellers?list=true',
                singleCategory: '/api/ml-bestsellers?category=washer&limit=20',
                allCategories: '/api/ml-bestsellers?all=true&limit=10',
            },
            availableCategories: getAvailableCategories().map(c => c.categoryId),
        });

    } catch (error) {
        console.error('[API ML Best Sellers] Error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar best sellers' },
            { status: 500 }
        );
    }
}
