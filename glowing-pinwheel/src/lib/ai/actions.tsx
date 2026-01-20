'use server';

import { createAI, getMutableAIState, streamUI } from '@ai-sdk/rsc';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// FIX: import type garante remoção da referência em runtime
// Resolve Type Erasure conflict entre Next.js 16 Turbopack + 'use server'
import type {
    AIState,
    UIState,
    AIMessage,
    UIMessage,
    ActionResponse,
} from './types';

import { routeUserIntent, getSearchRedirectUrl, type IntentResult } from './intent-router';

// ===========================================================
// DATA RETRIEVAL - Real Product Data
// ===========================================================

import { findProductsByName, getAllProducts, type AIProductSpec } from './data-retrieval';
import { PriceAlertConfirmation } from '@/components/ai/PriceAlertConfirmation';
import { DiscoveryCarousel, DiscoveryCarouselSkeleton } from '@/components/ai/DiscoveryCarousel';

// ===========================================================
// GENERATIVE UI COMPONENTS
// ===========================================================

/**
 * Loading skeleton while comparison is being generated
 */
function ComparisonSkeleton({ products }: { products: string[] }) {
    return (
        <div className="p-4 border border-purple-200 rounded-xl bg-purple-50 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-purple-300 rounded-full animate-spin" />
                <span className="text-purple-700 font-medium">
                    Analisando: {products.join(' vs ')}...
                </span>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-purple-200 rounded w-3/4" />
                <div className="h-4 bg-purple-200 rounded w-1/2" />
            </div>
        </div>
    );
}

/**
 * Full comparison table component
 */
