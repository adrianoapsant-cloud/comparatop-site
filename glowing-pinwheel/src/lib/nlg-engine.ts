/**
 * NLG Engine 2.0 - Narrative Language Generator
 * 
 * Generates unique, opinion-based comparison text based on the 10 Pain Points scoring system.
 * This is NOT just specs comparison - it uses our proprietary Match Score system.
 */

import { Product } from '@/types/category';

// ============================================
// TYPES
// ============================================

export interface CriteriaResult {
    criteriaId: string;
    criteriaName: string;
    criteriaEmoji: string;
    productAScore: number;
    productBScore: number;
    winner: 'A' | 'B' | 'tie';
    winnerSeal: 'gold' | 'silver' | 'bronze' | 'none';
    loserSeal: 'gold' | 'silver' | 'bronze' | 'none';
    narrative: string;
}

export interface VersusResult {
    productA: Product;
    productB: Product;
    criteriaResults: CriteriaResult[];
    overallWinner: 'A' | 'B' | 'tie';
    overallNarrative: string;
    productAWins: number;
    productBWins: number;
    ties: number;
}

// ============================================
// CRITERIA DEFINITIONS (10 Pain Points)
// ============================================

interface CriteriaDefinition {
    id: string;
    name: string;
    emoji: string;
    category: 'tv' | 'fridge' | 'air_conditioner' | 'all';
}

const CRITERIA_BY_CATEGORY: Record<string, CriteriaDefinition[]> = {
    tv: [
        { id: 'c1', name: 'Custo-Benefício', emoji: '💰', category: 'tv' },
        { id: 'c2', name: 'Processamento de Imagem', emoji: '🖥️', category: 'tv' },
        { id: 'c3', name: 'Confiabilidade', emoji: '🛡️', category: 'tv' },
        { id: 'c4', name: 'Sistema Smart', emoji: '📱', category: 'tv' },
        { id: 'c5', name: 'Gaming', emoji: '🎮', category: 'tv' },
        { id: 'c6', name: 'Brilho/Sala Clara', emoji: '☀️', category: 'tv' },
        { id: 'c7', name: 'Pós-Venda', emoji: '🔧', category: 'tv' },
        { id: 'c8', name: 'Qualidade de Som', emoji: '🔊', category: 'tv' },
        { id: 'c9', name: 'Conectividade', emoji: '🔌', category: 'tv' },
        { id: 'c10', name: 'Design', emoji: '✨', category: 'tv' },
    ],
    fridge: [
        { id: 'c1', name: 'Custo-Benefício', emoji: '💰', category: 'fridge' },
        { id: 'c2', name: 'Eficiência Energética', emoji: '⚡', category: 'fridge' },
        { id: 'c3', name: 'Capacidade', emoji: '📦', category: 'fridge' },
        { id: 'c4', name: 'Refrigeração', emoji: '❄️', category: 'fridge' },
        { id: 'c5', name: 'Confiabilidade', emoji: '🛡️', category: 'fridge' },
        { id: 'c6', name: 'Ruído', emoji: '🔇', category: 'fridge' },
        { id: 'c7', name: 'Pós-Venda', emoji: '🔧', category: 'fridge' },
        { id: 'c8', name: 'Recursos Smart', emoji: '📱', category: 'fridge' },
        { id: 'c9', name: 'Design', emoji: '✨', category: 'fridge' },
        { id: 'c10', name: 'Funcionalidades', emoji: '⚙️', category: 'fridge' },
    ],
    air_conditioner: [
        { id: 'c1', name: 'Custo-Benefício', emoji: '💰', category: 'air_conditioner' },
        { id: 'c2', name: 'Eficiência Energética', emoji: '⚡', category: 'air_conditioner' },
        { id: 'c3', name: 'Capacidade BTU', emoji: '❄️', category: 'air_conditioner' },
        { id: 'c4', name: 'Durabilidade', emoji: '🛡️', category: 'air_conditioner' },
        { id: 'c5', name: 'Silêncio', emoji: '🔇', category: 'air_conditioner' },
        { id: 'c6', name: 'Tecnologia Inverter', emoji: '🔄', category: 'air_conditioner' },
        { id: 'c7', name: 'Filtros de Ar', emoji: '🌬️', category: 'air_conditioner' },
        { id: 'c8', name: 'Instalação', emoji: '🔧', category: 'air_conditioner' },
        { id: 'c9', name: 'Conectividade', emoji: '📱', category: 'air_conditioner' },
        { id: 'c10', name: 'Design', emoji: '✨', category: 'air_conditioner' },
    ],
};

// ============================================
// SEAL CALCULATION
// ============================================

function getSeal(score: number): 'gold' | 'silver' | 'bronze' | 'none' {
    if (score >= 9) return 'gold';
    if (score >= 7.5) return 'silver';
    if (score >= 6) return 'bronze';
    return 'none';
}

