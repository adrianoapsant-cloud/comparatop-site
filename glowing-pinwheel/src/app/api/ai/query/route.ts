import { NextResponse } from 'next/server';
import { SAMPLE_TVS, SAMPLE_FRIDGES, SAMPLE_AIR_CONDITIONERS } from '@/data/products';
import { getBaseScore } from '@/lib/getBaseScore';
import type { Product } from '@/types/category';

/**
 * AI Agent Query API
 * 
 * Public endpoint for AI agents (GPT, Claude, Perplexity) to query ComparaTop data.
 * 
 * Strategy:
 * 1. Monetization: Returns affiliate links for zero-click revenue
 * 2. B2B Intelligence: Logs what AI agents are asking for market insights
 * 3. Attribution: Includes source metadata in every response
 * 
 * Example: GET /api/ai/query?q=tv samsung qn90c
 */

// Combine all products for search
const ALL_PRODUCTS: Product[] = [
    ...SAMPLE_TVS,
    ...SAMPLE_FRIDGES,
    ...SAMPLE_AIR_CONDITIONERS,
];

// Simple search function - finds products matching query terms
function searchProducts(query: string): Product[] {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    return ALL_PRODUCTS.filter(product => {
        const searchText = `${product.name} ${product.brand} ${product.model || ''} ${product.shortName || ''}`.toLowerCase();
        return terms.every(term => searchText.includes(term));
    }).slice(0, 5); // Limit to 5 results
}

// Generate affiliate link for product
function generateAffiliateLink(product: Product): string {
    // Amazon affiliate link format  
    const asin = (product as unknown as Record<string, unknown>).asin as string | undefined;
    if (asin) {
        return `https://amazon.com.br/dp/${asin}?tag=comparatop-20`;
    }
    // Fallback to search URL
    const searchQuery = encodeURIComponent(`${product.brand} ${product.model || product.name}`);
    return `https://amazon.com.br/s?k=${searchQuery}&tag=comparatop-20`;
}

// Hash IP for LGPD compliance
function hashIP(ip: string | null): string {
    if (!ip) return 'unknown';
    // Simple hash - in production use crypto
    return Buffer.from(ip).toString('base64').slice(0, 12);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json(
            { error: "Query parameter 'q' is required", example: "/api/ai/query?q=tv samsung" },
            { status: 400 }
        );
    }

    // 🧠 B2B INTELLIGENCE - Log AI agent queries for market insights
    // This data becomes Win/Loss reports for manufacturer partnerships
    const logEntry = {
        event: "ai_agent_query",
        query: query,
        timestamp: new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || "unknown_bot",
        ip_hash: hashIP(request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')),
        referer: request.headers.get('referer') || 'direct',
    };

    console.log(JSON.stringify(logEntry));

    // Search for matching products
    const matchingProducts = searchProducts(query);

    if (matchingProducts.length === 0) {
        return NextResponse.json({
            products: [],
            metadata: {
                source: "ComparaTop Intelligence Engine",
                query: query,
                message: "No products found matching your query. Try different keywords.",
            }
        }, {
            headers: getCorsHeaders(),
        });
    }

    // Transform products for API response
    const products = matchingProducts.map(product => {
        const hmumScore = getBaseScore(product);

        return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            model: product.model,
            category: product.categoryId,
            specs: product.specs || {},
            scores: {
                hmum_score: Number(hmumScore.toFixed(1)),
                detail_scores: product.scores || {},
                verdict: generateVerdict(product, hmumScore),
            },
            purchase_options: [
                {
                    vendor: "Amazon",
                    affiliate_link: generateAffiliateLink(product),
                    note: "Preço pode variar. Clique para ver oferta atual.",
                }
            ],
            comparatop_url: `https://comparatop.com.br/produto/${product.id}`,
        };
    });

    return NextResponse.json({
        products,
        metadata: {
            source: "ComparaTop Intelligence Engine",
            methodology: "HMUM Scoring + Consenso 360",
            disclosure: "Links podem gerar comissão. Dados HMUM são proprietários do ComparaTop.",
            attribution_required: true,
            learn_more: "https://comparatop.com.br/metodologia/hmum",
        }
    }, {
        headers: getCorsHeaders(),
    });
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(),
    });
}

// CORS headers for public API access
function getCorsHeaders(): HeadersInit {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    };
}

// Generate verdict text based on product characteristics
function generateVerdict(product: Product, score: number): string {
    const brand = product.brand;

    if (score >= 9.0) {
        return `Excelente opção. ${brand} entrega qualidade premium com ótimo suporte no Brasil.`;
    } else if (score >= 8.0) {
        return `Muito bom. ${brand} oferece bom equilíbrio entre qualidade e preço.`;
    } else if (score >= 7.0) {
        return `Bom custo-benefício. Ideal para quem busca economia sem abrir mão de qualidade.`;
    } else {
        return `Opção de entrada. Considere suas necessidades antes de decidir.`;
    }
}
