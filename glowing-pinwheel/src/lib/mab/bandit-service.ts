/**
 * @file bandit-service.ts
 * @description Multi-Armed Bandit (MAB) Service for Layout Optimization
 * 
 * Implements Thompson Sampling / Epsilon-Greedy algorithm to automatically
 * balance "Explore new layouts" vs "Use what sells more".
 * 
 * The algorithm:
 * 1. Cold Start: Equal distribution when no data exists
 * 2. Exploitation (90%): Choose variant with highest conversion rate
 * 3. Exploration (10%): Random variant to test if behavior changed
 * 
 * @example
 * const arm = await banditService.selectArm(['layout_visual', 'layout_tecnico']);
 * await banditService.updateArmStats(arm.id, 'impression');
 * // ... later, on CTA click:
 * await banditService.updateArmStats(arm.id, 'conversion');
 */

// ============================================================================
// TYPES
// ============================================================================

export type BanditArm = {
    /** Unique identifier for the layout variant */
    id: string;
    /** Number of times this variant was shown */
    impressions: number;
    /** Number of times this variant generated a conversion (click/sale) */
    conversions: number;
    /** Computed conversion rate (conversions / impressions) */
    conversionRate: number;
    /** Last updated timestamp */
    lastUpdated: number;
};

export type BanditConfig = {
    /** Exploration rate (0-1). Default: 0.1 (10% exploration) */
    epsilon: number;
    /** Minimum impressions before trusting conversion rate */
    minImpressionsForSignificance: number;
    /** Default prior for Thompson Sampling (Beta distribution) */
    priorAlpha: number;
    priorBeta: number;
};

export type UpdateType = 'impression' | 'conversion';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: BanditConfig = {
    epsilon: 0.1, // 10% exploration rate
    minImpressionsForSignificance: 30, // Need 30 impressions to trust data
    priorAlpha: 1, // Beta(1,1) = uniform prior
    priorBeta: 1,
};

// ============================================================================
// STORAGE ABSTRACTION
// ============================================================================
// This in-memory store can be replaced with Vercel KV, Redis, or Database
// Just implement the StorageAdapter interface

interface StorageAdapter {
    get(key: string): Promise<BanditArm | null>;
    set(key: string, value: BanditArm): Promise<void>;
    getAll(prefix: string): Promise<BanditArm[]>;
}

/**
 * In-Memory Storage (Development/Testing)
 * Replace with RedisAdapter or KVAdapter for production
 */
class InMemoryStorage implements StorageAdapter {
    private store: Map<string, BanditArm> = new Map();

    async get(key: string): Promise<BanditArm | null> {
        return this.store.get(key) || null;
    }

    async set(key: string, value: BanditArm): Promise<void> {
        this.store.set(key, value);
    }

    async getAll(prefix: string): Promise<BanditArm[]> {
        const results: BanditArm[] = [];
        for (const [key, value] of this.store.entries()) {
            if (key.startsWith(prefix)) {
                results.push(value);
            }
        }
        return results;
    }

    // Debug method to see current state
    getSnapshot(): Record<string, BanditArm> {
        return Object.fromEntries(this.store);
    }
}

/**
 * Vercel KV / Redis Adapter (Production)
 * Automatically used when KV_REST_API_URL is configured
 * 
 * Required Environment Variables:
 * - KV_REST_API_URL: Vercel KV REST API URL
 * - KV_REST_API_TOKEN: Vercel KV REST API Token
 */
class VercelKVAdapter implements StorageAdapter {
    private kv: typeof import('@vercel/kv').kv;
    private initialized: boolean = false;
    private initPromise: Promise<void> | null = null;

    constructor() {
        // Lazy initialization to avoid import errors when KV is not configured
        this.kv = null as unknown as typeof import('@vercel/kv').kv;
    }

    private async ensureInitialized(): Promise<void> {
        if (this.initialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            const { kv } = await import('@vercel/kv');
            this.kv = kv;
            this.initialized = true;
            console.log('[MAB] Vercel KV adapter initialized');
        })();

