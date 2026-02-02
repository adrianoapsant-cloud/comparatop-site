#!/usr/bin/env npx tsx
/// <reference types="node" />
/**
 * @file compare-score-baseline.ts
 * @description Compare current getUnifiedScore with baseline to verify migration accuracy
 * 
 * Fails if any product has diff > 0.01 from baseline.
 * Prints top 50 largest diffs for debugging weight calibration.
 * 
 * Usage:
 *   npx tsx scripts/compare-score-baseline.ts
 *   npm run compare:score-baseline
 */

import * as fs from 'fs';
import * as path from 'path';
import { ALL_PRODUCTS } from '../src/data/products';
import { getUnifiedScore, normalizeCategoryId } from '../src/lib/scoring/getUnifiedScore';

// ============================================
// CONSTANTS
// ============================================

const MAX_ALLOWED_DIFF = 0.01;
const TOP_N_DIFFS = 50;

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

interface DiffResult {
    id: string;
    name: string;
    categoryId: string;
    normalizedCategoryId: string;
    baselineScore: number;
    newScore: number;
    diff: number;
    scores: Record<string, number>;
}

// ============================================
// MAIN
// ============================================

function main(): void {
    console.log('🔍 Comparing Scores with Baseline...\n');

    // Load baseline
    const baselinePath = path.join(process.cwd(), 'scoring-baselines', 'baseScore-v0.json');

    if (!fs.existsSync(baselinePath)) {
        console.error(`❌ Baseline file not found: ${baselinePath}`);
        console.error(`   Run 'npm run generate:score-baseline' first.\n`);
        process.exit(1);
    }

    const baselineRaw = fs.readFileSync(baselinePath, 'utf-8');
    const baseline: BaselineFile = JSON.parse(baselineRaw);

    console.log(`📁 Baseline: ${baselinePath}`);
    console.log(`📅 Generated: ${baseline.generatedAt}`);
    console.log(`📦 Products in baseline: ${baseline.productCount}`);
    console.log(`📦 Products in current: ${ALL_PRODUCTS.length}\n`);

    // Compare each product
    const diffs: DiffResult[] = [];
    const categoryDiffs: Record<string, { totalDiff: number; count: number; maxDiff: number }> = {};
    let missingCount = 0;

    for (const product of ALL_PRODUCTS) {
        const baselineEntry = baseline.entries[product.id];

        if (!baselineEntry) {
            console.warn(`⚠️  Product not in baseline: ${product.id}`);
            missingCount++;
            continue;
        }

        const newScore = Math.round(getUnifiedScore(product) * 100) / 100;
        const diff = Math.abs(newScore - baselineEntry.baseScore);
        const normalizedCategoryId = normalizeCategoryId(product.categoryId);

        diffs.push({
            id: product.id,
            name: product.name,
            categoryId: product.categoryId,
            normalizedCategoryId,
            baselineScore: baselineEntry.baseScore,
            newScore,
            diff,
            scores: product.scores || {},
        });

        // Track category-level diffs
        if (!categoryDiffs[normalizedCategoryId]) {
            categoryDiffs[normalizedCategoryId] = { totalDiff: 0, count: 0, maxDiff: 0 };
        }
        categoryDiffs[normalizedCategoryId].totalDiff += diff;
        categoryDiffs[normalizedCategoryId].count++;
        categoryDiffs[normalizedCategoryId].maxDiff = Math.max(categoryDiffs[normalizedCategoryId].maxDiff, diff);
    }

    // Sort by diff (descending)
    diffs.sort((a, b) => b.diff - a.diff);

    // Count failures
    const failures = diffs.filter(d => d.diff > MAX_ALLOWED_DIFF);

    // Print category summary
    console.log('📊 Category Diff Summary:');
    console.log('─'.repeat(80));
    console.log('Category'.padEnd(25) + '| Count | Avg Diff | Max Diff | Status');
    console.log('─'.repeat(80));

    const sortedCategories = Object.entries(categoryDiffs)
        .sort((a, b) => b[1].maxDiff - a[1].maxDiff);

    for (const [categoryId, stats] of sortedCategories) {
        const avgDiff = stats.totalDiff / stats.count;
        const status = stats.maxDiff > MAX_ALLOWED_DIFF ? '❌ NEEDS CALIBRATION' : '✅ OK';
        console.log(
            `${categoryId.padEnd(25)}| ${stats.count.toString().padStart(5)} | ${avgDiff.toFixed(4).padStart(8)} | ${stats.maxDiff.toFixed(4).padStart(8)} | ${status}`
        );
    }
    console.log('─'.repeat(80));

    // Print top N diffs
    console.log(`\n📈 Top ${Math.min(TOP_N_DIFFS, diffs.length)} Largest Diffs:`);
    console.log('─'.repeat(100));
    console.log('ID'.padEnd(40) + '| Category'.padEnd(18) + '| Baseline | New    | Diff');
    console.log('─'.repeat(100));

    for (const item of diffs.slice(0, TOP_N_DIFFS)) {
        const diffStr = item.diff > MAX_ALLOWED_DIFF ? `${item.diff.toFixed(4)} ❌` : `${item.diff.toFixed(4)}`;
        console.log(
            `${item.id.substring(0, 38).padEnd(40)}| ${item.normalizedCategoryId.padEnd(16)}| ${item.baselineScore.toFixed(2).padStart(8)} | ${item.newScore.toFixed(2).padStart(6)} | ${diffStr}`
        );
    }
    console.log('─'.repeat(100));

    // Print c1-c10 for top 5 failures (for debugging)
    if (failures.length > 0) {
        console.log(`\n🔧 Scores breakdown for top 5 failures (for weight calibration):`);
        console.log('─'.repeat(100));

        for (const item of failures.slice(0, 5)) {
            console.log(`\n  ${item.id} (${item.normalizedCategoryId})`);
            console.log(`  Baseline: ${item.baselineScore.toFixed(2)} | New: ${item.newScore.toFixed(2)} | Diff: ${item.diff.toFixed(4)}`);
            console.log(`  Scores: ${JSON.stringify(item.scores)}`);
        }
        console.log('─'.repeat(100));
    }

    // Final result
    console.log('\n' + '═'.repeat(60));

    if (failures.length === 0 && missingCount === 0) {
        console.log('✅ ALL PRODUCTS WITHIN TOLERANCE (diff <= 0.01)');
        console.log('═'.repeat(60));
        console.log(`\n💡 Migration is safe to proceed!`);
        console.log(`   All ${diffs.length} products have newScore within ±${MAX_ALLOWED_DIFF} of baseline.\n`);
        process.exit(0);
    } else {
        console.log(`❌ MIGRATION CHECK FAILED`);
        console.log('═'.repeat(60));
        console.log(`\n   Products over tolerance: ${failures.length}`);
        console.log(`   Products missing from baseline: ${missingCount}`);
        console.log(`   Max allowed diff: ${MAX_ALLOWED_DIFF}`);
        console.log(`\n💡 To fix: Adjust CATEGORY_WEIGHTS in src/lib/scoring/category-weights.ts`);
        console.log(`   for the categories marked ❌ above.\n`);
        process.exit(1);
    }
}

main();
