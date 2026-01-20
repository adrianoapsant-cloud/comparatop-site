import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { findProductsByName, getAllProducts, getProductDetails, type AIProductSpec } from "@/lib/ai/data-retrieval";
import { ALL_PRODUCTS } from "@/data/products";
import { enqueueImmunityEvent } from "@/lib/immunity/ingest";
import type { ImmunityEvent } from "@/lib/immunity/types";
import { calculateTco, getDefaultEnergyConsumption, type TcoBreakdown } from "@/lib/tco/calculate-tco";
import { getEnergyRate, ENERGY_RATES } from "@/lib/tco/energy-rates";
import { evaluateSafety, shouldBlockResponse, isEthicalBrakeActive } from "@/lib/safety/guardian";
import { buildSafetyResponse, getEthicalBrakePromptAddition, removeUrgencyFromText } from "@/lib/safety/responses";
import { redactPII } from "@/lib/privacy/redact";
import { createPricingResult, type PricingResult } from "@/lib/llm/pricing";
import { getEnergyProfileBySku, type EnergySource, type StorageType } from "@/lib/energy/energy-profiles-store";
import { getPrimaryOffer, hasOffer } from "@/lib/catalog/offers";
import { joinBlocks, normalizeSpacing } from "@/lib/chat/text-format";
import { buildOndeComprarSection, type ProductForOffers } from "@/lib/commerce/offer-link-resolver";
import { routeWithLLM, toLegacyIntents, type UserIntent } from "@/lib/ai/semantic-router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================
// HELPERS
// ============================================

// Detecta se deve forçar tool call para catálogo
function shouldForceCatalog(text: string): boolean {
    const t = text.toLowerCase();
    return /tv|televis|geladeira|refriger|ar.?condicionado|split|menor consumo|econ[oô]mic|op[cç][aã]o|recomenda|tem aí|lista|mostrar|ver produto|quais|melhores/.test(t);
}

// Detecta se usuário está perguntando sobre detalhes técnicos ou TCO
function isDetailsIntent(text: string): boolean {
    const t = text.toLowerCase();
    // Original patterns + TCO patterns
    const patterns = /consumo|kwh|energia|gasta|gastam|gasto|selo|manual|especifica|tensão|tensao|voltagem|ruído|ruido|btu|potência|potencia|capacidade|quanto .*consome|quanto .*gasta|custo real|tco|custo total|5 anos|cinco anos|longo prazo/;
    return patterns.test(t);
}

// Detecta intenção de comparar produtos do snapshot
function isCompareIntent(text: string): boolean {
    const t = text.toLowerCase();
    return /compare|lado a lado|maiores notas|top 2|melhores notas|as duas|os dois|vs|versus/.test(t);
}

// Detecta pedido de ajuda com navegação/UI
function isUIHelpIntent(text: string): boolean {
    const t = text.toLowerCase();
    return /não consigo|nao consigo|não funciona|nao funciona|travou|bug|erro|cadê|cade|sumiu|não aparece|nao aparece|botão|botao|clicar|tela|carregar|página|pagina|não roda|nao roda|site travou|onde (fica|está|ta)|como (clico|acesso)|não abre|nao abre|problema|difícil|dificil|quer ajuda/i.test(t);
}

// Detecta pedido de link de compra (EXCETO "link do manual" que é MANUAL intent)
function isBuyLinkIntent(text: string): boolean {
    const t = text.toLowerCase();

    // Exclusão: "link do manual" é tratado pelo MANUAL intent
    if (/link.*(manual|instrução|instruções|guia|pdf)/i.test(t)) {
        return false;
    }

    // Padrões de compra em PT-BR
    const buyPatterns = [
        /link.*(compra|oferta|produto)/,           // "link de compra", "link da oferta"
        /onde.*(compro|comprar|acho|encontro)/,    // "onde compro", "onde acho"
        /(me )?(envie?|manda|passa).* ?o? ?link/,  // "me envia o link", "manda o link"
        /ver oferta/,                               // "ver oferta"
        /comprar (agora|já|esse|este)/,            // "comprar agora", "comprar esse"
        /quero comprar/,                            // "quero comprar"
        /link.*(amazon|magalu|casas bahia|americanas|shopee|mercado livre|ml)/,  // lojas
        /como (compro|comprar)/,                    // "como compro"
        /posso comprar/,                            // "posso comprar"
        /(pode|poderia).*(link|enviar.*oferta)/,   // "pode me mandar o link"
        /preço.*(link|compra)/,                     // "preço com link"
        /link.*(para|pra) comprar/                  // "link pra comprar"
    ];

    return buyPatterns.some(pattern => pattern.test(t));
}

