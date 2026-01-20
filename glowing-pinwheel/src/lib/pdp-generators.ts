/**
 * PDP Automatic Generators
 * 
 * These generators create audit verdict and simulator data automatically
 * from product.ts data when no JSON mock exists.
 * 
 * Reference: Roborock Q7 L5 structure
 */

import type { Product } from '@/types/category';

// ============================================
// TYPES
// ============================================

export interface AuditVerdictItem {
    title: string;
    icon: string;
    color: string;
    items?: string[];
    text?: string;
}

export interface AuditVerdict {
    solution: AuditVerdictItem;
    attentionPoint: AuditVerdictItem;
    technicalConclusion: AuditVerdictItem;
    dontBuyIf: AuditVerdictItem;
}

export interface SimulatorAlert {
    status: 'optimal' | 'acceptable' | 'warning' | 'critical';
    message: string;
    type?: string;
    icon?: string;
    title?: string;
    rating?: string;
    suggestions?: Array<{ condition: string; product: string; reason: string }>;
}

export interface Simulators {
    sizeAlert?: SimulatorAlert;
    soundAlert?: SimulatorAlert;
    energyAlert?: SimulatorAlert;
}

// ============================================
// AUDIT VERDICT GENERATOR
// ============================================

/**
 * Generate Audit Verdict automatically from product data
 * Uses scores, scoreReasons, painPointsSolved, and mainCompetitor
 */
export function generateAuditVerdict(product: Product): AuditVerdict {
    const scores = product.scores || {};
    const scoreReasons = product.scoreReasons || {};
    const painPoints = (product as any).painPointsSolved || [];
    const competitor = product.mainCompetitor;

    // === SOLUTION: From high scores (>8.5) + painPointsSolved ===
    const solutionItems: string[] = [];

    // Add pain points solved
    painPoints.forEach((pain: string) => {
        solutionItems.push(`Resolve: ${pain}`);
    });

    // Add high score reasons
    Object.entries(scores).forEach(([key, score]) => {
        if (typeof score === 'number' && score >= 8.5) {
            const reason = scoreReasons[key];
            if (reason) {
                // Extract first sentence if long
                const shortReason = reason.split('.')[0] + '.';
                solutionItems.push(shortReason);
            }
        }
    });

    // Limit to 5 items max
    const finalSolutionItems = solutionItems.slice(0, 5);
    if (finalSolutionItems.length === 0) {
        finalSolutionItems.push('Produto com bom desempenho geral na categoria.');
    }

    // === ATTENTION POINT: From low scores (<7.0) ===
    const attentionItems: string[] = [];

    Object.entries(scores).forEach(([key, score]) => {
        if (typeof score === 'number' && score < 7.0 && score > 0) {
            const reason = scoreReasons[key];
            if (reason) {
                attentionItems.push(reason.split('.')[0] + '.');
            }
        }
    });

    if (attentionItems.length === 0) {
        attentionItems.push('Sem pontos críticos identificados.');
    }

    // === DON'T BUY IF: From competitor where rival wins ===
    const dontBuyItems: string[] = [];

    if (competitor?.keyDifferences) {
        competitor.keyDifferences.forEach((diff) => {
            if (diff.winner === 'rival') {
                dontBuyItems.push(`${competitor.shortName || 'Concorrente'} é melhor em: ${diff.label} (${diff.rival})`);
            }
        });
    }

    // Add budget concerns if price is high
    const price = product.price || 0;
    if (price > 3000) {
        dontBuyItems.push(`Seu orçamento máximo é menor que R$ ${Math.round(price * 0.8).toLocaleString('pt-BR')}`);
    }

    if (dontBuyItems.length === 0) {
        dontBuyItems.push('Você precisa de recursos que este produto não oferece.');
    }

    // === TECHNICAL CONCLUSION: Template by category ===
    const categoryConclusions: Record<string, string> = {
        'robot-vacuum': `Este robô aspirador oferece um bom equilíbrio entre funcionalidades e preço. Avalie se os recursos atendem suas necessidades específicas de limpeza.`,
        'tv': `Esta Smart TV entrega qualidade de imagem competitiva na faixa de preço. Considere o ambiente de uso (sala clara vs escura) na decisão.`,
        'fridge': `Esta geladeira oferece boa eficiência para o tamanho. Verifique se as dimensões cabem no espaço disponível.`,
        'smartphone': `Este smartphone oferece bom custo-benefício para uso diário. Avalie se câmera e bateria atendem seu padrão de uso.`,
        'air_conditioner': `Este ar-condicionado é adequado para o espaço indicado. Verifique a instalação elétrica antes da compra.`,
    };

    const conclusionText = categoryConclusions[product.categoryId || '']
        || `Produto com características adequadas para a categoria. Compare com alternativas antes de decidir.`;

    return {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: finalSolutionItems,
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: attentionItems.slice(0, 4),
        },
        technicalConclusion: {
            title: 'Conclusão Técnica',
            icon: 'clipboard',
            color: 'blue',
            text: conclusionText,
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: dontBuyItems.slice(0, 4),
        },
    };
}

