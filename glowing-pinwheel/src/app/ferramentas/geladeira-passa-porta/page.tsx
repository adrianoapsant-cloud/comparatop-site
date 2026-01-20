import { Metadata } from 'next';
import { TransparencyHeader } from '@/components/TransparencyHeader';
import { GeometryEngine } from '@/components/engines/GeometryEngine';
import { GELADEIRA_PASSA_PORTA } from '@/lib/tools-config';

export const metadata: Metadata = {
    title: 'A geladeira passa na porta? - Calculadora de Dimensões | ComparaTop',
    description: 'Verifique se sua geladeira vai passar pela porta ou corredor. Calculadora visual gratuita.',
};

export default function GeladeiraPassaPortaPage() {
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
                        <span className="text-text-primary">A geladeira passa na porta?</span>
                    </nav>

                    {/* Calculator */}
                    <GeometryEngine config={GELADEIRA_PASSA_PORTA} />

                    {/* Educational Content */}
                    <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                            🚪 Dicas para passar a geladeira
                        </h2>
                        <div className="prose prose-sm text-text-secondary">
                            <p>
                                Além da largura da porta, considere que você precisa de espaço para <strong>manobrar</strong>
                                a geladeira. Recomendamos no mínimo 5cm de folga.
                            </p>
                            <h3 className="text-text-primary font-semibold mt-4 mb-2">Truques úteis:</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Remova as portas da geladeira (a maioria é removível)</li>
                                <li>Remova os pés ajustáveis para reduzir altura</li>
                                <li>Incline levemente se a altura estiver justa</li>
                                <li>Meça também largura do corredor se houver curvas</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
