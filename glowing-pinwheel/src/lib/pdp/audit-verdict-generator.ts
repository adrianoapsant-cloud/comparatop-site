/**
 * Audit Verdict Auto-Generator
 * 
 * Generates auditVerdict from product scores and specs.
 * Maps high scores to "A Solução" (strengths) and low scores to "Ponto de Atenção" (weaknesses)
 */

import type { Product } from '@/types/category';
import { extractRadarDimensions, type RadarDimension } from './extract-radar-dimensions';

export interface AuditVerdictData {
    solution: {
        title: string;
        icon: string;
        color: string;
        items: string[];
    };
    attentionPoint: {
        title: string;
        icon: string;
        color: string;
        items: string[];
    };
    technicalConclusion: {
        title: string;
        text: string;
        color: string;
    };
    dontBuyIf: {
        title: string;
        icon: string;
        color: string;
        items: string[];
    };
}

// Templates for generating verdict items based on dimension scores
const VERDICT_TEMPLATES: Record<string, {
    high: (score: number) => string;
    low: (score: number) => string;
}> = {
    'Navegação': {
        high: (s) => `Navegação LiDAR de alta precisão (${s.toFixed(1)}/10) — mapeia a casa com eficiência`,
        low: (s) => `Sistema de navegação pode ter dificuldades em ambientes complexos (${s.toFixed(1)}/10)`,
    },
    'App/Conectividade': {
        high: (s) => `App intuitivo com controle completo (${s.toFixed(1)}/10)`,
        low: (s) => `App pode ser confuso ou ter recursos limitados (${s.toFixed(1)}/10)`,
    },
    'Sistema de Mop': {
        high: (s) => `Sistema de mop eficiente para manutenção diária (${s.toFixed(1)}/10)`,
        low: (s) => `Mop estático — apenas arrasta pano, não esfrega (${s.toFixed(1)}/10)`,
    },
    'Escovas': {
        high: (s) => `Escovas anti-emaranhamento para pelos de pets (${s.toFixed(1)}/10)`,
        low: (s) => `Escovas podem emaranhar com cabelos longos (${s.toFixed(1)}/10)`,
    },
    'Bateria/Autonomia': {
        high: (s) => `Autonomia estendida para casas grandes (${s.toFixed(1)}/10)`,
        low: (s) => `Autonomia limitada para espaços maiores (${s.toFixed(1)}/10)`,
    },
    'Acústica': {
        high: (s) => `Opera silenciosamente (${s.toFixed(1)}/10)`,
        low: (s) => `Pode ser ruidoso em potência máxima (${s.toFixed(1)}/10)`,
    },
    'Qualidade de Imagem': {
        high: (s) => `Qualidade de imagem excepcional (${s.toFixed(1)}/10)`,
        low: (s) => `Qualidade de imagem pode não atender expectativas premium (${s.toFixed(1)}/10)`,
    },
    'HDR/Contraste': {
        high: (s) => `HDR e contraste de cinema (${s.toFixed(1)}/10)`,
        low: (s) => `HDR limitado para conteúdo premium (${s.toFixed(1)}/10)`,
    },
    'Gaming': {
        high: (s) => `Excelente para jogos com baixa latência (${s.toFixed(1)}/10)`,
        low: (s) => `Não ideal para gaming competitivo (${s.toFixed(1)}/10)`,
    },
    // Default template for unknown dimensions
    'default': {
        high: (s) => `Bom desempenho neste critério (${s.toFixed(1)}/10)`,
        low: (s) => `Desempenho abaixo da média neste critério (${s.toFixed(1)}/10)`,
    },
};

/**
 * Generate audit verdict from product scores
 */
export function generateAuditVerdict(product: Product): AuditVerdictData | null {
    const dimensions = extractRadarDimensions(product);

    if (dimensions.length < 3) {
        return null;
    }

    // Separate into strengths (≥8) and weaknesses (<7)
    const strengths = dimensions.filter(d => d.score >= 8).sort((a, b) => b.score - a.score);
    const weaknesses = dimensions.filter(d => d.score < 7).sort((a, b) => a.score - b.score);

    // Generate solution items (top 5 strengths)
    const solutionItems = strengths.slice(0, 5).map(dim => {
        const template = VERDICT_TEMPLATES[dim.name] || VERDICT_TEMPLATES['default'];
        return template.high(dim.score);
    });

    // Generate attention items (top 3 weaknesses)
    const attentionItems = weaknesses.slice(0, 3).map(dim => {
        const template = VERDICT_TEMPLATES[dim.name] || VERDICT_TEMPLATES['default'];
        return template.low(dim.score);
    });

    // Add default items if lists are too short
    if (solutionItems.length < 3) {
        solutionItems.push('Produto com bom custo-benefício geral');
    }
    if (attentionItems.length === 0) {
        attentionItems.push('Nenhum ponto crítico identificado na análise técnica');
    }

    return {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: solutionItems,
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: attentionItems,
        },
        technicalConclusion: {
            title: 'Conclusão Técnica',
            text: generateTechnicalConclusion(product, strengths, weaknesses),
            color: 'blue',
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: generateDontBuyIfItems(weaknesses),
        },
    };
}

/**
 * Generate technical conclusion text
 */
function generateTechnicalConclusion(
    product: Product,
    strengths: RadarDimension[],
    weaknesses: RadarDimension[]
): string {
    const productName = product.shortName || product.name;
    const strengthCount = strengths.length;
    const weaknessCount = weaknesses.length;

    if (strengthCount >= 5 && weaknessCount <= 1) {
        return `O ${productName} demonstra excelência em praticamente todas as dimensões avaliadas. Recomendado sem ressalvas para a maioria dos usuários.`;
    }

    if (strengthCount >= 3 && weaknessCount <= 2) {
        return `O ${productName} oferece um equilíbrio sólido entre performance e custo. Os pontos de atenção são aceitáveis para o segmento de preço.`;
    }

    return `O ${productName} tem pontos fortes específicos que podem atender bem a certos perfis de usuário. Avalie se os pontos de atenção impactam seu uso pretendido.`;
}

/**
 * Generate "don't buy if" contra-indication items
 */
function generateDontBuyIfItems(weaknesses: RadarDimension[]): string[] {
    if (weaknesses.length === 0) {
        return ['Você precisa de performance máxima em todos os critérios'];
    }

    const dontBuyItems = weaknesses.slice(0, 3).map(dim => {
        // Map dimension names to contra-indications
        const contraMap: Record<string, string> = {
            'Navegação': 'Você tem uma casa grande com muitos cômodos',
            'App/Conectividade': 'Você depende de automação avançada via app',
            'Sistema de Mop': 'Você precisa de limpeza profunda de pisos',
            'Bateria/Autonomia': 'Sua casa tem mais de 100m²',
            'Acústica': 'Você trabalha de home office durante as limpezas',
            'Qualidade de Imagem': 'Você é videófilo exigente',
            'Gaming': 'Você joga competitivamente online',
        };
        return contraMap[dim.name] || `Você prioriza ${dim.name.toLowerCase()} acima de tudo`;
    });

    return dontBuyItems;
}

/**
 * Check if product has enough data to generate verdict
 */
export function canGenerateAuditVerdict(product: Product): boolean {
    const dimensions = extractRadarDimensions(product);
    return dimensions.length >= 3;
}
