#!/usr/bin/env npx tsx
/// <reference types="node" />
/**
 * @file generate-score-baseline.ts
 * @description Generate baseline of current scores using getBaseScore (before HMUM removal)
 * 
 * This captures the current scoring behavior so we can compare after migration.
 * 
 * Output: scoring-baselines/baseScore-v0.json
 * 
 * Usage:
 *   npx tsx scripts/generate-score-baseline.ts
 *   npm run generate:score-baseline
 */

import * as fs from 'fs';
import * as path from 'path';
import { ALL_PRODUCTS } from '../src/data/products.index';
import { getBaseScore } from '../src/lib/getBaseScore';
import { normalizeCategoryId } from '../src/lib/scoring/getUnifiedScore';

// ============================================
// TYPES
// ============================================

interface BaselineEntry {
    id: string;
    categoryId: string;
    normalizedCategoryId: string;
    name: string;
    baseScore: number;
    scores: Record<string, number>;
}

interface BaselineFile {
    version: 'v0';
    generatedAt: string;
    productCount: number;
    entries: Record<string, BaselineEntry>;
    categorySummary: Record<string, {
        count: number;
        avgScore: number;
        minScore: number;
        maxScore: number;
    }>;
}

// ============================================
// MAIN
// ============================================

function main(): void {
    console.log('📊 Generating Score Baseline...\n');

    const entries: Record<string, BaselineEntry> = {};
    const categoryStats: Record<string, { scores: number[]; count: number }> = {};

    for (const product of ALL_PRODUCTS) {
        const baseScore = Math.round(getBaseScore(product) * 100) / 100; // 2 decimal places
        const normalizedCategoryId = normalizeCategoryId(product.categoryId);

        entries[product.id] = {
            id: product.id,
            categoryId: product.categoryId,
            normalizedCategoryId,
            name: product.name,
            baseScore,
            scores: product.scores || {},
        };

        // Track category stats
        if (!categoryStats[normalizedCategoryId]) {
            categoryStats[normalizedCategoryId] = { scores: [], count: 0 };
        }
        categoryStats[normalizedCategoryId].scores.push(baseScore);
        categoryStats[normalizedCategoryId].count++;
    }

    // Build category summary
    const categorySummary: BaselineFile['categorySummary'] = {};
    for (const [categoryId, stats] of Object.entries(categoryStats)) {
        const { scores, count } = stats;
        const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / count) * 100) / 100;
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);

        categorySummary[categoryId] = {
            count,
            avgScore,
            minScore,
            maxScore,
        };
    }

    const baseline: BaselineFile = {
        version: 'v0',
        generatedAt: new Date().toISOString(),
        productCount: ALL_PRODUCTS.length,
        entries,
        categorySummary,
    };

    // Write to file
    const outPath = path.join(process.cwd(), 'scoring-baselines', 'baseScore-v0.json');
    fs.writeFileSync(outPath, JSON.stringify(baseline, null, 2), 'utf-8');

    console.log(`✅ Baseline generated successfully!\n`);
    console.log(`📁 Output: ${outPath}`);
    console.log(`📦 Products: ${ALL_PRODUCTS.length}`);
    console.log(`\n📊 Category Summary:`);
    console.log('─'.repeat(60));

    const sortedCategories = Object.entries(categorySummary)
        .sort((a, b) => b[1].count - a[1].count);

    for (const [categoryId, stats] of sortedCategories) {
        console.log(`  ${categoryId.padEnd(20)} | ${stats.count.toString().padStart(3)} products | avg: ${stats.avgScore.toFixed(2)} | range: [${stats.minScore.toFixed(2)}, ${stats.maxScore.toFixed(2)}]`);
    }

    console.log('─'.repeat(60));
    console.log(`\n💡 Next step: Run 'npm run compare:score-baseline' after making changes.\n`);
}

main();
