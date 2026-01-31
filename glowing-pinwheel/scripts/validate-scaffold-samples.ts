#!/usr/bin/env npx tsx
/**
 * @file validate-scaffold-samples.ts
 * @description P5.5-C: Valida samples de scaffold para todas as categorias
 * 
 * Para cada categoria suportada:
 * - Dry-run sem strict (espera PASS)
 * - Dry-run --strict com evidence (espera PASS)
 * - Dry-run --strict sem evidence (espera FAIL exit code 2)
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SUPPORTED_CATEGORIES = [
    'robot-vacuum',
    'tv',
    'fridge',
    'air_conditioner',
    'smartwatch',
    'smartphone',
    'laptop',
    'washer',
    'monitor',
    'tablet',
    'soundbar',
];

const SAMPLES_DIR = path.resolve(__dirname, '..', 'samples');

interface TestResult {
    categoryId: string;
    test: string;
    expected: 'PASS' | 'FAIL';
    actual: 'PASS' | 'FAIL';
    success: boolean;
    error?: string;
}

function runScaffold(categoryId: string, sampleFile: string, strict: boolean): { exitCode: number; output: string } {
    const samplePath = path.join(SAMPLES_DIR, sampleFile);
    if (!fs.existsSync(samplePath)) {
        return { exitCode: -1, output: `Sample not found: ${samplePath}` };
    }

    const cmd = `npx tsx scripts/scaffold-product.ts --category ${categoryId} --dry-run ${strict ? '--strict ' : ''}--in "${samplePath}"`;

    try {
        const output = execSync(cmd, {
            cwd: path.resolve(__dirname, '..'),
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return { exitCode: 0, output };
    } catch (error: unknown) {
        const err = error as { status?: number; stdout?: string; stderr?: string };
        return {
            exitCode: err.status || 1,
            output: (err.stdout || '') + (err.stderr || '')
        };
    }
}

function runTests(): TestResult[] {
    const results: TestResult[] = [];

    for (const categoryId of SUPPORTED_CATEGORIES) {
        // Check if sample files exist
        const evidenceSample = `${categoryId}.evidence.input.json`;
        const noEvidenceSample = `${categoryId}.input.json`;

        // Test 1: Dry-run without strict (should PASS with noevidence sample)
        const test1 = runScaffold(categoryId, noEvidenceSample, false);
        const test1Pass = test1.exitCode === 0;
        results.push({
            categoryId,
            test: 'dry-run (no strict)',
            expected: 'PASS',
            actual: test1Pass ? 'PASS' : 'FAIL',
            success: test1Pass,
            error: test1Pass ? undefined : `Exit code ${test1.exitCode}`,
        });

        // Test 2: Dry-run --strict with evidence (should PASS)
        const test2 = runScaffold(categoryId, evidenceSample, true);
        const test2Pass = test2.exitCode === 0;
        results.push({
            categoryId,
            test: '--strict (with evidence)',
            expected: 'PASS',
            actual: test2Pass ? 'PASS' : 'FAIL',
            success: test2Pass,
            error: test2Pass ? undefined : `Exit code ${test2.exitCode}`,
        });

        // Test 3: Dry-run --strict without evidence (should FAIL with exit 2)
        const test3 = runScaffold(categoryId, noEvidenceSample, true);
        const test3Pass = test3.exitCode !== 0;  // Expected to fail
        results.push({
            categoryId,
            test: '--strict (no evidence)',
            expected: 'FAIL',
            actual: test3.exitCode === 0 ? 'PASS' : 'FAIL',
            success: test3Pass,
            error: test3Pass ? undefined : 'Should have failed but passed',
        });
    }

    return results;
}

function printResults(results: TestResult[]): void {
    console.log('\n' + '='.repeat(70));
    console.log('SCAFFOLD SAMPLES VALIDATION RESULTS');
    console.log('='.repeat(70) + '\n');

    const byCategory: Record<string, TestResult[]> = {};
    for (const r of results) {
        if (!byCategory[r.categoryId]) byCategory[r.categoryId] = [];
        byCategory[r.categoryId].push(r);
    }

    let totalPassed = 0;
    let totalFailed = 0;

    for (const categoryId of SUPPORTED_CATEGORIES) {
        const categoryResults = byCategory[categoryId] || [];
        const allPassed = categoryResults.every(r => r.success);
        const icon = allPassed ? '✅' : '❌';

        console.log(`${icon} ${categoryId}`);
        for (const r of categoryResults) {
            const status = r.success ? '  ✓' : '  ✗';
            console.log(`${status} ${r.test}: expected ${r.expected}, got ${r.actual}${r.error ? ` (${r.error})` : ''}`);
            if (r.success) totalPassed++;
            else totalFailed++;
        }
        console.log();
    }

    console.log('='.repeat(70));
    console.log(`SUMMARY: ${totalPassed} passed, ${totalFailed} failed out of ${results.length} tests`);
    console.log(`CATEGORIES: ${SUPPORTED_CATEGORIES.length}/11`);
    console.log('='.repeat(70));

    if (totalFailed > 0) {
        process.exit(1);
    }
}

// Run
const results = runTests();
printResults(results);
