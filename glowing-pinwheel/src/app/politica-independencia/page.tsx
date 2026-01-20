import Link from 'next/link';
import { Shield, ExternalLink, CheckCircle } from 'lucide-react';

export const metadata = {
    title: 'Política de Independência | ComparaTop',
    description: 'Entenda como mantemos nossa independência editorial e evitamos conflitos de interesse.',
};

export default function PoliticaIndependenciaPage() {
    const principios = [
        {
            title: 'Sem Influência de Fabricantes',
            description: 'Nenhum fabricante pode pagar para melhorar ou piorar uma avaliação. Nossas notas são baseadas apenas em critérios técnicos.',
        },
        {
            title: 'Transparência em Links',
            description: 'Quando você clica em um link de compra, podemos receber comissão. Isso não afeta nossas avaliações - apenas nos ajuda a manter o site gratuito.',
        },
        {
            title: 'Metodologia Pública',
            description: 'Nossa metodologia de avaliação é aberta e documentada. Qualquer pessoa pode entender como chegamos às nossas notas.',
        },
        {
            title: 'Equipe Editorial Separada',
            description: 'Nossa equipe que faz as análises é diferente da equipe comercial. Isso garante que decisões de negócio não afetem o conteúdo.',
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
                        <Shield size={16} />
                        Transparência
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Política de Independência
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sua confiança é nossa prioridade. Entenda como mantemos
                        nossas análises livres de conflitos de interesse.
                    </p>
                </div>

                {/* Commitment Box */}
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-violet-800 mb-2">Nosso Compromisso</h3>
                    <p className="text-violet-700">
                        O ComparaTop existe para ajudar você a fazer melhores escolhas de compra.
                        Para isso, mantemos rigorosos padrões de independência editorial que
                        garantem que nossas recomendações sejam baseadas apenas no que é melhor para você.
                    </p>
                </div>

                {/* Principles */}
                <div className="space-y-4">
                    {principios.map((principio, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-xl p-6"
                        >
                            <div className="flex items-start gap-4">
                                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {principio.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {principio.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Links */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/como-somos-financiados"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Como Somos Financiados
                        <ExternalLink size={14} />
                    </Link>
                    <Link
                        href="/metodologia"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Nossa Metodologia
                        <ExternalLink size={14} />
                    </Link>
                </div>
            </div>
        </main>
    );
}