// Sanitiza texto para remover tool leaks
function stripToolLeak(text: string): string {
    return text
        .split("\n")
        .filter(line => !/default_api\.|search_products\s*\(|print\s*\(/i.test(line))
        .join("\n")
        .trim();
}

// ============================================
// MARKDOWN SAFE FORMATTER
// ============================================

/**
 * formatMd - Formata seções para markdown seguro
 * 
 * - Junta seções com \n\n (parágrafos)
 * - Normaliza \r\n para \n
 * - Remove espaços duplicados
 * - Garante que listas (- ou 1.) comecem em nova linha
 */
function formatMd(sections: string[]): string {
    // Join with double newline for paragraphs
    let text = sections.filter(s => s && s.trim()).join('\n\n');

    // Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // Remove duplicate blank lines (more than 2 newlines)
    text = text.replace(/\n{3,}/g, '\n\n');

    // Ensure list items start on new line
    // If there's content before a list marker without newline, add one
    text = text.replace(/([^\n])((?:\n)?(?:[-•] |\d+\. ))/g, '$1\n$2');

    // Trim each line's trailing whitespace
    text = text.split('\n').map(line => line.trimEnd()).join('\n');

    return text.trim();
}

// ============================================
// MULTI-INTENT DETECTION
// ============================================

interface DetectedIntents {
    catalog?: { category?: string; query?: string };
    budget?: { max: number; category?: string };
    compare?: { count: 2; category?: string };
    details?: { fields: ('energy' | 'tco' | 'specs' | 'manual')[] };
    manual?: boolean;
    buyLink?: { productName?: string };
}

/**
 * Detecta TODAS as intents em uma única mensagem
 * Permite múltiplas intents no mesmo turno
 */
function detectIntents(text: string): DetectedIntents {
    const t = text.toLowerCase();
    const intents: DetectedIntents = {};

    // CATALOG: lista de produtos
    const catalogPatterns = /quais|lista|mostrar|ver produto|tem (aí|ai)|vocês têm|voces tem|opcões|opções|opcoes|recomenda/;
    if (catalogPatterns.test(t)) {
        const category = extractCategoryFromText(t);
        intents.catalog = { category: category || undefined };
    }

    // BUDGET: orçamento específico
    // NOTA: (r\$)? como grupo opcional para não consumir chars errados
    const budgetPatterns = [
        /melhor.*at[eé]\s*(r\$)?\s*\d/,      // "melhor TV ate 5000" ou "melhor até R$ 5000"
        /at[eé]\s+(r\$)?\s*\d/,              // "ate 5000" ou "até R$ 5000"
        /or[cç]amento\s*(de)?\s*(r\$)?\s*\d/, // "orçamento de 5000"
        /no\s+m[aá]ximo\s*(r\$)?\s*\d/,      // "no máximo 5000"
        /\d+\s*k\b.*melhor|melhor.*\d+\s*k\b/i // "5k melhor" ou "melhor 5k"
    ];
    if (budgetPatterns.some(p => p.test(t))) {
        const max = parseBudgetFromText(t);
        if (max) {
            intents.budget = { max, category: extractCategoryFromText(t) || undefined };
        }
    }

    // COMPARE: comparar produtos (DEVE ser explícito, não pode disparar com "tem")
    // Padrões válidos: compare, comparar, vs, x entre itens, "as 2 melhores", "lado a lado"
    const comparePatterns = /\bcompar(e|ar|ação)\b|\bvs\b|\blado\s+a\s+lado\b|\b(as|os)\s+(2|duas|dois)\s+melhores\b|\btop\s*2\b/;
    if (comparePatterns.test(t)) {
        intents.compare = { count: 2, category: extractCategoryFromText(t) || undefined };
    }

    // DETAILS: energia, consumo, TCO
    const detailsFields: ('energy' | 'tco' | 'specs' | 'manual')[] = [];
    if (/consumo|kwh|energia|gasta|gastam|gasto|quanto.*consome|quanto.*gasta|custo.*m[eê]s/.test(t)) {
        detailsFields.push('energy');
    }
    if (/custo real|tco|custo total|5 anos|cinco anos|longo prazo/.test(t)) {
        detailsFields.push('tco');
    }
    if (/especifica|tensão|tensao|voltagem|ruído|ruido|btu|potência|potencia|capacidade|tamanho|peso|dimensões|dimensoes/.test(t)) {
        detailsFields.push('specs');
    }
    if (/manual/.test(t)) {
        detailsFields.push('manual');
    }
    if (detailsFields.length > 0) {
        intents.details = { fields: detailsFields };
    }

    // MANUAL: pedido explícito de manual
    if (/manual|instru[çc][oõ]es|guia/.test(t)) {
        intents.manual = true;
    }

    // BUY_LINK: pedido de link de compra (PRIORIDADE - deve disparar mesmo com outras intents)
    if (isBuyLinkIntent(text)) {
        // Tentar extrair nome do produto da mensagem
        const productMatch = text.match(/link.*(d[aoe]|para|do|da)?\s*([A-Z][\w\s-]+)/i);
        intents.buyLink = { productName: productMatch?.[2]?.trim() };
    }

    return intents;
}

/**
 * Extrai categoria da mensagem
 */
function countIntents(intents: DetectedIntents): number {
    return Object.keys(intents).length;
}

// ============================================
// CATEGORY RESOLVER (Single Source of Truth)
// ============================================

type CategorySource = 'page' | 'persisted' | 'text_infer' | 'none';

interface CategoryResolution {
    slug: string | null;
    source: CategorySource;
}

/**
 * Category patterns for text inference
 * Each pattern maps to a category slug
 */
const CATEGORY_PATTERNS: [RegExp, string][] = [
    [/\b(tv|tvs|televis[aã]o|televisao|smart\s*tv|oled|qled|neo\s*qled|mini\s*led)\b/i, 'smart-tvs'],
    [/\b(geladeira|refrigerador|frost\s*free|duplex|french\s*door|side\s*by\s*side)\b/i, 'geladeiras'],
    [/\b(ar[\s-]?condicionado|split|btus?|climatiza|inverter)\b/i, 'ar-condicionado'],
    [/\b(lavadora|m[aá]quina\s*de\s*lavar|lava[\s-]?e[\s-]?seca|lava[\s-]?roupa)\b/i, 'lavadoras'],
    [/\b(notebook|laptop|ultrabook|chromebook)\b/i, 'notebooks'],
    [/\b(microondas|micro[\s-]?ondas|forno\s*el[ée]trico)\b/i, 'microondas'],
];

/**
 * Map category ID to slug (for filtering products)
 */
const CATEGORY_ID_TO_SLUG: Record<string, string> = {
    'tv': 'smart-tvs',
    'fridge': 'geladeiras',
    'air_conditioner': 'ar-condicionado',
    'washer': 'lavadoras',
};

/**
 * Infer category slug from user message text
 * Returns null if no category detected or multiple categories (ambiguity)
 */
function inferCategorySlugFromText(text: string): string | null {
    const matches: string[] = [];

    for (const [pattern, slug] of CATEGORY_PATTERNS) {
        if (pattern.test(text)) {
            if (!matches.includes(slug)) {
                matches.push(slug);
            }
        }
    }

    // If exactly one category, return it
    if (matches.length === 1) {
        return matches[0];
    }

    // Multiple or none: return null
    return null;
}

/**
 * Legacy alias for compatibility
 */
function extractCategoryFromText(text: string): string | null {
    return inferCategorySlugFromText(text);
}

interface CategoryResolverContext {
    userMessage: string;
    pageContextCategorySlug?: string;
    activeCategorySlug?: string;
}

/**
 * Resolve the active category with priority:
 * 1. pageContext.categorySlug (when on /categorias/...)
 * 2. pageContext.activeCategorySlug (persisted from previous visit)
 * 3. inferCategorySlugFromText(userMessage)
 * 4. null
 */
function resolveActiveCategorySlug(ctx: CategoryResolverContext): CategoryResolution {
    // Priority 1: Page context (on category page)
    if (ctx.pageContextCategorySlug) {
        return { slug: ctx.pageContextCategorySlug, source: 'page' };
    }

    // Priority 2: Persisted from previous visit
    if (ctx.activeCategorySlug) {
        return { slug: ctx.activeCategorySlug, source: 'persisted' };
    }

    // Priority 3: Infer from user message
    const inferred = inferCategorySlugFromText(ctx.userMessage);
    if (inferred) {
        return { slug: inferred, source: 'text_infer' };
    }

    // No category resolved
    return { slug: null, source: 'none' };
}

// Generic product interface for candidate selection
interface BaseProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    score: number;
}

interface CandidateProductsContext<T extends BaseProduct = AIProductSpec> {
    catalogSnapshot?: { lastResults?: T[]; focusIds?: string[] };
    pageContextVisibleSkus?: string[];
    activeCategorySlug: string | null;
    requestId: string;
}

interface CandidateProductsResult<T extends BaseProduct = AIProductSpec> {
    products: T[];
    countBefore: number;
    countAfter: number;
}

/**
 * Get candidate products with category filtering (Single Source of Truth)
 * 
 * Priority:
 * 1. catalogSnapshot.lastResults (if present)
 * 2. pageContext.visibleSkus (max 8)
 * 3. getAllProducts()
 * 
 * Then filter by activeCategorySlug if present
 */
function getCandidateProducts(ctx: CandidateProductsContext): CandidateProductsResult {
    let candidates: AIProductSpec[];

    // Step 1: Get base candidates
    if (ctx.catalogSnapshot?.lastResults && ctx.catalogSnapshot.lastResults.length > 0) {
        candidates = ctx.catalogSnapshot.lastResults;
    } else if (ctx.pageContextVisibleSkus && ctx.pageContextVisibleSkus.length > 0) {
        // Try to map visible SKUs to products
        const allProducts = getAllProducts();
        candidates = ctx.pageContextVisibleSkus
            .slice(0, 8)
            .map(sku => allProducts.find(p => p.id === sku))
            .filter((p): p is AIProductSpec => p !== undefined);

        if (candidates.length === 0) {
            candidates = allProducts;
        }
    } else {
        candidates = getAllProducts();
    }

    const countBefore = candidates.length;

    // Step 2: Filter by category if present
    if (ctx.activeCategorySlug) {
        const filtered = candidates.filter(p => {
            // Check category slug directly
            if (p.category === ctx.activeCategorySlug) return true;
            // Check if category ID maps to slug
            const mappedSlug = CATEGORY_ID_TO_SLUG[p.category];
            if (mappedSlug === ctx.activeCategorySlug) return true;
            return false;
        });

        if (filtered.length > 0) {
            console.log(`[chat][${ctx.requestId}] getCandidateProducts: filtered ${countBefore} -> ${filtered.length} by category=${ctx.activeCategorySlug}`);
            return { products: filtered, countBefore, countAfter: filtered.length };
        }

        // If filter resulted in empty, log and return original (fallback)
        console.log(`[chat][${ctx.requestId}] getCandidateProducts: filter by ${ctx.activeCategorySlug} empty, using unfiltered`);
    }

    return { products: candidates, countBefore, countAfter: candidates.length };
}

/**
 * Parser de budget robusto
 */
function parseBudgetFromText(text: string): number | null {
    const t = text.toLowerCase().replace(/\s+/g, ' ').replace(',', '.').trim();

    const patterns = [
        /r?\$\s*(\d+(?:[.\s]?\d{3})*)/,       // "R$ 5000" ou "R$ 5.000"
        /at[eé]\s*(\d+)/,                      // "ate 5000" - simples, pega qualquer número
        /(\d+)\s*k\b/i,                        // "5k"
        /or[cç]amento\s*(de)?\s*(r\$)?\s*(\d+)/, // "orçamento de 5000"
        /m[aá]ximo\s*(r\$)?\s*(\d+)/           // "máximo 5000"
    ];

    for (const pattern of patterns) {
        const match = t.match(pattern);
        if (match) {
            const numStr = (match[2] || match[1]).replace(/[\s.]/g, '');
            let value = parseInt(numStr, 10);
            if (/k\b/i.test(t) && value < 1000) value *= 1000;
            if (value >= 100 && value <= 100000) return value;
        }
    }
    return null;
}

// ============================================
// MULTI-INTENT HANDLER
// ============================================

interface MultiIntentContext {
    intents: DetectedIntents;
    catalogSnapshot: CatalogProduct[];
    focusIds: string[];
    stateCode: string;
    energyRate: number;
    stateName: string;
    requestId: string;
    pageContextCategorySlug?: string;
    activeCategorySlug?: string;  // Persisted from client
    pageContextVisibleSkus?: string[];
    userMessage?: string;  // For text inference
}

interface MultiIntentResult {
    text: string;
    cards: CatalogProduct[];
    intentsUsed: Record<string, boolean>;
    categoryResolution?: CategoryResolution;
    candidateCounts?: { before: number; after: number };
}

/**
 * Orquestra resposta para múltiplas intents no mesmo turno
 * Usa getCandidateProducts como single source of truth para produtos
 */
async function handleDeterministicMulti(ctx: MultiIntentContext): Promise<MultiIntentResult> {
    const { intents, catalogSnapshot, stateCode, energyRate, stateName, requestId, userMessage } = ctx;
    const sections: string[] = [];
    const intentsUsed: Record<string, boolean> = {};

    // ===== CATEGORY RESOLUTION (Single Source of Truth) =====
    const categoryResolution = resolveActiveCategorySlug({
        userMessage: userMessage || '',
        pageContextCategorySlug: ctx.pageContextCategorySlug,
        activeCategorySlug: ctx.activeCategorySlug
    });
    const category = categoryResolution.slug;

    console.log(`[chat][${requestId}] CATEGORY_RESOLUTION: slug=${category} source=${categoryResolution.source}`);

    // ===== GET CANDIDATES (Single Source of Truth) =====
    // If we have catalog snapshot, use it directly (already filtered by frontend)
    // Otherwise, use getCandidateProducts with category filtering
    let baseProducts: CatalogProduct[];
    let candidateCounts = { before: 0, after: 0 };

    if (catalogSnapshot.length > 0) {
        // Use snapshot directly, but filter by category if different from current page
        baseProducts = catalogSnapshot;
        candidateCounts.before = baseProducts.length;

        // Filter by resolved category if needed (text_infer case)
        if (category && categoryResolution.source === 'text_infer') {
            const filtered = baseProducts.filter(p => {
                const name = p.name.toLowerCase();
                if (category === 'smart-tvs') return /tv|oled|qled|led/i.test(name);
                if (category === 'geladeiras') return /geladeira|refrigerador|frost/i.test(name);
                if (category === 'ar-condicionado') return /ar.?condicionado|split|btu/i.test(name);
                return true;
            });
            if (filtered.length > 0) baseProducts = filtered;
        }
        candidateCounts.after = baseProducts.length;
    } else {
        // No snapshot: use getCandidateProducts with category filtering
        const candidateResult = getCandidateProducts({
            catalogSnapshot: undefined,
            pageContextVisibleSkus: ctx.pageContextVisibleSkus,
            activeCategorySlug: category,
            requestId
        });

        // Convert AIProductSpec to CatalogProduct format for compatibility
        baseProducts = candidateResult.products.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            score: p.score
        }));
        candidateCounts = { before: candidateResult.countBefore, after: candidateResult.countAfter };
    }

    // Filtrar por budget
    if (intents.budget?.max) {
        baseProducts = baseProducts.filter(p => p.price > 0 && p.price <= intents.budget!.max);
    }

    // Ordenar por score
    baseProducts = [...baseProducts].sort((a, b) => b.score - a.score);
    const focusProducts = baseProducts.slice(0, 2);
    let cards = baseProducts.slice(0, 5);

    // CATALOG
    if (intents.catalog) {
        intentsUsed.catalog = true;
        const catName = category === 'smart-tvs' ? 'TVs' : category === 'geladeiras' ? 'Geladeiras' : category === 'ar-condicionado' ? 'Ar-Condicionados' : 'produtos';
        sections.push(`📺 **Encontrei ${baseProducts.length} ${catName}** no catálogo:`);
    }

    // BUDGET
    if (intents.budget?.max && focusProducts.length > 0) {
        intentsUsed.budget = true;
        const best = focusProducts[0];
        sections.push(`\n💰 **Melhor até R$ ${intents.budget.max.toLocaleString('pt-BR')}:**`);
        sections.push(`→ **${best.name}** - R$ ${best.price.toLocaleString('pt-BR')} (nota ${best.score})`);
        cards = [best, ...cards.filter(c => c.id !== best.id)].slice(0, 5);
    }

    // COMPARE
    if (intents.compare && focusProducts.length >= 2) {
        intentsUsed.compare = true;
        const [p1, p2] = focusProducts;
        sections.push(`\n⚖️ **Comparando as 2 melhores:**`);
        sections.push(`→ **${p1.name}** (nota ${p1.score}) vs **${p2.name}** (nota ${p2.score})`);
        const priceDiff = Math.abs(p1.price - p2.price);
        if (priceDiff > 0) {
            const cheaper = p1.price < p2.price ? p1.name.split(' ')[0] : p2.name.split(' ')[0];
            sections.push(`  • ${cheaper} é R$ ${priceDiff.toLocaleString('pt-BR')} mais barato`);
        }
    }

    // DETAILS (energy/tco)
    if (intents.details && focusProducts.length > 0) {
        const fields = intents.details.fields;
        if (fields.includes('energy') || fields.includes('tco')) {
            intentsUsed.details = true;
            sections.push(`\n⚡ **Consumo em ${stateName} (R$ ${energyRate.toFixed(2)}/kWh):**`);
            for (const product of focusProducts.slice(0, 2)) {
                const details = getProductDetails(product.id);

                // Try to get real energy profile first
                const energyProfile = await getEnergyProfileBySku(product.id);
                let monthlyKwh = 15;
                let isRealEnergy = false;
                let energySourceLabel = '';

                if (energyProfile && energyProfile.source !== 'estimado') {
                    // REAL data from energy_profiles
                    monthlyKwh = energyProfile.kwhMonth;
                    isRealEnergy = true;
                    energySourceLabel = ` (REAL — fonte: ${energyProfile.source})`;
                } else if (details?.energyKwh && details.energyKwh > 0) {
                    // Fallback to catalog data
                    monthlyKwh = details.energyPeriod === 'month' ? details.energyKwh : Math.round(details.energyKwh / 12);
                    energySourceLabel = ' (ESTIMADO)';
                } else {
                    // Default estimate
                    energySourceLabel = ' (ESTIMADO)';
                }

                const monthlyCost = monthlyKwh * energyRate;
                sections.push(`→ **${product.name.split(' ').slice(0, 3).join(' ')}**: ${monthlyKwh} kWh/mês${energySourceLabel} → R$ ${monthlyCost.toFixed(2)}/mês`);
                if (fields.includes('tco') && details) {
                    const tco = calculateTco({ price: details.price, energyKwhMonth: monthlyKwh, energyRate, lifespanYears: 5 });
                    sections.push(`  • TCO 5 anos: R$ ${tco.totalTco.toLocaleString('pt-BR')}`);
                }
            }
        }
    }

    // MANUAL - SEMPRE renderiza quando solicitado
    if (intents.manual) {
        intentsUsed.manual = true;
        sections.push(`\n📖 **Manuais:**`);

        if (focusProducts.length > 0) {
            for (const product of focusProducts.slice(0, 2)) {
                const brand = product.brand || product.name.split(' ')[0];
                const model = product.name.split(' ').slice(1, 3).join(' ');
                sections.push(`→ **${product.name.split(' ').slice(0, 3).join(' ')}**: Busque "${brand} ${model} manual PDF"`);
            }
        } else {
            sections.push(`→ Nenhum produto selecionado. Me diga qual produto você quer o manual.`);
        }
    }

    // BUY_LINK - Links de compra do catálogo (DETERMINISTIC - ALWAYS SENDS CARDS)
    if (intents.buyLink) {
        intentsUsed.buyLink = true;

        // CRITICAL FIX: Clear cards[] - BUY_LINK should ONLY show purchase products
        // The previous logic was adding BUY_LINK products ON TOP of existing cards
        cards = [];

        // Determine source for telemetry
        let buyLinkSource: 'productName' | 'focusProducts' | 'baseProducts' | 'categoryFallback' = 'focusProducts';
        let targetProducts: CatalogProduct[] = [];

        // 1) Try to find specific product if name was mentioned
        if (intents.buyLink.productName && intents.buyLink.productName.length > 2) {
            const searched = findProductsByName([intents.buyLink.productName]);
            if (searched.length > 0) {
                // ONLY take the first match when searching by name (avoid duplicates)
                targetProducts = searched.slice(0, 1).map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand ?? p.name.split(' ')[0],
                    price: p.price ?? 0,
                    score: p.score ?? 0
                }));
                buyLinkSource = 'productName';
            }
        }

        // 2) Fallback to focusProducts (top 2 from catalogSnapshot)
        if (targetProducts.length === 0 && focusProducts.length > 0) {
            // Deduplicate by ID
            const seen = new Set<string>();
            targetProducts = focusProducts.filter(p => {
                if (seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
            }).slice(0, 3);
            buyLinkSource = 'focusProducts';
        }

        // 3) Fallback to baseProducts (from getCandidateProducts)
        if (targetProducts.length === 0 && baseProducts.length > 0) {
            const seen = new Set<string>();
            targetProducts = baseProducts.filter(p => {
                if (seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
            }).slice(0, 3);
            buyLinkSource = 'baseProducts';
        }

        // 4) Ultimate fallback: Top 3 by score from ALL_PRODUCTS in category
        if (targetProducts.length === 0) {
            const allProducts = getAllProducts();
            const categoryFiltered = category
                ? allProducts.filter(p => {
                    const name = p.name.toLowerCase();
                    if (category === 'smart-tvs') return /tv|oled|qled|led/.test(name);
                    if (category === 'geladeiras') return /geladeira|refrigerador/.test(name);
                    if (category === 'ar-condicionado') return /ar|split|btu/.test(name);
                    return true;
                })
                : allProducts;

            // Deduplicate by ID
            const seen = new Set<string>();
            targetProducts = categoryFiltered
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                .filter(p => {
                    if (seen.has(p.id)) return false;
                    seen.add(p.id);
                    return true;
                })
                .slice(0, 3)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand ?? p.name.split(' ')[0],
                    price: p.price ?? 0,
                    score: p.score ?? 0
                }));
            buyLinkSource = 'categoryFallback';
        }

        // Build response
        const resolvedSkus: string[] = [];
        let cardsRendered = 0;

        if (targetProducts.length === 0) {
            // Should never happen, but handle gracefully
            sections.push(`🛒 No momento não encontrei produtos para mostrar. Tente perguntar sobre uma categoria específica como "TVs" ou "geladeiras".`);
        } else if (buyLinkSource === 'productName' && targetProducts.length === 1) {
            // Specific product found - show just that one
            const product = targetProducts[0];
            sections.push(`🛒 Aqui está o link de compra:`);

            cards.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                score: product.score
            });
            resolvedSkus.push(product.id);
            cardsRendered++;
        } else {
            // Multiple products - show up to 3 unique products
            const introText = buyLinkSource === 'productName'
                ? `🛒 Encontrei ${targetProducts.length} opções:`
                : targetProducts.length > 1
                    ? `🛒 Aqui estão os links de compra dos produtos em destaque:`
                    : `🛒 Aqui está o link de compra:`;
            sections.push(introText);

            // Add unique products to cards (already deduplicated above)
            for (const product of targetProducts) {
                cards.push({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    score: product.score
                });
                resolvedSkus.push(product.id);
                cardsRendered++;
            }
        }

        // Enhanced telemetry
        console.log(`[chat][${requestId}] BUY_LINK: source=${buyLinkSource} resolved=${resolvedSkus.length} cards=${cardsRendered} skus=${resolvedSkus.join(',')}`);

        // Store telemetry for immunity logging (accessible via intentsUsed)
        (intentsUsed as Record<string, unknown>).buyLinkTelemetry = {
            resolvedSkus,
            source: buyLinkSource,
            cardsRendered
        };
    }

    // ===== ONDE COMPRAR (para handlers que não são BUY_LINK) =====
    // Adiciona CTA de compra para BUDGET, COMPARE, CATALOG quando tiver produtos
    if (!intents.buyLink && focusProducts.length > 0 && (intents.budget || intents.compare || intents.catalog)) {
        // Map CatalogProduct to ProductForOffers
        const productsForOffers: ProductForOffers[] = focusProducts.slice(0, 2).map(p => {
            const fullProduct = ALL_PRODUCTS.find(fp => fp.id === p.id);
            return {
                id: p.id,
                name: p.name,
                price: p.price,
                offers: fullProduct?.offers?.map(o => ({
                    affiliateUrl: o.affiliateUrl,
                    url: o.url,
                    store: o.store,
                    price: o.price,
                    inStock: o.inStock
                }))
            };
        });

        const ondeComprarSection = buildOndeComprarSection(productsForOffers);
        sections.push(`\n${ondeComprarSection}`);
        intentsUsed.ondeComprar = true;
    }

    if (sections.length > 0 && !intents.buyLink) {
        sections.push(`\n---\nQuer que eu detalhe algum desses produtos?`);
    } else if (sections.length > 0 && intents.buyLink) {
        sections.push(`\n---\nPosso ajudar com mais alguma coisa?`);
    }

    console.log(`[chat][${requestId}] MULTI_INTENT: ${JSON.stringify(intentsUsed)} cards=${cards.length} category=${category} source=${categoryResolution.source}`);
    return { text: formatMd(sections), cards, intentsUsed, categoryResolution, candidateCounts };
}