// ============================================
// SIMULATORS GENERATOR
// ============================================

/**
 * Generate Simulator alerts automatically from product specs
 */
export function generateSimulators(product: Product): Simulators {
    const specs = product.specs || {};
    const techSpecs = product.technicalSpecs || {};
    const categoryId = product.categoryId || '';

    const simulators: Simulators = {};

    // === SIZE ALERT: Based on physical dimensions ===
    if (categoryId === 'tv' && specs.screenSize) {
        simulators.sizeAlert = {
            status: 'acceptable',
            type: 'info',
            icon: 'ruler',
            title: 'Tamanho da Tela',
            message: `Tela de ${specs.screenSize}" é ideal para distância de ${Math.round(specs.screenSize as number * 4.2 / 100)}m a ${Math.round(specs.screenSize as number * 5 / 100)}m.`,
        };
    } else if (categoryId === 'robot-vacuum' && (specs.height || techSpecs.height)) {
        const height = Number(specs.height || techSpecs.height);
        const status = height < 8 ? 'optimal' : height < 10 ? 'acceptable' : 'warning';
        simulators.sizeAlert = {
            status,
            message: `Com ${height}cm de altura, ${status === 'warning' ? 'pode travar em móveis baixos' : 'passa sob a maioria dos móveis'}.`,
        };
    } else if (categoryId === 'fridge' && specs.capacity) {
        simulators.sizeAlert = {
            status: 'acceptable',
            type: 'info',
            icon: 'ruler',
            title: 'Capacidade',
            message: `${specs.capacity}L é adequado para família de ${Math.ceil((specs.capacity as number) / 100)} pessoas.`,
        };
    }

    // === SOUND ALERT: Based on noise level ===
    const noiseLevelRaw = specs.noiseLevel || techSpecs.noiseLevel;
    if (noiseLevelRaw) {
        const noiseLevel = Number(noiseLevelRaw);
        const status = noiseLevel < 35 ? 'optimal' : noiseLevel < 45 ? 'acceptable' : 'warning';
        const messages: Record<string, string> = {
            optimal: `Extremamente silencioso (${noiseLevel}dB). Ideal para quartos.`,
            acceptable: `Ruído moderado (${noiseLevel}dB). Adequado para uso geral.`,
            warning: `Ruído perceptível (${noiseLevel}dB). Considere uso em horários específicos.`,
        };
        simulators.soundAlert = {
            status,
            type: 'info',
            icon: 'volume2',
            title: 'Nível de Ruído',
            message: messages[status],
        };
    }

    // === ENERGY ALERT: Based on energy class or consumption ===
    const energyClass = specs.energyClass || techSpecs.energyClass;
    const inverter = specs.inverter || techSpecs.inverter;

    if (energyClass || inverter) {
        const rating = String(energyClass || (inverter ? 'A' : 'B'));
        const savings = inverter ? 'economia de até 40% vs. modelos convencionais' : 'consumo padrão para a categoria';
        simulators.energyAlert = {
            status: 'acceptable',
            rating,
            type: 'info',
            icon: 'zap',
            title: 'Eficiência Energética',
            message: `Classificação ${rating} - ${savings}.`,
        };
    }

    return simulators;
}

// ============================================
// COMBINED FALLBACK
// ============================================

/**
 * Get extended data with automatic fallback
 * Priority: JSON mock > Auto-generated > null
 */
export function getExtendedDataWithFallback(product: Product, jsonData: any | null) {
    if (jsonData) {
        return jsonData;
    }

    // No JSON mock - generate automatically
    return {
        product: {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.categoryId,
        },
        header: {
            overallScore: calculateOverallScore(product),
            scoreLabel: getScoreLabel(calculateOverallScore(product)),
            title: product.shortName || product.name,
            subtitle: (product as any).benefitSubtitle || '',
        },
        auditVerdict: generateAuditVerdict(product),
        simulators: generateSimulators(product),
        // productDna is handled separately via DNA chart component
        // decisionFAQ requires Gemini API or manual curation
    };
}

// ============================================
// HELPERS
// ============================================

function calculateOverallScore(product: Product): number {
    const scores = product.scores || {};
    const values = Object.values(scores).filter((v): v is number => typeof v === 'number' && v > 0);
    if (values.length === 0) return 7.5;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

function getScoreLabel(score: number): string {
    if (score >= 9.0) return 'Excelente';
    if (score >= 8.0) return 'Muito Bom';
    if (score >= 7.0) return 'Bom';
    if (score >= 6.0) return 'Razoável';
    return 'Abaixo da Média';
}
