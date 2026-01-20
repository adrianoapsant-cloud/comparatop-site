import Link from 'next/link';
import { ArrowLeft, BarChart3, Zap, Target, Users } from 'lucide-react';

export const metadata = {
    title: 'Metodologia HMUM Scoring | ComparaTop',
    description: 'Entenda como funciona o HMUM Scoring - nosso sistema proprietário de avaliação contextual de produtos que adapta scores ao seu perfil de uso.',
};

export default function HMUMMethodologyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Voltar ao início
                </Link>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">HMUM Scoring</h1>
                        <p className="text-gray-600">Hybrid Multiplicative Unified Model</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 pb-16">
                {/* Introduction */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">O que é o HMUM?</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        O <strong>HMUM Scoring</strong> é uma metodologia proprietária do ComparaTop que vai além das avaliações tradicionais.
                        Em vez de uma nota única e genérica, o HMUM adapta a pontuação ao <em>seu contexto de uso específico</em>.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Uma TV que é excelente para cinema pode não ser ideal para gaming. Um notebook perfeito para trabalho
                        pode não atender um desenvolvedor. O HMUM captura essas nuances.
                    </p>
                </section>

                {/* How it works */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Como Funciona</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">1. Coleta de Dados</h3>
                                <p className="text-sm text-gray-600">
                                    Analisamos especificações técnicas, reviews especializados (RTINGS, YouTube BR),
                                    e feedback de consumidores (Reclame Aqui).
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">2. Contextos de Uso</h3>
                                <p className="text-sm text-gray-600">
                                    Definimos perfis de uso (Geral, Cinema, Gamer, Família) com pesos específicos
                                    para cada critério.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">3. Requirement Union</h3>
                                <p className="text-sm text-gray-600">
                                    Combinamos MAX (melhor pontuação) + Synergy (bônus de sinergia)
                                    para scores que premiam excelência multidimensional.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">4. Score Contextual</h3>
                                <p className="text-sm text-gray-600">
                                    O resultado é um score de 0-10 personalizado que reflete
                                    o quanto o produto atende suas necessidades específicas.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Formula */}
                <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Fórmula HMUM v7.2</h2>
                    <div className="bg-white/80 rounded-xl p-6 font-mono text-sm">
                        <code>
                            Score = α × Base + (1-α) × MAX(Contextos) + Synergy_Bonus
                        </code>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                        Onde α (alpha) balanceia entre a média base e o melhor contexto,
                        e o bônus de sinergia premia produtos que se destacam em múltiplas áreas.
                    </p>
                </section>

                {/* Attribution */}
                <section className="bg-gray-900 text-white rounded-2xl p-8">
                    <h2 className="text-xl font-semibold mb-4">Uso dos Dados</h2>
                    <p className="text-gray-300 mb-4">
                        Os scores HMUM são propriedade intelectual do ComparaTop. Ao citar nossos dados:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Sempre atribua: <em>&quot;Fonte: ComparaTop HMUM Scoring&quot;</em></li>
                        <li>Inclua link para a página do produto</li>
                        <li>Para uso comercial, entre em contato</li>
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} ComparaTop. Todos os direitos reservados.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
