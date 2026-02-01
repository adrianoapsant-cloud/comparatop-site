#!/usr/bin/env npx tsx
/**
 * Generic Category QA Quality Gate
 * 
 * Validates any registered category:
 * - All products have valid structuredSpecs (Zod)
 * - No product falls back to isFallback=true
 * - Scores and tags match snapshot (golden set)
 * 
 * Usage:
 *   npx tsx scripts/qa-category.ts --category robot-vacuum
 *   npx tsx scripts/qa-category.ts --category robot-vacuum --write-snapshot
 * 
 * Exit codes:
 *   0 = All checks passed
 *   1 = Validation errors or diffs found
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { getCategoryModule } from '../src/categories/registry';

// ============================================
// TYPES
// ============================================

interface SnapshotItem {
    id: string;
    scores: Record<string, number>;
    tags: Record<string, boolean>;
}

interface Snapshot {
    version: number;
    category: string;
    generatedAt: string;
    productCount: number;
    items: SnapshotItem[];
}

interface ValidationResult {
    productId: string;
    hasStructuredSpecs: boolean;
    schemaValid: boolean;
    schemaErrors: string[];
    isFallback: boolean;
    fallbackInfo?: unknown;
    scores: Record<string, number> | null;
    tags: Record<string, boolean> | null;
}

interface DiffItem {
    productId: string;
    field: string;
    expected: string;
    actual: string;
}

interface LoadedProduct {
    id: string;
    categoryId: string;
    structuredSpecs?: unknown;
    [key: string]: unknown;
}

// ============================================
// CONSTANTS
// ============================================

const SNAPSHOT_DIR = path.resolve(__dirname, '../qaSnapshots');
const DATA_DIR = path.resolve(__dirname, '../src/data');

// ============================================
// HELPERS
// ============================================

function roundScores(scores: Record<string, number>): Record<string, number> {
    const rounded: Record<string, number> = {};
    for (const [key, value] of Object.entries(scores)) {
        rounded[key] = Number(value.toFixed(2));
    }
    return rounded;
}

function compareObjects(a: Record<string, unknown>, b: Record<string, unknown>, prefix: string): DiffItem[] {
    const diffs: DiffItem[] = [];
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const key of allKeys) {
        const aVal = JSON.stringify(a[key]);
        const bVal = JSON.stringify(b[key]);
        if (aVal !== bVal) {
            diffs.push({
                productId: '',
                field: `${prefix}.${key}`,
                expected: aVal ?? 'undefined',
                actual: bVal ?? 'undefined',
            });
        }
    }
    return diffs;
}

function parseArgs(): { category: string; writeSnapshot: boolean; snapshotPath?: string } {
    const args = process.argv.slice(2);
    let category = '';
    let writeSnapshot = false;
    let snapshotPath: string | undefined;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--category' && args[i + 1]) {
            category = args[i + 1];
            i++;
        } else if (args[i] === '--write-snapshot') {
            writeSnapshot = true;
        } else if (args[i] === '--snapshot' && args[i + 1]) {
            snapshotPath = args[i + 1];
            i++;
        }
    }

    if (!category) {
        console.error('Usage: npx tsx scripts/qa-category.ts --category <slug> [--write-snapshot] [--snapshot <path>]');
        console.error('');
        console.error('Options:');
        console.error('  --category <slug>    Category slug (e.g., robot-vacuum)');
        console.error('  --write-snapshot     Generate/update snapshot file');
        console.error('  --snapshot <path>    Custom snapshot path');
        process.exit(1);
    }

    return { category, writeSnapshot, snapshotPath };
}

// ============================================
// PRODUCT LOADING (dynamic import)
// ============================================

/**
 * Load all product entries via dynamic import.
 * 
 * How it works:
 * 1. List all files matching products.entry.*.ts in src/data
 * 2. Convert each file path to a file:// URL for dynamic import
 * 3. Import the module and extract the default export (product object)
 * 4. Return all products as an array
 */
async function loadProductEntries(): Promise<LoadedProduct[]> {
    const products: LoadedProduct[] = [];
    const allFiles = fs.readdirSync(DATA_DIR);

    for (const file of allFiles) {
        if (!file.startsWith('products.entry.') || !file.endsWith('.ts')) {
            continue;
        }

        const filePath = path.join(DATA_DIR, file);
        const fileUrl = pathToFileURL(filePath).href;

        try {
            // Dynamic import returns the module object
            const module = await import(fileUrl);

            // Extract the product from default export or first named export
            const product = module.default || Object.values(module)[0];

            if (product && typeof product === 'object' && 'id' in product && 'categoryId' in product) {
                products.push(product as LoadedProduct);
            }
        } catch (err) {
            console.warn(`⚠️  Failed to load ${file}: ${(err as Error).message}`);
        }
    }

    return products;
}

