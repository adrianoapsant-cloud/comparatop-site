#!/usr/bin/env npx tsx
/**
 * QA All Categories
 * 
 * Runs qa-category.ts for all registered categories.
 * Fails (exit 1) if any category fails.
 * 
 * Usage:
 *   npx tsx scripts/qa-all.ts
 *   npm run qa:all
 */

import { exec } from 'child_process';
import * as path from 'path';
import { listCategories } from '../src/categories/registry';

interface CategoryResult {
    slug: string;
    passed: boolean;
    exitCode: number;
}

async function runQAForCategory(slug: string): Promise<CategoryResult> {
    return new Promise((resolve) => {
        const scriptPath = path.resolve(__dirname, 'qa-category.ts');

        // Use quotes around path to handle spaces in Windows paths
        const cmd = `npx tsx "${scriptPath}" --category ${slug}`;

        const proc = exec(cmd, { cwd: path.resolve(__dirname, '..') });

        proc.stdout?.pipe(process.stdout);
        proc.stderr?.pipe(process.stderr);

        proc.on('close', (code) => {
            resolve({
                slug,
                passed: code === 0,
                exitCode: code ?? 1,
            });
        });

        proc.on('error', () => {
            resolve({
                slug,
                passed: false,
                exitCode: 1,
            });
        });
    });
}

async function main() {
    console.log('========================================');
    console.log('QA All Categories');
    console.log('========================================\n');

    const categories = listCategories();

    if (categories.length === 0) {
        console.log('⚠️  No categories registered in registry.ts');
        process.exit(1);
    }

    console.log(`Found ${categories.length} registered category(ies): ${categories.join(', ')}\n`);

    const results: CategoryResult[] = [];

    for (const slug of categories) {
        console.log(`\n--- Running QA for: ${slug} ---\n`);
        const result = await runQAForCategory(slug);
        results.push(result);
    }

    // Summary
    console.log('\n========================================');
    console.log('QA ALL - SUMMARY');
    console.log('========================================\n');

    const passed = results.filter(r => r.passed);
    const failed = results.filter(r => !r.passed);

    for (const r of results) {
        const icon = r.passed ? '✅' : '❌';
        console.log(`${icon} ${r.slug}`);
    }

    console.log('');
    console.log(`Total: ${results.length} | Passed: ${passed.length} | Failed: ${failed.length}`);

    if (failed.length > 0) {
        console.log('\n❌ QA ALL FAILED');
        process.exit(1);
    }

    console.log('\n✅ QA ALL PASSED');
    process.exit(0);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
