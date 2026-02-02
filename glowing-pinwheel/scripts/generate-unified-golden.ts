#!/usr/bin/env npx tsx
/// <reference types="node" />
/**
 * @file generate-unified-golden.ts
 * @description Generate golden file of unified scores for regression protection
 * 
 * Output: scoring-baselines/unifiedScore-v{VERSION}.json
 * 
 * Usage:
 *   npx tsx scripts/generate-unified-golden.ts
 *   npm run generate:golden
 */

import * as fs from 'fs';
import * as path from 'path';
import { ALL_PRODUCTS } from '../src/data/products.index';
import { getUnifiedScore, normalizeCategoryId } from '../src/lib/scoring/getUnifiedScore';
import { WEIGHTS_VERSION } from '../src/lib/scoring/category-weights';

// ============================================
// TYPES
// ============================================

interface GoldenEntry {
    id: string;
    name: string;
    categoryId: string;
    unifiedScore: number;
}

interface GoldenFile {
    weightsVersion: number;
    generatedAt: string;
    productCount: number;
    entries: Record<string, GoldenEntry>;
}

// ============================================
// MAIN
// ============================================

function main(): void {
    console.log('🥇 Generating Unified Score Golden File...\n');
    console.log(`📐 WEIGHTS_VERSION: ${WEIGHTS_VERSION}`);

    const entries: Record<string, GoldenEntry> = {};

    for (const product of ALL_PRODUCTS) {
        const unifiedScore = Math.round(getUnifiedScore(product) * 100) / 100;

        entries[product.id] = {
            id: product.id,
            name: product.name,
            categoryId: normalizeCategoryId(product.categoryId),
            unifiedScore,
        };
    }

    const golden: GoldenFile = {
        weightsVersion: WEIGHTS_VERSION,
        generatedAt: new Date().toISOString(),
        productCount: ALL_PRODUCTS.length,
        entries,
    };

    const filename = `unifiedScore-v${WEIGHTS_VERSION}.json`;
    const outPath = path.join(process.cwd(), 'scoring-baselines', filename);
    fs.writeFileSync(outPath, JSON.stringify(golden, null, 2), 'utf-8');

    console.log(`\n✅ Golden file generated!`);
    console.log(`📁 Output: ${outPath}`);
    console.log(`📦 Products: ${ALL_PRODUCTS.length}`);
    console.log(`\n⚠️  POLICY: Commit this file. Any weight change requires:`);
    console.log(`   1. Bump WEIGHTS_VERSION in category-weights.ts`);
    console.log(`   2. Run 'npm run generate:golden' to regenerate`);
    console.log(`   3. Commit the new golden file\n`);
}

main();