function getSealLabel(seal: 'gold' | 'silver' | 'bronze' | 'none'): string {
    switch (seal) {
        case 'gold': return 'Ouro 🥇';
        case 'silver': return 'Prata 🥈';
        case 'bronze': return 'Bronze 🥉';
        default: return 'Sem selo';
    }
}

// ============================================
// NARRATIVE GENERATION
// ============================================

function generateCriteriaNarrative(
    criteria: CriteriaDefinition,
    productA: Product,
    productB: Product,
    scoreA: number,
    scoreB: number,
    winner: 'A' | 'B' | 'tie'
): string {
    const nameA = productA.shortName || productA.brand;
    const nameB = productB.shortName || productB.brand;
    const sealA = getSealLabel(getSeal(scoreA));
    const sealB = getSealLabel(getSeal(scoreB));
    const diff = Math.abs(scoreA - scoreB).toFixed(1);

    if (winner === 'tie') {
        return `Em ${criteria.name}, ambos os produtos empatam com desempenho similar. ${nameA} tem ${sealA} e ${nameB} tem ${sealB}.`;
    }

    const winnerName = winner === 'A' ? nameA : nameB;
    const loserName = winner === 'A' ? nameB : nameA;
    const winnerSeal = winner === 'A' ? sealA : sealB;
    const winnerScore = winner === 'A' ? scoreA : scoreB;

    // Category-specific narratives
    if (criteria.id === 'c5' && productA.categoryId === 'tv') {
        // Gaming
        const hdmi21A = (productA.attributes as Record<string, unknown>)?.hdmi21Ports || 0;
        const hdmi21B = (productB.attributes as Record<string, unknown>)?.hdmi21Ports || 0;
        if (Number(hdmi21A) > 0 || Number(hdmi21B) > 0) {
            const winnerHdmi = winner === 'A' ? hdmi21A : hdmi21B;
            return `Na batalha de ${criteria.name}, ${winnerName} vence com selo ${winnerSeal} graças às ${winnerHdmi} portas HDMI 2.1, superando ${loserName} por ${diff} pontos.`;
        }
    }

    if (criteria.id === 'c6' && productA.categoryId === 'tv') {
        // Brightness/Sala Clara
        const brightnessA = (productA.attributes as Record<string, unknown>)?.brightness || 0;
        const brightnessB = (productB.attributes as Record<string, unknown>)?.brightness || 0;
        if (Number(brightnessA) > 0 || Number(brightnessB) > 0) {
            const winnerBrightness = winner === 'A' ? brightnessA : brightnessB;
            return `Na batalha de ${criteria.name}, ${winnerName} vence com selo ${winnerSeal} devido ao brilho de ${winnerBrightness} nits, superando ${loserName}.`;
        }
    }

    // Generic narrative
    return `Na batalha de ${criteria.name}, ${winnerName} vence com selo ${winnerSeal} (${winnerScore.toFixed(1)}/10), superando ${loserName} por ${diff} pontos.`;
}

// ============================================
// MAIN COMPARISON FUNCTION
// ============================================

export function generateVersusComparison(productA: Product, productB: Product): VersusResult {
    const categoryId = productA.categoryId;
    const criteria = CRITERIA_BY_CATEGORY[categoryId] || CRITERIA_BY_CATEGORY.tv;

    const scoresA = productA.scores || {};
    const scoresB = productB.scores || {};

    let productAWins = 0;
    let productBWins = 0;
    let ties = 0;

    const criteriaResults: CriteriaResult[] = criteria.map(c => {
        const scoreA = (scoresA[c.id] as number) || 7;
        const scoreB = (scoresB[c.id] as number) || 7;

        let winner: 'A' | 'B' | 'tie';
        if (Math.abs(scoreA - scoreB) < 0.3) {
            winner = 'tie';
            ties++;
        } else if (scoreA > scoreB) {
            winner = 'A';
            productAWins++;
        } else {
            winner = 'B';
            productBWins++;
        }

        return {
            criteriaId: c.id,
            criteriaName: c.name,
            criteriaEmoji: c.emoji,
            productAScore: scoreA,
            productBScore: scoreB,
            winner,
            winnerSeal: getSeal(winner === 'A' ? scoreA : winner === 'B' ? scoreB : Math.max(scoreA, scoreB)),
            loserSeal: getSeal(winner === 'A' ? scoreB : winner === 'B' ? scoreA : Math.min(scoreA, scoreB)),
            narrative: generateCriteriaNarrative(c, productA, productB, scoreA, scoreB, winner),
        };
    });

    // Overall winner
    let overallWinner: 'A' | 'B' | 'tie';
    if (productAWins > productBWins) {
        overallWinner = 'A';
    } else if (productBWins > productAWins) {
        overallWinner = 'B';
    } else {
        overallWinner = 'tie';
    }

    // Overall narrative
    const nameA = productA.shortName || productA.brand;
    const nameB = productB.shortName || productB.brand;

    let overallNarrative: string;
    if (overallWinner === 'tie') {
        overallNarrative = `A batalha entre ${nameA} e ${nameB} termina em empate técnico! Cada um vence em ${productAWins} critérios. A escolha depende das suas prioridades específicas.`;
    } else {
        const winnerName = overallWinner === 'A' ? nameA : nameB;
        const loserName = overallWinner === 'A' ? nameB : nameA;
        const winnerWins = overallWinner === 'A' ? productAWins : productBWins;
        const loserWins = overallWinner === 'A' ? productBWins : productAWins;
        overallNarrative = `${winnerName} vence o duelo! Com vitória em ${winnerWins} dos 10 critérios analisados, supera ${loserName} que venceu em apenas ${loserWins}. ${ties > 0 ? `Houve ${ties} empate(s) técnico(s).` : ''}`;
    }

    return {
        productA,
        productB,
        criteriaResults,
        overallWinner,
        overallNarrative,
        productAWins,
        productBWins,
        ties,
    };
}

