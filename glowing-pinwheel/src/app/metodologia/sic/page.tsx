import Link from 'next/link';
import { ArrowLeft, Cpu, Wrench, Clock, Shield } from 'lucide-react';

export const metadata = {
    title: 'Metodologia SIC | ComparaTop',
    description: 'Conheça o SIC - Sistema de Inteligência de Componentes que calcula vida útil e durabilidade real dos produtos.',
};

export default function SICMethodologyPage() {
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
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">SIC</h1>
                        <p className="text-gray-600">Sistema de Inteligência de Componentes</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 pb-16">
                {/* Introduction */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">O que é o SIC?</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        O <strong>SIC</strong> é nossa metodologia atuarial para calcular a <em>durabilidade real</em> de produtos
                        baseada nos componentes internos. Diferente de garantias genéricas, o SIC analisa cada peça crítica.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Um compressor de geladeira premium tem vida útil diferente de um modelo budget.
                        Um painel OLED degrada diferente de um LCD. O SIC captura essas diferenças técnicas.
                    </p>
                </section>

                {/* What we analyze */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">O que Analisamos</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Cpu className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Componentes Críticos</h3>
                                <p className="text-sm text-gray-600">
                                    Identificamos as peças que mais falham: painéis, compressores, PSUs,
                                    baterias, motores e placas controladoras.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Taxa de Falha L10</h3>
                                <p className="text-sm text-gray-600">
                                    Usamos dados de engenharia de confiabilidade: L10 é o tempo até
                                    10% dos componentes falharem.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Quality Factors (π)</h3>
                                <p className="text-sm text-gray-600">
                                    Multiplicadores por marca (πMarca) e tecnologia (πTech)
                                    diferenciam componentes premium de budget.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Wrench className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Custo de Reparo</h3>
                                <p className="text-sm text-gray-600">
                                    Avaliamos se vale a pena consertar: peças disponíveis,
                                    custo vs. produto novo, facilidade de reparo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Outputs */}
                <section className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Métricas Geradas</h2>

                    <div className="space-y-4">
                        <div className="bg-white/80 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900">VUE (Vida Útil Estimada)</h3>
                            <p className="text-sm text-gray-600">
                                Estimativa em anos de uso normal antes da primeira falha significativa.
                            </p>
                        </div>

                        <div className="bg-white/80 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900">TCO (Custo Total de Propriedade)</h3>
                            <p className="text-sm text-gray-600">
                                Preço de compra + energia + manutenção ao longo de 5 anos de uso.
                            </p>
                        </div>

                        <div className="bg-white/80 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900">Índice de Reparabilidade</h3>
                            <p className="text-sm text-gray-600">
                                Score de 0-10 baseado na metodologia francesa de reparabilidade:
                                disponibilidade de peças, documentação, design modular.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Attribution */}
                <section className="bg-gray-900 text-white rounded-2xl p-8">
                    <h2 className="text-xl font-semibold mb-4">Uso dos Dados SIC</h2>
                    <p className="text-gray-300 mb-4">
                        As análises SIC são propriedade intelectual do ComparaTop. Ao citar:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Atribua: <em>&quot;Análise SIC - ComparaTop&quot;</em></li>
                        <li>Inclua link para a página do produto</li>
                        <li>Dados de componentes são estimativas baseadas em engenharia</li>
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
