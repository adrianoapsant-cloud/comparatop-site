/**
 * ComparaTop - Product JSON Schema
 * Engine JSON Generator Template
 * 
 * Este arquivo define a estrutura TypeScript para os JSONs de produtos.
 * Use como referência para validação e tipagem.
 */

// ============================================
// TYPES
// ============================================

export interface ProductData {
    product: Product;
    header: Header;
    auditVerdict: AuditVerdict;
    productDna: ProductDna;
    simulators: Simulators;
    /** Decision FAQ - "Perguntas de quem estava em dúvida" */
    decisionFAQ?: DecisionFAQItem[];
}

/** FAQ item for decision doubts (comparison, routine, usage) */
export interface DecisionFAQItem {
    id: string;
    icon: string;  // Lucide icon name: Scale, Volume2, Dog, Wrench, etc.
    question: string;
    answer: string;
}

export interface Product {
    id: string;           // slug-do-produto-aqui
    name: string;         // Nome Comercial Exato
    brand: string;        // Marca
    category: string;     // categoria-slug
    releaseYear: number;  // 2024
}

export interface Header {
    overallScore: number;   // 0-10, 2 casas decimais. Ex: 8.45
    scoreLabel: string;     // "Excelente" | "Muito Bom" | "Bom" | "Regular" | "Ruim"
    title: string;          // Titulo curto do produto
    subtitle: string;       // Manchete de 1 linha resumindo o principal diferencial
    badges: Badge[];
}

export interface Badge {
    type: 'award' | 'certification' | 'gaming' | 'feature';
    label: string;
    icon: string;
}

export interface AuditVerdict {
    solution: VerdictSection;
    attentionPoint: VerdictSection;
    technicalConclusion: TechnicalConclusion;
    dontBuyIf: VerdictSection;
}

export interface VerdictSection {
    title: string;
    icon: string;
    color: 'emerald' | 'amber' | 'blue' | 'red';
    items: string[];  // Array de strings curtas
}

export interface TechnicalConclusion {
    title: string;
    icon: string;
    color: string;
    text: string;  // Parágrafo único de 3-4 linhas
}

export interface ProductDna {
    title: string;
    subtitle: string;
    dimensions: Dimension[];
}

export interface Dimension {
    id: string;          // c1, c2, c3...c10
    name: string;        // Nome completo da dimensão
    shortName: string;   // Nome curto para UI compacta
    score: number;       // 0-10 (nota 7 = Bom, 5 = Médio, >9.5 = Raro)
    description: string; // Justificativa curta
}

export interface Simulators {
    sizeAlert: SizeAlert;
    soundAlert: SoundAlert;
    energyAlert: EnergyAlert;
}

export interface SizeAlert {
    status: 'optimal' | 'acceptable' | 'warning';
    message: string;
    idealRange: {
        min: number;
        max: number;
    };
}

export interface SoundAlert {
    status: 'optimal' | 'acceptable' | 'warning';
    message: string;
    suggestions: {
        condition: string;
        product: string;
        reason: string;
    }[];
}

export interface EnergyAlert {
    rating: 'A' | 'B' | 'C' | 'D' | 'E';
    message: string;
}

// ============================================
// 10 DIMENSÕES PADRÃO (IDs fixos)
// ============================================

export const DIMENSIONS_CONFIG = [
    { id: 'c1', name: 'Custo-Benefício', shortName: 'Custo' },
    { id: 'c2', name: 'Design & Acabamento', shortName: 'Design' },
    { id: 'c3', name: 'Processamento', shortName: 'Processamento' },
    { id: 'c4', name: 'Qualidade de Imagem', shortName: 'Imagem' },
    { id: 'c5', name: 'Qualidade de Áudio', shortName: 'Áudio' },
    { id: 'c6', name: 'Gaming', shortName: 'Gaming' },
    { id: 'c7', name: 'Smart TV & Apps', shortName: 'Smart' },
    { id: 'c8', name: 'Conectividade', shortName: 'Conectividade' },
    { id: 'c9', name: 'Durabilidade', shortName: 'Durabilidade' },
    { id: 'c10', name: 'Suporte & Pós-Venda', shortName: 'Suporte' },
] as const;

// ============================================
// SCORE LABELS
// ============================================

export function getScoreLabel(score: number): string {
    if (score >= 9.0) return 'Excelente';
    if (score >= 8.0) return 'Muito Bom';
    if (score >= 7.0) return 'Bom';
    if (score >= 5.0) return 'Regular';
    return 'Ruim';
}

// ============================================
// PROMPT TEMPLATE (para IA)
// ============================================

export const ENGINE_PROMPT = `
# Contexto e Role
Você é o "Engine JSON Generator" do ComparaTop. Sua única função é converter dados brutos de produtos (Specs + Reviews) em um arquivo JSON estruturado que alimenta o frontend do site.
Você NÃO deve escrever texto livre. Você deve apenas preencher o Schema JSON fornecido.

# Instruções de Tom e Estilo
- **Veredito (Audit Verdict):** Seja direto, use bullet points curtos. Evite "marketing fluff". Fale como um engenheiro que audita o produto.
- **DNA (Scores):** Seja crítico. Notas acima de 9.5 são raras. Nota 7 é "Bom", nota 5 é "Médio".
- **Consistência:** Se você der nota baixa em "Áudio" no DNA, o campo "attentionPoint" DEVE mencionar o áudio ruim.

# INPUT DATA (Variáveis que você receberá)
{{PRODUCT_SPECS}}
{{PRODUCT_REVIEWS}}

# OUTPUT SCHEMA (Strict JSON)
Você deve responder APENAS com o JSON válido, sem markdown code fences.
`;