// ============================================
// UI SNAPSHOT - Transforms UI state to text for prompt
// ============================================

interface UiSnapshotElement {
    kind: string;
    label?: string;
    disabled?: boolean;
    visible?: boolean;
    valueState?: string;
    hint?: string;
}

interface UiSnapshotPayload {
    url?: string;
    title?: string;
    viewport?: { w: number; h: number };
    elements?: UiSnapshotElement[];
    notices?: string[];
}

interface BehaviorSignalsPayload {
    sinceMs?: number;
    deadClicks?: number;
    rageClicks?: number;
    backScrolls?: number;
    confusionScore?: number;
    lastHint?: string;
}

/**
 * Convert UI snapshot to text summary for system prompt
 * NEVER exposes raw JSON to the model
 */
function uiSnapshotToText(snapshot: UiSnapshotPayload | undefined, signals: BehaviorSignalsPayload | undefined): string {
    if (!snapshot && !signals) return '';

    const lines: string[] = [];

    if (snapshot) {
        if (snapshot.url) lines.push(`Página atual: ${snapshot.url}`);
        if (snapshot.title) lines.push(`Título: ${snapshot.title}`);

        // Notices (errors, empty states)
        if (snapshot.notices && snapshot.notices.length > 0) {
            lines.push(`\nAvisos na tela:`);
            snapshot.notices.slice(0, 5).forEach(n => lines.push(`  - ${n}`));
        }

        // Disabled elements
        const disabled = snapshot.elements?.filter(e => e.disabled && e.visible) || [];
        if (disabled.length > 0) {
            lines.push(`\nElementos desabilitados (${disabled.length}):`);
            disabled.slice(0, 5).forEach(e => {
                lines.push(`  - ${e.kind}: "${e.label || 'sem label'}"`);
            });
        }

        // Empty inputs
        const emptyInputs = snapshot.elements?.filter(
            e => e.visible && e.valueState === 'empty' && (e.kind === 'input' || e.kind === 'select')
        ) || [];
        if (emptyInputs.length > 0 && emptyInputs.length <= 5) {
            lines.push(`\nCampos vazios:`);
            emptyInputs.forEach(e => lines.push(`  - ${e.hint || e.label || e.kind}`));
        }

        // Key buttons
        const buttons = snapshot.elements?.filter(e => e.kind === 'button' && e.visible && !e.disabled) || [];
        if (buttons.length > 0) {
            lines.push(`\nBotões ativos: ${buttons.slice(0, 6).map(b => `"${b.label || '?'}"`).join(', ')}`);
        }
    }

    if (signals && signals.confusionScore !== undefined && signals.confusionScore > 0) {
        lines.push(`\nSinais do usuário: confusão=${signals.confusionScore}/100${signals.lastHint ? ` (${signals.lastHint})` : ''}`);
    }

    return lines.length > 0 ? lines.join('\n') : '';
}

