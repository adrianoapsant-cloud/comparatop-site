import { google } from '@ai-sdk/google';
import { streamText, tool, stepCountIs, convertToModelMessages, UIMessage } from 'ai';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 30;

// ==========================================
// TYPES
// ==========================================
interface Product {
    id: string;
    name: string;
    price: number;
    score: number;
    category: string;
}

interface CatalogSnapshot {
    lastResults: Product[];
    focusIds: string[];
    updatedAt: string;
}

interface IntentResult {
    catalog: boolean;
    comparison: boolean;
    details: boolean;
    manual: boolean;  // Specific sub-intent for manual requests
}

// ==========================================
// OBSERVABILITY: Structured logging
// ==========================================
function logEvent(event: string, data?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ timestamp, event, ...data }));
}

// ==========================================
// CATALOG DATA (Mock - will be replaced with real data)
// ==========================================
const CATALOG: Product[] = [
    { id: '1', name: 'TCL C735 55"', price: 2800, score: 7.8, category: 'smart-tvs' },
    { id: '2', name: 'Samsung QN90C 55"', price: 4500, score: 8.4, category: 'smart-tvs' },
    { id: '3', name: 'LG C3 OLED 55"', price: 5200, score: 9.1, category: 'smart-tvs' },
    { id: '4', name: 'Sony X90L 65"', price: 6500, score: 8.7, category: 'smart-tvs' },
    { id: '5', name: 'Hisense U7K 55"', price: 2200, score: 7.2, category: 'smart-tvs' },
];

// Extended product details (mock data)
const PRODUCT_DETAILS: Record<string, { watts: number; kwhMonth: number; warranty: string; manual: string | null }> = {
    '1': { watts: 120, kwhMonth: 18, warranty: '1 ano', manual: 'https://tcl.com/manual/c735' },
    '2': { watts: 150, kwhMonth: 22, warranty: '2 anos', manual: 'https://samsung.com/manual/qn90c' },
    '3': { watts: 130, kwhMonth: 19, warranty: '2 anos', manual: 'https://lg.com/manual/c3' },
    '4': { watts: 180, kwhMonth: 27, warranty: '2 anos', manual: 'https://sony.com/manual/x90l' },
    '5': { watts: 100, kwhMonth: 15, warranty: '1 ano', manual: null },
};

// ==========================================
// CATEGORY DEFAULTS (when product has no data)
// ==========================================
const CATEGORY_DEFAULTS: Record<string, { watts: number; kwhMonth: number; warranty: string }> = {
    'smart-tvs': { watts: 120, kwhMonth: 15, warranty: '1 ano' },
    'geladeiras': { watts: 150, kwhMonth: 40, warranty: '1 ano' },
    'ar-condicionado': { watts: 1200, kwhMonth: 90, warranty: '1 ano' },
    'lavadoras': { watts: 500, kwhMonth: 12, warranty: '1 ano' },
    'default': { watts: 100, kwhMonth: 20, warranty: '1 ano' },
};

// ==========================================
// ENERGY RATES BY UF (R$/kWh)
// ==========================================
const ENERGY_RATES_BY_UF: Record<string, number> = {
    'SP': 0.72,
    'RJ': 0.89,
    'MG': 0.78,
    'RS': 0.71,
    'PR': 0.68,
    'SC': 0.65,
    'BA': 0.76,
    'PE': 0.74,
    'CE': 0.73,
    'GO': 0.69,
    'DF': 0.70,
    'ES': 0.77,
    'PA': 0.82,
    'AM': 0.85,
    'MT': 0.75,
    'MS': 0.74,
    'MA': 0.79,
    'PI': 0.80,
    'RN': 0.75,
    'PB': 0.76,
    'AL': 0.77,
    'SE': 0.75,
    'TO': 0.78,
    'RO': 0.80,
    'AC': 0.83,
    'AP': 0.81,
    'RR': 0.84,
    'default': 0.75,  // Média nacional
};

function getEnergyRate(uf?: string): { rate: number; uf: string } {
    if (uf && ENERGY_RATES_BY_UF[uf.toUpperCase()]) {
        return { rate: ENERGY_RATES_BY_UF[uf.toUpperCase()], uf: uf.toUpperCase() };
    }
    return { rate: ENERGY_RATES_BY_UF['default'], uf: 'BR (média)' };
}

