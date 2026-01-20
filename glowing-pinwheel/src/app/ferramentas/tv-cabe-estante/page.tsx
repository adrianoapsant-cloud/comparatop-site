import { Metadata } from 'next';
import { TransparencyHeader } from '@/components/TransparencyHeader';
import { GeometryEngine } from '@/components/engines/GeometryEngine';
import { TV_CABE_ESTANTE } from '@/lib/tools-config';

export const metadata: Metadata = {
    title: 'A TV cabe na estante? - Calculadora de Dimensões | ComparaTop',
    description: 'Verifique se sua TV vai caber no rack ou estante. Calculadora visual gratuita.',
};

export default function TVCabeEstantePage() {
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
                        <span className="text-text-primary">A TV cabe na estante?</span>
                    </nav>

                    {/* Calculator */}
                    <GeometryEngine config={TV_CABE_ESTANTE} />

                    {/* Educational Content */}
                    <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                            📏 Dicas para medir sua TV
                        </h2>
                        <div className="prose prose-sm text-text-secondary">
                            <p>
                                A medida em polegadas da TV (55", 65", etc.) refere-se à <strong>diagonal da tela</strong>,
                                não à largura total. Além disso, as bordas e a base podem adicionar alguns centímetros.
                            </p>
                            <h3 className="text-text-primary font-semibold mt-4 mb-2">Tamanhos comuns:</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                <li><strong>50":</strong> ~112 x 65 cm</li>
                                <li><strong>55":</strong> ~124 x 72 cm</li>
                                <li><strong>65":</strong> ~145 x 84 cm</li>
                                <li><strong>75":</strong> ~168 x 97 cm</li>
                            </ul>
                            <p className="mt-4 text-xs text-text-muted">
                                * Dimensões aproximadas. Consulte as especificações exatas do fabricante.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
