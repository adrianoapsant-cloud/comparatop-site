'use client';

import Link from 'next/link';

// ============================================
// GLOBAL FOOTER - COMPLIANCE & TRUST
// ============================================

export function GlobalFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🔬</span>
                            <span className="font-display font-bold text-xl">ComparaTop</span>
                        </div>
                        <p className="text-slate-400 text-sm max-w-md mb-4">
                            Auditoria técnica independente de eletrônicos e eletrodomésticos.
                            Cruzamos testes de laboratório com a realidade do mercado brasileiro.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            Comparativo em Tempo Real atualizado diariamente
                        </div>
                    </div>

                    {/* Compliance Links */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                            Transparência
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/politica-independencia"
                                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xs">📜</span>
                                    Política de Independência Editorial
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/como-somos-financiados"
                                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xs">💡</span>
                                    Como somos financiados (Afiliação)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/metodologia"
                                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xs">🔬</span>
                                    Metodologia Consenso 360º
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/fontes"
                                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xs">📊</span>
                                    Nossas 9 Fontes de Dados
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                            Laboratórios
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/lab"
                                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xs">🧪</span>
                                    Lab 360 (Validação)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categorias/smart-tvs"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Smart TVs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categorias/geladeiras"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Geladeiras
                                </Link>
                            </li>
                            {/* TODO: Adicionar quando categorias forem registradas
                            <li>
                                <Link
                                    href="/categorias/notebooks"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Notebooks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categorias/smartphones"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Smartphones
                                </Link>
                            </li>
                            */}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                        <p>
                            © {currentYear} ComparaTop • Auditoria Editorial Independente
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="/privacidade" className="hover:text-white transition-colors">
                                Privacidade
                            </Link>
                            <Link href="/termos" className="hover:text-white transition-colors">
                                Termos
                            </Link>
                            <Link href="/contato" className="hover:text-white transition-colors">
                                Contato
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
