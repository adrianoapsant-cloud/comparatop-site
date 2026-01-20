import Link from 'next/link';
import { DollarSign, Shield, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Como Somos Financiados | ComparaTop',
    description: 'Transparência total sobre como o ComparaTop gera receita e se mantém gratuito.',
};

export default function ComoSomosFinanciadosPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                        <DollarSign size={16} />
                        Transparência Financeira
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Como Somos Financiados
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        O ComparaTop é 100% gratuito para você. Veja como mantemos
                        o site funcionando sem comprometer nossa independência.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Affiliate Links */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            💰 Links de Afiliado
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Quando você clica em um link de compra e finaliza a compra em lojas
                            como Amazon, Magazine Luiza ou Mercado Livre, recebemos uma pequena
                            comissão. Isso não aumenta o preço para você - é a loja que nos paga.
                        </p>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <p className="text-emerald-800 text-sm font-medium">
                                ✓ O preço é o mesmo com ou sem nosso link
                            </p>
                        </div>
                    </div>

                    {/* What We Don't Do */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            🚫 O Que NÃO Fazemos
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✕</span>
                                Não aceitamos pagamento de fabricantes para alterar notas
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✕</span>
                                Não priorizamos produtos por comissão maior
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✕</span>
                                Não vendemos seus dados pessoais
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✕</span>
                                Não cobramos assinatura ou mensalidade
                            </li>
                        </ul>
                    </div>

                    {/* Our Commitment */}
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <Shield className="text-violet-600 flex-shrink-0" size={24} />
                            <div>
                                <h3 className="font-semibold text-violet-800 mb-2">
                                    Nosso Compromisso
                                </h3>
                                <p className="text-violet-700">
                                    A equipe editorial é completamente independente da equipe comercial.
                                    As análises são feitas antes de qualquer consideração sobre links ou comissões.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <Link
                        href="/politica-independencia"
                        className="inline-flex items-center gap-2 text-violet-600 font-medium hover:underline"
                    >
                        Ver Política de Independência Completa
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </main>
    );
}
