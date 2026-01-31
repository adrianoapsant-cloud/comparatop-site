/**
 * @file unified-voice-loader.ts
 * @description Loads Unified Voice data from local cache
 * 
 * Serves community_consensus and curiosity_sandwich from pre-generated cache.
 * Cache is populated by: npm run fetch:unified-voice-cache
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

export interface CommunityConsensus {
    rating: number;
    totalReviews: number;
    approvalPercentage: number;
    bullets: string[];
    sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative';
    topPraise: string;
    topCriticism: string;
}

export interface CuriositySandwich {
    hook: string;
    insight: string;
    callToAction: string;
}

export interface UnifiedVoiceCache {
    productId: string;
    generatedAt: string;
    source: string;
    communityConsensus: CommunityConsensus;
    curiositySandwich: CuriositySandwich;
}

// ============================================
// CACHE LOADER
// ============================================

const CACHE_DIR = path.join(process.cwd(), 'src/data/unified-voice-cache');

/**
 * Load Unified Voice cache for a product
 * Returns null if cache doesn't exist
 */
export function loadUnifiedVoiceCache(productId: string): UnifiedVoiceCache | null {
    const cachePath = path.join(CACHE_DIR, `${productId}.json`);

    try {
        if (!fs.existsSync(cachePath)) {
            return null;
        }

        const content = fs.readFileSync(cachePath, 'utf-8');
        return JSON.parse(content) as UnifiedVoiceCache;
    } catch (error) {
        console.warn(`[UnifiedVoiceLoader] Failed to load cache for ${productId}:`, error);
        return null;
    }
}

/**
 * Check if cache exists for a product
 */
export function hasUnifiedVoiceCache(productId: string): boolean {
    const cachePath = path.join(CACHE_DIR, `${productId}.json`);
    return fs.existsSync(cachePath);
}

/**
 * Get community consensus from cache
 */
export function getCommunityConsensus(productId: string): CommunityConsensus | null {
    const cache = loadUnifiedVoiceCache(productId);
    return cache?.communityConsensus || null;
}

/**
 * Get curiosity sandwich from cache
 */
export function getCuriositySandwich(productId: string): CuriositySandwich | null {
    const cache = loadUnifiedVoiceCache(productId);
    return cache?.curiositySandwich || null;
}

/**
 * List all cached product IDs
 */
export function listCachedProducts(): string[] {
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            return [];
        }

        return fs.readdirSync(CACHE_DIR)
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));
    } catch {
        return [];
    }
}