// ==========================================
// ENRICHED PRODUCT DETAILS TYPE
// ==========================================
interface ProductDetailsEnriched {
    id: string;
    name: string;
    price: number;
    score: number;
    category: string;
    watts: number;
    kwhMonth: number;
    warranty: string;
    manual: string | null;
    isDefault: boolean;  // True if using category defaults
}

// ==========================================
// INTENT DETECTION (Multi-intent aware)
// ==========================================
const CATALOG_INTENT_PATTERNS = [
    /\b(tv|tvs|televisão|televisor|smart\s*tv)\b/i,
    /\b(geladeira|refrigerador|freezer)\b/i,
    /\b(mostrar?|mostr[ea]|lista[re]?|listar)\b/i,
    /\b(recomend[ae]|sugest[ãa]o|sugir[ae])\b/i,
    /\b(opç[õo]es|alternativas|escolhas)\b/i,
    /\b(quais|quantas?|vocês têm|voces tem)\b/i,
    /\b(barata|barato|econômic[ao]|custo.benefício)\b/i,
];

const COMPARISON_INTENT_PATTERNS = [
    /\b(compar[ae]|compare|comparação|comparar)\b/i,
    /\b(lado\s*a\s*lado|versus|vs\.?)\b/i,
    /\b(diferenças?|diferença)\b/i,
    /\b(melhores?\s*(2|duas|dois)|top\s*2|as?\s*2)\b/i,
    /\b(maiores?\s*notas?)\b/i,
];

const DETAILS_INTENT_PATTERNS = [
    // Consumo de energia
    /\b(consumo|consumir|consome)\b/i,
    /\bkwh\b/i,                           // kWh alone
    /\bkwh\s*\/?\s*m[eê]s\b/i,            // kWh/mês, kWh por mês
    /\b(watts?|watt)\b/i,
    /\b(energia|eletricidade)\b/i,
    /\benergia\s+por\s+m[eê]s\b/i,        // energia por mês

    // Conjugações de "gastar" - TODAS
    /\b(gasta|gastam|gasto|gastar|gastando|gastou|gastaria|gastariam)\b/i,
    /\bgasto\s+mensal\b/i,                // gasto mensal
    /\bgasto\s+de\s+energia\b/i,          // gasto de energia

    // Custo
    /\bquanto\s+(custa|gasta|consome|gastam?|vai\s+gastar)\b/i,
    /\bcusto\s+(mensal|de\s+energia)\b/i,

    // Período mensal
    /\bpor\s+m[eê]s\b/i,                  // por mês, por mes
    /\b(mensal|mensalmente)\b/i,

    // Garantia
    /\b(garantia|warranty)\b/i,
];

const MANUAL_INTENT_PATTERNS = [
    // Manual do produto
    /\b(manual|manuais)\b/i,
    /\btem\s+manual\b/i,                  // tem manual?
    /\bmanual\s+(do\s+produto|de\s+instru[çc][õo]es)\b/i,

    // Documentação técnica
    /\b(especifica[çc][ãa]o|especificaç[õo]es)\b/i,
    /\bficha\s*t[eé]cnica\b/i,            // ficha técnica
    /\bdados\s+t[eé]cnicos\b/i,           // dados técnicos

    // Downloads
    /\b(pdf|download)\b/i,
    /\bdocumento\b/i,
    /\binstru[çc][õo]es\b/i,
];

function detectIntents(text: string): IntentResult {
    return {
        catalog: CATALOG_INTENT_PATTERNS.some(p => p.test(text)),
        comparison: COMPARISON_INTENT_PATTERNS.some(p => p.test(text)),
        details: DETAILS_INTENT_PATTERNS.some(p => p.test(text)) || MANUAL_INTENT_PATTERNS.some(p => p.test(text)),
        manual: MANUAL_INTENT_PATTERNS.some(p => p.test(text)),
    };
}

// ==========================================
// CATALOG FUNCTIONS
// ==========================================
function searchProducts(query: string, category?: string) {
    let filtered = CATALOG.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (category && p.category === category) ||
        query.toLowerCase().includes('tv') ||
        query.toLowerCase().includes('barata') ||
        query === 'produtos'
    );

    if (query.toLowerCase().includes('barata') || query.toLowerCase().includes('econômic')) {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
    }

    return { found: filtered.length, products: filtered.slice(0, 5) };
}

/**
 * Get product details with fallback to category defaults.
 * NEVER returns null - always provides data (real or default).
 */
