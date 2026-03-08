import type { Metadata } from 'next';
import Link from 'next/link';

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
    title: 'Auditoria de Sobrevivência 360™ | Metodologia | ComparaTop',
    description: 'Por que nossa nota é a única calibrada para a realidade do Brasil. Entenda o Paradoxo da Praia e como avaliamos produtos com contexto.',
};

// ============================================
// FUNNEL STEP COMPONENT
// ============================================

function FunnelStep({
    icon,
    title,
    description,
    color,
    isLast = false
}: {
    icon: string;
    title: string;
    description: string;
    color: string;
    isLast?: boolean;
}) {
    return (
        <div className="flex flex-col items-center">
            <div
                className="w-full max-w-md p-6 rounded-2xl border-2 shadow-lg"
                style={{
                    borderColor: color,
                    background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`
                }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-4xl">{icon}</span>
                    <div>
                        <h3 className="font-display font-bold text-lg text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
            </div>
            {!isLast && (
                <div className="flex flex-col items-center py-2">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-400" />
                    <span className="text-2xl">▼</span>
                </div>
            )}
        </div>
    );
}

// ============================================
// PENALTY CARD COMPONENT
// ============================================

function PenaltyCard({
    category,
    rule,
    penalty,
    context,
    severity
}: {
    category: string;
    rule: string;
    penalty: string;
    context: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}) {
    const severityColors = {
        low: 'bg-gray-100 text-gray-700',
        medium: 'bg-orange-100 text-orange-700',
        high: 'bg-red-100 text-red-700',
        critical: 'bg-purple-100 text-purple-700',
    };

    const severityLabels = {
        low: 'Leve',
        medium: 'Moderada',
        high: 'Alta',
        critical: 'CRÍTICA',
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{category}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${severityColors[severity]}`}>
                    {severityLabels[severity]}
                </span>
            </div>
            <p className="font-medium text-gray-800 mb-2">{rule}</p>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Contexto: {context}</span>
                <span className="font-bold text-red-600">{penalty}</span>
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function MetodologiaPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-4xl mx-auto text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
                        <span className="text-xl">🧪</span>
                        <span className="text-sm font-medium">Metodologia Exclusiva ComparaTop</span>
                    </div>

                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Auditoria de Sobrevivência 360™
                    </h1>

                    <p className="text-lg md:text-xl text-violet-100 max-w-2xl mx-auto mb-8">
                        Por que nossa nota é a única <strong className="text-white">calibrada para a realidade do Brasil</strong> —
                        Calor, Logística e Custo-Energia.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/lab"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-semibold rounded-full hover:bg-violet-50 transition-colors"
                        >
                            🧪 Ver o Lab em Ação
                        </Link>
                        <Link
                            href="/fontes"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500/30 text-white font-semibold rounded-full hover:bg-violet-500/50 transition-colors"
                        >
                            📊 Nossas 9 Fontes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Links to Detailed Methodologies */}
            <section className="py-8 px-4 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/metodologia"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary/20 transition-colors"
                        >
                            📊 Scoring Unificado
                        </Link>
                        <Link
                            href="/metodologia/sic"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-700 font-medium rounded-full hover:bg-emerald-200 transition-colors"
                        >
                            🔧 SIC - Componentes
                        </Link>
                        <Link
                            href="/metodologia/consenso-360"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-100 text-violet-700 font-medium rounded-full hover:bg-violet-200 transition-colors"
                        >
                            🎯 Consenso 360
                        </Link>
                    </div>
                </div>
            </section>

            {/* O Funil de Realidade */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">
                            O Funil de Realidade™
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Toda nota começa em 10. Depois, passa pelos filtros da realidade brasileira.
                            O que sobra é a nota que <em>realmente importa</em>.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <FunnelStep
                            icon="📋"
                            title="SPECS DE FÁBRICA"
                            description="Nota marketing do fabricante. Todos começam em 10."
                            color="#6366f1"
                        />

                        <FunnelStep
                            icon="❄️"
                            title="FILTRO: TROPICALIZAÇÃO"
                            description="Penalidade por serpentina de alumínio, superaquecimento, eficiência em clima tropical."
                            color="#f59e0b"
                        />

                        <FunnelStep
                            icon="🛡️"
                            title="FILTRO: LOGÍSTICA BR"
                            description="SAC no Brasil, disponibilidade de peças, rede de assistência técnica."
                            color="#ef4444"
                        />

                        <FunnelStep
                            icon="⚡"
                            title="FILTRO: CUSTO-ENERGIA"
                            description="Consumo real de energia na tarifa brasileira (R$/kWh)."
                            color="#10b981"
                        />

                        <FunnelStep
                            icon="🎯"
                            title="NOTA CONSENSO 360º"
                            description="A nota calibrada para a realidade do seu contexto de uso."
                            color="#8b5cf6"
                            isLast
                        />
                    </div>
                </div>
            </section>

            {/* O Paradoxo da Praia */}
            <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            🏖️ O Problema que Ninguém Fala
                        </span>
                        <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">
                            O Paradoxo da Praia
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Um ar-condicionado nota <strong>10</strong> no interior pode ser nota <strong>4</strong> no litoral.
                            Por quê? A maresia corrói serpentinas de alumínio em poucos anos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Interior Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">🏠</span>
                                <div>
                                    <h3 className="font-display font-bold text-xl text-gray-800">Interior / Cidade</h3>
                                    <p className="text-sm text-gray-500">Clima seco, sem maresia</p>
                                </div>
                            </div>

                            <div className="text-center py-6 bg-green-50 rounded-xl mb-6">
                                <span className="text-6xl font-bold text-green-600">10.0</span>
                                <p className="text-green-700 font-medium mt-2">Nota Máxima</p>
                            </div>

                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Serpentina de alumínio funciona bem
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Sem risco de corrosão acelerada
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Vida útil de 10+ anos
                                </li>
                            </ul>
                        </div>

                        {/* Litoral Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-200">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">🏖️</span>
                                <div>
                                    <h3 className="font-display font-bold text-xl text-gray-800">Litoral / Praia</h3>
                                    <p className="text-sm text-gray-500">Alta umidade, maresia</p>
                                </div>
                            </div>

                            <div className="text-center py-6 bg-red-50 rounded-xl mb-6">
                                <span className="text-6xl font-bold text-red-600">4.0</span>
                                <p className="text-red-700 font-medium mt-2">Risco Alto</p>
                            </div>

                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">✗</span>
                                    Alumínio oxida rapidamente
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">✗</span>
                                    Serpentina impossível de reparar
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">✗</span>
                                    Vida útil reduzida (3-5 anos)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-white rounded-xl border border-blue-200 shadow-sm">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl">💡</span>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">A Solução: Serpentina de Cobre</h4>
                                <p className="text-gray-600 text-sm">
                                    Para quem mora no litoral, recomendamos ar-condicionados com serpentina 100% cobre
                                    ou tratamento anticorrosivo Gold Fin. O custo inicial é maior, mas a durabilidade
                                    compensa — e nosso sistema aplica um <strong className="text-green-600">+1.0 bônus</strong> automaticamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Glossário de Penalidades */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">
                            Glossário de Penalidades
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Exemplos reais das regras que aplicamos. Cada categoria tem seu próprio conjunto
                            de filtros calibrados para o contexto brasileiro.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <PenaltyCard
                            category="Ar-Condicionado"
                            rule="Serpentina de alumínio"
                            penalty="-2.0 pontos"
                            context="Litoral"
                            severity="critical"
                        />
                        <PenaltyCard
                            category="Ar-Condicionado"
                            rule="Sem proteção anticorrosiva"
                            penalty="-2.0 pontos"
                            context="Alta Umidade"
                            severity="high"
                        />
                        <PenaltyCard
                            category="Smart TV"
                            rule="Sem suporte a Dolby Vision"
                            penalty="-1.5 pontos"
                            context="Cinéfilos"
                            severity="medium"
                        />
                        <PenaltyCard
                            category="Smart TV"
                            rule="Input lag alto (>20ms)"
                            penalty="-2.0 pontos"
                            context="Gamers"
                            severity="high"
                        />
                        <PenaltyCard
                            category="Geladeira"
                            rule="Compressor convencional"
                            penalty="-1.5 pontos"
                            context="Economia"
                            severity="medium"
                        />
                        <PenaltyCard
                            category="Notebook"
                            rule="Bateria <6h autonomia"
                            penalty="-2.0 pontos"
                            context="Mobilidade"
                            severity="high"
                        />
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/lab"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-colors"
                        >
                            🧪 Testar no Laboratório
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 px-4 bg-slate-900 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                        Não compre sem contexto.
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        A nota de fábrica não considera onde você mora, como você usa,
                        ou quanto paga de energia. A nossa considera.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/categorias/ar-condicionados"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
                        >
                            ❄️ Ver Ar-Condicionados
                        </Link>
                        <Link
                            href="/categorias/smart-tvs"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
                        >
                            📺 Ver Smart TVs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
