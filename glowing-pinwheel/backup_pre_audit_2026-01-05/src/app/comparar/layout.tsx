import { Metadata } from 'next';

/**
 * /comparar route metadata
 * 
 * SEO Strategy:
 * - noindex, follow for 3+ product comparisons (CSR tool)
 * - This prevents "thin content" penalties while allowing crawlers to follow links
 */
export const metadata: Metadata = {
    title: 'Comparar Produtos | ComparaTop',
    description: 'Ferramenta de comparação de produtos. Selecione 2 ou mais produtos para comparar especificações e preços.',
    robots: {
        index: false,  // NOINDEX - tool page, not content
        follow: true,  // Follow links to product pages
    },
};

export default function CompararLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