function getProductDetailsWithDefaults(productId: string): ProductDetailsEnriched | null {
    const product = CATALOG.find(p => p.id === productId);
    if (!product) return null;

    const details = PRODUCT_DETAILS[productId];
    if (details) {
        return {
            ...product,
            ...details,
            isDefault: false,
        };
    }

    // Use category defaults
    const categoryDefaults = CATEGORY_DEFAULTS[product.category] || CATEGORY_DEFAULTS['default'];
    return {
        ...product,
        ...categoryDefaults,
        manual: null,
        isDefault: true,
    };
}

function getProductDetails(productId: string) {
    return getProductDetailsWithDefaults(productId);
}

function getAllProductDetails(): ProductDetailsEnriched[] {
    return CATALOG.map(p => getProductDetailsWithDefaults(p.id))
        .filter((p): p is ProductDetailsEnriched => p !== null);
}

function getTop2ByScore(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.score - a.score).slice(0, 2);
}

// ==========================================
// RESPONSE BUILDERS
// ==========================================
function buildCatalogResponse(products: Product[]): string {
    return products.map((p, i) =>
        `${i + 1}. **${p.name}** — R$ ${p.price.toLocaleString('pt-BR')} (Nota: ${p.score}/10)`
    ).join('\n');
}

function buildManualSection(products: Array<{ name: string; manual: string | null }>): string {
    return products.map(p =>
        `• **${p.name}** — ${p.manual ? `[Manual](${p.manual})` : 'manual não cadastrado no catálogo'}`
    ).join('\n');
}

function buildTechnicalSection(products: Array<{ name: string; watts: number; kwhMonth: number; warranty: string; manual: string | null }>, energyCostPerKwh: number): string {
    return products.map(p =>
        `📺 **${p.name}**
   • Consumo: ${p.watts}W (~${p.kwhMonth} kWh/mês)
   • Custo mensal: ~R$ ${(p.kwhMonth * energyCostPerKwh).toFixed(2)}/mês
   • Garantia: ${p.warranty}
   • Manual: ${p.manual ? `[Acessar](${p.manual})` : 'não cadastrado'}`
    ).join('\n\n');
}

