import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export const metadata = {
    title: 'Contato | ComparaTop',
    description: 'Entre em contato com a equipe do ComparaTop.',
};

export default function ContatoPage() {
    const canais = [
        {
            icon: Mail,
            title: 'Email Geral',
            description: 'Para dúvidas, sugestões ou parcerias',
            contato: 'contato@comparatop.com.br',
            href: 'mailto:contato@comparatop.com.br',
        },
        {
            icon: MessageCircle,
            title: 'Imprensa',
            description: 'Solicitações de entrevistas ou dados',
            contato: 'imprensa@comparatop.com.br',
            href: 'mailto:imprensa@comparatop.com.br',
        },
        {
            icon: HelpCircle,
            title: 'Suporte',
            description: 'Problemas técnicos ou dúvidas sobre análises',
            contato: 'suporte@comparatop.com.br',
            href: 'mailto:suporte@comparatop.com.br',
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Entre em Contato
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Estamos sempre abertos para ouvir você. Escolha o melhor canal
                        para sua necessidade.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {canais.map((canal, idx) => (
                        <a
                            key={idx}
                            href={canal.href}
                            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all text-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <canal.icon className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {canal.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                                {canal.description}
                            </p>
                            <span className="text-blue-600 text-sm font-medium">
                                {canal.contato}
                            </span>
                        </a>
                    ))}
                </div>

                {/* Response Time */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Tempo médio de resposta: 1-2 dias úteis
                </div>

                {/* FAQ Link */}
                <div className="mt-8 bg-gray-100 rounded-xl p-6 text-center">
                    <p className="text-gray-600 mb-2">
                        Antes de entrar em contato, confira se sua dúvida já foi respondida:
                    </p>
                    <a href="/metodologia" className="text-blue-600 font-medium hover:underline">
                        Ver Metodologia e FAQ →
                    </a>
                </div>
            </div>
        </main>
    );
}
