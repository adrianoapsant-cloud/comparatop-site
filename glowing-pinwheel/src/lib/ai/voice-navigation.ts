'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { ALL_PRODUCTS } from '@/data/products';
import type { VoiceAction } from './voice-types';

// ===========================================================
// PRODUCT DATABASE (for RAG / grounding)
// ===========================================================

const CATEGORIES = [
    { id: 'tv', names: ['tv', 'smart tv', 'televisão', 'televisao', 'televisor'] },
    { id: 'fridge', names: ['geladeira', 'geladeiras', 'refrigerador', 'freezer'] },
    { id: 'air_conditioner', names: ['ar condicionado', 'ar-condicionado', 'split', 'ar'] },
];

// Build product list for prompt
const PRODUCT_LIST = ALL_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    brand: p.brand,
    categoryId: p.categoryId,
}));

// ===========================================================
// SCHEMA FOR AI RESPONSE
// ===========================================================

const VoiceIntentSchema = z.object({
    action: z.enum([
        'navigate_product',
        'navigate_category',
        'compare_products',
        'search',
        'show_assistant',
        'redirect_to_assistant',
        'unknown',
    ]).describe('The type of action to take'),
    productIds: z.array(z.string()).optional().describe('Product IDs if action involves specific products'),
    productNames: z.array(z.string()).optional().describe('Product names mentioned by user'),
    categoryId: z.string().optional().describe('Category ID if navigating to category'),
    categoryName: z.string().optional().describe('Category name in Portuguese'),
    searchQuery: z.string().optional().describe('Search query if action is search'),
    message: z.string().optional().describe('Message to show user if needed'),
    agenticReason: z.enum(['comparison', 'price_alert', 'complex_question']).optional().describe('Reason for redirecting to assistant'),
    confidence: z.number().min(0).max(1).describe('Confidence level 0-1'),
});

// ===========================================================
// SYSTEM PROMPT
// ===========================================================

const SYSTEM_PROMPT = `Você é um assistente de navegação do ComparaTop, um site de comparação de produtos.

PRODUTOS DISPONÍVEIS NO CATÁLOGO:
${JSON.stringify(PRODUCT_LIST, null, 2)}

CATEGORIAS DISPONÍVEIS:
${JSON.stringify(CATEGORIES, null, 2)}

SUA TAREFA:
Analise o que o usuário disse e determine a melhor ação a tomar.

REGRAS DE DECISÃO:

1. **navigate_product**: Quando o usuário quer ver UM produto específico SEM fazer comparação
   - "mostre a LG C3" → navigate_product, productId: "lg-c3-65"
   - "quero ver a Samsung QN90C" → navigate_product, productId: "samsung-qn90c-65"

2. **navigate_category**: Quando o usuário quer ver uma CATEGORIA
   - "mostre as geladeiras" → navigate_category, categoryId: "fridge"
   - "quero ver TVs" → navigate_category, categoryId: "tv"

3. **redirect_to_assistant** (COMANDOS AGÊNTICOS - USE PARA ESTES CASOS!):
   a) COMPARAÇÕES - Quando o usuário quer COMPARAR produtos:
      - "compare LG C3 com Samsung QN90C" → redirect_to_assistant, agenticReason: "comparison"
      - "qual é melhor, TCL ou LG?" → redirect_to_assistant, agenticReason: "comparison"
      - "diferença entre X e Y" → redirect_to_assistant, agenticReason: "comparison"
   
   b) ALERTAS DE PREÇO - Quando o usuário quer monitorar preço:
      - "me avisa quando baixar" → redirect_to_assistant, agenticReason: "price_alert"
      - "tá caro, quero esperar" → redirect_to_assistant, agenticReason: "price_alert"
      - "monitora o preço" → redirect_to_assistant, agenticReason: "price_alert"
   
   c) PERGUNTAS COMPLEXAS - Quando precisa de análise profunda:
      - "qual TV é boa para jogos?" → redirect_to_assistant, agenticReason: "complex_question"
      - "vale a pena a Samsung?" → redirect_to_assistant, agenticReason: "complex_question"

4. **search**: Quando o usuário busca algo genérico que não existe no catálogo
   - "notebook gamer" → search (não temos notebooks)

5. **unknown**: Quando não conseguir entender
   - Sempre inclua uma mensagem amigável

IMPORTANTE: 
- Use os IDs exatos dos produtos do catálogo
- Faça fuzzy matching (LG C3 = lg-c3-65, TCL 735 = tcl-c735-65)
- PRIORIZE redirect_to_assistant para comparações, alertas de preço e perguntas complexas
- Essas ações precisam das ferramentas do Assistente IA`;

// ===========================================================
// PROCESS VOICE INPUT ACTION
// ===========================================================

/**
 * Process voice input and return the appropriate action
 * Uses Gemini to understand intent and match to products/categories
 */
export async function processVoiceInput(transcript: string): Promise<VoiceAction> {
    try {
        console.log('[VoiceNav Server] Processing:', transcript);
        console.log('[VoiceNav Server] API Key exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

        const { object } = await generateObject({
            model: google('gemini-2.0-flash'),
            schema: VoiceIntentSchema,
            system: SYSTEM_PROMPT,
            prompt: `O usuário disse: "${transcript}"
            
Analise e retorne a ação apropriada com os IDs corretos do catálogo.`,
        });

        console.log('[VoiceNav Server] AI Response:', JSON.stringify(object, null, 2));

        // Map AI response to VoiceAction
        switch (object.action) {
            case 'navigate_product':
                if (object.productIds?.[0]) {
                    return {
                        type: 'NAVIGATE_PRODUCT',
                        productId: object.productIds[0],
                        productName: object.productNames?.[0] || '',
                    };
                }
                break;

            case 'navigate_category':
                if (object.categoryId) {
                    return {
                        type: 'NAVIGATE_CATEGORY',
                        categoryId: object.categoryId,
                        categoryName: object.categoryName || '',
                    };
                }
                break;

            case 'compare_products':
                // Comparisons now redirect to assistant for Generative UI
                return {
                    type: 'REDIRECT_TO_ASSISTANT',
                    initialPrompt: transcript,
                    reason: 'comparison',
                };

            case 'search':
                return {
                    type: 'SEARCH',
                    query: object.searchQuery || transcript,
                };

            case 'show_assistant':
                return {
                    type: 'SHOW_ASSISTANT',
                    message: object.message || transcript,
                };

            case 'redirect_to_assistant':
                return {
                    type: 'REDIRECT_TO_ASSISTANT',
                    initialPrompt: transcript,
                    reason: object.agenticReason || 'complex_question',
                };
        }

        // Fallback
        return {
            type: 'UNKNOWN',
            message: object.message || 'Não entendi. Tente novamente.',
        };

    } catch (error) {
        // Log full error details for debugging
        console.error('[VoiceNav Server] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        // Return user-friendly error with additional context
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        return {
            type: 'UNKNOWN',
            message: `Erro: ${errorMsg.substring(0, 100)}`,
        };
    }
}

// ===========================================================
// GET URL FOR ACTION (exported separately for client use)
// Note: This logic is duplicated on the client since 'use server'
// files can only export async functions
// ===========================================================
