#!/usr/bin/env npx tsx
/**
 * @file fix-pdp-mocks.ts
 * @description Auto-fix PDP mocks with missing dimension weights
 * 
 * This script:
 * 1. Scans all mock files
 * 2. Detects missing `weight` in productDna.dimensions[]
 * 3. Auto-fills with uniform weights (0.1 for 10 dimensions = 1.0 total)
 * 4. Adds missing required fields with sensible defaults
 * 
 * Usage:
 *   npm run fix:pdp-mocks
 *   npx tsx scripts/fix-pdp-mocks.ts
 *   npx tsx scripts/fix-pdp-mocks.ts --dry-run  (preview only)
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONSTANTS
// ============================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MOCK_DIRS = [
    path.join(PROJECT_ROOT, 'src', 'data', 'mocks'),
    path.join(PROJECT_ROOT, 'src', 'data', 'generated', 'mocks'),
];

const DRY_RUN = process.argv.includes('--dry-run');

// ============================================
// TYPES
// ============================================

interface Dimension {
    id?: string;
    name?: string;
    shortName?: string;
    score?: number;
    weight?: number;
    icon?: string;
    color?: string;
    description?: string;
}

interface MockFile {
    product?: {
        id?: string;
        name?: string;
        brand?: string;
        category?: string;
    };
    header?: {
        overallScore?: number;
    };
    productDna?: {
        dimensions?: Dimension[];
    };
    simulators?: unknown;
    decisionFAQ?: unknown[];
    [key: string]: unknown;
}

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

function loadMock(filePath: string): MockFile | null {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return null;
    }
}

function saveMock(filePath: string, mock: MockFile): void {
    const content = JSON.stringify(mock, null, 4);
    fs.writeFileSync(filePath, content, 'utf-8');
}

// ============================================
// FIX FUNCTIONS
// ============================================

interface FixResult {
    path: string;
    fixed: boolean;
    changes: string[];
}

function fixMock(filePath: string, mock: MockFile): FixResult {
    const changes: string[] = [];
    const relativePath = path.relative(PROJECT_ROOT, filePath);

    // 1. Fix missing product.category
    if (mock.product && !mock.product.category) {
        // Try to infer from filename or set to unknown
        const filename = path.basename(filePath, '.json');
        if (filename.includes('robot') || filename.includes('roborock') || filename.includes('dreame') || filename.includes('xiaomi-robot')) {
            mock.product.category = 'robot-vacuum';
        } else if (filename.includes('tv') || filename.includes('samsung-qn') || filename.includes('lg-oled')) {
            mock.product.category = 'tv';
        } else if (filename.includes('fridge') || filename.includes('geladeira') || filename.includes('brm')) {
            mock.product.category = 'fridge';
        } else if (filename.includes('ac-') || filename.includes('ar-') || filename.includes('q12')) {
            mock.product.category = 'air_conditioner';
        } else if (filename.includes('air-fryer') || filename.includes('afn')) {
            mock.product.category = 'air_fryer';
        } else if (filename.includes('watch')) {
            mock.product.category = 'smartwatch';
        } else if (filename.includes('phone') || filename.includes('edge-') || filename.includes('galaxy')) {
            mock.product.category = 'smartphone';
        } else if (filename.includes('inspiron') || filename.includes('macbook') || filename.includes('thinkpad')) {
            mock.product.category = 'laptop';
        } else if (filename.includes('soundbar') || filename.includes('hw-q')) {
            mock.product.category = 'soundbar';
        }
        if (mock.product.category) {
            changes.push(`Added product.category: '${mock.product.category}'`);
        }
    }

    // 2. Fix missing header.overallScore
    if (mock.header && mock.header.overallScore === undefined) {
        // Calculate from dimensions if available
        const dims = mock.productDna?.dimensions || [];
        if (dims.length > 0) {
            const avg = dims.reduce((sum, d) => sum + (d.score || 5), 0) / dims.length;
            mock.header.overallScore = Math.round(avg * 100) / 100;
            changes.push(`Calculated header.overallScore: ${mock.header.overallScore}`);
        } else {
            mock.header.overallScore = 7.0;
            changes.push(`Set default header.overallScore: 7.0`);
        }
    }

    // 3. Fix missing productDna.dimensions[].weight
    if (mock.productDna?.dimensions && Array.isArray(mock.productDna.dimensions)) {
        const dims = mock.productDna.dimensions;
        const missingWeights = dims.filter(d => d.weight === undefined || d.weight === null);

        if (missingWeights.length > 0) {
            // Calculate uniform weight for all dimensions
            const uniformWeight = Math.round((1 / dims.length) * 100) / 100;

            dims.forEach((dim, idx) => {
                if (dim.weight === undefined || dim.weight === null) {
                    dim.weight = uniformWeight;
                }
            });

            // Adjust last weight to ensure sum = 1.0
            const sum = dims.reduce((s, d) => s + (d.weight || 0), 0);
            if (Math.abs(sum - 1.0) > 0.001 && dims.length > 0) {
                const lastDim = dims[dims.length - 1];
                lastDim.weight = Math.round((lastDim.weight! + (1.0 - sum)) * 100) / 100;
            }

            changes.push(`Fixed ${missingWeights.length} dimensions with weight: ${uniformWeight} each`);
        }
    }

    // 4. Ensure simulators exists (empty object if missing)
    if (!mock.simulators) {
        mock.simulators = {
            title: "Simuladores",
            items: []
        };
        changes.push(`Added empty simulators section`);
    }

    // 5. Ensure decisionFAQ exists (empty array if missing)
    if (!mock.decisionFAQ) {
        mock.decisionFAQ = [];
        changes.push(`Added empty decisionFAQ array`);
    }

    return {
        path: relativePath,
        fixed: changes.length > 0,
        changes,
    };
}

// ============================================
// MAIN
// ============================================

function main() {
    console.log('🔧 PDP Mock Fixer');
    console.log('='.repeat(60));

    if (DRY_RUN) {
        console.log('⚠️  DRY RUN MODE - No files will be modified\n');
    }

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

    console.log(`\n🔧 Processing ${allMocks.length} mock(s)...\n`);

    // Process each mock
    let fixedCount = 0;
    let unchangedCount = 0;
    const results: FixResult[] = [];

    for (const mockPath of allMocks) {
        const mock = loadMock(mockPath);
        if (!mock) {
            console.error(`❌ Failed to load ${mockPath}`);
            continue;
        }

        const result = fixMock(mockPath, mock);
        results.push(result);

        if (result.fixed) {
            fixedCount++;
            console.log(`✅ ${result.path}`);
            result.changes.forEach(c => console.log(`   → ${c}`));

            if (!DRY_RUN) {
                saveMock(mockPath, mock);
            }
        } else {
            unchangedCount++;
            console.log(`⏭️  ${result.path} (no changes needed)`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`   ✅ Fixed: ${fixedCount}`);
    console.log(`   ⏭️  Unchanged: ${unchangedCount}`);
    console.log(`   📁 Total: ${allMocks.length}`);

    if (DRY_RUN) {
        console.log('\n⚠️  DRY RUN - Run without --dry-run to apply fixes');
    } else if (fixedCount > 0) {
        console.log('\n✅ All fixes applied. Run validate:pdp-mocks to verify.');
    } else {
        console.log('\n✅ All mocks already compliant. No changes needed.');
    }

    process.exit(0);
}

main();