// ============================================
// PRODUCT RECOMMENDATIONS GENERATOR
// ============================================

export interface ProductRecommendation {
    recommendedFor: string[];
    notRecommendedFor: string[];
}

export function generateProductRecommendations(product: Product): ProductRecommendation {
    const scores = product.scores || {};
    const categoryId = product.categoryId;
    const recommendedFor: string[] = [];
    const notRecommendedFor: string[] = [];

    if (categoryId === 'tv') {
        // Gaming
        if ((scores.c5 as number) >= 9) {
            recommendedFor.push('Gamers competitivos que exigem input lag mínimo');
        } else if ((scores.c5 as number) < 6) {
            notRecommendedFor.push('Gamers que jogam títulos competitivos');
        }

        // Cinema/Image
        if ((scores.c2 as number) >= 9) {
            recommendedFor.push('Cinéfilos que priorizam qualidade de imagem');
        }

        // Bright rooms
        if ((scores.c6 as number) >= 8.5) {
            recommendedFor.push('Salas com muita luz natural');
        } else if ((scores.c6 as number) < 6) {
            notRecommendedFor.push('Ambientes com luz direta do sol');
        }

        // Sound
        if ((scores.c8 as number) < 6) {
            notRecommendedFor.push('Quem não pretende usar soundbar');
        }

        // Budget
        if ((scores.c1 as number) >= 9) {
            recommendedFor.push('Quem busca o melhor custo-benefício');
        } else if ((scores.c1 as number) < 6) {
            notRecommendedFor.push('Orçamentos limitados');
        }
    }

    if (categoryId === 'fridge') {
        // Capacity
        if ((scores.c3 as number) >= 9) {
            recommendedFor.push('Famílias grandes que precisam de muito espaço');
        } else if ((scores.c3 as number) < 6) {
            notRecommendedFor.push('Famílias com mais de 4 pessoas');
        }

        // Energy
        if ((scores.c2 as number) >= 9) {
            recommendedFor.push('Quem se preocupa com a conta de luz');
        }

        // Smart features
        if ((scores.c8 as number) >= 9) {
            recommendedFor.push('Entusiastas de tecnologia smart home');
        } else if ((scores.c8 as number) < 5) {
            notRecommendedFor.push('Quem precisa de recursos smart e WiFi');
        }
    }

    if (categoryId === 'air_conditioner') {
        // Inverter/Efficiency
        if ((scores.c2 as number) >= 9) {
            recommendedFor.push('Quem usa ar condicionado por longos períodos');
        } else if ((scores.c2 as number) < 6) {
            notRecommendedFor.push('Uso frequente e prolongado');
        }

        // Noise
        if ((scores.c5 as number) >= 9) {
            recommendedFor.push('Quartos e ambientes que exigem silêncio');
        } else if ((scores.c5 as number) < 6) {
            notRecommendedFor.push('Quartos de pessoas com sono leve');
        }

        // Connectivity
        if ((scores.c9 as number) >= 8) {
            recommendedFor.push('Quem quer controlar o ar pelo celular');
        }
    }

    // Default recommendations if none generated
    if (recommendedFor.length === 0) {
        recommendedFor.push('Usuários que buscam um produto equilibrado');
    }
    if (notRecommendedFor.length === 0) {
        if ((scores.c1 as number) < 7) {
            notRecommendedFor.push('Quem busca o menor preço possível');
        } else {
            notRecommendedFor.push('Quem precisa de recursos específicos não oferecidos');
        }
    }

    return { recommendedFor, notRecommendedFor };
}
