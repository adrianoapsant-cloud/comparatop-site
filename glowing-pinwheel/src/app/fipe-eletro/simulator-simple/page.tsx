'use client';

/**
 * =============================================================================
 * SIMULADOR FIPE-ELETRO SIMPLIFICADO
 * =============================================================================
 * 
 * Versão simplificada que:
 * 1. Extrai valores diretamente da tabela TCO do relatório
 * 2. Mostra breakdown claro de cada custo
 * 3. Sem camadas de abstração desnecessárias
 */

import { useState, useCallback } from 'react';
import { parseSimpleReport, isJsonInput, SimpleParsedReport } from '@/lib/fipe-eletro/simpleReportParser';

export default function SimpleTcoSimulator() {
    const [reportInput, setReportInput] = useState('');
    const [result, setResult] = useState<SimpleParsedReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSimulate = useCallback(() => {
        setError(null);
        setResult(null);

        if (!reportInput.trim()) {
            setError('Cole o relatório do Gemini para analisar.');
            return;
        }

        try {
            if (isJsonInput(reportInput)) {
                setError('Este simulador simplificado aceita apenas relatórios em Markdown. Para JSON, use o simulador completo.');
                return;
            }

            const parsed = parseSimpleReport(reportInput);

            // Validação básica
            if (parsed.acquisitionCost === 0) {
                setError('Não foi possível extrair o preço de aquisição do relatório. Verifique se o relatório contém uma tabela de TCO.');
                return;
            }

            console.log('=== PARSED RESULT ===');
            console.log(parsed);
            console.log('=====================');

            setResult(parsed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar relatório');
        }
    }, [reportInput]);

    const fmt = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <header className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">🧪 Simulador FIPE-Eletro (Simplificado)</h1>
                    <p className="text-slate-500 mt-1">Cole um relatório Gemini e veja o breakdown de custos</p>
                </header>

                {/* Input */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        📋 Relatório Markdown do Gemini
                    </label>
                    <textarea
                        value={reportInput}
                        onChange={(e) => setReportInput(e.target.value)}
                        placeholder="Cole aqui o relatório completo gerado pelo Gemini Deep Research..."
                        className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <button
                        onClick={handleSimulate}
                        className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Analisar Relatório
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Resultado */}
                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card TCO Principal */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">📊 Custo Total de Propriedade</h2>
                                <p className="text-blue-100 text-sm">Projeção para {result.lifespan} anos</p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Aquisição */}
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase">💳 Investimento Inicial</h3>
                                    <div className="flex justify-between text-slate-700 mt-1">
                                        <span>Preço do Produto</span>
                                        <span className="font-semibold">{fmt(result.acquisitionCost)}</span>
                                    </div>
                                </div>

                                {/* Operacionais */}
                                <div className="pt-2 border-t">
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase">⚡ Custos Operacionais ({result.lifespan} anos)</h3>
                                    <div className="flex justify-between text-yellow-600 mt-1">
                                        <span>Energia Elétrica</span>
                                        <span className="font-semibold">{fmt(result.energyCost5y)}</span>
                                    </div>
                                </div>

                                {/* Manutenção + Consumíveis */}
                                <div className="pt-2 border-t">
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase">🔧 Manutenção + Consumíveis</h3>
                                    <div className="flex justify-between text-orange-600 mt-1">
                                        <span>Manutenção</span>
                                        <span className="font-semibold">{fmt(result.maintenanceCost5y)}</span>
                                    </div>
                                    <div className="flex justify-between text-purple-600 mt-1">
                                        <span>Consumíveis</span>
                                        <span className="font-semibold">{fmt(result.consumablesCost5y)}</span>
                                    </div>
                                </div>

                                {/* Valor Residual */}
                                {result.residualValue5y > 0 && (
                                    <div className="pt-2 border-t">
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase">💰 Valor Residual (Revenda)</h3>
                                        <div className="flex justify-between text-green-600 mt-1">
                                            <span>Estimativa em {result.lifespan} anos</span>
                                            <span className="font-semibold">-{fmt(result.residualValue5y)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="pt-4 border-t-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">🎯 CUSTO REAL TOTAL</span>
                                        <span className="text-2xl font-bold text-blue-600">{fmt(result.totalTco5y)}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 rounded-lg p-3">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500">Custo Mensal</p>
                                            <p className="font-bold text-blue-600">{fmt(result.totalTco5y / (result.lifespan * 12))}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500">% vs Etiqueta</p>
                                            <p className="font-bold text-slate-800">
                                                {((result.totalTco5y / result.acquisitionCost) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Breakdown de Consumíveis */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">📦 Breakdown de Consumíveis</h2>
                                <p className="text-purple-100 text-sm">Detalhamento dos custos recorrentes</p>
                            </div>

                            <div className="p-6 space-y-4">
                                {result.consumablesBreakdown.length > 0 ? (
                                    <>
                                        {result.consumablesBreakdown.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                                <div>
                                                    <p className="font-medium text-slate-800">{item.item}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {fmt(item.unitPrice)} × a cada {item.frequencyMonths} meses
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-purple-600">{fmt(item.annualCost)}/ano</p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 border-t-2">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-slate-900">Total em {result.lifespan} anos</span>
                                                <span className="font-bold text-purple-600">{fmt(result.consumablesCost5y)}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <p>Nenhum item de consumível detectado no relatório.</p>
                                        <p className="text-sm mt-2">O valor de {fmt(result.consumablesCost5y)} foi extraído diretamente da tabela TCO.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Breakdown de Manutenção */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">🔧 Breakdown de Manutenção</h2>
                                <p className="text-orange-100 text-sm">Componentes com risco de falha</p>
                            </div>

                            <div className="p-6">
                                {result.maintenanceBreakdown.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {result.maintenanceBreakdown.map((item, idx) => (
                                            <div key={idx} className="bg-orange-50 rounded-lg p-4">
                                                <p className="font-medium text-slate-800">{item.component}</p>
                                                <div className="flex justify-between mt-2 text-sm">
                                                    <span className="text-slate-500">Custo estimado:</span>
                                                    <span className="font-semibold text-orange-600">{fmt(item.estimatedCost)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Risco em {result.lifespan} anos:</span>
                                                    <span className="font-semibold text-orange-700">{(item.probability5y * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <p>Nenhum componente de manutenção detectado no relatório.</p>
                                        <p className="text-sm mt-2">O valor de {fmt(result.maintenanceCost5y)} foi extraído diretamente da tabela TCO.</p>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t flex justify-between">
                                    <span className="font-bold text-slate-900">Total Manutenção Esperada</span>
                                    <span className="font-bold text-orange-600">{fmt(result.maintenanceCost5y)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Debug info */}
                        <div className="md:col-span-2 bg-slate-100 rounded-lg p-4">
                            <p className="text-xs text-slate-500 text-center">
                                Produto: {result.productName} | Categoria: {result.category} | Confiança: {(result.dataConfidence * 100).toFixed(0)}%
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
