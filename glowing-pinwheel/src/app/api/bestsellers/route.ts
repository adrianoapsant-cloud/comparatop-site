/**
 * API Route: Unified Best Sellers
 * 
 * GET /api/bestsellers?category=refrigerator&limit=20
 * GET /api/bestsellers/status (ver credenciais configuradas)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    fetchBestSellers,
    getMarketplaceStatuses,
    getAvailableCategories,
} from '@/lib/marketplace-bestsellers';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status') === 'true';
    const list = searchParams.get('list') === 'true';

    try {
        // Status dos marketplaces (credenciais)
        if (status) {
            return NextResponse.json({
                marketplaces: getMarketplaceStatuses(),
                note: 'Configure as credenciais no .env para habilitar cada marketplace',
            });
        }

        // Lista categorias disponíveis
        if (list) {
            return NextResponse.json({
                categories: getAvailableCategories(),
            });
        }

        // Busca categoria específica
        if (category) {
            const result = await fetchBestSellers(category, limit);

            // Conta produtos por marketplace
            const counts = {
                mercadolivre: result.byMarketplace.mercadolivre.length,
                amazon: result.byMarketplace.amazon.length,
                magalu: result.byMarketplace.magalu.length,
                shopee: result.byMarketplace.shopee.length,
            };

            return NextResponse.json({
                success: true,
                category,
                consolidatedCount: result.consolidated.length,
                countsByMarketplace: counts,
                errors: Object.keys(result.errors).length > 0 ? result.errors : undefined,
                consolidated: result.consolidated,
                byMarketplace: result.byMarketplace,
                fetchedAt: result.fetchedAt,
            });
        }

        // Sem parâmetros - retorna ajuda
        return NextResponse.json({
            usage: {
                status: '/api/bestsellers?status=true',
                listCategories: '/api/bestsellers?list=true',
                fetchCategory: '/api/bestsellers?category=refrigerator&limit=20',
            },
            availableCategories: getAvailableCategories().map(c => c.id),
        });

    } catch (error) {
        console.error('[API Bestsellers] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erro desconhecido' },
            { status: 500 }
        );
    }
}
