/**
 * @file semantic-adapter.ts
 * @description SemanticAdapter - Unifica Radar Chart e HMUM Breakdown
 * 
 * Arquitetura "Iceberg Semântico":
 * - Camada Universal (c1-c3): Critérios presentes em TODAS as categorias
 * - Camada Polimórfica (c4-c8): Critérios contextuais por categoria
 * - Camada Esparsa (c9-c10): Reservas para diferenciação
 * - Verdades Ocultas (Extended): O que o consumidor deveria saber
 * 
 * Score final usa Média Harmônica Ponderada (pune notas muito baixas)
 */

// --- TYPES & INTERFACES ---

export type Metacategory = 'PERFORMANCE' | 'USABILITY' | 'CONSTRUCTION' | 'ECONOMY';
export type NormalizationType = 'LINEAR' | 'LOGARITHMIC' | 'INVERSE_EXP' | 'BOOLEAN' | 'MAPPING';

/**
 * Configuração de como transformar dados brutos em nota 0-10
 */
export interface NormalizationConfig {
    type: NormalizationType;
    min?: number;       // Para Linear
    max?: number;       // Para Linear
    refValue?: number;  // Para Inverse (ex: 35dB é o ideal)
    decay?: number;     // Fator de punição para Inverse
    map?: Record<string, number>;  // Mapeamento manual (ex: 'OLED': 4)
    boolTrue?: number;
    boolFalse?: number;
}

/**
 * Definição de um critério de avaliação
 */
export interface CriterionDef {
    label: string;
    metacategory: Metacategory;
    weight: number;  // Peso relativo (1-100)
    normalization: NormalizationConfig;
    unit?: string;
    source: 'scores' | 'specs' | 'computed';  // De onde vem o dado?
    dataField: string;  // Chave do dado (ex: 'c1', 'screen.refresh_rate')
    isHiddenTruth?: boolean;  // Se true, UI destaca como "Verdade Oculta"
    description?: string;  // Tooltip educativo
}

/**
 * Configuração completa de uma categoria
 */
export interface CategoryConfig {
    categoryId: string;
    displayName?: string;

    // Slots Físicos (c1-c10 - Retrocompatibilidade)
    criteria: Record<string, CriterionDef>;

    // Slots Virtuais (Novas verdades baseadas em Specs)
    extendedCriteria?: CriterionDef[];

    // Pesos macro das metacategorias para o Score Final
    metacategoryWeights: Record<Metacategory, number>;
}

/**
 * Dados unificados para UI
 */
export interface UnifiedProductData {
    // Para o Radar (4 eixos agregados)
    radarData: Record<Metacategory, {
        score: number;
        label: string;
        color: string;
    }>;

    // Para a Lista HMUM (Detalhado e Agrupado)
    breakdownData: {
        category: Metacategory;
        label: string;
        score: number;
        criteria: {
            id: string;
            label: string;
            valueDisplay: string;
            score: number;  // 0-10
            isHiddenTruth: boolean;
            description?: string;
        }[];
    }[];

    // Score Final (HMUM - Média Harmônica Ponderada)
    finalScore: number;

    // Warnings para UI
    warnings: string[];
}

// Labels e cores das metacategorias
const META_LABELS: Record<Metacategory, string> = {
    PERFORMANCE: 'Performance',
    USABILITY: 'Usabilidade',
    CONSTRUCTION: 'Construção',
    ECONOMY: 'Economia'
};

const META_COLORS: Record<Metacategory, string> = {
    PERFORMANCE: '#8884d8',
    USABILITY: '#82ca9d',
    CONSTRUCTION: '#ff7300',
    ECONOMY: '#4caf50'
};

// --- IMPLEMENTAÇÃO DO ADAPTER ---

export class SemanticAdapter {

    /**
     * Motor de Normalização - Transforma dados brutos em scores 0-10
     */
    private normalize(val: unknown, cfg: NormalizationConfig): number {
        if (val === undefined || val === null) return 0;
        const num = Number(val);

        switch (cfg.type) {
            case 'LINEAR': {
                // Regra de três simples entre min e max
                const min = cfg.min ?? 0;
                const max = cfg.max ?? 10;
                const lin = (num - min) / (max - min);
                return Math.max(0, Math.min(10, lin * 10));
            }

            case 'INVERSE_EXP': {
                // Para "Menor é Melhor" (Preço, Ruído). Decai rápido se afastar do ideal.
                // Score = 10 * e^( -decay * |val - ref| )
                const dist = Math.abs(num - (cfg.refValue ?? 0));
                return 10 * Math.exp(-(cfg.decay ?? 0.05) * dist);
            }

            case 'LOGARITHMIC': {
                // Para specs técnicas (Nits, Contrast). Ganhos marginais.
                return Math.min(10, Math.log10(num + 1) * 2.5);
            }

            case 'BOOLEAN':
                return val ? (cfg.boolTrue ?? 10) : (cfg.boolFalse ?? 0);

            case 'MAPPING':
                return cfg.map ? (cfg.map[String(val)] ?? 5) : 5;

            default:
                return 0;
        }
    }

