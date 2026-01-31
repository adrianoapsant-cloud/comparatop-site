#!/usr/bin/env npx tsx
/**
 * @file validate-pdp-mocks.ts
 * @description Validates all PDP mocks against the contract
 * 
 * Exit codes:
 *   0 = All mocks valid
 *   1 = Some mocks have warnings (optional modules missing or __CT_TODO__)
 *   2 = Some mocks have errors (required modules missing)
 * 
 * Usage:
 *   npm run validate:pdp-mocks
 *   npx tsx scripts/validate-pdp-mocks.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { validatePdpModules, formatValidationResult, type PdpValidationResult } from '../src/lib/scaffold/pdp/validate';
import { getUnknownUnknowns } from '../src/data/unknown-unknowns-data';

// ============================================
// CONSTANTS
// ============================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MOCK_DIRS = [
    path.join(PROJECT_ROOT, 'src', 'data', 'mocks'),
    path.join(PROJECT_ROOT, 'src', 'data', 'generated', 'mocks'),
];

// ============================================
// HELPERS
// ============================================

function findMockFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findMockFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            // Skip benchmark files and other non-mock JSONs
            if (!entry.name.includes('benchmark') && !entry.name.startsWith('_')) {
                files.push(fullPath);
            }
        }
    }

    return files;
}

function loadMock(filePath: string): Record<string, unknown> | null {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        console.error(`❌ Failed to load ${filePath}: ${e instanceof Error ? e.message : e}`);
        return null;
    }
}

// ============================================
// MAIN
// ============================================

function main() {
    console.log('🔍 PDP Mock Validator');
    console.log('='.repeat(60));

    // Collect all mock files
    const allMocks: string[] = [];
    for (const dir of MOCK_DIRS) {
        const mocks = findMockFiles(dir);
        if (mocks.length > 0) {
            console.log(`📁 Found ${mocks.length} mocks in ${path.relative(PROJECT_ROOT, dir)}`);
            allMocks.push(...mocks);
        }
    }

    if (allMocks.length === 0) {
        console.log('\n⚠️ No mock files found');
        process.exit(0);
    }

    console.log(`\n📊 Validating ${allMocks.length} mock(s)...\n`);

    // Validate each mock
    const results: { path: string; result: PdpValidationResult }[] = [];
    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;

    for (const mockPath of allMocks) {
        const mock = loadMock(mockPath);
        if (!mock) {
            failCount++;
            continue;
        }

        // Extract category from mock
        const product = mock.product as { category?: string } | undefined;
        const categoryId = product?.category || 'unknown';

        const result = validatePdpModules(mock, categoryId);
        results.push({ path: mockPath, result });

        // Display result
        const relativePath = path.relative(PROJECT_ROOT, mockPath);
        const statusIcon = result.exitCode === 0 ? '✅' : result.exitCode === 1 ? '⚠️' : '❌';
        console.log(`${statusIcon} ${relativePath}`);

        if (result.exitCode === 0) {
            passCount++;
        } else if (result.exitCode === 1) {
            warnCount++;
            result.warnings.forEach(w => console.log(`   ⚠️ ${w.message}`));
        } else {
            failCount++;
            result.errors.forEach(e => console.log(`   ❌ [${e.path || 'N/A'}] ${e.message}`));
        }

        // Check Unknown Unknowns availability
        const uu = getUnknownUnknowns(categoryId);
        const uuCount = uu?.items?.length ?? 0;
        if (uuCount === 0) {
            console.log(`   ℹ️ No Unknown Unknowns data for category '${categoryId}'`);
        } else if (uuCount < 5) {
            console.log(`   ⚠️ Unknown Unknowns: ${uuCount} items (recommended: 5+)`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`   ✅ Pass: ${passCount}`);
    console.log(`   ⚠️ Warn: ${warnCount}`);
    console.log(`   ❌ Fail: ${failCount}`);
    console.log(`   📁 Total: ${allMocks.length}`);

    // Exit with appropriate code
    if (failCount > 0) {
        console.log('\n🔴 VALIDATION FAILED - Some mocks have critical errors');
        process.exit(2);
    } else if (warnCount > 0) {
        console.log('\n🟡 VALIDATION PASSED WITH WARNINGS');
        process.exit(1);
    } else {
        console.log('\n🟢 ALL MOCKS VALID');
        process.exit(0);
    }
}

main();
