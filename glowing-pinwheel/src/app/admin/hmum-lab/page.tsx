'use client';

/**
 * @file page.tsx
 * @description HMUM Validation Laboratory
 * 
 * This page provides a controlled environment to:
 * 1. Test the HMUM engine with benchmark products
 * 2. Compare scores across different contexts
 * 3. Verify Ceiling Effect elimination
 * 4. Debug utility curves and weight matrices
 * 
 * @route /admin/hmum-lab
 * @version 2.0.0 (HMUM Architecture)
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Beaker,
    RefreshCw,
    Trophy,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowRight,
} from 'lucide-react';

// HMUM Components
import { HMUMDebugger } from '@/components/admin/HMUMDebugger';
import { smartTvConfig } from '@/data/hmum/smart-tv-config';
import { mapProductToHMUM, evaluateLegacyProduct } from '@/lib/scoring/hmum-adapter';
import type { EvaluationResult } from '@/lib/scoring/hmum-types';

// Benchmark Data
import { TV_BENCHMARKS_SCORED, TV_BENCHMARK_MAP } from '@/data/mocks/tv-benchmarks';
import type { ScoredProduct } from '@/types/category';

// ============================================
// TYPES
// ============================================

type ProductKey = 'cinema-king' | 'brightness-beast' | 'budget-trap' | 'gamers-choice';

// ============================================
// PRODUCT SELECTOR
// ============================================

function ProductSelector({
    selected,
    onSelect,
}: {
    selected: ProductKey;
    onSelect: (key: ProductKey) => void;
}) {
    const products: { key: ProductKey; name: string; emoji: string; description: string }[] = [
        { key: 'cinema-king', name: 'Cinema King', emoji: '👑', description: 'OLED, contraste perfeito' },
        { key: 'brightness-beast', name: 'Brightness Beast', emoji: '☀️', description: 'MiniLED, brilho extremo' },
        { key: 'budget-trap', name: 'Budget Trap', emoji: '💸', description: 'Entrada, specs ruins' },
        { key: 'gamers-choice', name: "Gamer's Choice", emoji: '🎮', description: 'Input lag mínimo' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((product) => (
                <button
                    key={product.key}
                    onClick={() => onSelect(product.key)}
                    className={`
                        p-4 rounded-xl border-2 text-left transition-all
                        ${selected === product.key
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }
                    `}
                >
                    <div className="text-2xl mb-1">{product.emoji}</div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {product.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {product.description}
                    </div>
                </button>
            ))}
        </div>
    );
}

// ============================================
// COMPARISON TABLE
// ============================================

function ComparisonTable({
    results,
    contextId,
}: {
    results: { product: ScoredProduct; result: EvaluationResult }[];
    contextId: string;
}) {
    // Sort by score descending
    const sorted = [...results].sort((a, b) => b.result.displayScore - a.result.displayScore);
    const winner = sorted[0];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Comparativo no Contexto: {contextId}
                </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sorted.map((item, index) => {
                    const isWinner = index === 0;
                    const isIncompatible = item.result.isIncompatible;

                    return (
                        <div
                            key={item.product.id}
                            className={`
                                px-4 py-3 flex items-center justify-between
                                ${isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}
                                ${isIncompatible ? 'bg-red-50 dark:bg-red-900/20' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-slate-400 w-6">
                                    #{index + 1}
                                </span>
                                <div>
                                    <div className="font-medium text-slate-800 dark:text-slate-200">
                                        {item.product.shortName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        R$ {item.product.price.toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isIncompatible ? (
                                    <div className="flex items-center gap-1 text-red-600">
                                        <XCircle className="w-4 h-4" />
                                        <span className="text-sm font-bold">INCOMPATÍVEL</span>
                                    </div>
                                ) : (
                                    <>
                                        {isWinner && (
                                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                VENCEDOR
                                            </span>
                                        )}
                                        <span className={`
                                            text-2xl font-black
                                            ${item.result.displayScore >= 8 ? 'text-emerald-600' : ''}
                                            ${item.result.displayScore >= 6 && item.result.displayScore < 8 ? 'text-green-600' : ''}
                                            ${item.result.displayScore >= 4 && item.result.displayScore < 6 ? 'text-yellow-600' : ''}
                                            ${item.result.displayScore < 4 ? 'text-red-600' : ''}
                                        `}>
                                            {item.result.displayScore.toFixed(1)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// VALIDATION CHECKLIST
// ============================================

function ValidationChecklist({
    results,
    contextId,
}: {
    results: { product: ScoredProduct; result: EvaluationResult }[];
    contextId: string;
}) {
    // Get results by product key
    const getResult = (key: string) => {
        return results.find(r => r.product.id === `benchmark-${key}`)?.result;
    };

    const cinemaKing = getResult('cinema-king');
    const brightnessBeast = getResult('brightness-beast');
    const budgetTrap = getResult('budget-trap');
    const gamersChoice = getResult('gamers-choice');

    // Validation checks
    const checks = [
        {
            label: 'Ceiling Effect Eliminado',
            description: 'Nenhum produto atinge nota 10.0',
            passed: results.every(r => r.result.displayScore < 10),
        },
        {
            label: 'Cinema King vence no Cinema Dark Room',
            description: 'OLED deve dominar em sala escura',
            passed: contextId === 'cinema_dark_room'
                ? (cinemaKing?.displayScore ?? 0) > (brightnessBeast?.displayScore ?? 0)
                : null,
            contextual: 'cinema_dark_room',
        },
        {
            label: 'Brightness Beast vence no Cinema Bright Room',
            description: 'MiniLED deve dominar em sala clara',
            passed: contextId === 'cinema_bright_room'
                ? (brightnessBeast?.displayScore ?? 0) > (cinemaKing?.displayScore ?? 0)
                : null,
            contextual: 'cinema_bright_room',
        },
        {
            label: 'Budget Trap nunca é competitivo',
            description: 'Preço baixo não salva specs ruins',
            passed: (budgetTrap?.displayScore ?? 0) < 6.5,
        },
        {
            label: 'Budget Trap incompatível com PS5',
            description: 'Sem HDMI 2.1 = FATAL no contexto gamer_ps5',
            passed: contextId === 'gamer_ps5'
                ? budgetTrap?.isIncompatible === true
                : null,
            contextual: 'gamer_ps5',
        },
        {
            label: "Gamer's Choice vence no Gamer Competitive",
            description: 'Input lag mínimo deve dominar',
            passed: contextId === 'gamer_competitive'
                ? (gamersChoice?.displayScore ?? 0) >= (cinemaKing?.displayScore ?? 0)
                : null,
            contextual: 'gamer_competitive',
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Checklist de Validação
                </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {checks.map((check, i) => {
                    const isApplicable = check.contextual ? check.contextual === contextId : true;

                    return (
                        <div
                            key={i}
                            className={`
                                px-4 py-3 flex items-start gap-3
                                ${!isApplicable ? 'opacity-40' : ''}
                            `}
                        >
                            <div className="mt-0.5">
                                {check.passed === null && !isApplicable ? (
                                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
                                ) : check.passed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-sm text-slate-800 dark:text-slate-200">
                                    {check.label}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {check.description}
                                    {check.contextual && !isApplicable && (
                                        <span className="ml-1 text-purple-500">
                                            (testar no contexto {check.contextual})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE
// ============================================

export default function HMUMLabPage() {
    // State
    const [selectedProduct, setSelectedProduct] = useState<ProductKey>('cinema-king');
    const [selectedContext, setSelectedContext] = useState(smartTvConfig.contexts[0]?.id ?? 'cinema_dark_room');

    // Get current product
    const currentProduct = useMemo(() => {
        const product = TV_BENCHMARK_MAP[selectedProduct];
        // Add computed scores
        const scores = Object.values(product.scores) as number[];
        const overall = scores.reduce((a, b) => a + b, 0) / scores.length;
        return {
            ...product,
            computed: {
                qs: overall,
                vs: overall * 0.9,
                gs: overall * 0.95,
                overall: Math.round(overall * 10) / 10,
                pricePerPoint: Math.round(product.price / overall),
                breakdown: [],
                profileId: null,
            },
        } as ScoredProduct;
    }, [selectedProduct]);

    // Evaluate all products in current context
    const allResults = useMemo(() => {
        return TV_BENCHMARKS_SCORED.map(product => ({
            product,
            result: evaluateLegacyProduct(product, smartTvConfig, { contextId: selectedContext }),
        }));
    }, [selectedContext]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-6 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Beaker className="w-8 h-8" />
                        <h1 className="text-2xl font-black">HMUM Validation Lab</h1>
                    </div>
                    <p className="text-purple-200 text-sm">
                        Ambiente de teste para validar a arquitetura HMUM e eliminação do Ceiling Effect
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                {/* Product Selector */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">
                        Selecione um Produto Benchmark
                    </h2>
                    <ProductSelector
                        selected={selectedProduct}
                        onSelect={setSelectedProduct}
                    />
                </section>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Debugger */}
                    <section>
                        <motion.div
                            key={selectedProduct}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <HMUMDebugger
                                product={currentProduct}
                                categoryConfig={smartTvConfig}
                                initialContextId={selectedContext}
                                userSettings={{ voltage: 110 }}
                            />
                        </motion.div>
                    </section>

                    {/* Right: Comparison & Validation */}
                    <section className="space-y-6">
                        {/* Context Sync Note */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Sync:</strong> Altere o contexto no Debugger à esquerda para atualizar a comparação.
                                <div className="flex items-center gap-2 mt-1">
                                    <span>Contexto atual:</span>
                                    <select
                                        value={selectedContext}
                                        onChange={(e) => setSelectedContext(e.target.value)}
                                        className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded px-2 py-1 text-xs"
                                    >
                                        {smartTvConfig.contexts.map(ctx => (
                                            <option key={ctx.id} value={ctx.id}>{ctx.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Comparison */}
                        <ComparisonTable
                            results={allResults}
                            contextId={selectedContext}
                        />

                        {/* Validation Checklist */}
                        <ValidationChecklist
                            results={allResults}
                            contextId={selectedContext}
                        />
                    </section>
                </div>

                {/* Quick Context Switcher */}
                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">
                        Teste Rápido de Contextos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {smartTvConfig.contexts.map((ctx) => (
                            <button
                                key={ctx.id}
                                onClick={() => setSelectedContext(ctx.id)}
                                className={`
                                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                                    flex items-center gap-2
                                    ${selectedContext === ctx.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                                    }
                                `}
                            >
                                <span>{ctx.icon}</span>
                                <span>{ctx.name}</span>
                                <ArrowRight className="w-3 h-3 opacity-50" />
                            </button>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-xs text-slate-500">
                HMUM Engine v2.0.0 | Validation Lab
            </footer>
        </div>
    );
}
