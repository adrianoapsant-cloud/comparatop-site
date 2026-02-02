#!/usr/bin/env npx tsx
/// <reference types="node" />
/**
 * @file compare-unified-golden.ts
 * @description Compare current unified scores against golden file
 * 
 * Fails CI if:
 * - Any product has diff > 0.01 from golden
 * - Golden file version doesn't match WEIGHTS_VERSION
 * 
 * Usage:
 *   npx tsx scripts/compare-unified-golden.ts
 *   npm run compare:golden
 */

import * as fs from 'fs';
import * as path from 'path';
import { ALL_PRODUCTS } from '../src/data/products.index';
import { getUnifiedScore, normalizeCategoryId } from '../src/lib/scoring/getUnifiedScore';
import { WEIGHTS_VERSION } from '../src/lib/scoring/category-weights';

// ============================================
// CONSTANTS
// ============================================

const MAX_ALLOWED_DIFF = 0.01;

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

interface DiffResult {
    id: string;
    name: string;
    categoryId: string;
    goldenScore: number;
    currentScore: number;
    diff: number;
}

// ============================================
// MAIN
// ============================================

function main(): void {
    console.log('🔍 Comparing Unified Scores with Golden File...\n');
    console.log(`📐 Current WEIGHTS_VERSION: ${WEIGHTS_VERSION}`);

    // Find golden file for current version
    const goldenPath = path.join(process.cwd(), 'scoring-baselines', `unifiedScore-v${WEIGHTS_VERSION}.json`);

    if (!fs.existsSync(goldenPath)) {
        console.error(`\n❌ Golden file not found: ${goldenPath}`);
        console.error(`\n💡 To fix:`);
        console.error(`   1. Run 'npm run generate:golden' to create the golden file`);
        console.error(`   2. Commit the generated file\n`);
        process.exit(1);
    }

    const goldenRaw = fs.readFileSync(goldenPath, 'utf-8');
    const golden: GoldenFile = JSON.parse(goldenRaw);

    console.log(`📁 Golden file: unifiedScore-v${golden.weightsVersion}.json`);
    console.log(`📅 Generated: ${golden.generatedAt}`);
    console.log(`📦 Products in golden: ${golden.productCount}`);
    console.log(`📦 Products in current: ${ALL_PRODUCTS.length}\n`);

    // Version check
    if (golden.weightsVersion !== WEIGHTS_VERSION) {
        console.error(`❌ VERSION MISMATCH!`);
        console.error(`   Golden file version: ${golden.weightsVersion}`);
        console.error(`   Current WEIGHTS_VERSION: ${WEIGHTS_VERSION}`);
        console.error(`\n💡 To fix: Run 'npm run generate:golden' and commit the new file.\n`);
        process.exit(1);
    }

    // Compare each product
    const diffs: DiffResult[] = [];
    let missingInGolden = 0;
    let missingInCurrent = 0;

    // Check products in current that exist in golden
    for (const product of ALL_PRODUCTS) {
        const goldenEntry = golden.entries[product.id];

        if (!goldenEntry) {
            missingInGolden++;
            console.warn(`⚠️  New product (not in golden): ${product.id}`);
            continue;
        }

        const currentScore = Math.round(getUnifiedScore(product) * 100) / 100;
        const diff = Math.abs(currentScore - goldenEntry.unifiedScore);

        diffs.push({
            id: product.id,
            name: product.name,
            categoryId: normalizeCategoryId(product.categoryId),
            goldenScore: goldenEntry.unifiedScore,
            currentScore,
            diff,
        });
    }

    // Check for products in golden that are missing in current
    const currentIds = new Set(ALL_PRODUCTS.map(p => p.id));
    for (const id of Object.keys(golden.entries)) {
        if (!currentIds.has(id)) {
            missingInCurrent++;
            console.warn(`⚠️  Removed product (in golden but not current): ${id}`);
        }
    }

    // Sort by diff (descending)
    diffs.sort((a, b) => b.diff - a.diff);

    // Count failures
    const failures = diffs.filter(d => d.diff > MAX_ALLOWED_DIFF);

    // Print results
    console.log('📊 Score Comparison:');
    console.log('─'.repeat(90));
    console.log('ID'.padEnd(40) + '| Golden | Current | Diff');
    console.log('─'.repeat(90));

    for (const item of diffs.slice(0, 20)) {
        const status = item.diff > MAX_ALLOWED_DIFF ? '❌' : '✅';
        console.log(
            `${item.id.substring(0, 38).padEnd(40)}| ${item.goldenScore.toFixed(2).padStart(6)} | ${item.currentScore.toFixed(2).padStart(7)} | ${item.diff.toFixed(4)} ${status}`
        );
    }

    if (diffs.length > 20) {
        console.log(`... and ${diffs.length - 20} more products`);
    }
    console.log('─'.repeat(90));

    // Summary
    console.log('\n' + '═'.repeat(60));

    if (failures.length === 0 && missingInGolden === 0 && missingInCurrent === 0) {
        console.log('✅ ALL SCORES MATCH GOLDEN FILE');
        console.log('═'.repeat(60));
        console.log(`\n   ${diffs.length} products verified`);
        console.log(`   Max diff: ${diffs.length > 0 ? diffs[0].diff.toFixed(4) : '0.0000'}`);
        console.log(`   Tolerance: ${MAX_ALLOWED_DIFF}\n`);
        process.exit(0);
    } else {
        console.log('❌ GOLDEN FILE CHECK FAILED');
        console.log('═'.repeat(60));

        if (failures.length > 0) {
            console.log(`\n   Score regressions: ${failures.length}`);
            console.log(`   Max allowed diff: ${MAX_ALLOWED_DIFF}`);
        }

        if (missingInGolden > 0) {
            console.log(`   New products (not in golden): ${missingInGolden}`);
        }

        if (missingInCurrent > 0) {
            console.log(`   Removed products: ${missingInCurrent}`);
        }

        console.log(`\n💡 To fix:`);
        console.log(`   1. If weights changed: bump WEIGHTS_VERSION in category-weights.ts`);
        console.log(`   2. Run 'npm run generate:golden' to regenerate golden file`);
        console.log(`   3. Commit the updated golden file\n`);
        process.exit(1);
    }
}

main();
