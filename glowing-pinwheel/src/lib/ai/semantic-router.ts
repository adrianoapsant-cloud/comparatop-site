/**
 * Semantic Router - LLM-based intent detection for ComparaTop Chat
 * 
 * Replaces fragile regex-based intent detection with Gemini 2.0 Flash.
 * Handles Brazilian Portuguese nuances including:
 * - Number formats: "70.000" = 70000 (BR thousands separator)
 * - Slang: "500 conto", "10 pau", "1 barão"
 * - Approximations: "uns 5 mil"
 * 
 * @module semantic-router
 * @since 2026-01-20
 */

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// ============================================
// SCHEMA DEFINITIONS
// ============================================

/**
 * Intent categories for user queries
 */
export const IntentEnum = z.enum([
    'DISCOVERY',      // Looking for products, browsing, recommendations
    'COMPARISON',     // Compare specific products
    'TECHNICAL',      // Specs, consumption, TCO, manual questions
    'TRANSACTIONAL',  // Buy links, offers, prices
    'CHITCHAT'        // Greetings, off-topic, help
]);

/**
 * Category slugs matching our catalog
 */
export const CategoryEnum = z.enum([
    'smart-tvs',
    'geladeiras',
    'ar-condicionado',
    'lavadoras',
    'notebooks',
    'microondas',
    'robot-vacuum'
]);

/**
 * Technical fields that can be requested
 */
export const TechnicalFieldEnum = z.enum([
    'energy',      // kWh, consumption
    'tco',         // Total Cost of Ownership
    'specs',       // General specifications
    'manual',      // User manual, PDF
    'dimensions',  // Size, weight
    'noise'        // Decibels, noise level
]);

/**
 * Main schema for semantic intent extraction
 * 
 * CRITICAL: The LLM prompt must instruct proper handling of:
 * - Brazilian number formats (dots as thousands separator)
 * - Slang terms for money ("conto", "pau", "barão")
 * - Approximate budgets ("uns", "mais ou menos")
 */
export const UserIntentSchema = z.object({
    // Primary intent classification
    intent: IntentEnum,

    // Confidence score 0-1
    confidence: z.number().min(0).max(1),

    // Budget: ALWAYS normalize to integer REAIS (no cents)
    // LLM handles: "70.000" -> 70000, "5k" -> 5000, "500 conto" -> 500
    normalizedBudget: z.number().int().nullable(),

    // True if user used approximate language ("uns", "mais ou menos", "por aí")
    budgetIsApproximate: z.boolean().default(false),

    // Inferred filters from context
    filters: z.object({
        category: CategoryEnum.nullable(),
        brands: z.array(z.string()).default([]),
        // Features user wants (e.g., "inverter", "gamer", "4K")
        mustHaveFeatures: z.array(z.string()).default([]),
        // Features user explicitly doesn't want
        excludeFeatures: z.array(z.string()).default([])
    }),

    // For COMPARISON intent
    comparisonContext: z.object({
        productNames: z.array(z.string()).default([]),
        count: z.number().int().min(2).max(5).default(2)
    }).optional(),

    // For TECHNICAL intent - which fields are being asked about
    technicalFields: z.array(TechnicalFieldEnum).default([]),

    // For TRANSACTIONAL intent
    transactionalContext: z.object({
        wantsBuyLink: z.boolean().default(false),
        specificProductName: z.string().nullable().default(null)
    }).optional(),

    // Brief reasoning for debugging (max 100 chars)
    reasoning: z.string().max(200)
});

export type UserIntent = z.infer<typeof UserIntentSchema>;
export type IntentType = z.infer<typeof IntentEnum>;
export type CategorySlug = z.infer<typeof CategoryEnum>;

// ============================================
// ROUTER PROMPT
// ============================================

