/**
 * @file contract.ts
 * @description PDP Modules Contract - Define módulos obrigatórios para PDPs completas
 * 
 * Este contrato garante que nenhum produto seja cadastrado com PDP incompleta.
 * Todos os módulos listados são OBRIGATÓRIOS, mesmo que com placeholders.
 */

// ============================================
// PDP MODULES CONTRACT
// ============================================

/**
 * Módulos obrigatórios em todo mock de produto
 */
export const REQUIRED_MOCK_MODULES = [
    'product',           // Dados básicos (id, name, brand, category)
    'header',            // Score geral + badges
    'auditVerdict',      // Veredito: solution, attentionPoint, technicalConclusion, dontBuyIf
    'productDna',        // DNA com 10 dimensões (radar data)
    'simulators',        // Alertas de tamanho/som/energia
    'decisionFAQ',       // Perguntas frequentes de decisão
] as const;

/**
 * Módulos opcionais mas recomendados (para futura expansão P21)
 */
export const OPTIONAL_MOCK_MODULES = [
    // Future P21 modules will be added here when mocks are updated
    // 'curiositySandwich',    // Texto azul ao lado da foto (currently from API)
    // 'communityConsensus',   // Consenso com nota (currently from API)
    // 'tcoDetails',           // Custo real completo (currently from shadow engine)
] as const;

/**
 * Submódulos obrigatórios dentro de auditVerdict
 */
export const REQUIRED_AUDIT_VERDICT_SECTIONS = [
    'solution',
    'attentionPoint',
    'technicalConclusion',
    'dontBuyIf',
] as const;

/**
 * Regras de validação para productDna
 */
export const PRODUCT_DNA_RULES = {
    minDimensions: 10,     // Mínimo 10 dimensões (c1-c10)
    maxDimensions: 10,     // Máximo 10 dimensões
    weightSumTolerance: 0.01,  // Soma dos pesos deve ser ~1.0
} as const;

/**
 * Campos obrigatórios no objeto product
 */
export const REQUIRED_PRODUCT_FIELDS = [
    'id',
    'name',
    'brand',
    'category',
] as const;

/**
 * Campos obrigatórios no objeto header
 */
export const REQUIRED_HEADER_FIELDS = [
    'overallScore',
    'scoreLabel',
    'title',
] as const;

/**
 * Campos obrigatórios em cada dimensão do productDna
 */
export const REQUIRED_DIMENSION_FIELDS = [
    'id',
    'name',
    'score',
    'weight',
] as const;

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface PdpModuleContract {
    requiredModules: readonly string[];
    optionalModules: readonly string[];
    auditVerdictSections: readonly string[];
    productDnaRules: typeof PRODUCT_DNA_RULES;
    requiredProductFields: readonly string[];
    requiredHeaderFields: readonly string[];
    requiredDimensionFields: readonly string[];
}

/**
 * Contrato completo exportado
 */
export const PDP_CONTRACT: PdpModuleContract = {
    requiredModules: REQUIRED_MOCK_MODULES,
    optionalModules: OPTIONAL_MOCK_MODULES,
    auditVerdictSections: REQUIRED_AUDIT_VERDICT_SECTIONS,
    productDnaRules: PRODUCT_DNA_RULES,
    requiredProductFields: REQUIRED_PRODUCT_FIELDS,
    requiredHeaderFields: REQUIRED_HEADER_FIELDS,
    requiredDimensionFields: REQUIRED_DIMENSION_FIELDS,
};

// ============================================
// PLACEHOLDER TEMPLATES
// ============================================

/**
 * Template placeholder para módulos sem dados
 * Usado quando um módulo é obrigatório mas ainda não tem conteúdo editorial
 */
export const PLACEHOLDER_TEMPLATES = {
    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: ['__CT_TODO__: Adicionar pontos fortes do produto'],
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: ['__CT_TODO__: Adicionar pontos de atenção'],
        },
        technicalConclusion: {
            title: 'Conclusão Técnica',
            icon: 'clipboard',
            color: 'blue',
            text: '__CT_TODO__: Adicionar conclusão técnica editorial',
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: ['__CT_TODO__: Adicionar cenários onde não é a melhor escolha'],
        },
    },
    simulators: {
        sizeAlert: {
            status: 'unknown',
            message: '__CT_TODO__: Adicionar alerta de dimensões',
        },
        soundAlert: {
            status: 'unknown',
            message: '__CT_TODO__: Adicionar alerta de som/ruído',
        },
        energyAlert: {
            rating: '?',
            message: '__CT_TODO__: Adicionar alerta de consumo energético',
        },
    },
    decisionFAQ: [
        {
            id: 'placeholder',
            icon: 'HelpCircle',
            question: '__CT_TODO__: Adicionar pergunta frequente',
            answer: '__CT_TODO__: Adicionar resposta',
        },
    ],
} as const;

export default PDP_CONTRACT;
