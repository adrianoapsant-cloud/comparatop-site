import { z } from 'zod';

// ============================================
// FROZEN CONTENT PIPELINE - Zod Schemas
// ============================================
// Validates AI-generated review structure to prevent frontend breaks

// ============================================
// REVIEW CONTENT SCHEMA
// ============================================

export const ProductScoresSchema = z.object({
    overall: z.number().min(0).max(10),
    quality: z.number().min(0).max(10),
    value: z.number().min(0).max(10),
    features: z.number().min(0).max(10),
    durability: z.number().min(0).max(10).optional(),
    design: z.number().min(0).max(10).optional(),
    easeOfUse: z.number().min(0).max(10).optional(),
});

export const ProConItemSchema = z.object({
    emoji: z.string().max(4),
    title: z.string().max(100),
    description: z.string().max(500),
    severity: z.enum(['critical', 'moderate', 'minor']).optional(),
});

export const VerdictSchema = z.object({
    headline: z.string().max(150), // e.g., "Melhor Custo-Benefício da Categoria"
    summary: z.string().max(500),
    idealFor: z.array(z.string()).max(5), // ["Gamers", "Cinéfilos"]
    avoidIf: z.array(z.string()).max(5), // ["Orçamento apertado", "Ambiente muito claro"]
    competitorComparison: z.string().max(300).optional(),
});

export const NormalizedSpecSchema = z.object({
    key: z.string(),
    label: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
    unit: z.string().optional(),
    category: z.enum(['display', 'audio', 'connectivity', 'dimensions', 'power', 'features', 'other']),
});

export const ReviewContentSchema = z.object({
    // Core Analysis
    scores: ProductScoresSchema,
    pros: z.array(ProConItemSchema).min(3).max(8),
    cons: z.array(ProConItemSchema).min(2).max(6),
    verdict: VerdictSchema,

    // Normalized Specifications
    specs: z.array(NormalizedSpecSchema),

    // AI-Generated Narratives
    narratives: z.object({
        oneLinePitch: z.string().max(150),
        thirtySecondSummary: z.string().max(500),
        deepDive: z.string().max(2000).optional(),
    }),

    // Comparison Context
    categoryContext: z.object({
        rank: z.number().int().positive(),
        totalInCategory: z.number().int().positive(),
        percentile: z.number().min(0).max(100),
        nearestCompetitor: z.string().optional(),
    }).optional(),

    // Voice of Customer (Synthesized)
    voiceOfCustomer: z.object({
        sentimentScore: z.number().min(-1).max(1), // -1 to 1
        topPraise: z.array(z.string()).max(5),
        topComplaints: z.array(z.string()).max(5),
        reviewCount: z.number().int().nonnegative(),
        averageRating: z.number().min(0).max(5),
    }).optional(),
});

// ============================================
// DATABASE RECORD SCHEMA
// ============================================

export const ProductReviewRecordSchema = z.object({
    productId: z.string().min(1).max(100),
    contentJson: ReviewContentSchema,
    aiModelVersion: z.string().max(50),
    promptVersion: z.string().max(50),
    generatedAt: z.date(),
    isLocked: z.boolean(),
    hashVerification: z.string().length(64), // SHA-256 hex
    isArchived: z.boolean().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type ProductScores = z.infer<typeof ProductScoresSchema>;
export type ProConItem = z.infer<typeof ProConItemSchema>;
export type Verdict = z.infer<typeof VerdictSchema>;
export type NormalizedSpec = z.infer<typeof NormalizedSpecSchema>;
export type ReviewContent = z.infer<typeof ReviewContentSchema>;
export type ProductReviewRecord = z.infer<typeof ProductReviewRecordSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateReviewContent(data: unknown): ReviewContent {
    return ReviewContentSchema.parse(data);
}

export function safeValidateReviewContent(data: unknown): {
    success: true; data: ReviewContent
} | {
    success: false; error: z.ZodError
} {
    const result = ReviewContentSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