const ROUTER_SYSTEM_PROMPT = `Você é um roteador de intenções para o ComparaTop, um comparador de produtos brasileiros.

TAREFA: Analise a mensagem do usuário e extraia a intenção estruturada.

=== CLASSIFICAÇÃO DE INTENT ===
- DISCOVERY: Usuário quer encontrar produtos, recomendações, opções
- COMPARISON: Usuário quer comparar produtos específicos
- TECHNICAL: Usuário pergunta sobre specs, consumo, TCO, manual
- TRANSACTIONAL: Usuário quer link de compra, oferta, preço
- CHITCHAT: Saudação, off-topic, pedido de ajuda geral

=== PROCESSAMENTO DE ORÇAMENTO (CRÍTICO) ===
IMPORTANTE: Você DEVE normalizar valores monetários brasileiros corretamente.

Formato brasileiro:
- "70.000" = setenta mil (ponto é separador de milhares) → 70000
- "5.000" = cinco mil → 5000
- "1.500" = mil e quinhentos → 1500
- "500,00" = quinhentos reais (vírgula é decimal) → 500

Sufixos:
- "70k", "70K", "70 k" = 70000
- "5k", "5K" = 5000

Gírias brasileiras (MUITO IMPORTANTE):
- "500 conto" = 500 reais → 500
- "10 pau" = 10 mil reais → 10000
- "1 barão" = 1000 reais → 1000
- "5 pila" = 5 reais → 5
- "2 conto" = 2000 (quando falando de produtos caros) → 2000

Aproximações (marcar budgetIsApproximate=true):
- "uns 5 mil" = ~5000 → 5000 com budgetIsApproximate=true
- "mais ou menos 10k" = ~10000 → 10000 com budgetIsApproximate=true
- "por volta de 3000" = ~3000 → 3000 com budgetIsApproximate=true

=== INFERÊNCIA DE CATEGORIA ===
Detecte menções a:
- TVs: "tv", "televisão", "smart tv", "oled", "qled", "4k"
- Geladeiras: "geladeira", "refrigerador", "frost free"
- Ar-condicionado: "ar condicionado", "split", "btu"
- Lavadoras: "lavadora", "máquina de lavar", "lava e seca"
- Notebooks: "notebook", "laptop"
- Microondas: "microondas", "micro-ondas"
- Robô aspirador: "robô aspirador", "aspirador robô", "robot vacuum"

=== INFERÊNCIA DE FEATURES ===
Detecte especificações desejadas:
- "pra jogar" / "gamer" → mustHaveFeatures: ["gamer"]
- "econômica" / "baixo consumo" → mustHaveFeatures: ["energy_efficient"] 
- "inverter" → mustHaveFeatures: ["inverter"]
- "4K" → mustHaveFeatures: ["4k"]
- "grande" → mustHaveFeatures: ["large_capacity"]

=== REGRAS ===
1. Sempre retorne normalizedBudget como INTEGER (sem decimais)
2. Se não houver menção a orçamento, retorne null
3. Para comparações, extraia nomes de produtos mencionados
4. Confidence deve ser alta (>0.8) se a intenção for clara
5. Reasoning deve ser conciso (<100 chars)`;

function buildRouterPrompt(
    userMessage: string,
    context?: {
        categoryHint?: string | null;
        visibleProducts?: string[];
        previousIntent?: IntentType;
    }
): string {
    let prompt = `MENSAGEM DO USUÁRIO: "${userMessage}"`;

    if (context?.categoryHint) {
        prompt += `\n\nCONTEXTO: Usuário está na página de categoria "${context.categoryHint}"`;
    }

    if (context?.visibleProducts && context.visibleProducts.length > 0) {
        const products = context.visibleProducts.slice(0, 5).join(', ');
        prompt += `\n\nPRODUTOS VISÍVEIS: ${products}`;
    }

    if (context?.previousIntent) {
        prompt += `\n\nINTENT ANTERIOR: ${context.previousIntent}`;
    }

    prompt += '\n\nExtraia a intenção estruturada do usuário.';

    return prompt;
}

// ============================================
// MAIN ROUTER FUNCTION
// ============================================

export interface RouteWithLLMOptions {
    categoryHint?: string | null;
    visibleProducts?: string[];
    previousIntent?: IntentType;
    timeoutMs?: number;
}

/**
 * Route user intent using LLM-based semantic analysis
 * 
 * Uses Gemini 2.0 Flash for fast, cheap intent extraction.
 * Handles all Brazilian Portuguese nuances including slang budgets.
 * 
 * @param userMessage - The user's chat message
 * @param options - Optional context hints
 * @returns Structured intent with normalized values
 * 
 * @example
 * const intent = await routeWithLLM("qual a melhor TV até 70k?");
 * // Returns: { intent: 'DISCOVERY', normalizedBudget: 70000, ... }
 * 
 * @example
 * const intent = await routeWithLLM("quanto gasta a geladeira?");
 * // Returns: { intent: 'TECHNICAL', technicalFields: ['energy'], ... }
 */
