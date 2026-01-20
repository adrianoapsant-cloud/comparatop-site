import crypto from 'crypto';
import { ReviewContent, validateReviewContent, safeValidateReviewContent } from './review-schemas';

// ============================================
// FROZEN CONTENT PIPELINE - Review Generator Service
// ============================================
// Core service for generating and fetching AI reviews
// with immutability guarantees and cost optimization

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Current versions (update to trigger regeneration)
    PROMPT_VERSION: 'v2.1-custo-beneficio',
    AI_MODEL: 'gpt-4-turbo-2024-01',

    // Cost tracking (update based on OpenAI pricing)
    COST_PER_1K_INPUT_TOKENS: 0.01,
    COST_PER_1K_OUTPUT_TOKENS: 0.03,

    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
};

// ============================================
// TYPES
// ============================================

interface ProductData {
    id: string;
    name: string;
    brand: string;
    category: string;
    specs: Record<string, unknown>;
    rawReviews?: string[];
    price?: number;
}

interface GenerationResult {
    content: ReviewContent;
    fromCache: boolean;
    latencyMs: number;
    costUsd?: number;
}

interface DatabaseAdapter {
    findReview(productId: string): Promise<StoredReview | null>;
    saveReview(review: StoredReview): Promise<void>;
    logGeneration(log: GenerationLog): Promise<void>;
}

interface StoredReview {
    productId: string;
    contentJson: ReviewContent;
    aiModelVersion: string;
    promptVersion: string;
    generatedAt: Date;
    isLocked: boolean;
    hashVerification: string;
    isArchived: boolean;
}

interface GenerationLog {
    productId: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUsd: number;
    latencyMs: number;
    modelUsed: string;
    success: boolean;
    errorMessage?: string;
}

interface LLMAdapter {
    generate(systemPrompt: string, userPrompt: string): Promise<{
        content: string;
        promptTokens: number;
        completionTokens: number;
    }>;
}

// ============================================
// HASH VERIFICATION
// ============================================

function generateContentHash(content: ReviewContent): string {
    const json = JSON.stringify(content, Object.keys(content).sort());
    return crypto.createHash('sha256').update(json).digest('hex');
}

function verifyContentIntegrity(content: ReviewContent, expectedHash: string): boolean {
    const actualHash = generateContentHash(content);
    return actualHash === expectedHash;
}

// ============================================
// PROMPT BUILDER
// ============================================

function buildSystemPrompt(): string {
    return `Você é um analista de produtos especializado em eletrônicos de consumo.
Sua tarefa é gerar análises imparciais, detalhadas e bem estruturadas.

REGRAS:
1. Seja objetivo e baseado em dados.
2. Destaque pontos fortes E fracos honestamente.
3. Compare com concorrentes quando relevante.
4. Use linguagem acessível para consumidores brasileiros.
5. Sempre retorne JSON válido no formato especificado.

FORMATO DE RESPOSTA (JSON):
{
  "scores": { "overall": 8.5, "quality": 9.0, "value": 7.5, "features": 8.0 },
  "pros": [
    { "emoji": "🖼️", "title": "Qualidade de Imagem", "description": "...", "severity": "critical" }
  ],
  "cons": [
    { "emoji": "🔊", "title": "Som Fraco", "description": "...", "severity": "moderate" }
  ],
  "verdict": {
    "headline": "Melhor Custo-Benefício da Categoria",
    "summary": "...",
    "idealFor": ["Gamers", "Cinéfilos"],
    "avoidIf": ["Orçamento apertado"]
  },
  "specs": [
    { "key": "resolution", "label": "Resolução", "value": "4K", "category": "display" }
  ],
  "narratives": {
    "oneLinePitch": "...",
    "thirtySecondSummary": "..."
  }
}`;
}

function buildUserPrompt(product: ProductData): string {
    return `Analise o seguinte produto e gere uma análise completa:

PRODUTO: ${product.name}
MARCA: ${product.brand}
CATEGORIA: ${product.category}
PREÇO: ${product.price ? `R$ ${product.price.toLocaleString('pt-BR')}` : 'N/A'}

ESPECIFICAÇÕES:
${JSON.stringify(product.specs, null, 2)}

${product.rawReviews?.length ? `REVIEWS DE CONSUMIDORES (Resumo):\n${product.rawReviews.slice(0, 10).join('\n---\n')}` : ''}

Gere a análise completa no formato JSON especificado.`;
}

// ============================================
// MAIN SERVICE
// ============================================

export class ReviewGeneratorService {
    constructor(
        private db: DatabaseAdapter,
        private llm: LLMAdapter
    ) { }