// ============================================
// BUDGET RANKING - DETERMINISTIC PATH
// ============================================

/**
 * SMOKE TESTS for parseBudget:
 * - "5000" -> 5000
 * - "5.000" -> 5000
 * - "R$ 5000" -> 5000
 * - "R$5.000" -> 5000
 * - "5k" -> 5000
 * - "5 K" -> 5000
 * - "até 5000" -> 5000
 * - "orçamento de 10.000" -> 10000
 * - "15k" -> 15000
 */

// Detecta intenção de recomendação por orçamento
function isBudgetIntent(text: string): boolean {
    const t = text.toLowerCase();
    // Patterns: "melhor tv até", "até r$", "até 5000", "orçamento", "budget", "no máximo"
    // NOTA: Aceita tanto "até" quanto "ate" (sem acento)
    const patterns = [
        // "qual a melhor TV até 5000" / "qual a melhor até R$ 5000"
        /qual\s+(a\s+)?melhor.*at[eé]\s*r?\$?\s*\d/,
        // "melhor TV até 5000"
        /melhor\s+(tv|geladeira|refrigerador|ar[\s-]?condicionado|split).*at[eé]/,
        // "até r$ 5000" or "até 5000"
        /at[eé]\s+r?\$?\s*\d/,
        // "orçamento de 5000"
        /or[cç]amento\s*(de)?\s*r?\$?\s*\d/,
        // "no máximo 5000"
        /no\s+m[aá]ximo\s*r?\$?\s*\d/,
        // "TV até 5000" or "geladeira até 5000"
        /(tv|geladeira|refrigerador|ar[\s-]?condicionado|split).*(at[eé]|or[cç]amento|m[aá]ximo)\s*r?\$?\s*\d/,
        // "até 5000 TV"
        /(at[eé]|or[cç]amento|m[aá]ximo)\s*r?\$?\s*\d.*(tv|geladeira|refrigerador|ar[\s-]?condicionado|split)/,
        // Simple: any price mention with "melhor"
        /melhor.*r?\$\s*\d/,
        /r?\$\s*\d.*melhor/
    ];
    const result = patterns.some(p => p.test(t));
    console.log(`[isBudgetIntent] "${t.substring(0, 50)}..." => ${result}`);
    return result;
}

// Extrai categoria mencionada na mensagem
function extractCategory(text: string): string | null {
    const t = text.toLowerCase();
    if (/tv|televis|smart.?tv|oled|qled/.test(t)) return 'smart-tvs';
    if (/geladeira|refrigerador|frost.?free|duplex/.test(t)) return 'geladeiras';
    if (/ar[\s-]?condicionado|split|btu/.test(t)) return 'ar-condicionado';
    return null;
}

// Parser de dinheiro robusto
function parseBudget(text: string): number | null {
    const t = text.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(',', '.')
        .trim();

    // Try to find budget patterns
    const patterns = [
        // "R$ 5.000" or "R$5000" or "r$ 5 000"
        /r?\$\s*(\d{1,3}(?:[\.\s]?\d{3})*)/,
        // "até 5000" or "até 5.000"
        /até\s*(\d{1,3}(?:[\.\s]?\d{3})*)/,
        // "5k" or "5 k" or "5K"
        /(\d+)\s*k\b/i,
        // "orçamento de 5000"
        /orçamento\s*(?:de)?\s*r?\$?\s*(\d{1,3}(?:[\.\s]?\d{3})*)/,
        // "no máximo 5000"
        /máximo\s*r?\$?\s*(\d{1,3}(?:[\.\s]?\d{3})*)/,
        // Fallback: any sequence of digits that looks like money
        /(\d{4,})/
    ];

    for (const pattern of patterns) {
        const match = t.match(pattern);
        if (match && match[1]) {
            let numStr = match[1].replace(/[\.\s]/g, ''); // Remove dots and spaces
            let value = parseInt(numStr, 10);

            // Handle "k" suffix (5k = 5000)
            if (/k\b/i.test(t) && value < 1000) {
                value *= 1000;
            }

            // Sanity check: budget should be reasonable (100 to 100000)
            if (value >= 100 && value <= 100000) {
                return value;
            }
        }
    }

    return null;
}

// Filtra e ordena produtos por orçamento
interface BudgetPickResult {
    top1: CatalogProduct | null;
    top2: CatalogProduct | null;
    filtered: CatalogProduct[];
    allItems: CatalogProduct[];
}

function pickTopByBudget(
    items: CatalogProduct[],
    budget: number,
    category?: string | null
): BudgetPickResult {
    // Filter by price <= budget and price > 0
    let filtered = items.filter(p => p.price > 0 && p.price <= budget);

    // Optional: filter by category if specified
    if (category && filtered.length > 0) {
        const categoryFiltered = filtered.filter(p => {
            const name = p.name.toLowerCase();
            if (category === 'smart-tvs') return /tv|oled|qled|led/.test(name);
            if (category === 'geladeiras') return /geladeira|refrigerador|frost/.test(name);
            if (category === 'ar-condicionado') return /ar|split|btu/.test(name);
            return true;
        });
        if (categoryFiltered.length > 0) {
            filtered = categoryFiltered;
        }
    }

    // Sort by score descending
    const sorted = [...filtered].sort((a, b) => b.score - a.score);

    return {
        top1: sorted[0] || null,
        top2: sorted[1] || null,
        filtered: sorted,
        allItems: items
    };
}

// ============================================
// TYPES
// ============================================

interface CatalogProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    score: number;
}

// ============================================
// EMIT ERROR HELPER - NEVER LEAVE UI HANGING
// ============================================

function createErrorStream(requestId: string, message: string): ReadableStream {
    const enc = new TextEncoder();
    return new ReadableStream({
        start(controller) {
            const errorMsg = `⚠️ ${message} (ID: ${requestId.slice(0, 8)}). Tente novamente.`;
            controller.enqueue(enc.encode(`0:${JSON.stringify(errorMsg)}\n`));
            controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "error", requestId })}\n`));
            controller.close();
        }
    });
}

function emitErrorAndFinish(controller: ReadableStreamDefaultController, enc: TextEncoder, requestId: string, error: unknown): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[chat][${requestId}] Stream error:`, errorMsg);

    try {
        const userMsg = `⚠️ Tive um erro interno (ID: ${requestId.slice(0, 8)}). Tente novamente.`;
        controller.enqueue(enc.encode(`0:${JSON.stringify(userMsg)}\n`));
        controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "error", requestId, error: errorMsg })}\n`));
    } catch {
        // Controller might be closed, just log
        console.error(`[chat][${requestId}] Failed to emit error to stream`);
    }
}

// ============================================
// SYSTEM PROMPT
// ============================================

const SYSTEM_PROMPT = `
=== QUEM VOCÊ É ===
Você é o Consultor Técnico Sênior do ComparaTop.
Seu papel: ajudar brasileiros a escolher tecnologia para o lar com conhecimento técnico e empatia genuína.

=== FILOSOFIA DE COMUNICAÇÃO ===

📘 DALE CARNEGIE
- Interesse genuíno no que o usuário realmente quer
- Facilite o sim, valide primeiro

📗 MARSHALL ROSENBERG (CNV)
- Observe sem julgar, empatia antes de solução

📕 NEIL RACKHAM (SPIN)
- Situação → Problema → Implicação → Necessidade

=== REGRA DE OURO ===
O usuário é o chefe. Se ele quer algo simples, dê simples.

=== LINKS DE COMPRA ===
Você PODE e DEVE fornecer links de compra do catálogo do ComparaTop quando solicitados.
Os links são do nosso catálogo (Amazon, Magazine Luiza, etc.) — são legítimos e confiáveis.
Nunca diga "não posso enviar links" ou "não tenho acesso a links".
Se um produto não tiver link cadastrado, diga "Sem link cadastrado ainda" e sugira buscar no Google ou Amazon.

=== FERRAMENTA DISPONÍVEL ===
Ferramenta: search_products (busca no catálogo)

REGRAS CRÍTICAS:
- Nunca escreva código ou chamadas de ferramenta no texto.
- Nunca mencione "search_products", "print", "default_api", "tool", "function".
- Use a ferramenta internamente e apresente os resultados como recomendações naturais.
- Os produtos aparecerão automaticamente como cards.

