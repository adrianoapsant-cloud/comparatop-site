import { Metadata } from 'next';
import { ComparisonEngine } from '@/components/engines/ComparisonEngine';
import { OLED_VS_LED, HDR_COMPARISON, SOUNDBAR_VS_TV, ANC_HEADPHONES } from '@/lib/tools-config';
import { TransparencyHeader } from '@/components/TransparencyHeader';

export const metadata: Metadata = {
    title: 'Comparadores Interativos | ComparaTop',
    description: 'Compare qualidade de imagem OLED vs LED, som de soundbar vs TV, e mais simulações interativas.',
};

export default function ComparadoresPage() {
    return (
        <>
            <TransparencyHeader />
            <main className="min-h-screen bg-bg-ground py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            🎯 Comparadores Interativos
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Sinta a diferença antes de comprar. Use os controles para alternar
                            entre as opções e perceber a qualidade real dos produtos.
                        </p>
                    </div>

                    {/* Comparators Grid */}
                    <div className="space-y-12">
                        {/* Image Comparisons */}
                        <section>
                            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <span>🖥️</span>
                                Comparadores de Imagem
                            </h2>
                            <div className="grid gap-8">
                                <ComparisonEngine config={OLED_VS_LED} />
                                <ComparisonEngine config={HDR_COMPARISON} />
                            </div>
                        </section>

                        {/* Audio Comparisons - Temporarily disabled until audio files are available */}
                        <section className="opacity-60">
                            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <span>🎧</span>
                                Comparadores de Áudio
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 ml-2">Em breve</span>
                            </h2>
                            <div className="p-8 bg-gray-100 rounded-xl text-center">
                                <p className="text-text-muted">
                                    Os comparadores de áudio estarão disponíveis em breve.
                                    Estamos preparando samples de alta qualidade para você sentir a diferença.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Info */}
                    <div className="mt-12 p-6 bg-gray-100 rounded-xl text-center">
                        <p className="text-sm text-text-muted">
                            As simulações são aproximações para fins educacionais.
                            A experiência real pode variar de acordo com seu equipamento.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
