'use client';

import { ShieldCheck } from 'lucide-react';
import { SmartCitation } from '@/components/SmartCitation';

/**
 * TrustMethodology - Global Trust Accordion Component
 * 
 * Displays the "Consenso 360º" methodology as a collapsible accordion.
 * Shows authority badges for RTINGS, YouTube, Amazon, etc.
 * Collapsed by default for mobile UX optimization.
 */
export function TrustMethodology() {
    return (
        <details className="card-premium mb-8 group">
            {/* Accordion Header - Always Visible */}
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-core/10 flex items-center justify-center">
                        <ShieldCheck size={20} className="text-brand-core" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary text-sm md:text-base">
                            Metodologia Consenso 360º
                        </h3>
                        <p className="text-xs text-text-muted hidden md:block">
                            9 fontes verificadas • RTINGS, YouTube, Amazon e mais
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted hidden sm:block">
                        Ver como auditamos
                    </span>
                    <span className="text-text-muted transition-transform group-open:rotate-180">
                        ▾
                    </span>
                </div>
            </summary>

            {/* Accordion Content - Collapsible */}
            <div className="p-6 pt-4 border-t border-gray-100 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <div className="space-y-5 text-text-secondary">
                    <p className="leading-relaxed text-base">
                        Nossa metodologia de <strong className="text-text-primary">"Consenso 360º"</strong> blinda
                        você contra o marketing enganoso cruzando três camadas de dados:
                    </p>

                    {/* Layer 1: Análise Técnica */}
                    <div className="pl-4 border-l-2 border-blue-200">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                            1. 🔬 Análise Técnica
                        </p>
                        <p className="leading-relaxed">
                            Validamos as especificações de painel e colorimetria com dados brutos da{' '}
                            <SmartCitation
                                href="https://www.displayspecifications.com"
                                clickable={false}
                                customTitle="DisplaySpecifications"
                                customDescription="Banco de dados global de especificações técnicas de telas, cobrindo resolução, taxa de atualização, gamut de cores e muito mais."
                                customImage="https://logo.clearbit.com/displayspecifications.com"
                            >
                                DisplaySpecifications
                            </SmartCitation>{' '}
                            e medições de laboratório da{' '}
                            <SmartCitation
                                href="https://www.rtings.com"
                                clickable={false}
                                customTitle="RTINGS"
                                customDescription="Laboratório independente com medições técnicas de displays, áudio e latência. Referência mundial em reviews objetivos."
                                customImage="https://logo.clearbit.com/rtings.com"
                            >
                                RTINGS
                            </SmartCitation>.
                        </p>
                    </div>

                    {/* Layer 2: Crítica Especializada */}
                    <div className="pl-4 border-l-2 border-purple-200">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
                            2. 📰 Crítica Especializada
                        </p>
                        <p className="leading-relaxed">
                            Comparamos nossa avaliação com os vereditos editoriais de gigantes como{' '}
                            <SmartCitation
                                href="https://www.techradar.com"
                                clickable={false}
                                customTitle="TechRadar"
                                customDescription="Portal global de tecnologia com reviews detalhados e guias de compra confiáveis desde 2008."
                                customImage="https://logo.clearbit.com/techradar.com"
                            >
                                TechRadar
                            </SmartCitation>{' '}
                            e{' '}
                            <SmartCitation
                                href="https://www.theverge.com"
                                clickable={false}
                                customTitle="The Verge"
                                customDescription="Veículo premiado de tecnologia e cultura digital, conhecido por reviews aprofundados e críticos."
                                customImage="https://logo.clearbit.com/theverge.com"
                            >
                                The Verge
                            </SmartCitation>{' '}
                            para eliminar vieses de marca.
                        </p>
                    </div>

                    {/* Layer 3: Vivência Real e Longo Prazo (YouTube focus) */}
                    <div className="pl-4 border-l-2 border-emerald-200">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                            3. 🎬 Vivência Real e Longo Prazo
                        </p>
                        <p className="leading-relaxed mb-3">
                            <strong className="text-text-primary">Fichas técnicas são frias e não mostram o dia a dia.</strong>{' '}
                            Por isso, analisamos centenas de horas de reviews de donos no{' '}
                            <SmartCitation
                                href="https://www.youtube.com"
                                clickable={false}
                                customTitle="YouTube Reviews"
                                customDescription="Analisamos centenas de horas de reviews de proprietários reais após meses de uso, capturando problemas que só aparecem no longo prazo."
                                customImage="https://logo.clearbit.com/youtube.com"
                            >
                                YouTube
                            </SmartCitation>{' '}
                            e discussões de longo prazo no{' '}
                            <SmartCitation
                                href="https://www.reddit.com/r/4kTV"
                                clickable={false}
                                customTitle="Reddit r/4kTV"
                                customDescription="Comunidade com +200k membros discutindo problemas reais, defeitos crônicos e recomendações de TVs."
                                customImage="https://logo.clearbit.com/reddit.com"
                            >
                                Reddit
                            </SmartCitation>{' '}
                            e{' '}
                            <SmartCitation
                                href="https://www.htforum.com"
                                clickable={false}
                                customTitle="HT Forum"
                                customDescription="Maior fórum brasileiro de home theater, com discussões técnicas desde 2001."
                                customImage="https://logo.clearbit.com/htforum.com"
                            >
                                HT Forum
                            </SmartCitation>.
                        </p>
                        <p className="leading-relaxed text-sm bg-emerald-50 p-3 rounded-lg">
                            <strong className="text-emerald-700">🎯 Nosso objetivo:</strong>{' '}
                            Identificar <u>padrões de defeitos e reclamações que se repetem</u>,
                            poupando você de surpresas com o desempenho futuro do produto.
                        </p>
                    </div>

                    {/* Layer 4: Pós-Venda (Auxiliary) */}
                    <div className="pl-4 border-l-2 border-orange-200">
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                            ✓ Auditoria de Pós-Venda
                        </p>
                        <p className="leading-relaxed">
                            Também auditamos a satisfação de pós-venda na{' '}
                            <SmartCitation
                                href="https://www.amazon.com.br"
                                clickable={false}
                                customTitle="Amazon Brasil"
                                customDescription="Auditamos milhares de avaliações de compra verificada para garantir idoneidade da entrega e pós-venda."
                                customImage="https://logo.clearbit.com/amazon.com.br"
                            >
                                Amazon
                            </SmartCitation>{' '}
                            e{' '}
                            <SmartCitation
                                href="https://www.mercadolivre.com.br"
                                clickable={false}
                                customTitle="Mercado Livre"
                                customDescription="Verificamos reputação de vendedores e feedbacks de compradores para filtrar lojas problemáticas."
                                customImage="https://logo.clearbit.com/mercadolivre.com.br"
                            >
                                Mercado Livre
                            </SmartCitation>{' '}
                            para garantir que você não tenha dor de cabeça com entrega ou suporte.
                        </p>
                    </div>

                    {/* Conclusion */}
                    <p className="leading-relaxed font-medium text-text-primary border-l-4 border-brand-core pl-4 py-2 bg-blue-50/50 rounded-r-lg">
                        O resultado abaixo ignora a propaganda das marcas e foca exclusivamente no que
                        entrega valor real para o seu bolso.
                    </p>
                </div>
            </div>
        </details>
    );
}
