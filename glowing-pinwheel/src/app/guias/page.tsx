import Link from 'next/link';
import { FileText, BookOpen, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Guias de Compra | ComparaTop',
    description: 'Guias completos para ajudar você a escolher o melhor produto para suas necessidades.',
};

export default function GuiasPage() {
    const guias = [
        {
            title: 'Como Escolher a Melhor TV',
            description: 'Entenda as diferenças entre OLED, QLED e LED para fazer a escolha certa.',
            category: 'Smart TVs',
            slug: 'como-escolher-tv',
        },
        {
            title: 'Guia de Geladeiras',
            description: 'Frost Free, Inverter, French Door - descubra qual combina com sua casa.',
            category: 'Geladeiras',
            slug: 'guia-geladeiras',
        },
        {
            title: 'Ar Condicionado: BTU Ideal',
            description: 'Calcule a capacidade correta para seu ambiente e economize energia.',
            category: 'Ar Condicionado',
            slug: 'btu-ideal',
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                        <BookOpen size={16} />
                        Conteúdo Editorial
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Guias de Compra
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Conteúdo educativo para ajudar você a fazer escolhas informadas.
                        Em breve teremos guias completos para cada categoria.
                    </p>
                </div>

                {/* Coming Soon Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🚧</span>
                        <div>
                            <h3 className="font-semibold text-amber-800 mb-1">Em Desenvolvimento</h3>
                            <p className="text-sm text-amber-700">
                                Nossa equipe editorial está trabalhando em guias aprofundados.
                                Enquanto isso, explore nossas análises de produtos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Cards */}
                <div className="grid gap-4">
                    {guias.map((guia, idx) => (
                        <div
                            key={idx}
                            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all opacity-75"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {guia.category}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">
                                        {guia.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {guia.description}
                                    </p>
                                </div>
                                <FileText className="text-gray-300 flex-shrink-0" size={24} />
                            </div>
                            <div className="mt-4 text-xs text-gray-400">
                                Em breve
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href="/categorias/smart-tvs"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Explorar Produtos
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </main>
    );
}