    /**
     * Extrai campo do produto (suporta dot notation)
     */
    private getField(product: Record<string, unknown>, source: string, field: string): unknown {
        if (source === 'scores') {
            const scores = product.scores as Record<string, unknown> | undefined;
            return scores?.[field];
        }
        if (source === 'specs') {
            const specs = (product.specs ?? product.technicalSpecs) as Record<string, unknown> | undefined;
            return field.split('.').reduce<unknown>((obj, key) => {
                if (obj && typeof obj === 'object') {
                    return (obj as Record<string, unknown>)[key];
                }
                return undefined;
            }, specs);
        }
        return null;
    }

    /**
     * Processador Principal
     */
    public process(product: Record<string, unknown>, config: CategoryConfig): UnifiedProductData {
        // Inicializa acumuladores por metacategoria
        const metas: Record<Metacategory, {
            totalScore: number;
            totalWeight: number;
            items: UnifiedProductData['breakdownData'][0]['criteria'];
        }> = {
            PERFORMANCE: { totalScore: 0, totalWeight: 0, items: [] },
            USABILITY: { totalScore: 0, totalWeight: 0, items: [] },
            CONSTRUCTION: { totalScore: 0, totalWeight: 0, items: [] },
            ECONOMY: { totalScore: 0, totalWeight: 0, items: [] }
        };

        const warnings: string[] = [];

        // Helper para processar listas de critérios
        const processList = (list: { id: string; def: CriterionDef }[]) => {
            list.forEach(({ id, def }) => {
                const rawVal = this.getField(product, def.source, def.dataField);
                const score = this.normalize(rawVal, def.normalization);

                // Acumula para a média da Metacategoria
                metas[def.metacategory].totalScore += score * def.weight;
                metas[def.metacategory].totalWeight += def.weight;

                // Adiciona ao breakdown
                metas[def.metacategory].items.push({
                    id,
                    label: def.label,
                    valueDisplay: rawVal !== undefined ? `${rawVal} ${def.unit ?? ''}`.trim() : 'N/A',
                    score: Number(score.toFixed(1)),
                    isHiddenTruth: !!def.isHiddenTruth,
                    description: def.description
                });

                // Alerta para verdades ocultas críticas
                if (def.isHiddenTruth && score < 5) {
                    warnings.push(`⚠️ ${def.label}: ${def.description ?? 'Score baixo detectado'}`);
                }
            });
        };

        // Combina critérios físicos c1-c10 e estendidos em uma lista única
        const allCriteria = [
            ...Object.entries(config.criteria).map(([k, v]) => ({ id: k, def: v })),
            ...(config.extendedCriteria ?? []).map((v, i) => ({ id: `ext_${i}`, def: v }))
        ];

        processList(allCriteria);

        // Monta Output
        const radarData = {} as UnifiedProductData['radarData'];
        const breakdownData: UnifiedProductData['breakdownData'] = [];
        const finalWeights: number[] = [];
        const finalScores: number[] = [];

        (Object.keys(metas) as Metacategory[]).forEach(key => {
            const m = metas[key];
            const metaScore = m.totalWeight > 0 ? (m.totalScore / m.totalWeight) : 0;

            radarData[key] = {
                score: Number(metaScore.toFixed(1)),
                label: META_LABELS[key],
                color: META_COLORS[key]
            };

            breakdownData.push({
                category: key,
                label: META_LABELS[key],
                score: Number(metaScore.toFixed(1)),
                criteria: m.items.sort((a, b) => b.score - a.score)  // Melhores notas primeiro
            });

            // Prepara para HMUM Final
            if (config.metacategoryWeights[key] > 0) {
                finalScores.push(Math.max(0.1, metaScore));  // Evita div/0
                finalWeights.push(config.metacategoryWeights[key]);
            }
        });

        // CÁLCULO HMUM (Média Harmônica Ponderada)
        // Fórmula: Sum(Pesos) / Sum(Peso / Nota)
        // Pune severamente notas baixas (um 2 derruba muito mais que um 8 ajuda)
        const sumWeights = finalWeights.reduce((a, b) => a + b, 0);
        const sumInverse = finalScores.reduce((acc, score, i) => acc + (finalWeights[i] / score), 0);
        const finalScore = sumInverse > 0 ? (sumWeights / sumInverse) : 0;

        return {
            radarData,
            breakdownData,
            finalScore: Number(finalScore.toFixed(1)),
            warnings
        };
    }
}

// Singleton para uso global
export const semanticAdapter = new SemanticAdapter();
