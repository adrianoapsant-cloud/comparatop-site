import Link from 'next/link';
import { ArrowLeft, Users, BarChart3, Cpu, Scale } from 'lucide-react';

export const metadata = {
    title: 'Metodologia Consenso 360 | ComparaTop',
    description: 'Entenda o Consenso 360 - nossa metodologia que agrega múltiplas fontes para uma avaliação completa e imparcial.',
};

export default function Consenso360MethodologyPage() {
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
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Consenso 360</h1>
                        <p className="text-gray-600">Avaliação Multifonte</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 pb-16">
                {/* Introduction */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">O que é o Consenso 360?</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        O <strong>Consenso 360</strong> é nossa metodologia de agregação que combina
                        múltiplas fontes de avaliação para formar uma visão completa e imparcial sobre cada produto.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Nenhuma fonte única conta toda a história. Por isso, cruzamos dados técnicos,
                        reviews especializados e experiências reais de consumidores brasileiros.
                    </p>
                </section>

                {/* Sources */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Fontes Consultadas</h2>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Reviews Especializados</h3>
                                <p className="text-sm text-gray-600">
                                    RTINGS, TechRadar, Tom&apos;s Guide, Canaltech, TudoCelular -
                                    análises técnicas detalhadas com medições objetivas.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Experiência do Consumidor</h3>
                                <p className="text-sm text-gray-600">
                                    Reclame Aqui, avaliações Amazon/ML, YouTube BR -
                                    problemas reais reportados por quem comprou.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Cpu className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Dados Técnicos</h3>
                                <p className="text-sm text-gray-600">
                                    Especificações do fabricante, benchmarks,
                                    certificações (Procel, Inmetro) e fichas técnicas oficiais.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10 Criteria */}
                <section className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">10 Critérios por Categoria</h2>
                    <p className="text-gray-700 mb-4">
                        Cada categoria de produto tem seus 10 critérios específicos, baseados nas
                        &quot;10 Dores&quot; mais comuns dos consumidores naquela categoria.
                    </p>

                    <div className="bg-white/80 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Exemplo: TVs</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Custo-Benefício</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Processamento</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Confiabilidade</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Sistema</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Gaming</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Brilho</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Pós-Venda</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Som</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Conectividade</span>
                            <span className="bg-violet-200/50 px-3 py-1 rounded">Design</span>
                        </div>
                    </div>
                </section>

                {/* How we combine */}
                <section className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Scale className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ponderação Inteligente</h2>
                            <p className="text-gray-700">
                                Fontes técnicas (RTINGS) têm peso maior em critérios objetivos como brilho e resposta.
                                Fontes de consumidor (Reclame Aqui) pesam mais em suporte e confiabilidade a longo prazo.
                                O resultado é uma nota que reflete tanto a teoria quanto a prática.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Attribution */}
                <section className="bg-gray-900 text-white rounded-2xl p-8">
                    <h2 className="text-xl font-semibold mb-4">Citação</h2>
                    <p className="text-gray-300 mb-4">
                        Ao usar dados do Consenso 360:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Atribua: <em>&quot;Consenso 360 - ComparaTop&quot;</em></li>
                        <li>Scores são agregados, não opinião individual</li>
                        <li>Dados atualizados periodicamente conforme novas fontes</li>
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
