'use client';

import { cn } from '@/lib/utils';
import { Product } from '@/types/category';
import { CriteriaResult, VersusResult } from '@/lib/nlg-engine';

// ============================================
// VERSUS DOLOR TABLE (Visual Pain Points Comparison)
// ============================================

interface VersusDolorTableProps {
    versusResult: VersusResult;
    className?: string;
}

export function VersusDolorTable({ versusResult, className }: VersusDolorTableProps) {
    const { productA, productB, criteriaResults } = versusResult;
    const nameA = productA.shortName || productA.brand;
    const nameB = productB.shortName || productB.brand;

    return (
        <section className={cn('py-8', className)}>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
                ⚔️ Batalha dos 10 Critérios
            </h2>
            <p className="text-sm text-text-muted mb-6">
                Comparação ponto a ponto baseada no nosso sistema de análise proprietário
            </p>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-gray-100 rounded-lg">
                <div className="flex-1 text-center">
                    <span className="font-semibold text-text-primary">{nameA}</span>
                </div>
                <div className="w-24 text-center text-sm text-text-muted">Critério</div>
                <div className="flex-1 text-center">
                    <span className="font-semibold text-text-primary">{nameB}</span>
                </div>
            </div>

            {/* Criteria Rows */}
            <div className="space-y-2">
                {criteriaResults.map((result, idx) => (
                    <CriteriaRow
                        key={result.criteriaId}
                        result={result}
                        isEven={idx % 2 === 0}
                    />
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{versusResult.productAWins}</div>
                        <div className="text-xs text-blue-600">vitórias</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-text-muted">vs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">{versusResult.productBWins}</div>
                        <div className="text-xs text-orange-500">vitórias</div>
                    </div>
                </div>
                {versusResult.ties > 0 && (
                    <div className="text-center mt-2 text-xs text-text-muted">
                        {versusResult.ties} empate(s) técnico(s)
                    </div>
                )}
            </div>
        </section>
    );
}

function CriteriaRow({ result, isEven }: { result: CriteriaResult; isEven: boolean }) {
    const percentA = (result.productAScore / 10) * 100;
    const percentB = (result.productBScore / 10) * 100;

    const colorA = result.winner === 'A' ? 'bg-emerald-500' : result.winner === 'tie' ? 'bg-gray-400' : 'bg-gray-300';
    const colorB = result.winner === 'B' ? 'bg-emerald-500' : result.winner === 'tie' ? 'bg-gray-400' : 'bg-gray-300';

    return (
        <div className={cn(
            'flex items-center gap-4 px-4 py-3 rounded-lg transition-colors',
            isEven ? 'bg-gray-50' : 'bg-white',
            'hover:bg-gray-100'
        )}>
            {/* Product A Bar (right-aligned) */}
            <div className="flex-1 flex items-center gap-2">
                <span className="text-xs font-medium text-text-secondary w-8 text-right">
                    {result.productAScore.toFixed(1)}
                </span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden flex justify-end">
                    <div
                        className={cn('h-full rounded-full transition-all', colorA)}
                        style={{ width: `${percentA}%` }}
                    />
                </div>
                {result.winner === 'A' && (
                    <span className="text-xs">🏆</span>
                )}
            </div>

            {/* Criteria Label */}
            <div className="w-24 text-center flex-shrink-0">
                <span className="text-lg">{result.criteriaEmoji}</span>
                <div className="text-[10px] text-text-muted leading-tight mt-0.5">
                    {result.criteriaName}
                </div>
            </div>

            {/* Product B Bar (left-aligned) */}
            <div className="flex-1 flex items-center gap-2">
                {result.winner === 'B' && (
                    <span className="text-xs">🏆</span>
                )}
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full transition-all', colorB)}
                        style={{ width: `${percentB}%` }}
                    />
                </div>
                <span className="text-xs font-medium text-text-secondary w-8">
                    {result.productBScore.toFixed(1)}
                </span>
            </div>
        </div>
    );
}

// ============================================
// SPECS COMPARISON TABLE (Zebra-striped)
// ============================================

interface SpecsComparisonTableProps {
    productA: Product;
    productB: Product;
    className?: string;
}

interface SpecRow {
    label: string;
    valueA: string;
    valueB: string;
    higherIsBetter?: boolean;
}

export function SpecsComparisonTable({ productA, productB, className }: SpecsComparisonTableProps) {
    const nameA = productA.shortName || productA.brand;
    const nameB = productB.shortName || productB.brand;

    const specs = generateSpecRows(productA, productB);

    return (
        <section className={cn('py-8', className)}>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
                📋 Especificações Técnicas
            </h2>
            <p className="text-sm text-text-muted mb-6">
                Dados técnicos lado a lado para comparação detalhada
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left px-4 py-3 font-semibold text-text-primary">Especificação</th>
                            <th className="text-center px-4 py-3 font-semibold text-blue-600">{nameA}</th>
                            <th className="text-center px-4 py-3 font-semibold text-orange-500">{nameB}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map((spec, idx) => (
                            <tr
                                key={spec.label}
                                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                <td className="px-4 py-3 text-text-secondary">{spec.label}</td>
                                <td className="px-4 py-3 text-center font-medium">{spec.valueA}</td>
                                <td className="px-4 py-3 text-center font-medium">{spec.valueB}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function generateSpecRows(productA: Product, productB: Product): SpecRow[] {
    const specsA = (productA.specs || {}) as Record<string, unknown>;
    const specsB = (productB.specs || {}) as Record<string, unknown>;
    const attrsA = (productA.attributes || {}) as Record<string, unknown>;
    const attrsB = (productB.attributes || {}) as Record<string, unknown>;

    const rows: SpecRow[] = [];

    // Common specs
    rows.push({ label: 'Marca', valueA: productA.brand, valueB: productB.brand });
    rows.push({ label: 'Preço', valueA: `R$ ${productA.price.toLocaleString('pt-BR')}`, valueB: `R$ ${productB.price.toLocaleString('pt-BR')}` });

    if (productA.categoryId === 'tv') {
        if (specsA.screenSize || specsB.screenSize) {
            rows.push({ label: 'Tamanho da Tela', valueA: `${specsA.screenSize || '-'}"`, valueB: `${specsB.screenSize || '-'}"` });
        }
        if (specsA.resolution || specsB.resolution) {
            rows.push({ label: 'Resolução', valueA: String(specsA.resolution || '-'), valueB: String(specsB.resolution || '-') });
        }
        if (specsA.panelType || specsB.panelType) {
            rows.push({ label: 'Tipo de Painel', valueA: String(specsA.panelType || '-'), valueB: String(specsB.panelType || '-') });
        }
        if (specsA.refreshRate || specsB.refreshRate) {
            rows.push({ label: 'Taxa de Atualização', valueA: `${specsA.refreshRate || '-'} Hz`, valueB: `${specsB.refreshRate || '-'} Hz` });
        }
        if (attrsA.brightness || attrsB.brightness) {
            rows.push({ label: 'Brilho Máximo', valueA: `${attrsA.brightness || '-'} nits`, valueB: `${attrsB.brightness || '-'} nits` });
        }
        if (attrsA.hdmi21Ports !== undefined || attrsB.hdmi21Ports !== undefined) {
            rows.push({ label: 'Portas HDMI 2.1', valueA: String(attrsA.hdmi21Ports ?? '-'), valueB: String(attrsB.hdmi21Ports ?? '-') });
        }
        if (specsA.hdmiPorts || specsB.hdmiPorts) {
            rows.push({ label: 'Total de Portas HDMI', valueA: String(specsA.hdmiPorts || '-'), valueB: String(specsB.hdmiPorts || '-') });
        }
        if (attrsA.speakers || attrsB.speakers) {
            rows.push({ label: 'Sistema de Som', valueA: String(attrsA.speakers || '-'), valueB: String(attrsB.speakers || '-') });
        }
    }

    if (productA.categoryId === 'fridge') {
        if (specsA.capacity || specsB.capacity) {
            rows.push({ label: 'Capacidade', valueA: `${specsA.capacity || '-'} L`, valueB: `${specsB.capacity || '-'} L` });
        }
        if (attrsA.energyClass || attrsB.energyClass) {
            rows.push({ label: 'Classe Energética', valueA: String(attrsA.energyClass || '-'), valueB: String(attrsB.energyClass || '-') });
        }
        if (attrsA.freezerPosition || attrsB.freezerPosition) {
            rows.push({ label: 'Posição do Freezer', valueA: String(attrsA.freezerPosition || '-'), valueB: String(attrsB.freezerPosition || '-') });
        }
    }

    if (productA.categoryId === 'air_conditioner') {
        if (specsA.btus || specsB.btus) {
            rows.push({ label: 'Capacidade BTU', valueA: String(specsA.btus || '-'), valueB: String(specsB.btus || '-') });
        }
        if (attrsA.inverter !== undefined || attrsB.inverter !== undefined) {
            rows.push({ label: 'Tecnologia Inverter', valueA: attrsA.inverter ? 'Sim' : 'Não', valueB: attrsB.inverter ? 'Sim' : 'Não' });
        }
        if (attrsA.noiseLevel || attrsB.noiseLevel) {
            rows.push({ label: 'Nível de Ruído', valueA: `${attrsA.noiseLevel || '-'} dB`, valueB: `${attrsB.noiseLevel || '-'} dB` });
        }
    }

    return rows;
}

// ============================================
// VERSUS VERDICT COMPONENT
// ============================================

interface VersusVerdictProps {
    versusResult: VersusResult;
    className?: string;
}

export function VersusVerdict({ versusResult, className }: VersusVerdictProps) {
    const { productA, productB, overallWinner, overallNarrative } = versusResult;
    const nameA = productA.shortName || productA.brand;
    const nameB = productB.shortName || productB.brand;

    const winnerName = overallWinner === 'A' ? nameA : overallWinner === 'B' ? nameB : null;
    const winnerProduct = overallWinner === 'A' ? productA : overallWinner === 'B' ? productB : null;

    return (
        <section className={cn('py-8', className)}>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                    🏆 Veredito Final
                </h2>

                {overallWinner !== 'tie' && winnerProduct ? (
                    <div className="flex items-center gap-6 mb-4">
                        <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
                            {winnerProduct.imageUrl ? (
                                <img
                                    src={winnerProduct.imageUrl}
                                    alt={winnerName || ''}
                                    className="w-20 h-20 object-contain"
                                />
                            ) : (
                                <span className="text-4xl">🏆</span>
                            )}
                        </div>
                        <div>
                            <div className="text-sm text-blue-600 font-medium mb-1">Vencedor</div>
                            <div className="font-display text-2xl font-bold text-text-primary">
                                {winnerName}
                            </div>
                            <div className="text-sm text-text-muted mt-1">
                                {versusResult.productAWins > versusResult.productBWins
                                    ? `${versusResult.productAWins}`
                                    : `${versusResult.productBWins}`
                                } de 10 critérios
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="text-3xl">🤝</span>
                        <span className="font-display text-xl font-bold text-text-primary">
                            Empate Técnico
                        </span>
                    </div>
                )}

                <p className="text-text-secondary leading-relaxed">
                    {overallNarrative}
                </p>
            </div>
        </section>
    );
}