        return this.initPromise;
    }

    async get(key: string): Promise<BanditArm | null> {
        await this.ensureInitialized();
        try {
            const value = await this.kv.get<BanditArm>(key);
            return value ?? null;
        } catch (error) {
            console.error('[MAB] KV get error:', error);
            return null;
        }
    }

    async set(key: string, value: BanditArm): Promise<void> {
        await this.ensureInitialized();
        try {
            // Set with 30 day expiration to prevent stale data buildup
            await this.kv.set(key, value, { ex: 60 * 60 * 24 * 30 });
        } catch (error) {
            console.error('[MAB] KV set error:', error);
        }
    }

    async getAll(prefix: string): Promise<BanditArm[]> {
        await this.ensureInitialized();
        try {
            const keys = await this.kv.keys(`${prefix}*`);
            const results: BanditArm[] = [];
            for (const key of keys) {
                const arm = await this.get(key);
                if (arm) results.push(arm);
            }
            return results;
        } catch (error) {
            console.error('[MAB] KV getAll error:', error);
            return [];
        }
    }
}

// ============================================================================
// BANDIT ALGORITHMS
// ============================================================================

/**
 * Sample from Beta distribution (Thompson Sampling)
 * Uses Box-Muller transform approximation
 */
function sampleBeta(alpha: number, beta: number): number {
    // Simple approximation using the mean with some noise
    // For production, use a proper Beta distribution library
    const mean = alpha / (alpha + beta);
    const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
    const stdDev = Math.sqrt(variance);

    // Add Gaussian noise (Box-Muller)
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    // Sample with noise, clamped to [0, 1]
    return Math.max(0, Math.min(1, mean + z * stdDev));
}

/**
 * Epsilon-Greedy Selection
 * With probability epsilon, explore randomly; otherwise exploit best arm
 */
function epsilonGreedy(
    arms: BanditArm[],
    epsilon: number
): BanditArm {
    // Exploration: random selection
    if (Math.random() < epsilon) {
        const randomIndex = Math.floor(Math.random() * arms.length);
        return arms[randomIndex];
    }

    // Exploitation: select arm with highest conversion rate
    return arms.reduce((best, current) =>
        current.conversionRate > best.conversionRate ? current : best
    );
}

/**
 * Thompson Sampling Selection
 * Sample from posterior distributions and select highest sample
 */
function thompsonSampling(
    arms: BanditArm[],
    priorAlpha: number,
    priorBeta: number
): BanditArm {
    let bestArm = arms[0];
    let bestSample = -1;

    for (const arm of arms) {
        // Posterior: Beta(alpha + successes, beta + failures)
        const alpha = priorAlpha + arm.conversions;
        const beta = priorBeta + (arm.impressions - arm.conversions);

        const sample = sampleBeta(alpha, beta);

        if (sample > bestSample) {
            bestSample = sample;
            bestArm = arm;
        }
    }

    return bestArm;
}

// ============================================================================
// BANDIT SERVICE
// ============================================================================

class BanditService {
    private storage: StorageAdapter;
    private config: BanditConfig;
    private keyPrefix: string = 'mab:arm:';