export async function routeWithLLM(
    userMessage: string,
    options: RouteWithLLMOptions = {}
): Promise<UserIntent> {
    const { timeoutMs = 3000 } = options;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const { object } = await generateObject({
            model: google('gemini-2.0-flash-exp'),
            schema: UserIntentSchema,
            system: ROUTER_SYSTEM_PROMPT,
            prompt: buildRouterPrompt(userMessage, options),
            abortSignal: controller.signal,
        });

        clearTimeout(timeout);

        return object;
    } catch (error) {
        // Log error but don't crash - return safe fallback
        console.error('[SemanticRouter] LLM routing failed:', error instanceof Error ? error.message : error);

        // Return fallback intent (will trigger regex-based detection)
        return createFallbackIntent(userMessage);
    }
}

/**
 * Create fallback intent when LLM fails
 * Uses simple heuristics as safety net
 */
function createFallbackIntent(userMessage: string): UserIntent {
    const t = userMessage.toLowerCase();

    // Simple heuristic detection
    let intent: IntentType = 'DISCOVERY';

    if (/compar|vs|versus|lado a lado/.test(t)) {
        intent = 'COMPARISON';
    } else if (/consumo|kwh|gasta|manual|especifica|tco|custo real/.test(t)) {
        intent = 'TECHNICAL';
    } else if (/link|comprar|oferta|preço|onde/.test(t)) {
        intent = 'TRANSACTIONAL';
    } else if (/oi|olá|ola|bom dia|boa tarde|ajuda/.test(t)) {
        intent = 'CHITCHAT';
    }

    return {
        intent,
        confidence: 0.3, // Low confidence indicates fallback
        normalizedBudget: null,
        budgetIsApproximate: false,
        filters: {
            category: null,
            brands: [],
            mustHaveFeatures: [],
            excludeFeatures: []
        },
        technicalFields: [],
        reasoning: 'Fallback: LLM routing failed'
    };
}

// ============================================
// CONVERSION HELPERS
// ============================================

/**
 * Convert semantic intent to legacy DetectedIntents format
 * For backwards compatibility with existing handlers
 */
export interface LegacyDetectedIntents {
    catalog?: { category?: string; query?: string };
    budget?: { max: number; category?: string };
    compare?: { count: 2; category?: string };
    details?: { fields: ('energy' | 'tco' | 'specs' | 'manual')[] };
    manual?: boolean;
    buyLink?: { productName?: string };
}

export function toLegacyIntents(intent: UserIntent): LegacyDetectedIntents {
    const legacy: LegacyDetectedIntents = {};

    // DISCOVERY -> catalog
    if (intent.intent === 'DISCOVERY') {
        legacy.catalog = {
            category: intent.filters.category ?? undefined
        };
    }

    // Budget (applies to any intent)
    if (intent.normalizedBudget !== null) {
        legacy.budget = {
            max: intent.normalizedBudget,
            category: intent.filters.category ?? undefined
        };
    }

    // COMPARISON -> compare
    if (intent.intent === 'COMPARISON') {
        legacy.compare = {
            count: 2 as const, // Always 2 for comparison
            category: intent.filters.category ?? undefined
        };
    }

    // TECHNICAL -> details
    if (intent.intent === 'TECHNICAL' && intent.technicalFields.length > 0) {
        legacy.details = {
            fields: intent.technicalFields.filter(f =>
                ['energy', 'tco', 'specs', 'manual'].includes(f)
            ) as ('energy' | 'tco' | 'specs' | 'manual')[]
        };

        // Special case: manual gets its own flag
        if (intent.technicalFields.includes('manual')) {
            legacy.manual = true;
        }
    }

    // TRANSACTIONAL -> buyLink
    if (intent.intent === 'TRANSACTIONAL') {
        legacy.buyLink = {
            productName: intent.transactionalContext?.specificProductName ?? undefined
        };
    }

    return legacy;
}

// ============================================
// TESTING UTILITIES
// ============================================

/**
 * Test the router with a batch of prompts (for smoke testing)
 */
export async function testRouter(prompts: string[]): Promise<void> {
    console.log('\n🧪 SEMANTIC ROUTER TEST\n');
    console.log('='.repeat(60));

    for (const prompt of prompts) {
        console.log(`\n📝 "${prompt}"`);
        const result = await routeWithLLM(prompt);
        console.log(`   Intent: ${result.intent} (${(result.confidence * 100).toFixed(0)}%)`);
        if (result.normalizedBudget !== null) {
            console.log(`   Budget: R$ ${result.normalizedBudget.toLocaleString('pt-BR')}${result.budgetIsApproximate ? ' (approx)' : ''}`);
        }
        if (result.filters.category) {
            console.log(`   Category: ${result.filters.category}`);
        }
        console.log(`   Reason: ${result.reasoning}`);
    }

    console.log('\n' + '='.repeat(60));
}
