import { Metadata } from 'next';
import { TransparencyHeader } from '@/components/TransparencyHeader';
import { RateEngine } from '@/components/engines/RateEngine';
import { CALCULADORA_BTU } from '@/lib/tools-config';

export const metadata: Metadata = {
    title: 'Calculadora de BTU - Ar Condicionado | ComparaTop',
    description: 'Descubra quantos BTUs seu ambiente precisa. Calculadora gratuita para dimensionar seu ar-condicionado corretamente.',
};

export default function CalculadoraBTUPage() {
    return (
        <>
            <TransparencyHeader />

            <div className="min-h-screen bg-bg-ground py-8">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-text-muted mb-6">
                        <a href="/" className="hover:text-brand-core">Início</a>
                        <span className="mx-2">›</span>
                        <a href="/ferramentas" className="hover:text-brand-core">Ferramentas</a>
                        <span className="mx-2">›</span>
                        <span className="text-text-primary">Calculadora de BTU</span>
                    </nav>

                    {/* Calculator */}
                    <RateEngine config={CALCULADORA_BTU} />

                    {/* Educational Content */}
                    <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                            📚 Como funciona o cálculo de BTU?
                        </h2>
                        <div className="prose prose-sm text-text-secondary">
                            <p>
                                BTU (British Thermal Unit) é a unidade que mede a capacidade de refrigeração
                                de um ar-condicionado. A regra básica é <strong>600 BTU por metro quadrado</strong>,
                                mas fatores como exposição solar, número de pessoas e equipamentos eletrônicos
                                aumentam essa necessidade.
                            </p>
                            <h3 className="text-text-primary font-semibold mt-4 mb-2">Fatores que aumentam o BTU:</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                <li><strong>Sol da tarde:</strong> +800 BTU (o lado oeste recebe mais calor)</li>
                                <li><strong>Cada pessoa:</strong> +600 BTU (calor corporal)</li>
                                <li><strong>Eletrônicos:</strong> +600 BTU (computadores, TVs geram calor)</li>
                                <li><strong>Último andar:</strong> +1000 BTU (sem isolamento do teto)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Related Tools */}
                    <section className="mt-6 grid grid-cols-2 gap-4">
                        <a
                            href="/ferramentas/tv-cabe-estante"
                            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-core hover:shadow-lg transition-all"
                        >
                            <div className="text-2xl mb-2">📺</div>
                            <h3 className="font-semibold text-text-primary text-sm">A TV cabe na estante?</h3>
                            <p className="text-xs text-text-muted">Verifique dimensões</p>
                        </a>
                        <a
                            href="/ferramentas/geladeira-passa-porta"
                            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-core hover:shadow-lg transition-all"
                        >
                            <div className="text-2xl mb-2">🧊</div>
                            <h3 className="font-semibold text-text-primary text-sm">A geladeira passa na porta?</h3>
                            <p className="text-xs text-text-muted">Verifique dimensões</p>
                        </a>
                    </section>
                </div>
            </div>
        </>
    );
}
