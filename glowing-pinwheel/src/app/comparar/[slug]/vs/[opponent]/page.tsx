import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/data/products';
import { buildComparisonRows } from '@/components/compare/ComparisonTable';
import { ComparisonTableClient } from '@/components/compare/ComparisonTableClient';
import { formatCurrencyValue } from '@/lib/formatters';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';

interface PageProps {
    params: Promise<{
        slug: string;
        opponent: string;
    }>;
}

/**
 * Get raw product data directly from products.ts
 * Simple direct access - no transformations, all fields preserved
 */
function getRawProduct(slug: string) {
    return ALL_PRODUCTS.find(p => p.id === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug: leftSlug, opponent: rightSlug } = await params;
    const leftProduct = getRawProduct(leftSlug);
    const rightProduct = getRawProduct(rightSlug);

    if (!leftProduct || !rightProduct) {
        return { title: 'Comparativo não encontrado' };
    }

    const leftName = leftProduct.shortName || leftProduct.name;
    const rightName = rightProduct.shortName || rightProduct.name;

    return {
        title: `${leftName} vs ${rightName} | Comparativo ComparaTop`,
        description: `Compare ${leftName} e ${rightName} lado a lado. Veja notas, TCO, confiança e especificações.`,
    };
}

export default async function ComparisonPage({ params }: PageProps) {
    const { slug: leftSlug, opponent: rightSlug } = await params;

    // Get raw products directly (no transformation)
    const leftProduct = getRawProduct(leftSlug);
    const rightProduct = getRawProduct(rightSlug);

    if (!leftProduct || !rightProduct) {
        notFound();
    }

    // Extract names
    const leftName = leftProduct.shortName || leftProduct.name;
    const rightName = rightProduct.shortName || rightProduct.name;

    // Calculate scores directly from raw product scores
    const leftScore = getUnifiedScore(leftProduct as any);
    const rightScore = getUnifiedScore(rightProduct as any);

    // Format prices
    const leftPrice = formatCurrencyValue(leftProduct.price);
    const rightPrice = formatCurrencyValue(rightProduct.price);

    // Build comparison rows with raw product data
    const rows = buildComparisonRows(leftProduct as any, rightProduct as any);

    return (
        <main className="ct-container py-8 bg-ct-bg min-h-screen pb-24 md:pb-8">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Comparativo: {leftName} vs {rightName}
                </h1>
                <p className="text-gray-600">
                    Análise lado a lado de nota, custo real e confiança
                </p>
            </header>

            {/* Comparison Table */}
            <ComparisonTableClient
                rows={rows}
                leftName={leftName}
                rightName={rightName}
                leftSlug={leftSlug}
                rightSlug={rightSlug}
                leftScore={leftScore}
                rightScore={rightScore}
                leftPrice={leftPrice}
                rightPrice={rightPrice}
            />
        </main>
    );
}
