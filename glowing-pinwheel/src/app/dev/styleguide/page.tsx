'use client';

/**
 * Styleguide Demo - Auditoria Premium Acessível
 * 
 * Esta página demonstra todos os tokens e componentes do design system.
 * Acesse em: /dev/styleguide
 */

import React from 'react';

export default function StyleguidePage() {
    return (
        <div className="min-h-screen bg-paper py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Header */}
                <header className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                        🎨 Design System: Auditoria Premium
                    </h1>
                    <p className="text-secondary text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                        Tokens, tipografia e componentes para UI confiável e acessível
                    </p>
                </header>

                {/* ===== CORES ===== */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold border-b border-default pb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        1. Paleta de Cores
                    </h2>

                    {/* Neutros */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Neutros</h3>
                        <div className="flex flex-wrap gap-3">
                            <ColorSwatch name="paper" color="var(--neutral-paper)" />
                            <ColorSwatch name="surface" color="var(--neutral-surface)" />
                            <ColorSwatch name="border" color="var(--neutral-border)" />
                            <ColorSwatch name="border-strong" color="var(--neutral-border-strong)" />
                        </div>
                    </div>

                    {/* Marca */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Marca (Teal)</h3>
                        <div className="flex flex-wrap gap-3">
                            <ColorSwatch name="brand-50" color="var(--brand-50)" />
                            <ColorSwatch name="brand-100" color="var(--brand-100)" />
                            <ColorSwatch name="brand-500" color="var(--brand-500)" dark />
                            <ColorSwatch name="brand-700" color="var(--brand-700)" dark />
                            <ColorSwatch name="brand-900" color="var(--brand-900)" dark />
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">CTA (Laranja)</h3>
                        <div className="flex flex-wrap gap-3">
                            <ColorSwatch name="cta-50" color="var(--cta-50)" />
                            <ColorSwatch name="cta-100" color="var(--cta-100)" />
                            <ColorSwatch name="cta-500" color="var(--cta-500)" dark />
                            <ColorSwatch name="cta-600" color="var(--cta-600)" dark />
                            <ColorSwatch name="cta-700" color="var(--cta-700)" dark />
                        </div>
                    </div>

                    {/* Semânticas */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Cores Semânticas</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted uppercase">Success</p>
                                <div className="flex gap-2">
                                    <ColorSwatch name="50" color="var(--semantic-success-50)" small />
                                    <ColorSwatch name="100" color="var(--semantic-success-100)" small />
                                    <ColorSwatch name="500" color="var(--semantic-success-500)" dark small />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted uppercase">Warning</p>
                                <div className="flex gap-2">
                                    <ColorSwatch name="50" color="var(--semantic-warn-50)" small />
                                    <ColorSwatch name="100" color="var(--semantic-warn-100)" small />
                                    <ColorSwatch name="500" color="var(--semantic-warn-500)" dark small />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted uppercase">Danger</p>
                                <div className="flex gap-2">
                                    <ColorSwatch name="50" color="var(--semantic-danger-50)" small />
                                    <ColorSwatch name="100" color="var(--semantic-danger-100)" small />
                                    <ColorSwatch name="500" color="var(--semantic-danger-500)" dark small />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted uppercase">Info</p>
                                <div className="flex gap-2">
                                    <ColorSwatch name="50" color="var(--semantic-info-50)" small />
                                    <ColorSwatch name="100" color="var(--semantic-info-100)" small />
                                    <ColorSwatch name="500" color="var(--semantic-info-500)" dark small />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== TIPOGRAFIA ===== */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold border-b border-default pb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        2. Tipografia
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="card p-6 space-y-4">
                            <p className="text-xs font-medium text-muted uppercase tracking-wider">Heading</p>
                            <p className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                                Plus Jakarta Sans
                            </p>
                            <p className="text-muted text-sm">Para títulos e headlines</p>
                        </div>

                        <div className="card p-6 space-y-4">
                            <p className="text-xs font-medium text-muted uppercase tracking-wider">Body</p>
                            <p className="text-2xl font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                                Inter
                            </p>
                            <p className="text-muted text-sm">Para parágrafos e UI</p>
                        </div>

                        <div className="card p-6 space-y-4">
                            <p className="text-xs font-medium text-muted uppercase tracking-wider">Mono / Data</p>
                            <p className="text-2xl font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                                JetBrains Mono
                            </p>
                            <p className="text-muted text-sm">Para preços, scores, código</p>
                        </div>
                    </div>

                    {/* Tamanhos */}
                    <div className="card p-6 space-y-4">
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Escala de Tamanhos</p>
                        <div className="space-y-3">
                            <p style={{ fontSize: 'var(--text-xs)' }}>text-xs (12px) - Labels pequenos</p>
                            <p style={{ fontSize: 'var(--text-sm)' }}>text-sm (14px) - Texto auxiliar</p>
                            <p style={{ fontSize: 'var(--text-base)' }}>text-base (17px) - Corpo principal ✓</p>
                            <p style={{ fontSize: 'var(--text-lg)' }}>text-lg (18px) - Destaque leve</p>
                            <p style={{ fontSize: 'var(--text-xl)' }}>text-xl (20px) - Subtítulos</p>
                            <p style={{ fontSize: 'var(--text-2xl)' }}>text-2xl (24px) - H3</p>
                            <p style={{ fontSize: 'var(--text-3xl)' }}>text-3xl (30px) - H2</p>
                        </div>
                    </div>

                    {/* Números Tabulares */}
                    <div className="card p-6 space-y-4">
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Números Tabulares (Preços/TCO)</p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted mb-2">Sem tabular-nums:</p>
                                <div className="space-y-1 text-xl font-semibold">
                                    <p>R$ 1.111,00</p>
                                    <p>R$ 999,99</p>
                                    <p>R$ 12.345,67</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted mb-2">Com tabular-nums (alinhado):</p>
                                <div className="space-y-1 text-xl font-semibold text-price">
                                    <p>R$ 1.111,00</p>
                                    <p>R$ 999,99</p>
                                    <p>R$ 12.345,67</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== COMPONENTES ===== */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold border-b border-default pb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        3. Componentes
                    </h2>

                    {/* Cards */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Cards</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="card p-6">
                                <h4 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Card Padrão</h4>
                                <p className="text-secondary text-sm">
                                    Superfície branca com borda sutil e sombra leve. Fundo neutro não compete com o conteúdo.
                                </p>
                            </div>
                            <div className="card card-hover p-6 cursor-pointer">
                                <h4 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Card com Hover</h4>
                                <p className="text-secondary text-sm">
                                    Classe <code className="text-xs bg-gray-100 px-1 rounded">card-hover</code> adiciona elevação no hover.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Badges Semânticos</h3>
                        <div className="flex flex-wrap gap-3">
                            <span className="badge badge-success">✓ Aprovado</span>
                            <span className="badge badge-warn">⚠ Atenção</span>
                            <span className="badge badge-danger">✕ Risco</span>
                            <span className="badge badge-info">ℹ Info</span>
                            <span className="badge badge-brand">🏷 Marca</span>
                            <span className="badge badge-neutral">Neutro</span>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Botões</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className="btn-cta">
                                Ver Melhor Oferta
                            </button>
                            <button className="btn-secondary">
                                Comparar
                            </button>
                        </div>
                    </div>

                    {/* Score Indicators */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Indicadores de Score</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <span className="score-indicator score-excellent">9.2</span>
                                <span className="text-sm text-muted">Excelente (9-10)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="score-indicator score-good">7.8</span>
                                <span className="text-sm text-muted">Bom (7-8.9)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="score-indicator score-fair">5.5</span>
                                <span className="text-sm text-muted">Regular (5-6.9)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="score-indicator score-poor">3.2</span>
                                <span className="text-sm text-muted">Fraco (&lt;5)</span>
                            </div>
                        </div>
                    </div>

                    {/* Bordas Semânticas */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-secondary">Bordas Semânticas (Alertas)</h3>
                        <div className="space-y-3">
                            <div className="card p-4 border-l-success bg-success-subtle">
                                <p className="font-medium">A Solução</p>
                                <p className="text-sm text-secondary">Navegação LiDAR precisa com mapeamento 3D</p>
                            </div>
                            <div className="card p-4 border-l-warn bg-warn-subtle">
                                <p className="font-medium">Ponto de Atenção</p>
                                <p className="text-sm text-secondary">Mop passivo — apenas arrasta pano úmido</p>
                            </div>
                            <div className="card p-4 border-l-danger bg-danger-subtle">
                                <p className="font-medium">Não Compre Se</p>
                                <p className="text-sm text-secondary">Precisa de suporte pós-venda confiável</p>
                            </div>
                            <div className="card p-4 border-l-info bg-info-subtle">
                                <p className="font-medium">Dica do Especialista</p>
                                <p className="text-sm text-secondary">Configure zonas proibidas para proteger fios</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== TCO DEMO ===== */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold border-b border-default pb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        4. Demo: Card de TCO
                    </h2>

                    <div className="card p-6 max-w-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-medium text-muted uppercase tracking-wider">Custo Real de Propriedade</p>
                                <p className="text-lg font-semibold mt-1" style={{ fontFamily: 'var(--font-heading)' }}>5 Anos</p>
                            </div>
                            <span className="badge badge-info">TCO</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-subtle">
                                <span className="text-secondary">Preço de Compra</span>
                                <span className="text-price">R$ 1.600,00</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-subtle">
                                <span className="text-secondary">Energia (5 anos)</span>
                                <span className="text-price">R$ 270,00</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-subtle">
                                <span className="text-secondary">Manutenção (5 anos)</span>
                                <span className="text-price">R$ 1.600,00</span>
                            </div>
                            <div className="flex justify-between py-3 bg-brand-light rounded-lg px-3 -mx-3">
                                <span className="font-semibold">Custo Total (5 anos)</span>
                                <span className="text-price font-bold text-brand" style={{ color: 'var(--brand-800)' }}>R$ 3.470,00</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-default">
                            <p className="text-sm text-muted">
                                💡 <strong>Reserve R$ 31/mês</strong> para cobrir custos de manutenção
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-muted text-sm pt-8 border-t border-default">
                    <p>Design System v2.0 — ComparaTop · Auditoria Premium Acessível</p>
                    <p className="mt-2">
                        Tokens em <code className="text-xs bg-gray-100 px-1 rounded">src/styles/tokens.css</code>
                    </p>
                </footer>
            </div>
        </div>
    );
}

/* ===== Helper Components ===== */

interface ColorSwatchProps {
    name: string;
    color: string;
    dark?: boolean;
    small?: boolean;
}

function ColorSwatch({ name, color, dark = false, small = false }: ColorSwatchProps) {
    const size = small ? 'w-10 h-10' : 'w-16 h-16';
    const textSize = small ? 'text-[10px]' : 'text-xs';

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`${size} rounded-lg border border-gray-200 shadow-sm`}
                style={{ backgroundColor: color }}
            />
            <span className={`${textSize} ${dark ? 'text-muted' : 'text-muted'}`}>{name}</span>
        </div>
    );
}
