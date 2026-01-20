/**
 * LLM Pricing Helper
 * 
 * Estimates cost of LLM API calls based on token usage.
 * Uses environment variables to avoid hardcoded prices.
 */

export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface CostEstimate {
    usd: number | null;
    source: 'env' | 'unset_env' | 'error';
    breakdown?: {
        inputCost: number;
        outputCost: number;
    };
}

export interface PricingResult {
    usage: TokenUsage | null;
    cost: CostEstimate;
    model: string;
    finishReason?: string;
}

/**
 * Estimate cost based on token usage and env-configured prices
 * 
 * Environment variables:
 * - LLM_COST_USD_PER_1M_INPUT: Cost per 1M input tokens (default: not set)
 * - LLM_COST_USD_PER_1M_OUTPUT: Cost per 1M output tokens (default: not set)
 * 
 * Example for Gemini 2.0 Flash:
 * LLM_COST_USD_PER_1M_INPUT=0.10
 * LLM_COST_USD_PER_1M_OUTPUT=0.40
 */
export function estimateCost(params: {
    model: string;
    promptTokens: number;
    completionTokens: number;
}): CostEstimate {
    const { promptTokens, completionTokens } = params;

    // Read pricing from environment
    const inputPriceStr = process.env.LLM_COST_USD_PER_1M_INPUT;
    const outputPriceStr = process.env.LLM_COST_USD_PER_1M_OUTPUT;

    // If either is not set, return null cost
    if (!inputPriceStr || !outputPriceStr) {
        return {
            usd: null,
            source: 'unset_env'
        };
    }

    try {
        const inputPricePerM = parseFloat(inputPriceStr);
        const outputPricePerM = parseFloat(outputPriceStr);

        if (isNaN(inputPricePerM) || isNaN(outputPricePerM)) {
            return {
                usd: null,
                source: 'error'
            };
        }

        const inputCost = (promptTokens / 1_000_000) * inputPricePerM;
        const outputCost = (completionTokens / 1_000_000) * outputPricePerM;
        const totalCost = inputCost + outputCost;

        return {
            usd: Math.round(totalCost * 1_000_000) / 1_000_000, // 6 decimal places
            source: 'env',
            breakdown: {
                inputCost: Math.round(inputCost * 1_000_000) / 1_000_000,
                outputCost: Math.round(outputCost * 1_000_000) / 1_000_000
            }
        };
    } catch {
        return {
            usd: null,
            source: 'error'
        };
    }
}

/**
 * Create a full pricing result with usage and cost
 */
export function createPricingResult(params: {
    model: string;
    usage: { promptTokens?: number; completionTokens?: number; totalTokens?: number } | null | undefined;
    finishReason?: string;
}): PricingResult {
    const { model, usage, finishReason } = params;

    if (!usage || usage.promptTokens === undefined || usage.completionTokens === undefined) {
        return {
            usage: null,
            cost: { usd: null, source: 'error' },
            model,
            finishReason
        };
    }

    const tokenUsage: TokenUsage = {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens ?? (usage.promptTokens + usage.completionTokens)
    };

    const cost = estimateCost({
        model,
        promptTokens: tokenUsage.promptTokens,
        completionTokens: tokenUsage.completionTokens
    });

    return {
        usage: tokenUsage,
        cost,
        model,
        finishReason
    };
}