    /**
     * Generate or fetch a product review.
     * 
     * LOGIC:
     * 1. Check if review exists in database
     * 2. If exists AND !forceUpdate → return cached (zero AI cost, <50ms)
     * 3. If !exists OR forceUpdate → generate new, save, return
     * 
     * @param productId Unique product identifier
     * @param productData Raw product data (only needed for generation)
     * @param forceUpdate Force regeneration even if cached
     */
    async generateOrFetchReview(
        productId: string,
        productData?: ProductData,
        forceUpdate = false
    ): Promise<GenerationResult> {
        const startTime = Date.now();

        // ============================================
        // STEP 1: Check Cache
        // ============================================
        const existingReview = await this.db.findReview(productId);

        if (existingReview && !forceUpdate) {
            // Verify integrity before returning
            const isValid = verifyContentIntegrity(
                existingReview.contentJson,
                existingReview.hashVerification
            );

            if (!isValid) {
                console.warn(`[ReviewGenerator] Integrity check failed for ${productId}, regenerating...`);
            } else {
                // Return cached review (ZERO AI COST)
                return {
                    content: existingReview.contentJson,
                    fromCache: true,
                    latencyMs: Date.now() - startTime,
                };
            }
        }

        // Check if locked (manual edit protection)
        if (existingReview?.isLocked && forceUpdate) {
            console.warn(`[ReviewGenerator] Review for ${productId} is LOCKED. Skipping regeneration.`);
            return {
                content: existingReview.contentJson,
                fromCache: true,
                latencyMs: Date.now() - startTime,
            };
        }

        // ============================================
        // STEP 2: Generate New Review
        // ============================================
        if (!productData) {
            throw new Error(`Product data required for generation of ${productId}`);
        }

        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(productData);

        let llmResponse;
        let generationError: Error | null = null;

        // Retry logic
        for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
            try {
                llmResponse = await this.llm.generate(systemPrompt, userPrompt);
                break;
            } catch (error) {
                generationError = error as Error;
                console.error(`[ReviewGenerator] Attempt ${attempt}/${CONFIG.MAX_RETRIES} failed:`, error);

                if (attempt < CONFIG.MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * attempt));
                }
            }
        }

        if (!llmResponse) {
            // Log failed generation
            await this.db.logGeneration({
                productId,
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                costUsd: 0,
                latencyMs: Date.now() - startTime,
                modelUsed: CONFIG.AI_MODEL,
                success: false,
                errorMessage: generationError?.message || 'Unknown error',
            });
            throw new Error(`Failed to generate review after ${CONFIG.MAX_RETRIES} attempts`);
        }

        // ============================================
        // STEP 3: Parse and Validate Response
        // ============================================
        let parsedContent: ReviewContent;

        try {
            const rawJson = JSON.parse(llmResponse.content);
            parsedContent = validateReviewContent(rawJson);
        } catch (parseError) {
            // Log validation failure
            await this.db.logGeneration({
                productId,
                promptTokens: llmResponse.promptTokens,
                completionTokens: llmResponse.completionTokens,
                totalTokens: llmResponse.promptTokens + llmResponse.completionTokens,
                costUsd: this.calculateCost(llmResponse.promptTokens, llmResponse.completionTokens),
                latencyMs: Date.now() - startTime,
                modelUsed: CONFIG.AI_MODEL,
                success: false,
                errorMessage: `Validation failed: ${(parseError as Error).message}`,
            });
            throw new Error(`LLM response validation failed: ${(parseError as Error).message}`);
        }

        // ============================================
        // STEP 4: Save to Database
        // ============================================
        const contentHash = generateContentHash(parsedContent);
        const costUsd = this.calculateCost(llmResponse.promptTokens, llmResponse.completionTokens);

        const reviewRecord: StoredReview = {
            productId,
            contentJson: parsedContent,
            aiModelVersion: CONFIG.AI_MODEL,
            promptVersion: CONFIG.PROMPT_VERSION,
            generatedAt: new Date(),
            isLocked: false,
            hashVerification: contentHash,
            isArchived: false,
        };

        await this.db.saveReview(reviewRecord);

        // Log successful generation
        await this.db.logGeneration({
            productId,
            promptTokens: llmResponse.promptTokens,
            completionTokens: llmResponse.completionTokens,
            totalTokens: llmResponse.promptTokens + llmResponse.completionTokens,
            costUsd,
            latencyMs: Date.now() - startTime,
            modelUsed: CONFIG.AI_MODEL,
            success: true,
        });

        return {
            content: parsedContent,
            fromCache: false,
            latencyMs: Date.now() - startTime,
            costUsd,
        };
    }

    private calculateCost(promptTokens: number, completionTokens: number): number {
        const inputCost = (promptTokens / 1000) * CONFIG.COST_PER_1K_INPUT_TOKENS;
        const outputCost = (completionTokens / 1000) * CONFIG.COST_PER_1K_OUTPUT_TOKENS;
        return Math.round((inputCost + outputCost) * 10000) / 10000; // Round to 4 decimals
    }

    /**
     * Batch generate reviews for multiple products.
     * Skips locked reviews and existing reviews (unless forceUpdate).
     */
    async batchGenerate(
        products: ProductData[],
        options: { forceUpdate?: boolean; skipLocked?: boolean } = {}
    ): Promise<Map<string, GenerationResult>> {
        const { forceUpdate = false, skipLocked = true } = options;
        const results = new Map<string, GenerationResult>();

        for (const product of products) {
            try {
                const result = await this.generateOrFetchReview(
                    product.id,
                    product,
                    forceUpdate
                );
                results.set(product.id, result);

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`[BatchGenerate] Failed for ${product.id}:`, error);
            }
        }

        return results;
    }
}

// ============================================
// FACTORY (for Next.js API routes)
// ============================================

export function createReviewService(
    db: DatabaseAdapter,
    llm: LLMAdapter
): ReviewGeneratorService {
    return new ReviewGeneratorService(db, llm);
}
