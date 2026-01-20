import { Metadata } from 'next';
import { LogicEngine } from '@/components/engines/LogicEngine';
import { QuizEngine } from '@/components/engines/QuizEngine';
import { CPU_MOTHERBOARD_COMPATIBILITY, QUIZ_COLCHAO_IDEAL } from '@/lib/tools-config';
import { TransparencyHeader } from '@/components/TransparencyHeader';

export const metadata: Metadata = {
    title: 'Ferramentas de Decisão | ComparaTop',
    description: 'Verificadores de compatibilidade e quizzes para descobrir o produto ideal para você.',
};

export default function DecisaoPage() {
    return (
        <>
            <TransparencyHeader />
            <main className="min-h-screen bg-bg-ground py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            🧠 Ferramentas de Decisão
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Ferramentas inteligentes para ajudar você a fazer a melhor escolha.
                            Verifique compatibilidade ou descubra seu perfil ideal.
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <div className="space-y-12">
                        {/* Logic Engine - Compatibility */}
                        <section>
                            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <span>⚙️</span>
                                Verificador de Compatibilidade
                            </h2>
                            <LogicEngine config={CPU_MOTHERBOARD_COMPATIBILITY} />
                        </section>

                        {/* Quiz Engine */}
                        <section>
                            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <span>🎯</span>
                                Quiz de Recomendação
                            </h2>
                            <QuizEngine config={QUIZ_COLCHAO_IDEAL} />
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
