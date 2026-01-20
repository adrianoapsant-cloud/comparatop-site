import { notFound } from 'next/navigation';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { getProductById, ALL_PRODUCTS } from '@/data/products';
import type { Metadata } from 'next';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all products
export async function generateStaticParams() {
    return ALL_PRODUCTS.map((product) => ({
        slug: product.id,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductById(slug);

    if (!product) {
        return { title: 'Produto não encontrado | ComparaTop' };
    }

    return {
        title: `${product.name} | Análise Completa | ComparaTop`,
        description: product.benefitSubtitle || `Análise editorial completa do ${product.name}. Compare preços, especificações e veja se vale a pena.`,
        openGraph: {
            title: product.name,
            description: product.benefitSubtitle,
            images: product.imageUrl ? [product.imageUrl] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = getProductById(slug);

    if (!product) {
        notFound();
    }

    return <ProductDetailPage product={product} />;
}
