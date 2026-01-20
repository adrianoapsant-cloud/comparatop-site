import Link from 'next/link';
import { Calculator, Ruler, Wind, ArrowRight, Tv } from 'lucide-react';

export const metadata = {
    title: 'Ferramentas Interativas | ComparaTop',
    description: 'Calculadoras e simuladores para ajudar você a escolher o produto ideal.',
};

export default function FerramentasPage() {
    const ferramentas = [
        {
            icon: Wind,
            title: 'Calculadora de BTU',
            description: 'Calcule a capacidade ideal do ar condicionado para seu ambiente.',
            href: '/ferramentas/calculadora-btu',
            available: true,
        },
        {
            icon: Tv,
            title: 'TV Cabe na Estante?',
            description: 'Verifique se a TV que você quer cabe no seu móvel.',
            href: '/ferramentas/tv-cabe-estante',
            available: true,
        },
        {
            icon: Ruler,
            title: 'Geladeira Passa na Porta?',
            description: 'Simule se a geladeira passará pela porta da sua casa.',
            href: '/ferramentas/geladeira-passa-porta',
            available: true,
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                        <Calculator size={16} />
                        Ferramentas
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ferramentas Interativas
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Calculadoras e simuladores para ajudar você a fazer a escolha certa
                        antes de comprar.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ferramentas.map((tool, idx) => (
                        <Link
                            key={idx}
                            href={tool.href}
                            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all"
                        >
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                                <tool.icon className="text-emerald-600" size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                {tool.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {tool.description}
                            </p>
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                Usar ferramenta
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>

                {/* More Coming */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Mais ferramentas em breve!
                </div>
            </div>
        </main>
    );
}