=== TOM DE VOZ ===
Português brasileiro natural. Seja humano. Seja útil.
`;

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(req: Request) {
    // ============================================
    // 1) REQUEST ID + INITIAL LOGGING
    // ============================================
    const requestId = crypto.randomUUID();
    const requestStartTime = Date.now();

    console.log(`[chat][${requestId}] === NEW REQUEST ===`);

    // ============================================
    // 2) GLOBAL TRY/CATCH - NEVER CRASH
    // ============================================
    try {
        // ============================================
        // 2.1) SAFE BODY PARSING
        // ============================================
        let body: Record<string, unknown>;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error(`[chat][${requestId}] Failed to parse request body:`, parseError);
            return new Response(createErrorStream(requestId, "Erro ao processar mensagem"), {
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
        }

        // Extract sessionId for logging
        const sessionId = typeof body.sessionId === 'string' ? body.sessionId : 'unknown';
        const payloadBytes = JSON.stringify(body).length;

        // Extract region for TCO calculations
        const rawRegion = body.region as { stateCode?: string } | undefined;
        const stateCode = rawRegion?.stateCode && ENERGY_RATES[rawRegion.stateCode]
            ? rawRegion.stateCode
            : 'SP';
        const energyRate = getEnergyRate(stateCode);
        const stateName = ENERGY_RATES[stateCode]?.stateName ?? 'São Paulo';

        // ============================================
        // 2.2) SAFE SNAPSHOT EXTRACTION (DEFENSIVE)
        // ============================================
        let catalogSnapshot: CatalogProduct[] = [];
        let focusIds: string[] = [];

        try {
            const rawSnapshot = body.catalogSnapshot;

            if (rawSnapshot && typeof rawSnapshot === 'object') {
                // Case 1: Object with lastResults (new format)
                if (!Array.isArray(rawSnapshot) && 'lastResults' in rawSnapshot) {
                    const snapshotObj = rawSnapshot as { lastResults?: unknown[]; focusIds?: string[] };

                    // Defensive: lastResults
                    const lastResults = Array.isArray(snapshotObj.lastResults) ? snapshotObj.lastResults : [];
                    catalogSnapshot = lastResults
                        .filter((p): p is CatalogProduct =>
                            typeof p === 'object' && p !== null &&
                            typeof (p as CatalogProduct).id === 'string' &&
                            typeof (p as CatalogProduct).name === 'string'
                        )
                        .map(p => ({
                            id: String(p.id),
                            name: String(p.name),
                            brand: String(p.brand ?? p.name.split(' ')[0]),
                            price: Number(p.price) || 0,
                            score: Number(p.score) || 0
                        }));

                    // Defensive: focusIds
                    focusIds = Array.isArray(snapshotObj.focusIds)
                        ? snapshotObj.focusIds.filter(id => typeof id === 'string')
                        : [];
                }
                // Case 2: Direct array (legacy format)
                else if (Array.isArray(rawSnapshot)) {
                    catalogSnapshot = rawSnapshot
                        .filter((p): p is CatalogProduct =>
                            typeof p === 'object' && p !== null &&
                            typeof (p as CatalogProduct).id === 'string'
                        )
                        .map(p => ({
                            id: String(p.id),
                            name: String(p.name ?? ''),
                            brand: String(p.brand ?? ''),
                            price: Number(p.price) || 0,
                            score: Number(p.score) || 0
                        }));
                }
            }

            // Fallback: if focusIds empty, compute from top2 by score
            if (focusIds.length === 0 && catalogSnapshot.length >= 2) {
                focusIds = [...catalogSnapshot]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 2)
                    .map(p => p.id);
                console.log(`[chat][${requestId}] fallback: computed focusIds from top2`);
            }
        } catch (snapshotError) {
            console.error(`[chat][${requestId}] Error parsing catalogSnapshot, continuing without it:`, snapshotError);
            catalogSnapshot = [];
            focusIds = [];
        }

        // ============================================
        // 2.2b) EXTRACT UI SNAPSHOT AND BEHAVIOR SIGNALS
        // ============================================
        let uiSnapshot: UiSnapshotPayload | undefined;
        let behaviorSignals: BehaviorSignalsPayload | undefined;

        try {
            if (body.uiSnapshot && typeof body.uiSnapshot === 'object') {
                uiSnapshot = body.uiSnapshot as UiSnapshotPayload;
            }
            if (body.behaviorSignals && typeof body.behaviorSignals === 'object') {
                behaviorSignals = body.behaviorSignals as BehaviorSignalsPayload;
            }
        } catch (e) {
            console.warn(`[chat][${requestId}] Error parsing uiSnapshot/behaviorSignals:`, e);
        }

        // ============================================
        // 2.2c) EXTRACT PAGE CONTEXT SNAPSHOT
        // ============================================
        interface PageContextPayload {
            path?: string;
            categorySlug?: string;
            activeCategorySlug?: string;  // Persisted category from localStorage
            section?: string;
            visibleSkus?: string[];
            scrollDepth?: number;
            friction?: {
                rageClicks: number;
                confusionScrolls: number;
                score: number;
                updatedAt?: string;
            };
            ui?: {
                elements?: Array<{
                    ct?: string;
                    tag: string;
                    disabled?: boolean;
                    ariaDisabled?: boolean;
                }>;
                lastNav?: Array<{
                    type: string;
                    target?: string;
                }>;
                lastErrors?: Array<{
                    kind: string;
                    messageTrunc: string;
                }>;
            };
        }
        let pageContext: PageContextPayload | undefined;

        try {
            if (body.pageContextSnapshot && typeof body.pageContextSnapshot === 'object') {
                pageContext = body.pageContextSnapshot as PageContextPayload;
                console.log(`[chat][${requestId}] pageContext: path=${pageContext.path} categorySlug=${pageContext.categorySlug} section=${pageContext.section}`);
            }
        } catch (e) {
            console.warn(`[chat][${requestId}] Error parsing pageContextSnapshot:`, e);
        }

        // Generate text summary for prompt (never raw JSON)
        const uiContextText = uiSnapshotToText(uiSnapshot, behaviorSignals);

        // ============================================
        // 2.3) SAFE MESSAGE EXTRACTION
        // ============================================
        const rawMessages = body.messages ?? [];
        const messages = (Array.isArray(rawMessages) ? rawMessages : [])
            .filter((m: { role?: string; content?: unknown }) =>
                m.role && typeof m.content === 'string' && m.content.trim()
            )
            .map((m: { role: string; content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.role === 'assistant' ? stripToolLeak(m.content) : m.content
            }))
            .filter((m: { content: string }) => m.content.trim());

        const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
        const lastText = lastUser?.content ?? '';

        // ============================================
        // 2.4) COMPREHENSIVE REQUEST LOGGING
        // ============================================
        console.log(`[chat][${requestId}] sessionId: ${sessionId.slice(0, 8)}... | messages: ${messages.length} | snapshot: ${catalogSnapshot.length} | focusIds: [${focusIds.join(', ')}] | bytes: ${payloadBytes}`);

        // Log if no snapshot (fallback case)
        if (catalogSnapshot.length === 0) {
            console.log(`[chat][${requestId}] fallback: no snapshot available`);
        }

        // Log UI context if present
        if (uiSnapshot || behaviorSignals) {
            console.log(`[chat][${requestId}] uiContext: elements=${uiSnapshot?.elements?.length || 0} notices=${uiSnapshot?.notices?.length || 0} confusionScore=${behaviorSignals?.confusionScore || 0}`);
        }

        // ============================================
        // 2.5) SAFETY EVALUATION (GUARDIÃO DIGITAL)
        // ============================================
        const safetyDecision = evaluateSafety(lastText);
        const ethicalBrake = isEthicalBrakeActive(safetyDecision);

        console.log(`[chat][${requestId}] safety: level=${safetyDecision.level} ethicalBrake=${ethicalBrake}`);

        // HIGH RISK: Block immediately with protective response
        if (shouldBlockResponse(safetyDecision)) {
            console.log(`[chat][${requestId}] SAFETY_BLOCK: reason=${safetyDecision.reason}`);

            const enc = new TextEncoder();
            const safetyText = buildSafetyResponse(safetyDecision.reason, 'pt-BR');

            const stream = new ReadableStream({
                start(controller) {
                    try {
                        // Send guard event for UI
                        controller.enqueue(enc.encode(`9:${JSON.stringify({
                            type: 'guard',
                            ethicalBrake: true,
                            safetyLevel: 'high'
                        })}\n`));

                        // Send protective message
                        controller.enqueue(enc.encode(`0:${JSON.stringify(safetyText)}\n`));
                        controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop" })}\n`));
                        controller.close();
                    } catch (e) {
                        controller.error(e);
                    }
                }
            });

            // Log to immunity (with PII redaction)
            enqueueImmunityEvent({
                requestId,
                sessionId,
                chat: {
                    userMessage: redactPII(lastText.slice(0, 200)),
                    assistantText: '[SAFETY_BLOCK]',
                    intents: {},
                    mode: 'deterministic'
                },
                safety: {
                    level: safetyDecision.level,
                    reason: safetyDecision.reason,
                    ethicalBrake: true,
                    userTextRedacted: redactPII(lastText.slice(0, 200))
                },
                latency: { totalMs: Date.now() - requestStartTime }
            });

            return new Response(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache, no-transform",
                    "X-Accel-Buffering": "no"
                }
            });
        }

        // WATCH: Log ethical brake activation
        if (ethicalBrake) {
            console.log(`[chat][${requestId}] ETHICAL_BRAKE: activated`);
        }

        // ============================================
        // 2.6) INTENT DETECTION
        // ============================================
        // TEMPORARY: Disabled semantic router due to 500 errors
        // Using regex-only detection until LLM call is debugged
        // TODO: Re-enable semantic router after fixing generateObject issue

        const detectedIntents = detectIntents(lastText);
        const intentCount = countIntents(detectedIntents);

        console.log(`[chat][${requestId}] detectedIntents: ${JSON.stringify(detectedIntents)} count=${intentCount} (mode: regex-only)`);

        // Handle multi-intent (2+ intents) OR single high-priority intents (buyLink) deterministically
        // CRITICAL: Only use deterministic path when we have catalog data, otherwise LLM streaming
        const hasCatalogData = catalogSnapshot.length > 0;
        const shouldUseDeterministic = hasCatalogData && (intentCount >= 2 || detectedIntents.buyLink || detectedIntents.budget);
        if (shouldUseDeterministic) {
            console.log(`[chat][${requestId}] intent: DETERMINISTIC (${intentCount} intents, buyLink=${!!detectedIntents.buyLink}, budget=${detectedIntents.budget?.max ?? 'none'}, catalog=${catalogSnapshot.length})`);

            try {
                const multiResult = await handleDeterministicMulti({
                    intents: detectedIntents as DetectedIntents,
                    catalogSnapshot,
                    focusIds,
                    stateCode,
                    energyRate,
                    stateName,
                    requestId,
                    pageContextCategorySlug: pageContext?.categorySlug,
                    activeCategorySlug: pageContext?.activeCategorySlug,
                    pageContextVisibleSkus: pageContext?.visibleSkus,
                    userMessage: lastText
                });

                if (multiResult.text) {
                    const enc = new TextEncoder();

                    const stream = new ReadableStream({
                        start(controller) {
                            try {
                                // Send guard event if ethical brake
                                if (ethicalBrake) {
                                    controller.enqueue(enc.encode(`9:${JSON.stringify({
                                        type: 'guard',
                                        ethicalBrake: true,
                                        safetyLevel: 'watch'
                                    })}\n`));
                                }

                                // Send text
                                controller.enqueue(enc.encode(`0:${JSON.stringify(multiResult.text)}\n`));

                                // Send cards
                                for (const product of multiResult.cards) {
                                    controller.enqueue(enc.encode(`9:${JSON.stringify({
                                        __ui: 'product_card',
                                        ...product,
                                        priceFormatted: `R$ ${product.price.toLocaleString('pt-BR')}`,
                                        internalUrl: `/produto/${product.id}`,
                                        amazonUrl: `https://amazon.com.br/s?k=${encodeURIComponent(product.name)}&tag=comparatop-20`
                                    })}\n`));
                                }

                                controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                            } catch (e) {
                                emitErrorAndFinish(controller, enc, requestId, e);
                            } finally {
                                controller.close();
                            }
                        }
                    });

                    // Log to immunity
                    enqueueImmunityEvent({
                        requestId,
                        sessionId,
                        chat: {
                            userMessage: redactPII(lastText.slice(0, 200)),
                            assistantText: multiResult.text.slice(0, 500),
                            intents: multiResult.intentsUsed,
                            mode: 'deterministic',
                            catalogSnapshot: {
                                count: catalogSnapshot.length,
                                focusIds: multiResult.cards.slice(0, 2).map(p => p.id),
                                lastResultsIds: catalogSnapshot.map(p => p.id)
                            },
                            // Category resolver telemetry
                            activeCategorySlug: multiResult.categoryResolution?.slug || undefined,
                            categorySource: multiResult.categoryResolution?.source || 'none',
                            candidateCountBefore: multiResult.candidateCounts?.before,
                            candidateCountAfter: multiResult.candidateCounts?.after
                        },
                        latency: { totalMs: Date.now() - requestStartTime }
                    });

                    return new Response(stream, {
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8",
                            "Cache-Control": "no-cache, no-transform",
                            "X-Accel-Buffering": "no"
                        }
                    });
                }
            } catch (deterministicError) {
                // Log error and fall through to LLM streaming
                console.error(`[chat][${requestId}] DETERMINISTIC_ERROR:`, deterministicError instanceof Error ? deterministicError.message : deterministicError);
                console.log(`[chat][${requestId}] Falling back to LLM streaming due to deterministic handler error`);
                // Continue to LLM streaming below
            }
        }

        // ============================================
        // 3) INTENT ROUTING WITH ERROR HANDLING (SINGLE INTENT FALLBACK)
        // ============================================

        // 3.1) Compare Intent
        if (isCompareIntent(lastText) && catalogSnapshot.length >= 2) {
            console.log(`[chat][${requestId}] intent: COMPARE`);

            const top2 = [...catalogSnapshot]
                .filter(p => typeof p.score === 'number')
                .sort((a, b) => b.score - a.score)
                .slice(0, 2);

            if (top2.length < 2) {
                console.log(`[chat][${requestId}] fallback: not enough products for comparison`);
            } else {
                const enc = new TextEncoder();
                const intro = `Beleza! Comparando as 2 com maior nota do catálogo:\n\n**${top2[0]?.name}** (nota ${top2[0]?.score}) vs **${top2[1]?.name}** (nota ${top2[1]?.score})\n\n`;
                const outro = "\n\nQuer que eu detalhe diferenças de consumo, tamanho ou custo-benefício?";

                const stream = new ReadableStream({
                    start(controller) {
                        try {
                            controller.enqueue(enc.encode(`0:${JSON.stringify(intro)}\n`));
                            for (const product of top2) {
                                controller.enqueue(enc.encode(`9:${JSON.stringify({
                                    __ui: 'product_card',
                                    ...product,
                                    priceFormatted: `R$ ${product.price.toLocaleString('pt-BR')}`,
                                    internalUrl: `/produto/${product.id}`,
                                    amazonUrl: `https://amazon.com.br/s?k=${encodeURIComponent(product.name)}&tag=comparatop-20`
                                })}\n`));
                            }
                            controller.enqueue(enc.encode(`0:${JSON.stringify(outro)}\n`));
                            controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                        } catch (e) {
                            emitErrorAndFinish(controller, enc, requestId, e);
                        } finally {
                            controller.close();
                        }
                    }
                });

                console.log(`[chat][${requestId}] response: COMPARE completed in ${Date.now() - requestStartTime}ms`);

                // Digital Immunity logging (cold path - after response ready)
                void enqueueImmunityEvent({
                    requestId,
                    sessionId,
                    ts: new Date().toISOString(),
                    env: (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development',
                    app: 'glowing-pinwheel',
                    chat: {
                        userMessage: lastText,
                        assistantText: intro + outro,
                        intents: { comparison: true },
                        mode: 'deterministic',
                        catalogSnapshot: {
                            count: catalogSnapshot.length,
                            focusIds,
                            lastResultsIds: catalogSnapshot.map(p => p.id)
                        }
                    },
                    latency: { totalMs: Date.now() - requestStartTime }
                });

                return new Response(stream, {
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Cache-Control": "no-cache, no-transform",
                        "X-Accel-Buffering": "no"
                    }
                });
            }
        }

        // 3.2) Budget Ranking Intent - "Qual a melhor TV até R$ 5000?"
        // USE LLM SEMANTIC ROUTER for reliable budget parsing (handles 70k, R$70.000, "uns 5 mil", etc.)
        try {
            // First, try LLM-based intent detection for budget
            let budget: number | null = null;
            let category: string | null = extractCategory(lastText);

            // Check if this looks like a budget query
            if (isBudgetIntent(lastText)) {
                console.log(`[chat][${requestId}] Detected potential budget intent, calling Semantic Router...`);

                try {
                    const semanticIntent = await routeWithLLM(lastText, {
                        categoryHint: category,
                        timeoutMs: 2500  // Fast timeout for budget parsing
                    });

                    console.log(`[chat][${requestId}] Semantic Router result:`, JSON.stringify({
                        intent: semanticIntent.intent,
                        budget: semanticIntent.normalizedBudget,
                        category: semanticIntent.filters?.category,
                        confidence: semanticIntent.confidence
                    }));

                    // Use LLM-parsed budget if available
                    if (semanticIntent.normalizedBudget && semanticIntent.normalizedBudget > 0) {
                        budget = semanticIntent.normalizedBudget;
                    }

                    // Use LLM-inferred category if we don't have one
                    if (!category && semanticIntent.filters?.category) {
                        category = semanticIntent.filters.category;
                    }
                } catch (routerError) {
                    console.warn(`[chat][${requestId}] Semantic Router failed, falling back to regex:`, routerError);
                    // Fallback to regex parser
                    budget = parseBudget(lastText);
                }

                // If LLM didn't give us a budget, try regex as fallback
                if (!budget) {
                    budget = parseBudget(lastText);
                    console.log(`[chat][${requestId}] Regex fallback budget: ${budget}`);
                }

                console.log(`[chat][${requestId}] intent: BUDGET_RANKING | budget: ${budget} | category: ${category}`);

                if (budget) {
                    // Fallback: se snapshot vazio, carregar do catálogo local
                    let productsToFilter = catalogSnapshot;
                    if (productsToFilter.length === 0) {
                        console.log(`[chat][${requestId}] BUDGET_RANKING: no snapshot, loading from local catalog`);
                        try {
                            const allProducts = getAllProducts();
                            productsToFilter = allProducts.map(p => ({
                                id: p.id,
                                name: p.name,
                                brand: p.brand,
                                price: p.price ?? 0,
                                score: p.score ?? 0
                            }));
                        } catch (productError) {
                            console.error(`[chat][${requestId}] BUDGET_RANKING: failed to load products:`, productError);
                            // Fall through to LLM
                        }
                    }

                    if (productsToFilter.length > 0) {
                        const result = pickTopByBudget(productsToFilter, budget, category);
                        const enc = new TextEncoder();

                        console.log(`[chat][${requestId}] BUDGET_RANKING: filtered ${result.filtered.length} from ${result.allItems.length} items`);

                        if (result.top1) {
                            // Success: found products in budget
                            const formattedBudget = budget.toLocaleString('pt-BR');
                            const top1 = result.top1;
                            const top2 = result.top2;

                            let responseText = `Até **R$ ${formattedBudget}**, a melhor opção do catálogo é:\n\n`;
                            responseText += `🏆 **${top1.name}** (nota ${top1.score})\n`;
                            responseText += `💰 R$ ${top1.price.toLocaleString('pt-BR')}\n\n`;
                            responseText += `**Por que essa?** Maior nota de avaliação dentro do seu orçamento, `;
                            responseText += `combinando qualidade de imagem, recursos smart e durabilidade.\n\n`;

                            if (top2) {
                                responseText += `Quer que eu compare com a 2ª melhor (**${top2.name}**, nota ${top2.score})?`;
                            } else {
                                responseText += `Quer mais detalhes técnicos ou ver outras faixas de preço?`;
                            }

                            const stream = new ReadableStream({
                                start(controller) {
                                    try {
                                        controller.enqueue(enc.encode(`0:${JSON.stringify(responseText)}\n`));
                                        // Emit top1 card
                                        controller.enqueue(enc.encode(`9:${JSON.stringify({
                                            __ui: 'product_card',
                                            ...top1,
                                            priceFormatted: `R$ ${top1.price.toLocaleString('pt-BR')}`,
                                            internalUrl: `/produto/${top1.id}`,
                                            amazonUrl: `https://amazon.com.br/s?k=${encodeURIComponent(top1.name)}&tag=comparatop-20`
                                        })}\n`));
                                        // Optionally emit top2 card if exists
                                        if (top2) {
                                            controller.enqueue(enc.encode(`9:${JSON.stringify({
                                                __ui: 'product_card',
                                                ...top2,
                                                priceFormatted: `R$ ${top2.price.toLocaleString('pt-BR')}`,
                                                internalUrl: `/produto/${top2.id}`,
                                                amazonUrl: `https://amazon.com.br/s?k=${encodeURIComponent(top2.name)}&tag=comparatop-20`
                                            })}\n`));
                                        }
                                        controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                                    } catch (e) {
                                        emitErrorAndFinish(controller, enc, requestId, e);
                                    } finally {
                                        controller.close();
                                    }
                                }
                            });

                            console.log(`[chat][${requestId}] response: BUDGET_RANKING completed in ${Date.now() - requestStartTime}ms`);

                            // Digital Immunity logging (cold path)
                            void enqueueImmunityEvent({
                                requestId,
                                sessionId,
                                ts: new Date().toISOString(),
                                env: (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development',
                                app: 'glowing-pinwheel',
                                chat: {
                                    userMessage: lastText,
                                    assistantText: responseText,
                                    intents: { budget: true },
                                    mode: 'deterministic',
                                    catalogSnapshot: {
                                        count: productsToFilter.length,
                                        focusIds: [top1.id, top2?.id].filter((id): id is string => !!id),
                                        lastResultsIds: productsToFilter.map(p => p.id).slice(0, 10)
                                    }
                                },
                                latency: { totalMs: Date.now() - requestStartTime }
                            });

                            return new Response(stream, {
                                headers: {
                                    "Content-Type": "text/plain; charset=utf-8",
                                    "Cache-Control": "no-cache, no-transform",
                                    "X-Accel-Buffering": "no"
                                }
                            });
                        } else {
                            // Fallback: no products in budget
                            const formattedBudget = budget.toLocaleString('pt-BR');
                            const minPrice = Math.min(...productsToFilter.map(p => p.price).filter(p => p > 0));
                            const suggestedBudget1 = Math.ceil(minPrice / 1000) * 1000;
                            const suggestedBudget2 = suggestedBudget1 + 2000;

                            let responseText = `Não encontrei opções até **R$ ${formattedBudget}** no catálogo atual. `;
                            responseText += `O produto mais acessível que tenho é **R$ ${minPrice.toLocaleString('pt-BR')}**.\n\n`;
                            responseText += `Quer que eu mostre opções:\n`;
                            responseText += `• Até R$ ${suggestedBudget1.toLocaleString('pt-BR')}?\n`;
                            responseText += `• Até R$ ${suggestedBudget2.toLocaleString('pt-BR')}?\n\n`;
                            responseText += `Ou posso buscar outras categorias se preferir.`;

                            const stream = new ReadableStream({
                                start(controller) {
                                    try {
                                        controller.enqueue(enc.encode(`0:${JSON.stringify(responseText)}\n`));
                                        controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                                    } catch (e) {
                                        emitErrorAndFinish(controller, enc, requestId, e);
                                    } finally {
                                        controller.close();
                                    }
                                }
                            });

                            console.log(`[chat][${requestId}] response: BUDGET_RANKING (no match) completed in ${Date.now() - requestStartTime}ms`);

                            // Digital Immunity logging (cold path)
                            void enqueueImmunityEvent({
                                requestId,
                                sessionId,
                                ts: new Date().toISOString(),
                                env: (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development',
                                app: 'glowing-pinwheel',
                                chat: {
                                    userMessage: lastText,
                                    assistantText: responseText,
                                    intents: { budget: true },
                                    mode: 'deterministic',
                                    catalogSnapshot: {
                                        count: productsToFilter.length,
                                        focusIds: [],
                                        lastResultsIds: productsToFilter.map(p => p.id).slice(0, 10)
                                    }
                                },
                                latency: { totalMs: Date.now() - requestStartTime }
                            });

                            return new Response(stream, {
                                headers: {
                                    "Content-Type": "text/plain; charset=utf-8",
                                    "Cache-Control": "no-cache, no-transform",
                                    "X-Accel-Buffering": "no"
                                }
                            });
                        }
                    } else {
                        console.log(`[chat][${requestId}] BUDGET_RANKING: no products available, falling through to LLM`);
                        // Fall through to LLM flow
                    }
                } else {
                    console.log(`[chat][${requestId}] BUDGET_RANKING: could not parse budget from "${lastText}"`);
                    // Fall through to LLM flow
                }
            }
        } catch (budgetIntentError) {
            console.error(`[chat][${requestId}] BUDGET_INTENT_ERROR:`, budgetIntentError instanceof Error ? budgetIntentError.message : budgetIntentError);
            // Fall through to LLM flow
        }

        // 3.3) Details Intent (with TCO calculation)
        if (isDetailsIntent(lastText) && catalogSnapshot.length >= 1) {
            console.log(`[chat][${requestId}] intent: DETAILS | stateCode: ${stateCode} | energyRate: ${energyRate}`);

            const focusProducts = [...catalogSnapshot]
                .sort((a, b) => b.score - a.score)
                .slice(0, 2);

            const enc = new TextEncoder();

            // Build response header with UF info
            let response = `**Consumo e Custo Real em ${stateName} (tarifa R$ ${energyRate.toFixed(2)}/kWh):**\n\n`;

            // Track products for immunity logging
            const tcoProducts: Array<{ id: string; kwh: number; estimated: boolean; monthlyCost: number; totalTco: number }> = [];

            for (const product of focusProducts) {
                const details = getProductDetails(product.id);
                if (details) {
                    response += `**${details.name}**\n`;

                    // Resolve energy consumption (real or fallback)
                    let monthlyKwh: number;
                    let estimated = false;

                    if (details.energyKwh && details.energyKwh > 0) {
                        // Real data from product
                        monthlyKwh = details.energyPeriod === 'month'
                            ? details.energyKwh
                            : Math.round(details.energyKwh / 12);
                    } else {
                        // Fallback by category
                        const categoryKey = details.category.replace('smart-tvs', 'tv').replace('geladeiras', 'fridge').replace('ar-condicionado', 'air_conditioner');
                        monthlyKwh = getDefaultEnergyConsumption(categoryKey);
                        estimated = true;
                    }

                    // Calculate costs
                    const monthlyCost = monthlyKwh * energyRate;
                    const tco = calculateTco({
                        price: details.price,
                        energyKwhMonth: monthlyKwh,
                        energyRate,
                        lifespanYears: 5
                    });

                    // Track for logging
                    tcoProducts.push({
                        id: product.id,
                        kwh: monthlyKwh,
                        estimated,
                        monthlyCost: Math.round(monthlyCost * 100) / 100,
                        totalTco: tco.totalTco
                    });

                    // Format response
                    response += `• Consumo: ~${monthlyKwh} kWh/mês`;
                    if (estimated) response += ` *(estimativa por categoria)*`;
                    response += `\n`;
                    response += `• Custo mensal: ~R$ ${monthlyCost.toFixed(2)}/mês\n`;
                    response += `• **Custo Real 5 anos**: R$ ${tco.totalTco.toLocaleString('pt-BR')}\n`;
                    response += `  (Aquisição: R$ ${tco.acquisitionCost.toLocaleString('pt-BR')} + Energia: R$ ${tco.energyCost.toLocaleString('pt-BR')} + Manutenção: R$ ${tco.maintenanceCost.toLocaleString('pt-BR')})\n`;

                    if (details.energyLabel) {
                        response += `• Selo Procel: ${details.energyLabel}\n`;
                    }
                    if (details.manualUrl) {
                        response += `• [Ver manual](${details.manualUrl})\n`;
                    }
                    response += `• [Ver detalhes completos](${details.internalUrl})\n\n`;
                }
            }

            if (response && tcoProducts.length > 0) {
                response += "Quer que eu compare o custo-benefício entre eles, ou tem alguma outra dúvida?";

                const stream = new ReadableStream({
                    start(controller) {
                        try {
                            controller.enqueue(enc.encode(`0:${JSON.stringify(response)}\n`));
                            controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                        } catch (e) {
                            emitErrorAndFinish(controller, enc, requestId, e);
                        } finally {
                            controller.close();
                        }
                    }
                });

                console.log(`[chat][${requestId}] response: DETAILS completed in ${Date.now() - requestStartTime}ms`);

                // Digital Immunity logging with TCO data (cold path)
                void enqueueImmunityEvent({
                    requestId,
                    sessionId,
                    ts: new Date().toISOString(),
                    env: (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development',
                    app: 'glowing-pinwheel',
                    chat: {
                        userMessage: lastText,
                        assistantText: response,
                        intents: { details: true },
                        mode: 'deterministic',
                        catalogSnapshot: {
                            count: catalogSnapshot.length,
                            focusIds: focusProducts.map(p => p.id),
                            lastResultsIds: catalogSnapshot.map(p => p.id)
                        }
                    },
                    // @ts-expect-error - extending immunity event with TCO data
                    tco: {
                        stateCode,
                        energyRate,
                        products: tcoProducts
                    },
                    latency: { totalMs: Date.now() - requestStartTime }
                });

                return new Response(stream, {
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Cache-Control": "no-cache, no-transform",
                        "X-Accel-Buffering": "no"
                    }
                });
            }
        }

        // ============================================
        // 3.5) UI_HELP DETERMINISTIC - DIAGNÓSTICO DE NAVEGAÇÃO
        // ============================================
        if (isUIHelpIntent(lastText)) {
            console.log(`[chat][${requestId}] intent: UI_HELP`);

            // Build diagnosis from pageContext.ui
            const ui = pageContext?.ui;
            const frictionScore = pageContext?.friction?.score || 0;
            const categorySlug = pageContext?.categorySlug || 'desconhecida';
            const section = pageContext?.section || 'página principal';
            const scrollDepth = (pageContext?.scrollDepth ?? 0) * 100;

            // Get element data
            const elementsWithCt = ui?.elements?.filter(e => e.ct) || [];
            const disabledElements = ui?.elements?.filter(e => e.disabled || e.ariaDisabled) || [];
            const lastNav = ui?.lastNav?.[ui.lastNav.length - 1];
            const errorsCount = ui?.lastErrors?.length || 0;

            // Build CTAs list (up to 6)
            const ctaList = elementsWithCt.slice(0, 6).map(e => {
                const status = e.disabled || e.ariaDisabled ? '❌ disabled' : '✅ ok';
                return `- \`${e.ct}\` (${e.tag}) ${status}`;
            }).join('\n');

            // Build disabled list
            const disabledList = disabledElements
                .filter(e => e.ct)
                .slice(0, 5)
                .map(e => `\`${e.ct}\``)
                .join(', ');

            // Build response
            let diagnosisResponse = `## 🧭 Diagnóstico rápido

**Contexto:** ${categorySlug} • seção: ${section} • scroll: ${scrollDepth.toFixed(0)}% • fricção: ${frictionScore}/100

**Última ação:** ${lastNav ? `${lastNav.type} → \`${lastNav.target || 'desconhecido'}\`` : 'nenhuma detectada'}

**Erros no navegador:** ${errorsCount > 0 ? `⚠️ ${errorsCount} erro(s) detectado(s)` : '✅ nenhum erro detectado'}

**CTAs detectados:**
${ctaList || '- Nenhum elemento data-ct encontrado'}

${disabledList ? `**Elementos desabilitados:** ${disabledList}` : ''}

---

`;
            // Add helpful guidance
            if (errorsCount > 0) {
                diagnosisResponse += `Notei ${errorsCount} erro(s) no navegador. Isso pode estar causando o problema. Tente recarregar a página (F5) e me avise se o problema persistir.\n\n`;
            } else if (disabledList) {
                diagnosisResponse += `Alguns botões estão desabilitados (${disabledList}). Isso pode ser normal dependendo do estado da página. Qual ação você estava tentando realizar?\n\n`;
            } else if (frictionScore >= 60) {
                diagnosisResponse += `Percebi que você está com dificuldade (fricção alta). Me diga exatamente qual botão ou funcionalidade não está respondendo.\n\n`;
            } else {
                diagnosisResponse += `Não detectei bloqueio visível. Me diga qual botão exato você está tentando clicar: **Alertas**, **Comparar**, **Ver oferta** ou outro?\n\n`;
            }

            // Stream response
            const stream = new ReadableStream({
                start(controller) {
                    const enc = new TextEncoder();
                    controller.enqueue(enc.encode(`0:"${diagnosisResponse.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`));
                    controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                    controller.close();
                }
            });

            console.log(`[chat][${requestId}] response: UI_HELP completed in ${Date.now() - requestStartTime}ms`);

            // Digital Immunity logging
            void enqueueImmunityEvent({
                requestId,
                sessionId,
                ts: new Date().toISOString(),
                env: (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development',
                app: 'glowing-pinwheel',
                chat: {
                    userMessage: lastText,
                    assistantText: diagnosisResponse,
                    intents: { details: false },
                    mode: 'deterministic',
                    catalogSnapshot: {
                        count: catalogSnapshot.length,
                        focusIds,
                        lastResultsIds: catalogSnapshot.map(p => p.id)
                    }
                },
                latency: { totalMs: Date.now() - requestStartTime },
                friction: pageContext?.friction ? {
                    rageClicks: pageContext.friction.rageClicks || 0,
                    confusionScrolls: pageContext.friction.confusionScrolls || 0,
                    score: pageContext.friction.score || 0
                } : undefined,
                intents: { uiHelp: true },
                // UI snapshot summary for immunity (não-PII)
                uiSnapshot: {
                    hasUi: !!ui,
                    elementsCtSample: elementsWithCt.slice(0, 10).map(e => e.ct),
                    disabledCt: disabledElements.filter(e => e.ct).map(e => e.ct),
                    lastNavType: lastNav?.type,
                    lastNavTarget: lastNav?.target,
                    lastErrorsCount: errorsCount
                }
            });

            return new Response(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache, no-transform",
                    "X-Accel-Buffering": "no"
                }
            });
        }

        // ============================================
        // 4) LLM FLOW WITH FULL ERROR HANDLING
        // ============================================
        console.log(`[chat][${requestId}] intent: LLM_FLOW`);

        const forceTool = shouldForceCatalog(lastText);
        console.log(`[chat][${requestId}] forceTool: ${forceTool}`);

        // Build system prompt with UI context and ethical brake if needed
        let llmSystemPrompt = SYSTEM_PROMPT;

        // Add grounding rules for anti-hallucination
        llmSystemPrompt += `

## REGRAS DE FONTES E ANTI-ALUCINAÇÃO (OBRIGATÓRIO)
1. NUNCA invente dados técnicos (kWh, selo Procel, BTU, URLs de manual, especificações).
2. Se a informação veio do catálogo/ferramentas, diga "Fonte: catálogo ComparaTop".
3. Se NÃO existir no catálogo, diga explicitamente: "Não está no catálogo; posso orientar onde encontrar."
4. Para CONSUMO mensal: se não houver dado real de energyKwhMonth, use estimativa (150-250kWh para TV, 30-50kWh para geladeira) e SEMPRE escreva "(Estimativa)".
5. Para MANUAL: se não houver manualUrl confirmado, oriente buscar no site do fabricante (NÃO invente URLs).
6. Se não souber algo, diga "Não tenho essa informação no momento."
7. Priorize dados do snapshot de catálogo enviado na conversa.`;

        if (uiContextText) {
            llmSystemPrompt += `\n\n## CONTEXTO DA TELA (use para orientar o usuário se perguntar sobre navegação, botões ou onde clicar)\n${uiContextText}`;
        }

        if (ethicalBrake) {
            llmSystemPrompt += getEthicalBrakePromptAddition();
        }

        const result = streamText({
            model: google("gemini-2.0-flash"),
            system: llmSystemPrompt,
            messages,
            tools: {
                search_products: tool({
                    description: "Busca produtos no catálogo (lista/resumo)",
                    inputSchema: z.object({
                        query: z.string().describe("Termo de busca"),
                        category: z.string().optional().describe("Categoria")
                    }),
                    execute: async ({ query, category }) => {
                        console.log(`[chat][${requestId}][search_products] Query: ${query}, Category: ${category}`);

                        try {
                            const allProducts = getAllProducts();
                            let results = allProducts;

                            if (category && category !== "todos") {
                                results = results.filter(p => p.category.toLowerCase().includes(category.replace("_", "-")));
                            }

                            if (query) {
                                const nameMatches = findProductsByName([query]);
                                if (nameMatches.length > 0) {
                                    results = nameMatches;
                                }
                            }

                            results = results.sort((a, b) => b.score - a.score).slice(0, 5);

                            return {
                                count: results.length,
                                products: results.map((p: AIProductSpec) => ({
                                    __ui: 'product_card',
                                    id: p.id,
                                    name: p.name,
                                    brand: p.brand,
                                    price: p.price,
                                    priceFormatted: `R$ ${p.price.toLocaleString('pt-BR')}`,
                                    score: p.score,
                                    internalUrl: `/produto/${p.id}`,
                                    amazonUrl: `https://amazon.com.br/s?k=${encodeURIComponent(p.name)}&tag=comparatop-20`
                                }))
                            };
                        } catch (toolError) {
                            console.error(`[chat][${requestId}][search_products] Error:`, toolError);
                            return {
                                count: 0,
                                products: [],
                                error: "Não foi possível buscar produtos no momento. Tente descrever o que procura de outra forma."
                            };
                        }
                    }
                }),
                get_product_details: tool({
                    description: "Retorna dados técnicos completos de um produto (consumo/energia, selo, specs, manual). Use quando o usuário perguntar sobre consumo, kWh, energia, gasto, selo, manual, especificações, tensão, ruído, BTU.",
                    inputSchema: z.object({
                        productId: z.string().describe("ID do produto para buscar detalhes")
                    }),
                    execute: async ({ productId }) => {
                        console.log(`[chat][${requestId}][get_product_details] ProductId: ${productId}`);
                        const details = getProductDetails(productId);
                        if (!details) {
                            return { error: "Produto não encontrado" };
                        }
                        return { details };
                    }
                })
            },
            toolChoice: forceTool ? { type: "tool", toolName: "search_products" } : "auto",
            temperature: 0,
            providerOptions: { google: { structuredOutputs: false } }
        });

        // ============================================
        // 5) STREAM WITH COMPREHENSIVE ERROR HANDLING
        // ============================================
        // Variables for immunity logging
        let accumulatedText = '';
        const toolsUsed: Array<{ name: string; params?: Record<string, unknown> }> = [];
        let llmPricing: PricingResult | null = null;

        const stream = new ReadableStream({
            async start(controller) {
                const enc = new TextEncoder();
                let hasEmittedIntro = false;
                let hasEmittedCards = false;
                let streamClosed = false;

                const safeClose = () => {
                    if (!streamClosed) {
                        streamClosed = true;
                        try {
                            controller.close();
                        } catch {
                            // Already closed
                        }
                    }
                };

                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    for await (const chunk of result.fullStream as any) {
                        if (streamClosed) break;

                        if (chunk.type === "text" && typeof chunk.text === "string") {
                            const cleanText = stripToolLeak(chunk.text);
                            if (cleanText) {
                                accumulatedText += cleanText;
                                controller.enqueue(enc.encode(`0:${JSON.stringify(cleanText)}\n`));
                            }
                            continue;
                        }

                        if (chunk.type === "text-delta") {
                            const delta = chunk.text ?? chunk.delta ?? chunk.textDelta;
                            if (typeof delta === "string") {
                                const cleanDelta = stripToolLeak(delta);
                                if (cleanDelta) {
                                    accumulatedText += cleanDelta;
                                    controller.enqueue(enc.encode(`0:${JSON.stringify(cleanDelta)}\n`));
                                }
                            }
                            continue;
                        }

                        if (chunk.type === "tool-call") {
                            toolsUsed.push({ name: chunk.toolName, params: chunk.args });
                            continue;
                        }

                        if (chunk.type === "tool-result") {
                            const output = chunk.output as { count?: number; products?: Array<{ __ui: string; id: string; name: string; brand: string; price: number; priceFormatted: string; score: number; internalUrl: string; amazonUrl: string }> };

                            if (output?.products && output.products.length > 0) {
                                if (!hasEmittedIntro) {
                                    const introText = `Encontrei ${output.count || output.products.length} opções do catálogo pra você:\n`;
                                    accumulatedText += introText;
                                    controller.enqueue(enc.encode(`0:${JSON.stringify(introText)}\n`));
                                    hasEmittedIntro = true;
                                }

                                for (const product of output.products) {
                                    controller.enqueue(enc.encode(`9:${JSON.stringify(product)}\n`));
                                }
                                hasEmittedCards = true;
                            }
                            continue;
                        }

                        if (chunk.type === "error") {
                            console.error(`[chat][${requestId}] LLM error chunk:`, chunk.errorText);
                            emitErrorAndFinish(controller, enc, requestId, chunk.errorText ?? "LLM error");
                            safeClose();
                            return;
                        }
                    }

                    // Success path: emit outro and finish
                    if (hasEmittedCards) {
                        const outroText = "\n\nQuer que eu compare algum deles lado a lado, ou prefere mais detalhes de algum específico?";
                        accumulatedText += outroText;
                        controller.enqueue(enc.encode(`0:${JSON.stringify(outroText)}\n`));
                    }

                    controller.enqueue(enc.encode(`d:${JSON.stringify({ finishReason: "stop", requestId })}\n`));
                    console.log(`[chat][${requestId}] response: LLM_FLOW completed in ${Date.now() - requestStartTime}ms`);

                } catch (e: unknown) {
                    console.error(`[chat][${requestId}] Stream exception:`, e);
                    emitErrorAndFinish(controller, enc, requestId, e);
                } finally {
                    safeClose();

                    // Capture token usage from result (cold path)
                    try {
                        const usage = await result.usage;
                        const finishReason = await result.finishReason;
                        if (usage) {
                            // AI SDK v6 uses inputTokens/outputTokens, we normalize to promptTokens/completionTokens
                            const normalizedUsage = {
                                promptTokens: (usage as { promptTokens?: number; inputTokens?: number }).promptTokens ?? (usage as { inputTokens?: number }).inputTokens ?? 0,
                                completionTokens: (usage as { completionTokens?: number; outputTokens?: number }).completionTokens ?? (usage as { outputTokens?: number }).outputTokens ?? 0,
                                totalTokens: usage.totalTokens ?? 0
                            };
                            llmPricing = createPricingResult({
                                model: 'gemini-2.0-flash',
                                usage: normalizedUsage,
                                finishReason
                            });
                            console.log(`[chat][${requestId}] LLM usage: ${normalizedUsage.totalTokens} tokens, cost: ${llmPricing.cost.usd ?? 'N/A'}`);
                        }
                    } catch (usageError) {
                        console.warn(`[chat][${requestId}] Failed to capture usage:`, usageError);
                    }

                    // Digital Immunity logging (cold path - after stream complete)
                    void enqueueImmunityEvent({
                        requestId,
                        sessionId,
                        ts: new Date().toISOString(),
                        env: (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development',
                        app: 'glowing-pinwheel',
                        chat: {
                            userMessage: lastText,
                            assistantText: accumulatedText,
                            intents: { manual: true },
                            mode: 'llm',
                            catalogSnapshot: {
                                count: catalogSnapshot.length,
                                focusIds,
                                lastResultsIds: catalogSnapshot.map(p => p.id)
                            }
                        },
                        llm: {
                            provider: 'google',
                            model: 'gemini-2.0-flash',
                            usage: llmPricing?.usage ?? undefined,
                            cost: llmPricing?.cost ?? undefined,
                            finishReason: llmPricing?.finishReason ?? undefined
                        },
                        tools: toolsUsed.length > 0 ? toolsUsed : undefined,
                        latency: { totalMs: Date.now() - requestStartTime },
                        // New: friction + pageContext + intents
                        friction: pageContext?.friction ? {
                            rageClicks: pageContext.friction.rageClicks || 0,
                            confusionScrolls: pageContext.friction.confusionScrolls || 0,
                            score: pageContext.friction.score || 0
                        } : undefined,
                        pageContext: pageContext?.path ? {
                            path: pageContext.path,
                            categorySlug: pageContext.categorySlug,
                            section: pageContext.section,
                            scrollDepth: pageContext.scrollDepth
                        } : undefined,
                        intents: { llm: true },
                        questionHash: lastText.length > 0 ? `len${lastText.length}_${lastText.slice(0, 10).replace(/\s/g, '_')}` : undefined
                    });
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no"
            }
        });

    } catch (globalError: unknown) {
        // ============================================
        // GLOBAL CATCH - ABSOLUTELY NEVER CRASH
        // ============================================
        console.error(`[chat][${requestId}] GLOBAL ERROR:`, globalError);

        return new Response(createErrorStream(requestId, "Erro inesperado no servidor"), {
            status: 500,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
    }
}
