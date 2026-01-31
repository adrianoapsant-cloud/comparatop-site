#!/usr/bin/env npx tsx
/**
 * @file validate-pdp-viewmodel.ts
 * @description Validates PDP ViewModels for all products against P21 requirements
 * 
 * This script:
 * 1. Loads all mock files
 * 2. Builds PdpViewModel for each
 * 3. Validates against P21 requirements
 * 4. Reports sections that are MISSING (not just not_available)
 * 
 * Exit codes:
 *   0 = All products valid (no missing sections)
 *   1 = Some products have not_available sections (warning)
 *   2 = Some products have MISSING sections (error)
 * 
 * Usage:
 *   npm run validate:pdp-viewmodel
 *   npx tsx scripts/validate-pdp-viewmodel.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { buildPdpViewModel, validatePdpViewModel, formatViewModelValidation } from '../src/lib/pdp';

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
    if (!fs.existsSync(dir)) return [];

    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findMockFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
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
    } catch {
        return null;
    }
}

// ============================================
// MAIN
// ============================================

function main() {
    console.log('🔍 PDP ViewModel Validator (P21 Multi-Layer)');
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

    console.log(`\n📊 Validating ${allMocks.length} PDP ViewModel(s)...\n`);

    // Validate each mock
    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    for (const mockPath of allMocks) {
        const mock = loadMock(mockPath);
        if (!mock) {
            console.error(`❌ Failed to load ${path.relative(PROJECT_ROOT, mockPath)}`);
            errorCount++;
            continue;
        }

        // Extract product info
        const product = mock.product as { id?: string; category?: string } | undefined;
        const productId = product?.id || path.basename(mockPath, '.json');
        const categoryId = product?.category || 'unknown';

        // Build and validate ViewModel
        // Note: In CI, we don't have runtime data from API/Shadow Engine
        // So we treat those as 'not_available' which is OK (explicit state)
        const viewModel = buildPdpViewModel(productId, categoryId, mock);
        const validation = validatePdpViewModel(viewModel);

        const relativePath = path.relative(PROJECT_ROOT, mockPath);

        if (validation.valid) {
            const notAvailCount = validation.notAvailableSections.length;
            if (notAvailCount > 3) {
                // Many not_available sections = warning
                console.log(`⚠️ ${relativePath}`);
                console.log(`   ${validation.summary}`);
                warningCount++;
            } else {
                console.log(`✅ ${relativePath}`);
                validCount++;
            }
        } else {
            console.log(`❌ ${relativePath}`);
            console.log(`   ${validation.summary}`);
            validation.missingSections.forEach(s => {
                console.log(`      → ${s.name}`);
            });
            errorCount++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`   ✅ Valid: ${validCount}`);
    console.log(`   ⚠️ Warnings: ${warningCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📁 Total: ${allMocks.length}`);

    // Exit with appropriate code
    if (errorCount > 0) {
        console.log('\n🔴 VALIDATION FAILED - Some products have MISSING sections');
        console.log('   Note: "missing" means the section silently disappeared.');
        console.log('   "not_available" is OK (explicit state shown to user).');
        process.exit(2);
    } else if (warningCount > 0) {
        console.log('\n🟡 VALIDATION PASSED WITH WARNINGS');
        console.log('   Some products have many "not_available" sections.');
        process.exit(1);
    } else {
        console.log('\n🟢 ALL PDP VIEWMODELS VALID');
        process.exit(0);
    }
}

main();