// ============================================
// MAIN
// ============================================

async function main() {
    const { category, writeSnapshot, snapshotPath } = parseArgs();
    const snapshotFile = snapshotPath || path.join(SNAPSHOT_DIR, `${category}.v1.json`);

    console.log('========================================');
    console.log(`Category QA Quality Gate`);
    console.log(`Category: ${category}`);
    console.log(`Mode: ${writeSnapshot ? 'WRITE SNAPSHOT' : 'VALIDATE'}`);
    console.log('========================================\n');

    // Load category module from registry
    let module: ReturnType<typeof getCategoryModule>;
    try {
        module = getCategoryModule(category);
    } catch (error) {
        console.error(`❌ ${(error as Error).message}`);
        process.exit(1);
    }

    // Load all products via dynamic import
    const allProducts = await loadProductEntries();

    // Filter by category
    const products = allProducts
        .filter(p => p.categoryId === category)
        .sort((a, b) => a.id.localeCompare(b.id)); // Sort for determinism

    console.log(`Found ${products.length} ${category} products\n`);

    if (products.length === 0) {
        console.log(`⚠️  No products found for category "${category}"`);
        process.exit(1);
    }

    // Validate each product
    const results: ValidationResult[] = [];
    const validItems: Array<{ id: string; specs: unknown; tags: unknown; scores: unknown }> = [];
    let schemaErrors = 0;
    let fallbackCount = 0;
    let noSpecsCount = 0;

    for (const product of products) {
        const result: ValidationResult = {
            productId: product.id,
            hasStructuredSpecs: false,
            schemaValid: false,
            schemaErrors: [],
            isFallback: false,
            scores: null,
            tags: null,
        };

        let specs: unknown = null;

        // Priority: structuredSpecs > getDerived > error
        // Note: getDerived expects runtime ScoredProduct format, but we have raw entries
        // So we prefer structuredSpecs when available
        if (product.structuredSpecs) {
            specs = product.structuredSpecs;
            result.hasStructuredSpecs = true;
        } else if (module.getDerived) {
            // Fallback to getDerived for legacy products
            try {
                const derived = module.getDerived(product);

                if (derived.isFallback) {
                    result.schemaErrors.push('getDerived returned isFallback=true (no structuredSpecs)');
                    result.isFallback = true;
                    result.fallbackInfo = derived.fallbackInfo;
                    fallbackCount++;
                } else {
                    specs = derived.specs;
                    result.hasStructuredSpecs = true;
                }
            } catch (err) {
                result.schemaErrors.push(`getDerived error: ${(err as Error).message}`);
                result.isFallback = true;
                fallbackCount++;
            }
        } else {
            result.schemaErrors.push('structuredSpecs not found and no getDerived available');
            result.isFallback = true;
            noSpecsCount++;
            fallbackCount++;
        }

        // Validate specs with Zod schema
        if (specs) {
            const validation = module.specSchema.safeParse(specs);

            if (!validation.success) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result.schemaErrors = (validation.error?.issues ?? []).map(
                    (e: any) => `${e.path.join('.')}: ${e.message}`
                );
                schemaErrors++;
                result.isFallback = true;
                fallbackCount++;
            } else {
                result.schemaValid = true;

                // Derive tags and compute scores using module functions
                const validSpecs = validation.data;
                const tags = module.deriveTags(validSpecs);
                const scores = roundScores(module.computeScores(validSpecs) as Record<string, number>);

                result.scores = scores;
                result.tags = tags as Record<string, boolean>;
                result.isFallback = false;

                // Collect for extraAssertions
                validItems.push({
                    id: product.id,
                    specs: validSpecs,
                    tags,
                    scores,
                });
            }
        }

        results.push(result);
    }

    // Print validation summary
    console.log('--- VALIDATION SUMMARY ---');
    console.log(`Total products: ${products.length}`);
    console.log(`Schema valid: ${products.length - schemaErrors - noSpecsCount}`);
    console.log(`Schema errors: ${schemaErrors}`);
    console.log(`Missing structuredSpecs: ${noSpecsCount}`);
    console.log(`Would use fallback (isFallback=true): ${fallbackCount}`);
    console.log('');

    // Print errors if any
    if (schemaErrors > 0 || noSpecsCount > 0 || fallbackCount > 0) {
        console.log('--- ERRORS ---');
        for (const r of results) {
            if (r.schemaErrors.length > 0) {
                console.log(`[ERROR] ${r.productId}:`);
                for (const err of r.schemaErrors) {
                    console.log(`  - ${err}`);
                }
            }
        }
        console.log('');
    }

    // Run category-specific extraAssertions if defined
    if (module.qa?.extraAssertions && validItems.length > 0) {
        console.log('--- EXTRA ASSERTIONS ---');
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            module.qa.extraAssertions(validItems as any);
            console.log('✅ Extra assertions passed\n');
        } catch (err) {
            console.log(`❌ Extra assertions failed: ${(err as Error).message}\n`);
            process.exit(1);
        }
    }

    // Handle snapshot
    if (writeSnapshot) {
        const validResults = results.filter(r => r.schemaValid && r.scores && r.tags);

        const snapshot: Snapshot = {
            version: 1,
            category,
            generatedAt: new Date().toISOString(),
            productCount: validResults.length,
            items: validResults.map(r => ({
                id: r.productId,
                scores: r.scores!,
                tags: r.tags!,
            })),
        };

        if (!fs.existsSync(SNAPSHOT_DIR)) {
            fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
        }

        fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2), 'utf-8');
        console.log(`✅ Snapshot written to: ${snapshotFile}`);
        console.log(`   Products in snapshot: ${snapshot.productCount}`);

        if (fallbackCount > 0) {
            console.log(`\n⚠️  WARNING: ${fallbackCount} product(s) would use fallback!`);
            process.exit(1);
        }

        process.exit(0);
    }

    // Validate mode: compare with snapshot
    if (!fs.existsSync(snapshotFile)) {
        console.log('❌ Snapshot file not found!');
        console.log('   Run with --write-snapshot to generate it first.');
        console.log(`   Expected: ${snapshotFile}`);
        process.exit(1);
    }

    const snapshot: Snapshot = JSON.parse(fs.readFileSync(snapshotFile, 'utf-8'));
    console.log(`--- SNAPSHOT COMPARISON (v${snapshot.version}) ---`);
    console.log(`Snapshot products: ${snapshot.productCount}`);
    console.log(`Current products: ${products.length}`);
    console.log('');

    // Compare
    const diffs: DiffItem[] = [];
    const snapshotMap = new Map(snapshot.items.map(item => [item.id, item]));
    const currentMap = new Map(results.filter(r => r.scores).map(r => [r.productId, r]));

    for (const item of snapshot.items) {
        if (!currentMap.has(item.id)) {
            diffs.push({ productId: item.id, field: '(product)', expected: 'exists', actual: 'MISSING' });
        }
    }

    for (const result of results) {
        if (result.scores && !snapshotMap.has(result.productId)) {
            diffs.push({ productId: result.productId, field: '(product)', expected: 'not exists', actual: 'ADDED' });
        }
    }

    for (const result of results) {
        if (!result.scores || !result.tags) continue;

        const snapshotItem = snapshotMap.get(result.productId);
        if (!snapshotItem) continue;

        const scoreDiffs = compareObjects(
            snapshotItem.scores as unknown as Record<string, unknown>,
            result.scores as unknown as Record<string, unknown>,
            'scores'
        );
        const tagDiffs = compareObjects(
            snapshotItem.tags as unknown as Record<string, unknown>,
            result.tags as unknown as Record<string, unknown>,
            'tags'
        );

        for (const d of [...scoreDiffs, ...tagDiffs]) {
            d.productId = result.productId;
            diffs.push(d);
        }
    }

    // Print results
    if (diffs.length === 0 && fallbackCount === 0) {
        console.log('✅ All checks passed!');
        console.log(`   - Category: ${category}`);
        console.log('   - Schema: OK');
        console.log('   - Fallback: 0');
        console.log('   - Snapshot: 0 diffs');
        process.exit(0);
    }

    if (diffs.length > 0) {
        console.log('--- SNAPSHOT DIFFS ---');
        for (const d of diffs.slice(0, 20)) {
            console.log(`[DIFF] ${d.productId} :: ${d.field}`);
            console.log(`       expected: ${d.expected}`);
            console.log(`       actual:   ${d.actual}`);
        }
        if (diffs.length > 20) {
            console.log(`... and ${diffs.length - 20} more diffs`);
        }
        console.log('');
    }

    console.log('❌ QA FAILED');
    console.log(`   Fallback products: ${fallbackCount}`);
    console.log(`   Snapshot diffs: ${diffs.length}`);

    if (diffs.length > 0) {
        console.log('\n💡 If these changes are intentional, run:');
        console.log(`   npx tsx scripts/qa-category.ts --category ${category} --write-snapshot`);
    }

    process.exit(1);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
