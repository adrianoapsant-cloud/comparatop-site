import Link from 'next/link';
import { ExternalLink, BookOpen, Youtube, Star, MessageSquare } from 'lucide-react';

export const metadata = {
    title: 'Nossas Fontes | ComparaTop',
    description: 'Conheça as fontes de dados que utilizamos para criar nossas análises imparciais.',
};

export default function FontesPage() {
    const fontes = [
        {
            icon: Star,
            name: 'RTINGS.com',
            description: 'Referência mundial em testes objetivos de TVs, monitores e fones.',
            url: 'https://rtings.com',
            tipo: 'Testes Técnicos',
        },
        {
            icon: Youtube,
            name: 'Canais BR',
            description: 'Tecnoblog, Canaltech, TecMundo e criadores especializados do Brasil.',
            url: 'https://youtube.com',
            tipo: 'Reviews',
        },
        {
            icon: MessageSquare,
            name: 'Reclame Aqui',
            description: 'Análise de pós-venda e satisfação real dos consumidores brasileiros.',
            url: 'https://reclameaqui.com.br',
            tipo: 'Voz do Consumidor',
        },
        {
            icon: BookOpen,
            name: 'Manuais Oficiais',
            description: 'Especificações técnicas direto dos fabricantes.',
            url: '#',
            tipo: 'Especificações',
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Nossas Fontes
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Transparência é fundamental. Conheça as fontes que utilizamos
                        para construir nossas análises e recomendações.
                    </p>
                </div>

                {/* Methodology Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-blue-800 mb-2">Metodologia Consenso 360º</h3>
                    <p className="text-sm text-blue-700">
                        Nossa metodologia cruza dados de múltiplas fontes para criar uma análise
                        equilibrada. Não dependemos de uma única opinião - buscamos o consenso.
                    </p>
                    <Link
                        href="/metodologia"
                        className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium mt-3 hover:underline"
                    >
                        Saiba mais sobre nossa metodologia
                        <ExternalLink size={14} />
                    </Link>
                </div>

                {/* Sources Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {fontes.map((fonte, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-xl p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <fonte.icon className="text-gray-600" size={20} />
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500">
                                        {fonte.tipo}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {fonte.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {fonte.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 text-center">
                    As análises do ComparaTop são editorialmente independentes.
                    Fontes são consultadas para informação, não para aprovação.
                </div>
            </div>
        </main>
    );
}