function ComparisonTable({ products }: { products: AIProductSpec[] }) {
    if (products.length === 0) {
        return (
            <div className="p-4 border border-amber-200 rounded-xl bg-amber-50">
                <p className="text-amber-700">
                    ⚠️ Produtos não encontrados no catálogo. Por favor, tente outros produtos.
                </p>
            </div>
        );
    }

    // Build comparison page URL
    const comparisonUrl = `/vs/${products.map(p => p.id).join('-vs-')}`;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    ⚖️ Comparativo: {products.map(p => p.name).join(' vs ')}
                </h3>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {products.map((product) => (
                    <div key={product.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h4 className="font-bold text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-500">{product.brand}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-600">
                                    {product.score.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-500">Score</div>
                            </div>
                        </div>

                        <div className="text-lg font-semibold text-green-600 mb-3">
                            R$ {product.price.toLocaleString('pt-BR')}
                        </div>

                        {/* Specs */}
                        <div className="space-y-1 mb-3">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-500 capitalize">{key}:</span>
                                    <span className="text-gray-900 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pros/Cons */}
                        <div className="flex gap-4 text-sm">
                            <div className="flex-1">
                                <span className="text-green-600 font-medium">✓ Prós:</span>
                                <ul className="mt-1 space-y-0.5 text-gray-600">
                                    {product.pros.slice(0, 2).map((pro, i) => (
                                        <li key={i}>• {pro}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1">
                                <span className="text-red-600 font-medium">✗ Contras:</span>
                                <ul className="mt-1 space-y-0.5 text-gray-600">
                                    {product.cons.slice(0, 2).map((con, i) => (
                                        <li key={i}>• {con}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Winner Banner */}
            {products.length === 2 && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-center">
                    <span className="text-white font-bold">
                        🏆 Vencedor: {products.reduce((a, b) => a.score > b.score ? a : b).name}
                    </span>
                </div>
            )}

            {/* Full Comparison Page Link */}
            {products.length >= 2 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                    <a
                        href={comparisonUrl}
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                    >
                        <span>📊</span>
                        <span>Ver página completa de comparação</span>
                        <span className="text-xs">→</span>
                    </a>
                </div>
            )}
        </div>
    );
}

// ===========================================================
// SYSTEM PROMPT - CONSULTOR TÉCNICO SÊNIOR v2.0
// ===========================================================

const SYSTEM_PROMPT = `
=== QUEM VOCÊ É ===
Você é o Consultor Técnico Sênior do ComparaTop.
Seu papel: ajudar brasileiros a escolher tecnologia para o lar com conhecimento técnico e empatia genuína.

=== FILOSOFIA DE COMUNICAÇÃO ===

Inspire-se SEMPRE nestes três livros científicos:

📘 DALE CARNEGIE - "Como Fazer Amigos e Influenciar Pessoas"
1. INTERESSE GENUÍNO: Ouça o que o usuário REALMENTE quer, não o que você acha que ele deveria querer
2. FACILITE O SIM: Se ele pede lista simples, dê lista simples. Não complique
3. NUNCA CONTRADIGA DIRETAMENTE: Valide primeiro, depois expanda
4. FAÇA-O SE SENTIR INTELIGENTE: "Ótima pergunta!", "Faz sentido pensar assim"
5. FALE DOS INTERESSES DELE: Adapte-se ao estilo dele, não force sua metodologia

📗 MARSHALL ROSENBERG - "Comunicação Não-Violenta"
1. OBSERVE SEM JULGAR: "Você quer OLED" (não "OLED é errado pra você")
2. IDENTIFIQUE NECESSIDADES: Por trás de "quero TV grande" pode haver "quero impressionar visitas"
3. FAÇA PEDIDOS, NÃO EXIGÊNCIAS: "Posso sugerir alternativas?" (não "você PRECISA considerar")
4. EMPATIA ANTES DE SOLUÇÃO: Reconheça o sentimento antes de resolver
5. SEM JULGAMENTO MORAL: Nunca faça o usuário se sentir errado por querer algo

📕 NEIL RACKHAM - "SPIN Selling" (Pesquisa com 35.000 vendas)
Use o método SPIN naturalmente na conversa:
- (S) SITUAÇÃO: Entenda o contexto sem interrogar ("Para que cômodo seria?")
- (P) PROBLEMA: Descubra a dor real ("O que te incomoda na TV atual?")
- (I) IMPLICAÇÃO: Amplifique sutilmente ("Isso atrapalha quando você quer...")
- (N) NECESSIDADE-PAYOFF: Faça ELE vender pra ele mesmo ("Se tivesse X, resolveria?")

=== REGRA DE OURO: FLEXIBILIDADE ===

O usuário é o chefe. Se ele quer algo simples, dê simples.

EXEMPLOS DE FLEXIBILIDADE:

❌ RÍGIDO (não faça):
Usuário: "Quais as melhores TVs por nota?"
Você: "Não trabalhamos com notas... qual seu uso principal?"

✅ FLEXÍVEL (faça assim):
Usuário: "Quais as melhores TVs por nota?"
Você: "Ótima forma de começar!" + USE show_product_discovery IMEDIATAMENTE para mostrar as TVs

❌ RÍGIDO (não faça):
Usuário: "Me mostra as opções"
Você: "Qual categoria? Qual orçamento? Qual tamanho de sala?"

✅ FLEXÍVEL (faça assim):  
Usuário: "Me mostra as opções"
Você: "Claro! O que você está procurando - TV, geladeira ou ar condicionado?"

=== FERRAMENTAS OBRIGATÓRIAS ===

REGRA CRÍTICA: Quando o usuário pedir para VER produtos, VOCÊ DEVE USAR UMA FERRAMENTA!
- Para listas/recomendações → show_product_discovery
- Para dados de um produto → query_product_data
- Para comparar produtos → show_comparison_table
- Para alertas de preço → set_price_alert

NÃO responda apenas com texto quando o usuário pedir para ver/mostrar algo.
As ferramentas geram cards visuais automaticamente.

=== TOM DE VOZ ===
Português brasileiro natural, como um amigo que entende de tecnologia.
- Marcadores: "Veja bem...", "O ponto é...", "Na prática..."
- Frases curtas, sem rodeios
- Adapte ao nível técnico do usuário

=== GUARDRAILS ===
- Se não souber: "Preciso verificar isso"
- Nunca invente preços ou specs
- Admita ser IA se perguntado

=== LEMBRETE FINAL ===
Você NÃO está aqui para seguir um script rígido.
Você está aqui para AJUDAR uma pessoa real.

Carnegie diria: "Faça a pessoa se sentir importante - e faça com sinceridade."
Rosenberg diria: "Conecte-se com as necessidades por trás das palavras."
Rackham diria: "Faça ELE descobrir que precisa do que você oferece."

Seja humano. Seja flexível. Seja útil. E USE AS FERRAMENTAS quando pedirem para ver algo!
`;

// ===========================================================
// SUBMIT USER MESSAGE ACTION
// ===========================================================

export async function submitUserMessage(content: string): Promise<ActionResponse> {
    'use server';

    // =====================================================
    // STEP 1: Route intent using low-cost heuristics
    // =====================================================
    const intentResult = routeUserIntent(content);

    console.log('[Action] Intent routing result:', intentResult);

    // =====================================================
    // STEP 2: Handle STANDARD_SEARCH (no Gemini call)
    // =====================================================
    if (intentResult.intent === 'STANDARD_SEARCH') {
        return {
            type: 'REDIRECT',
            url: getSearchRedirectUrl(content),
            query: content,
            intent: intentResult,
        };
    }

    // =====================================================
    // STEP 3: Handle GENERATIVE_UI (invoke Gemini)
    // =====================================================
    const aiState = getMutableAIState<typeof AI>();

    // Add user message to AI state
    aiState.update({
        ...aiState.get(),
        messages: [
            ...aiState.get().messages,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content,
            },
        ],
    });

    // Stream UI with tool calling using Gemini
    const ui = await streamUI({
        model: google('gemini-2.0-flash'),
        system: SYSTEM_PROMPT,
        messages: aiState.get().messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
        })),
        text: ({ content: textContent, done }) => {
            if (done) {
                // Save assistant response to AI state
                aiState.done({
                    ...aiState.get(),
                    messages: [
                        ...aiState.get().messages,
                        {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: textContent,
                        },
                    ],
                });
            }

            return (
                <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-xl">
                    {textContent}
                </div>
            );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: {
            show_comparison_table: {
                description: 'Mostra uma tabela comparativa entre produtos quando o usuário pede uma comparação. Use sempre que o usuário perguntar sobre diferenças entre produtos ou qual é melhor.',
                parameters: z.object({
                    products: z.array(z.string()).describe('Lista de nomes de produtos para comparar (ex: ["iphone 15", "galaxy s24"])'),
                }),
                generate: async function* ({ products }: { products: string[] }) {
                    // Show loading skeleton first
                    yield <ComparisonSkeleton products={products} />;

                    // Real data lookup using fuzzy search
                    const foundProducts = findProductsByName(products);

                    // Save tool invocation to AI state
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: crypto.randomUUID(),
                                role: 'assistant',
                                content: `[Comparativo gerado: ${products.join(' vs ')}]`,
                                toolInvocations: [{
                                    toolName: 'show_comparison_table',
                                    toolCallId: crypto.randomUUID(),
                                    args: { products },
                                    result: foundProducts.map(p => p.name),
                                }],
                            },
                        ],
                    });

                    // Return final comparison table component
                    return <ComparisonTable products={foundProducts} />;
                },
            },

            // =======================================================
            // TOOL: set_price_alert - Agentic Commerce Phase 2
            // =======================================================
            set_price_alert: {
                description: 'Cria um alerta de preço quando o usuário quer ser avisado sobre quedas de preço, achar o preço caro, ou demonstrar intenção de compra futura. Use quando o usuário disser "me avisa", "tá caro", "vou esperar baixar", etc.',
                parameters: z.object({
                    product_name: z.string().describe('Nome do produto para monitorar'),
                    target_price: z.number().nullable().describe('Preço alvo desejado (null se não especificado)'),
                    platform: z.enum(['amazon', 'mercadolivre', 'shopee', 'geral']).describe('Plataforma a monitorar. Use "amazon" se mencionado, senão "geral"'),
                }),
                generate: async function* ({ product_name, target_price, platform }: { product_name: string; target_price: number | null; platform: 'amazon' | 'mercadolivre' | 'shopee' | 'geral' }) {
                    // Show loading state
                    yield (
                        <div className="p-4 border border-purple-200 rounded-xl bg-purple-50 animate-pulse">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-300 rounded-full animate-spin" />
                                <span className="text-purple-700 font-medium">
                                    Criando alerta para {product_name}...
                                </span>
                            </div>
                        </div>
                    );

                    // Generate alert ID
                    const alertId = crypto.randomUUID();

                    // Determine alert type based on platform (Business Rule)
                    const alertType = platform === 'amazon' ? 'DEAL_WATCH' : 'PRICE_TRACKER';

                    // Mock DB save (simulate database write)
                    console.log('[PriceAlert] Saving alert to database:', {
                        alertId,
                        productName: product_name,
                        targetPrice: target_price,
                        platform,
                        alertType,
                        createdAt: new Date().toISOString(),
                        userId: 'anonymous', // Would come from auth in production
                    });

                    // Save tool invocation to AI state
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: crypto.randomUUID(),
                                role: 'assistant',
                                content: `[Alerta criado: ${product_name} (${alertType})]`,
                                toolInvocations: [{
                                    toolName: 'set_price_alert',
                                    toolCallId: crypto.randomUUID(),
                                    args: { product_name, target_price, platform },
                                    result: { alertId, alertType, success: true },
                                }],
                            },
                        ],
                    });

                    // Return confirmation UI component
                    return (
                        <PriceAlertConfirmation
                            productName={product_name}
                            targetPrice={target_price}
                            platform={platform}
                            alertId={alertId}
                        />
                    );
                },
            },

            // =======================================================
            // TOOL: show_product_discovery - Inspiration & Discovery
            // =======================================================
            show_product_discovery: {
                description: 'Mostra um carrossel de produtos recomendados para inspiração e descoberta. Use quando o usuário fizer perguntas exploratórias, listas abertas, ou buscar ideias (ex: "melhores TVs", "ideias de presentes", "sugestões", "top 5").',
                parameters: z.object({
                    query_context: z.string().describe('Contexto da busca do usuário (ex: "presente pai churrasco", "melhores TVs 2024")'),
                    recommended_products: z.array(z.object({
                        name: z.string().describe('Nome do produto'),
                        reason_for_recommendation: z.string().describe('Razão curta e persuasiva para recomendar (ex: "O melhor custo-benefício para iniciantes")'),
                    })).min(3).max(5).describe('Lista de 3-5 produtos recomendados com razões'),
                }),
                generate: async function* ({ query_context, recommended_products }: { query_context: string; recommended_products: { name: string; reason_for_recommendation: string }[] }) {
                    // Show loading skeleton
                    yield <DiscoveryCarouselSkeleton />;

                    // Match recommended products with real catalog data
                    const allProducts = getAllProducts();
                    const discoveryProducts = recommended_products.map((rec, index) => {
                        // Try to find the product in catalog
                        const found = findProductsByName([rec.name])[0];

                        if (found) {
                            return {
                                id: found.id,
                                name: found.name,
                                reasonForRecommendation: rec.reason_for_recommendation,
                                imageUrl: `/images/products/${found.id}.jpg`,
                                price: found.price,
                                score: found.score,
                                category: found.category,
                            };
                        }

                        // Fallback for products not in catalog
                        return {
                            id: `discovery-${index}`,
                            name: rec.name,
                            reasonForRecommendation: rec.reason_for_recommendation,
                            imageUrl: '',
                            category: 'Recomendação',
                        };
                    });

                    // Save tool invocation to AI state
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: crypto.randomUUID(),
                                role: 'assistant',
                                content: `[Descoberta: ${query_context} - ${recommended_products.length} produtos]`,
                                toolInvocations: [{
                                    toolName: 'show_product_discovery',
                                    toolCallId: crypto.randomUUID(),
                                    args: { query_context, recommended_products },
                                    result: discoveryProducts.map(p => p.name),
                                }],
                            },
                        ],
                    });

                    // Return discovery carousel component
                    return (
                        <DiscoveryCarousel
                            queryContext={query_context}
                            products={discoveryProducts}
                        />
                    );
                },
            },

            // =======================================================
            // TOOL: query_product_data - Consultor Data Access
            // =======================================================
            query_product_data: {
                description: 'Busca dados técnicos, Score de Auditoria ComparaTop e links de compra para um produto específico. Use quando o usuário perguntar sobre um produto, quiser saber a nota, ou precisar de link para comprar.',
                parameters: z.object({
                    product_query: z.string().describe('Nome ou termo de busca do produto (ex: "samsung qn90c", "melhor tv 65", "geladeira frost free")'),
                }),
                generate: async function* ({ product_query }: { product_query: string }) {
                    // Show loading state
                    yield (
                        <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex items-center gap-2 text-blue-700">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-medium">Consultando base de dados...</span>
                            </div>
                        </div>
                    );

                    // Fetch from internal API
                    try {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                        const response = await fetch(`${baseUrl}/api/ai/v1/product-intelligence?q=${encodeURIComponent(product_query)}`);
                        const data = await response.json();

                        if (!data.products || data.products.length === 0) {
                            // Save to AI state
                            aiState.done({
                                ...aiState.get(),
                                messages: [
                                    ...aiState.get().messages,
                                    {
                                        id: crypto.randomUUID(),
                                        role: 'assistant',
                                        content: `[Consulta: "${product_query}" - Nenhum resultado]`,
                                    },
                                ],
                            });

                            return (
                                <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                                    <p className="text-amber-700 text-sm">
                                        ⚠️ Não encontrei "{product_query}" na base. Tente um nome mais específico ou uma categoria como "tv", "geladeira", "ar-condicionado".
                                    </p>
                                </div>
                            );
                        }

                        const product = data.products[0];

                        // Save to AI state
                        aiState.done({
                            ...aiState.get(),
                            messages: [
                                ...aiState.get().messages,
                                {
                                    id: crypto.randomUUID(),
                                    role: 'assistant',
                                    content: `[Consulta: "${product_query}" - Encontrado: ${product.name}, Score: ${product.scores.nota_auditoria}]`,
                                    toolInvocations: [{
                                        toolName: 'query_product_data',
                                        toolCallId: crypto.randomUUID(),
                                        args: { product_query },
                                        result: { name: product.name, score: product.scores.nota_auditoria },
                                    }],
                                },
                            ],
                        });

                        // Return product card
                        return (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-500">{product.brand}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-emerald-600">
                                                {product.scores.nota_auditoria.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <span>🛡️</span> Score de Auditoria
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-100">
                                        {product.scores.verdict}
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        <a
                                            href={product.comparatop_url}
                                            className="flex-1 text-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Ver Análise Completa
                                        </a>
                                        <a
                                            href={product.purchase_options?.[0]?.affiliate_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                                        >
                                            Ver Melhor Preço →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    } catch (error) {
                        console.error('[query_product_data] Error:', error);
                        return (
                            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                                <p className="text-red-700 text-sm">
                                    ❌ Erro ao consultar dados. Tente novamente.
                                </p>
                            </div>
                        );
                    }
                },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
    });

    return {
        type: 'GENERATIVE_UI',
        message: {
            id: crypto.randomUUID(),
            role: 'assistant',
            display: ui.value,
        },
    };
}

// ===========================================================
// CREATE AI INSTANCE
// ===========================================================

export const AI = createAI<AIState, UIState>({
    actions: {
        submitUserMessage,
    },
    initialAIState: {
        chatId: crypto.randomUUID(),
        messages: [],
    },
    initialUIState: [],
});

// Re-export types for consumers
export type { AIState, UIState, AIMessage, UIMessage, ActionResponse } from './types';
