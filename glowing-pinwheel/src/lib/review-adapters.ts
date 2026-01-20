import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReviewGeneratorService, createReviewService } from './review-generator';
import { ReviewContent, ReviewContentSchema } from './review-schemas';

// ============================================
// PRISMA DATABASE ADAPTER
// ============================================

const prisma = new PrismaClient();

export const prismaAdapter = {
    async findReview(productId: string) {
        const record = await prisma.productReview.findUnique({
            where: { productId },
        });

        if (!record) return null;

        // Parse JSON string back to object
        const contentJson = JSON.parse(record.contentJson) as ReviewContent;

        return {
            productId: record.productId,
            contentJson,
            aiModelVersion: record.aiModelVersion,
            promptVersion: record.promptVersion,
            generatedAt: record.generatedAt,
            isLocked: record.isLocked,
            hashVerification: record.hashVerification,
            isArchived: record.isArchived,
        };
    },

    async saveReview(review: {
        productId: string;
        contentJson: ReviewContent;
        aiModelVersion: string;
        promptVersion: string;
        generatedAt: Date;
        isLocked: boolean;
        hashVerification: string;
        isArchived: boolean;
    }) {
        // Stringify JSON for SQLite storage
        const contentJsonString = JSON.stringify(review.contentJson);

        await prisma.productReview.upsert({
            where: { productId: review.productId },
            update: {
                contentJson: contentJsonString,
                aiModelVersion: review.aiModelVersion,
                promptVersion: review.promptVersion,
                generatedAt: review.generatedAt,
                hashVerification: review.hashVerification,
                // Note: isLocked is NOT updated (preserve manual locks)
            },
            create: {
                productId: review.productId,
                contentJson: contentJsonString,
                aiModelVersion: review.aiModelVersion,
                promptVersion: review.promptVersion,
                generatedAt: review.generatedAt,
                isLocked: review.isLocked,
                hashVerification: review.hashVerification,
                isArchived: review.isArchived,
            },
        });
    },

    async logGeneration(log: {
        productId: string;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        costUsd: number;
        latencyMs: number;
        modelUsed: string;
        success: boolean;
        errorMessage?: string;
    }) {
        await prisma.generationLog.create({
            data: log,
        });
    },
};

// ============================================
// GOOGLE GEMINI LLM ADAPTER
// ============================================
// Using Gemini 1.5 Flash for 1M+ token context window
// Perfect for processing full product manuals and review datasets

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const geminiAdapter = {
    async generate(systemPrompt: string, userPrompt: string) {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',  // 1M context, very fast
            generationConfig: {
                temperature: 0.3,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            },
        });

        // Combine prompts (Gemini doesn't have system prompts like OpenAI)
        const fullPrompt = `${systemPrompt}

---

${userPrompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const content = response.text();

        // Get actual token counts from response (if available)
        const usageMetadata = response.usageMetadata;
        const promptTokens = usageMetadata?.promptTokenCount || Math.ceil(fullPrompt.length / 4);
        const completionTokens = usageMetadata?.candidatesTokenCount || Math.ceil(content.length / 4);

        return {
            content,
            promptTokens,
            completionTokens,
        };
    },
};

// ============================================
// SERVICE SINGLETON
// ============================================

let serviceInstance: ReviewGeneratorService | null = null;

export function getReviewService(): ReviewGeneratorService {
    if (!serviceInstance) {
        serviceInstance = createReviewService(prismaAdapter, geminiAdapter);
    }
    return serviceInstance;
}

// ============================================
// CONVENIENCE FUNCTIONS FOR API ROUTES
// ============================================

/**
 * Fetch or generate a review for a product.
 * Use this in API routes and server components.
 */
export async function getProductReview(
    productId: string,
    productData?: {
        id: string;
        name: string;
        brand: string;
        category: string;
        specs: Record<string, unknown>;
        rawReviews?: string[];
        price?: number;
        technicalManual?: string; // Can include full PDF text (1M+ tokens!)
    },
    forceUpdate = false
) {
    const service = getReviewService();
    return service.generateOrFetchReview(productId, productData, forceUpdate);
}

/**
 * Check if a review exists without generating.
 */
export async function hasReview(productId: string): Promise<boolean> {
    const review = await prismaAdapter.findReview(productId);
    return review !== null && !review.isArchived;
}

/**
 * Lock a review to prevent batch updates from overwriting it.
 */
export async function lockReview(productId: string): Promise<void> {
    await prisma.productReview.update({
        where: { productId },
        data: { isLocked: true },
    });
}

/**
 * Unlock a review to allow updates.
 */
export async function unlockReview(productId: string): Promise<void> {
    await prisma.productReview.update({
        where: { productId },
        data: { isLocked: false },
    });
}

/**
 * Archive a review (soft delete).
 */
export async function archiveReview(productId: string): Promise<void> {
    await prisma.productReview.update({
        where: { productId },
        data: {
            isArchived: true,
            archivedAt: new Date(),
        },
    });
}

/**
 * Restore an archived review.
 */
export async function restoreReview(productId: string): Promise<void> {
    await prisma.productReview.update({
        where: { productId },
        data: {
            isArchived: false,
            archivedAt: null,
        },
    });
}

// ============================================
// COST REPORTING
// ============================================

// Gemini 1.5 Flash pricing (as of 2024)
const GEMINI_COST = {
    INPUT_PER_1M_TOKENS: 0.075,  // $0.075 per 1M input tokens
    OUTPUT_PER_1M_TOKENS: 0.30,  // $0.30 per 1M output tokens
};

export function estimateCost(promptTokens: number, completionTokens: number): number {
    const inputCost = (promptTokens / 1_000_000) * GEMINI_COST.INPUT_PER_1M_TOKENS;
    const outputCost = (completionTokens / 1_000_000) * GEMINI_COST.OUTPUT_PER_1M_TOKENS;
    return Math.round((inputCost + outputCost) * 10000) / 10000;
}

export async function getGenerationStats(since?: Date) {
    const where = since ? { createdAt: { gte: since } } : {};

    const stats = await prisma.generationLog.aggregate({
        _count: { id: true },
        _sum: {
            totalTokens: true,
            costUsd: true,
        },
        _avg: {
            latencyMs: true,
        },
        where,
    });

    const successRate = await prisma.generationLog.groupBy({
        by: ['success'],
        _count: { id: true },
        where,
    });

    return {
        totalGenerations: stats._count.id,
        totalTokens: stats._sum.totalTokens || 0,
        totalCostUsd: stats._sum.costUsd || 0,
        avgLatencyMs: Math.round(stats._avg.latencyMs || 0),
        successRate: successRate.reduce((acc: Record<string, number>, s) => {
            acc[s.success ? 'success' : 'failed'] = s._count.id;
            return acc;
        }, {} as Record<string, number>),
    };
}