    constructor(storage?: StorageAdapter, config?: Partial<BanditConfig>) {
        this.storage = storage || new InMemoryStorage();
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Get stats for a specific arm
     */
    async getArmStats(armId: string): Promise<BanditArm | null> {
        return this.storage.get(this.keyPrefix + armId);
    }

    /**
     * Update arm statistics (impression or conversion)
     */
    async updateArmStats(armId: string, type: UpdateType): Promise<void> {
        const key = this.keyPrefix + armId;
        let arm = await this.storage.get(key);

        if (!arm) {
            // Initialize new arm
            arm = {
                id: armId,
                impressions: 0,
                conversions: 0,
                conversionRate: 0,
                lastUpdated: Date.now(),
            };
        }

        // Update stats
        if (type === 'impression') {
            arm.impressions++;
        } else if (type === 'conversion') {
            arm.conversions++;
        }

        // Recalculate conversion rate
        arm.conversionRate = arm.impressions > 0
            ? arm.conversions / arm.impressions
            : 0;
        arm.lastUpdated = Date.now();

        await this.storage.set(key, arm);
    }

    /**
     * Select the best arm using MAB algorithm
     * 
     * @param armIds - List of possible layout variants to choose from
     * @param algorithm - 'epsilon-greedy' or 'thompson-sampling' (default)
     * @returns The selected arm with its current stats
     */
    async selectArm(
        armIds: string[],
        algorithm: 'epsilon-greedy' | 'thompson-sampling' = 'thompson-sampling'
    ): Promise<BanditArm> {
        if (armIds.length === 0) {
            throw new Error('At least one arm ID must be provided');
        }

        if (armIds.length === 1) {
            // Only one option, return it
            const arm = await this.getArmStats(armIds[0]);
            return arm || this.createDefaultArm(armIds[0]);
        }

        // Fetch or initialize all arms
        const arms: BanditArm[] = await Promise.all(
            armIds.map(async (id) => {
                const arm = await this.getArmStats(id);
                return arm || this.createDefaultArm(id);
            })
        );

        // ========================================
        // COLD START HANDLING
        // ========================================
        // If none of the arms have enough data, use random selection
        const hasEnoughData = arms.some(
            arm => arm.impressions >= this.config.minImpressionsForSignificance
        );

        if (!hasEnoughData) {
            // Cold start: equal distribution (random selection)
            const randomIndex = Math.floor(Math.random() * arms.length);
            console.log('[MAB] Cold start - random selection:', arms[randomIndex].id);
            return arms[randomIndex];
        }

        // ========================================
        // ALGORITHM SELECTION
        // ========================================
        let selectedArm: BanditArm;

        if (algorithm === 'epsilon-greedy') {
            selectedArm = epsilonGreedy(arms, this.config.epsilon);
        } else {
            selectedArm = thompsonSampling(
                arms,
                this.config.priorAlpha,
                this.config.priorBeta
            );
        }

        console.log('[MAB] Selected arm:', {
            id: selectedArm.id,
            conversionRate: (selectedArm.conversionRate * 100).toFixed(2) + '%',
            impressions: selectedArm.impressions,
            conversions: selectedArm.conversions,
            algorithm,
        });

        return selectedArm;
    }

    /**
     * Create a default arm with zero stats
     */
    private createDefaultArm(id: string): BanditArm {
        return {
            id,
            impressions: 0,
            conversions: 0,
            conversionRate: 0,
            lastUpdated: Date.now(),
        };
    }

    /**
     * Get all arms stats for debugging/reporting
     */
    async getAllArmsStats(): Promise<BanditArm[]> {
        return this.storage.getAll(this.keyPrefix);
    }

    /**
     * Get a summary of MAB performance
     */
    async getPerformanceSummary(): Promise<{
        totalImpressions: number;
        totalConversions: number;
        overallConversionRate: number;
        bestArm: BanditArm | null;
        arms: BanditArm[];
    }> {
        const arms = await this.getAllArmsStats();

        const totalImpressions = arms.reduce((sum, arm) => sum + arm.impressions, 0);
        const totalConversions = arms.reduce((sum, arm) => sum + arm.conversions, 0);

        const bestArm = arms.length > 0
            ? arms.reduce((best, current) =>
                current.conversionRate > best.conversionRate ? current : best
            )
            : null;

        return {
            totalImpressions,
            totalConversions,
            overallConversionRate: totalImpressions > 0
                ? totalConversions / totalImpressions
                : 0,
            bestArm,
            arms,
        };
    }
}

// ============================================================================
// STORAGE FACTORY
// ============================================================================

/**
 * Create the appropriate storage adapter based on environment
 * - Uses Vercel KV when KV_REST_API_URL is configured
 * - Falls back to InMemoryStorage for development/testing
 */
function createStorageAdapter(): StorageAdapter {
    const hasKVConfig = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

    if (hasKVConfig) {
        console.log('[MAB] Using Vercel KV storage (production)');
        return new VercelKVAdapter();
    }

    console.log('[MAB] Using in-memory storage (development)');
    return new InMemoryStorage();
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Create a singleton instance with automatic storage selection
const banditService = new BanditService(createStorageAdapter());

export { banditService, BanditService, VercelKVAdapter, InMemoryStorage };
export default banditService;
