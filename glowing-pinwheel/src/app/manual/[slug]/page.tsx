import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, ExternalLink, Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductById } from '@/data/products';
import { getManualData, hasDirectPdfDownload } from '@/lib/manual-urls';

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductById(slug);

    if (!product) {
        return { title: 'Manual não encontrado' };
    }

    return {
        title: `Manual ${product.name} | Download PDF | ComparaTop`,
        description: `Baixe o manual do usuário ${product.name}. Guia completo de instalação, uso e solução de problemas. PDF gratuito.`,
        openGraph: {
            title: `Manual ${product.name} - PDF`,
            description: `Manual do usuário e guia de instalação para ${product.name}`,
            type: 'article',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
    // For now, return empty - will be generated on demand
    return [];
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function ManualPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = getProductById(slug);

    if (!product) {
        notFound();
    }

    // Get real manual data from manufacturer mapping
    const manualInfo = getManualData(slug, product.brand);
    const hasPdf = hasDirectPdfDownload(slug);

    // Category-specific manual topics
    const getManualTopics = (categoryId: string) => {
        switch (categoryId) {
            case 'robot-vacuum':
                return [
                    'Instalação e Configuração Inicial',
                    'Conexão com Wi-Fi e Aplicativo',
                    'Mapeamento e Zonas de Limpeza',
                    'Manutenção e Limpeza de Escovas',
                    'Solução de Problemas',
                    'Especificações Técnicas',
                    'Informações de Garantia',
                ];
            case 'tv':
                return [
                    'Instalação e Configuração Inicial',
                    'Conectividade (HDMI, USB, Wi-Fi)',
                    'Ajustes de Imagem e Som',
                    'Aplicativos e Smart Features',
                    'Solução de Problemas',
                    'Especificações Técnicas',
                    'Informações de Garantia',
                ];
            case 'smartwatch':
                return [
                    'Instalação e Pareamento',
                    'Configuração do Aplicativo',
                    'Monitoramento de Saúde',
                    'Personalização de Mostradores',
                    'Solução de Problemas',
                    'Especificações Técnicas',
                    'Informações de Garantia',
                ];
            default:
                return [
                    'Instalação e Configuração Inicial',
                    'Guia de Uso',
                    'Funcionalidades Principais',
                    'Manutenção e Cuidados',
                    'Solução de Problemas',
                    'Especificações Técnicas',
                    'Informações de Garantia',
                ];
        }
    };

    // SIMPLIFIED: Use product.manualUrl directly if available, else fallback to MANUAL_DATA
    const pdfUrl = product.manualUrl || manualInfo.pdfUrl;

    const manualData = {
        pdfUrl,
        supportUrl: pdfUrl || manualInfo.supportUrl, // If we have PDF, use it as the "support" link too
        language: manualInfo.language || 'Português (Brasil)',
        pages: manualInfo.pages,
        fileSize: manualInfo.fileSize,
        lastUpdated: manualInfo.lastUpdated || '2024',
        topics: getManualTopics(product.categoryId),
    };

    return (
        <div className="min-h-screen bg-bg-ground">
            {/* Breadcrumb */}
            <div className="max-w-5xl mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-text-muted">
                    <Link href="/" className="hover:text-brand-core">Início</Link>
                    <span>/</span>
                    <Link href={`/produto/${product.id}`} className="hover:text-brand-core">
                        {product.shortName || product.name}
                    </Link>
                    <span>/</span>
                    <span className="text-text-primary">Manual</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Manual Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <header>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FileText size={32} className="text-red-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-text-primary">
                                        Manual {product.shortName || product.name}
                                    </h1>
                                    <p className="text-text-muted mt-1">
                                        Manual do Usuário em {manualData.language}
                                    </p>
                                </div>
                            </div>
                        </header>

                        {/* Manual Details */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-semibold text-text-primary mb-4">
                                📄 Informações do Documento
                            </h2>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-text-muted">Idioma</dt>
                                    <dd className="font-medium text-text-primary">{manualData.language}</dd>
                                </div>
                                {manualData.pages && (
                                    <div>
                                        <dt className="text-text-muted">Páginas</dt>
                                        <dd className="font-medium text-text-primary">{manualData.pages}</dd>
                                    </div>
                                )}
                                {manualData.fileSize && (
                                    <div>
                                        <dt className="text-text-muted">Tamanho</dt>
                                        <dd className="font-medium text-text-primary">{manualData.fileSize}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-text-muted">Atualizado</dt>
                                    <dd className="font-medium text-text-primary">{manualData.lastUpdated}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Table of Contents */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-semibold text-text-primary mb-4">
                                📚 Conteúdo do Manual
                            </h2>
                            <ul className="space-y-2">
                                {manualData.topics.map((topic, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-text-muted">
                                            {idx + 1}
                                        </span>
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Download Options */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                            <h2 className="font-semibold text-text-primary mb-4">
                                📥 Download do Manual
                            </h2>

                            {/* Direct PDF Download (if available) */}
                            {manualData.pdfUrl && (
                                <a
                                    href={manualData.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
                                        'bg-brand-core hover:bg-brand-core/90',
                                        'text-white font-semibold transition-colors'
                                    )}
                                >
                                    <Download size={18} />
                                    Baixar Manual PDF
                                </a>
                            )}

                            <p className="text-xs text-text-muted text-center">
                                🔒 Link seguro para o manual oficial do fabricante
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-text-muted italic">
                            Este manual é fornecido pelo fabricante para fins informativos.
                            O ComparaTop não se responsabiliza pelo conteúdo. Para suporte oficial,
                            contate o fabricante. Se você é o detentor dos direitos autorais e
                            deseja remover este conteúdo, entre em contato conosco.
                        </p>
                    </div>

                    {/* Right Column - Cross-Sell Sidebar */}
                    <aside className="space-y-6">
                        {/* Product Card - Link back to review */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg p-2">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary text-sm">
                                        {product.shortName || product.name}
                                    </h3>
                                    <p className="text-xs text-text-muted">
                                        {product.brand}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Link
                                    href={`/produto/${product.id}`}
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg',
                                        'bg-brand-core hover:bg-brand-core/90',
                                        'text-white font-semibold text-sm transition-colors'
                                    )}
                                >
                                    <Star size={16} />
                                    Ver Análise Completa
                                </Link>
                                <a
                                    href={(() => {
                                        // Use affiliate URL from Amazon offer if available, else fallback to first offer
                                        const amazonOffer = product.offers?.find(o =>
                                            o.storeSlug === 'amazon' || o.store?.toLowerCase() === 'amazon'
                                        );
                                        return amazonOffer?.affiliateUrl ||
                                            amazonOffer?.url ||
                                            product.offers?.[0]?.affiliateUrl ||
                                            product.offers?.[0]?.url ||
                                            `https://amazon.com.br/s?k=${encodeURIComponent(product.name)}&tag=aferio-20`;
                                    })()}
                                    target="_blank"
                                    rel="nofollow sponsored noopener noreferrer"
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg',
                                        'bg-[#FF9900] hover:bg-[#E8890A]',
                                        'text-white font-semibold text-sm transition-colors'
                                    )}
                                >
                                    <ShoppingCart size={16} />
                                    Verificar Preço Atual
                                </a>
                                <Link
                                    href={`/comparar?ids=${product.id}`}
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
                                        'border border-gray-200 text-gray-600',
                                        'hover:border-brand-core hover:text-brand-core hover:bg-brand-core/5',
                                        'font-medium text-sm transition-colors'
                                    )}
                                >
                                    + Adicionar à Comparação
                                </Link>
                            </div>
                        </div>

                        {/* Cross-Sell: Accessories */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h3 className="font-semibold text-amber-900 mb-2 text-sm">
                                🔧 Precisa de peças de reposição?
                            </h3>
                            <p className="text-xs text-amber-800 mb-3">
                                Controle remoto, cabos ou acessórios compatíveis.
                            </p>
                            <a
                                href={
                                    product.recommendedAccessory?.affiliateUrl ||
                                    `https://amazon.com.br/s?k=${encodeURIComponent(`${product.brand} acessorios`)}&tag=aferio-20`
                                }
                                target="_blank"
                                rel="nofollow sponsored noopener noreferrer"
                                className={cn(
                                    'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
                                    'border border-amber-400 bg-white hover:bg-amber-100',
                                    'text-amber-800 font-semibold text-xs transition-colors'
                                )}
                            >
                                <ExternalLink size={14} />
                                Ver Acessórios
                            </a>
                        </div>

                        {/* Upgrade Suggestion */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h3 className="font-semibold text-blue-900 mb-2 text-sm">
                                ✨ Hora de um upgrade?
                            </h3>
                            <p className="text-xs text-blue-800 mb-3">
                                Conheça modelos mais recentes com tecnologias aprimoradas.
                            </p>
                            <Link
                                href={`/categorias/${product.categoryId === 'robot-vacuum' ? 'aspiradores' : product.categoryId}`}
                                className={cn(
                                    'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
                                    'border border-blue-400 bg-white hover:bg-blue-100',
                                    'text-blue-800 font-semibold text-xs transition-colors'
                                )}
                            >
                                Ver Alternativas
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