// ==========================================
// MAIN HANDLER
// ==========================================
export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch (parseError) {
        logEvent('REQUEST_PARSE_ERROR', { error: String(parseError) });
        return new Response(
            JSON.stringify({ error: 'Invalid JSON body' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const rawMessages = Array.isArray((body as Record<string, unknown>)?.messages)
        ? (body as Record<string, unknown>).messages as UIMessage[]
        : [];

    // ==========================================
    // CATALOG SNAPSHOT: Parse from request
    // ==========================================
    let catalogSnapshot = (body as Record<string, unknown>)?.catalogSnapshot as CatalogSnapshot | undefined;

    logEvent('SNAPSHOT_RECEIVED', {
        hasSnapshot: !!catalogSnapshot,
        productCount: catalogSnapshot?.lastResults?.length ?? 0,
        focusIds: catalogSnapshot?.focusIds ?? [],
    });

    if (rawMessages.length === 0) {
        logEvent('EMPTY_MESSAGES_ERROR');
        return new Response(
            JSON.stringify({ error: 'No messages received' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Get last user message
    const lastUserMessage = rawMessages.filter(m => m.role === 'user').pop();
    const lastUserText = lastUserMessage?.parts
        ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        ?.map(p => p.text)
        ?.join(' ') || '';

    // Detect ALL intents (multi-intent aware)
    const intents = detectIntents(lastUserText);

    logEvent('INTENT_DETECTION', {
        text: lastUserText.substring(0, 100),
        intents,
        hasSnapshot: !!catalogSnapshot,
    });

    // Convert messages
    let messages;
    try {
        messages = await convertToModelMessages(rawMessages);
        logEvent('MESSAGES_CONVERTED', { count: messages.length });
    } catch (conversionError) {
        logEvent('MESSAGE_CONVERSION_ERROR', {
            error: conversionError instanceof Error ? conversionError.message : String(conversionError),
        });
        return new Response(
            JSON.stringify({
                error: 'Message conversion failed',
                message: conversionError instanceof Error ? conversionError.message : String(conversionError),
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const energyCostPerKwh = 0.75;

    try {
        // ==========================================
        // PATH A: MULTI-INTENT (Catalog + Details/Manual)
        // "tem manual? quais TVs vocês têm?"
        // ==========================================
        if (intents.catalog && intents.details) {
            logEvent('MODE_MULTI_INTENT', { reason: 'catalog_and_details' });

            // Step 1: Execute catalog search first
            const searchResult = searchProducts(lastUserText, 'smart-tvs');

            // Step 2: Get details for all products
            const allDetails = getAllProductDetails();

            logEvent('MULTI_INTENT_DATA', {
                catalogCount: searchResult.found,
                detailsCount: allDetails.length,
                isManualRequest: intents.manual,
            });

            // Build combined response
            let combinedContent = `## 📺 TVs Disponíveis\n\n${buildCatalogResponse(searchResult.products)}\n\n`;

            if (intents.manual) {
                // User asked specifically about manuals
                combinedContent += `---\n\n## 📖 Manuais\n\n${buildManualSection(allDetails)}\n\n`;
            } else {
                // User asked about technical details (consumption, etc.)
                combinedContent += `---\n\n## ⚡ Dados Técnicos\n\n${buildTechnicalSection(allDetails, energyCostPerKwh)}\n\n`;
            }

            const multiSystem = `Você é um consultor de produtos do ComparaTop.
Responda em português brasileiro de forma amigável.

O usuário pediu uma lista de produtos E informações técnicas. Aqui estão os dados:

${combinedContent}

Instruções:
1. Apresente as informações de forma organizada e amigável
2. Se for sobre manuais, destaque quais modelos têm manual disponível
3. Se for sobre consumo, explique que o cálculo usa tarifa média de R$ 0,75/kWh
4. Pergunte se quer mais detalhes sobre algum modelo específico`;

            const result = streamText({
                model: google('gemini-2.0-flash'),
                system: multiSystem,
                messages,
            });

            logEvent('STREAM_CREATED', { mode: 'multi-intent', status: 'ok' });

            return result.toUIMessageStreamResponse({
                onError: (err) => {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    logEvent('STREAM_ERROR', { error: errorMessage, mode: 'multi-intent' });
                    return errorMessage;
                },
            });
        }

        // ==========================================
        // PATH B: COMPARISON MODE (requires snapshot)
        // ==========================================
        if (intents.comparison && catalogSnapshot?.lastResults?.length) {
            logEvent('MODE_COMPARISON', { reason: 'comparison_intent_with_snapshot' });

            const top2 = getTop2ByScore(catalogSnapshot.lastResults);

            logEvent('COMPARISON_DATA', {
                product1: top2[0]?.name,
                product2: top2[1]?.name,
            });

            const comparisonSystem = `Você é um consultor de produtos do ComparaTop.
Responda em português brasileiro de forma amigável.

O usuário quer comparar as 2 melhores TVs do catálogo anterior:

=== COMPARAÇÃO: TOP 2 POR NOTA ===

📺 **${top2[0]?.name}** (Nota: ${top2[0]?.score}/10)
   - Preço: R$ ${top2[0]?.price.toLocaleString('pt-BR')}
   - Consumo: ${PRODUCT_DETAILS[top2[0]?.id]?.watts}W (~${PRODUCT_DETAILS[top2[0]?.id]?.kwhMonth} kWh/mês)
   - Garantia: ${PRODUCT_DETAILS[top2[0]?.id]?.warranty}

📺 **${top2[1]?.name}** (Nota: ${top2[1]?.score}/10)
   - Preço: R$ ${top2[1]?.price.toLocaleString('pt-BR')}
   - Consumo: ${PRODUCT_DETAILS[top2[1]?.id]?.watts}W (~${PRODUCT_DETAILS[top2[1]?.id]?.kwhMonth} kWh/mês)
   - Garantia: ${PRODUCT_DETAILS[top2[1]?.id]?.warranty}

Instruções:
1. Faça uma análise comparativa clara
2. Destaque prós e contras de cada
3. Dê uma recomendação final
4. Pergunte se quer ver os links de compra`;

            const result = streamText({
                model: google('gemini-2.0-flash'),
                system: comparisonSystem,
                messages,
            });

            logEvent('STREAM_CREATED', { mode: 'comparison', status: 'ok' });

            return result.toUIMessageStreamResponse({
                onError: (err) => {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    logEvent('STREAM_ERROR', { error: errorMessage, mode: 'comparison' });
                    return errorMessage;
                },
            });
        }

        // ==========================================
        // PATH C: MANUAL-ONLY (no catalog intent)
        // "tem manual?" without specifying products
        // ==========================================
        if (intents.manual && !intents.catalog) {
            logEvent('MODE_MANUAL', { reason: 'manual_intent_only' });

            // Check if we have snapshot to work with
            if (catalogSnapshot?.lastResults?.length) {
                // Use full lastResults if <= 8 products, otherwise focusIds
                const targetProducts = catalogSnapshot.lastResults.length <= 8
                    ? catalogSnapshot.lastResults
                    : catalogSnapshot.focusIds.map(id => CATALOG.find(p => p.id === id)).filter((p): p is Product => !!p);

                const label = catalogSnapshot.lastResults.length <= 8
                    ? 'Para todos os modelos listados anteriormente'
                    : `Para os modelos em foco (Top ${catalogSnapshot.focusIds.length})`;

                const detailedProducts = targetProducts.map(p => {
                    const details = PRODUCT_DETAILS[p.id];
                    return { name: p.name, manual: details?.manual ?? null };
                });

                logEvent('MANUAL_DATA', {
                    label,
                    productCount: detailedProducts.length,
                });

                const manualSystem = `Você é um consultor de produtos do ComparaTop.
Responda em português brasileiro de forma amigável.

O usuário quer saber sobre manuais dos produtos:

${label}:

${buildManualSection(detailedProducts)}

Instruções:
1. Apresente os links de manual disponíveis
2. Se algum modelo não tiver manual, mencione que ainda não está no catálogo
3. Pergunte se quer informações técnicas adicionais`;

                const result = streamText({
                    model: google('gemini-2.0-flash'),
                    system: manualSystem,
                    messages,
                });

                logEvent('STREAM_CREATED', { mode: 'manual', status: 'ok' });

                return result.toUIMessageStreamResponse({
                    onError: (err) => {
                        const errorMessage = err instanceof Error ? err.message : String(err);
                        logEvent('STREAM_ERROR', { error: errorMessage, mode: 'manual' });
                        return errorMessage;
                    },
                });
            } else {
                // No snapshot - ask which model
                logEvent('MANUAL_NO_SNAPSHOT', { reason: 'need_model_name' });

                const askModelSystem = `Você é um consultor de produtos do ComparaTop.
Responda em português brasileiro de forma curta e amigável.

O usuário perguntou sobre manuais, mas não especificou o modelo e não temos um catálogo aberto.

Responda apenas: "De qual modelo você gostaria de ver o manual? Posso listar as TVs disponíveis se preferir."`;

                const result = streamText({
                    model: google('gemini-2.0-flash'),
                    system: askModelSystem,
                    messages,
                });

                return result.toUIMessageStreamResponse({
                    onError: (err) => {
                        const errorMessage = err instanceof Error ? err.message : String(err);
                        logEvent('STREAM_ERROR', { error: errorMessage, mode: 'manual-ask' });
                        return errorMessage;
                    },
                });
            }
        }

        // ==========================================
        // PATH D: DETAILS MODE (consumption, etc.)
        // ==========================================
        if (intents.details && (catalogSnapshot?.focusIds?.length || catalogSnapshot?.lastResults?.length)) {
            logEvent('MODE_DETAILS', { reason: 'details_intent_with_snapshot' });

            // Determine which products to use
            let targetProductIds: string[];
            let targetLabel: string;

            if (catalogSnapshot.focusIds?.length) {
                // Use focusIds (top 2 by score)
                targetProductIds = catalogSnapshot.focusIds;
                targetLabel = `modelos em foco (Top ${targetProductIds.length})`;
            } else {
                // Fallback: use top 2 from lastResults
                const top2 = getTop2ByScore(catalogSnapshot.lastResults!);
                targetProductIds = top2.map(p => p.id);
                targetLabel = `modelos com maior nota (Top ${targetProductIds.length})`;
            }

            // Get enriched details (NEVER null with defaults)
            const detailedProducts = targetProductIds
                .map(id => getProductDetails(id))
                .filter((p): p is ProductDetailsEnriched => p !== null);

            // Get energy rate (could be from user region in future)
            const { rate: energyRate, uf: energyUf } = getEnergyRate(); // TODO: get from request

            // Build FACTS_JSON for LLM guidance
            const factsJson = detailedProducts.map(p => ({
                name: p.name,
                kwhMonth: p.kwhMonth,
                watts: p.watts,
                costPerMonth: parseFloat((p.kwhMonth * energyRate).toFixed(2)),
                costPerYear: parseFloat((p.kwhMonth * 12 * energyRate).toFixed(2)),
                warranty: p.warranty,
                manual: p.manual,
                isDefault: p.isDefault,
            }));

            logEvent('DETAILS_FACTS', {
                productCount: factsJson.length,
                products: factsJson.map(p => ({ name: p.name, kwhMonth: p.kwhMonth, costPerMonth: p.costPerMonth })),
                energyRate,
                energyUf,
            });

            const detailsSystem = `Você é um consultor de produtos do ComparaTop.
Responda em português brasileiro de forma amigável e objetiva.

O usuário quer informações sobre consumo/especificações para os ${targetLabel}.

=== FACTS_JSON (use EXATAMENTE estes valores, NÃO invente números) ===
${JSON.stringify(factsJson, null, 2)}

=== TARIFA DE ENERGIA ===
- UF: ${energyUf}
- Tarifa: R$ ${energyRate.toFixed(2)}/kWh

Instruções:
1. Apresente o consumo de cada produto: "~X kWh/mês" e "~R$ Y/mês"
2. Se tiver mais de um produto, compare o custo entre eles
3. Se manual existir (não null), mostre o link
4. Nunca diga "não tenho acesso" - você TEM os dados acima
5. Se isDefault=true, mencione que é "estimativa média para a categoria"
6. Pergunte se quer estimar com tarifa de outro estado`;

            const result = streamText({
                model: google('gemini-2.0-flash'),
                system: detailsSystem,
                messages,
            });

            logEvent('STREAM_CREATED', { mode: 'details', status: 'ok' });

            return result.toUIMessageStreamResponse({
                onError: (err) => {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    logEvent('STREAM_ERROR', { error: errorMessage, mode: 'details' });
                    return errorMessage;
                },
            });
        }

        // ==========================================
        // PATH E: CATALOG-ONLY MODE
        // ==========================================
        if (intents.catalog) {
            logEvent('MODE_CATALOG', { reason: 'catalog_intent' });

            const searchResult = searchProducts(lastUserText, 'smart-tvs');

            logEvent('CATALOG_SEARCH', { foundCount: searchResult.found });

            const systemWithCatalog = `Você é um consultor de produtos do ComparaTop, especialista em TVs e eletrônicos.
Responda sempre em português brasileiro de forma amigável e objetiva.

IMPORTANTE: Você já tem os resultados da busca. NÃO tente usar ferramentas ou funções.

=== RESULTADOS DA BUSCA (${searchResult.found} produtos encontrados) ===
${buildCatalogResponse(searchResult.products)}

Instruções:
1. Apresente os produtos de forma amigável
2. Destaque o melhor custo-benefício
3. Pergunte qual produto interessa ou se quer comparar os melhores`;

            const result = streamText({
                model: google('gemini-2.0-flash'),
                system: systemWithCatalog,
                messages,
            });

            logEvent('STREAM_CREATED', { mode: 'catalog', status: 'ok' });

            return result.toUIMessageStreamResponse({
                onError: (err) => {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    logEvent('STREAM_ERROR', { error: errorMessage, mode: 'catalog' });
                    return errorMessage;
                },
            });
        }

        // ==========================================
        // PATH F: GENERAL MODE (with tools)
        // ==========================================
        logEvent('MODE_GENERAL', { reason: 'no_specific_intent' });

        const result = streamText({
            model: google('gemini-2.0-flash'),
            system: `Você é um consultor de produtos do ComparaTop, especialista em TVs e eletrônicos.
Responda sempre em português brasileiro de forma amigável e objetiva.
Quando o usuário pedir para buscar produtos, use a ferramenta search_products.`,
            messages,
            stopWhen: stepCountIs(5),
            tools: {
                search_products: tool({
                    description: 'Busca produtos no catálogo do ComparaTop.',
                    inputSchema: z.object({
                        query: z.string().min(1).describe('Termo de busca'),
                        category: z.string().optional().describe('Categoria opcional'),
                    }),
                    execute: async ({ query, category }) => {
                        logEvent('TOOL_EXECUTE', { toolName: 'search_products', args: { query, category } });
                        return searchProducts(query, category);
                    },
                }),
            },
        });

        logEvent('STREAM_CREATED', { mode: 'general', status: 'ok' });

        return result.toUIMessageStreamResponse({
            onError: (err) => {
                const errorMessage = err instanceof Error ? err.message : String(err);
                logEvent('STREAM_ERROR', { error: errorMessage, mode: 'general' });
                return errorMessage;
            },
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logEvent('STREAMTEXT_INIT_ERROR', { error: errorMessage });
        return new Response(
            JSON.stringify({ error: 'Stream initialization failed', message: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
