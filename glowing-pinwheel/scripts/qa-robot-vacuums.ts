#!/usr/bin/env npx tsx
/**
 * Robot Vacuums QA Quality Gate
 * 
 * Validates:
 * 1. All robot-vacuum products have valid structuredSpecs (Zod)
 * 2. No product falls back to isFallback=true
 * 3. Scores and tags match snapshot (golden set)
 * 
 * Usage:
 *   npx tsx scripts/qa-robot-vacuums.ts              # Validate against snapshot
 *   npx tsx scripts/qa-robot-vacuums.ts --write-snapshot   # Generate/update snapshot
 * 
 * Exit codes:
 *   0 = All checks passed
 *   1 = Validation errors or diffs found
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface RobotVacuumScores {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    c6: number;
    c7: number;
    c8: number;
    c9: number;
    c10: number;
}

interface RobotVacuumTags {
    hasLidar: boolean;
    hasVslam: boolean;
    hasSmartNav: boolean;
    trueMopping: boolean;
    hasRotatingMop: boolean;
    hasMopLift: boolean;
    lowProfile: boolean;
    ultraLowProfile: boolean;
    allInOneDock: boolean;
    autoEmptyDock: boolean;
    autoWashDock: boolean;
    goodForPets: boolean;
    advancedAvoidance: boolean;
    hasAiCamera: boolean;
    quiet: boolean;
    longRuntime: boolean;
    hasRechargeResume: boolean;
    hasGoodApp: boolean;
    goodPartsBrazil: boolean;
}

interface SnapshotItem {
    id: string;
    scores: RobotVacuumScores;
    tags: RobotVacuumTags;
}

interface Snapshot {
    version: number;
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
    scores: RobotVacuumScores | null;
    tags: RobotVacuumTags | null;
}

interface DiffItem {
    productId: string;
    field: string;
    expected: string;
    actual: string;
}

// ============================================
// CONSTANTS
// ============================================

const SNAPSHOT_DIR = path.resolve(__dirname, '../qaSnapshots');
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, 'robot-vacuums.v1.json');
const DATA_DIR = path.resolve(__dirname, '../src/data');

// ============================================
// HELPERS
// ============================================

function roundScores(scores: RobotVacuumScores): RobotVacuumScores {
    return {
        c1: Number(scores.c1.toFixed(2)),
        c2: Number(scores.c2.toFixed(2)),
        c3: Number(scores.c3.toFixed(2)),
        c4: Number(scores.c4.toFixed(2)),
        c5: Number(scores.c5.toFixed(2)),
        c6: Number(scores.c6.toFixed(2)),
        c7: Number(scores.c7.toFixed(2)),
        c8: Number(scores.c8.toFixed(2)),
        c9: Number(scores.c9.toFixed(2)),
        c10: Number(scores.c10.toFixed(2)),
    };
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

// ============================================
// ZOD SCHEMA (inline to avoid import issues)
// ============================================

const VALID_NAV_TYPES = ['random', 'gyro', 'vslam', 'lidar'];
const VALID_MOP_TYPES = ['none', 'static', 'vibrating', 'rotating'];
const VALID_BRUSH_TYPES = ['suction-only', 'bristle', 'rubber', 'anti-tangle'];
const VALID_DOCK_TYPES = ['basic', 'auto-empty', 'auto-wash', 'all-in-one'];
const VALID_OBSTACLE_TYPES = ['bump-only', 'infrared', '3d-structured', 'ai-camera'];

function validateSpecs(specs: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!VALID_NAV_TYPES.includes(specs.navigationType as string)) {
        errors.push(`navigationType: invalid value "${specs.navigationType}"`);
    }
    if (!VALID_MOP_TYPES.includes(specs.mopType as string)) {
        errors.push(`mopType: invalid value "${specs.mopType}"`);
    }
    if (!VALID_BRUSH_TYPES.includes(specs.brushType as string)) {
        errors.push(`brushType: invalid value "${specs.brushType}"`);
    }
    if (!VALID_DOCK_TYPES.includes(specs.dockType as string)) {
        errors.push(`dockType: invalid value "${specs.dockType}"`);
    }
    if (!VALID_OBSTACLE_TYPES.includes(specs.obstacleDetection as string)) {
        errors.push(`obstacleDetection: invalid value "${specs.obstacleDetection}"`);
    }
    if (typeof specs.heightCm !== 'number' || specs.heightCm <= 0) {
        errors.push(`heightCm: must be positive number, got "${specs.heightCm}"`);
    }

    return { valid: errors.length === 0, errors };
}

// ============================================
// SCORING (inline to avoid import issues)
// ============================================

const NAVIGATION_SCORES: Record<string, number> = { random: 2.5, gyro: 5.0, vslam: 7.0, lidar: 8.8 };
const MOP_TYPE_SCORES: Record<string, number> = { none: 0.5, static: 5.0, vibrating: 7.0, rotating: 8.6 };
const BRUSH_TYPE_SCORES: Record<string, number> = { 'suction-only': 5.0, bristle: 5.8, rubber: 7.0, 'anti-tangle': 8.6 };
const DOCK_TYPE_SCORES: Record<string, number> = { basic: 4.5, 'auto-empty': 7.0, 'auto-wash': 8.3, 'all-in-one': 9.2 };
const OBSTACLE_DETECTION_SCORES: Record<string, number> = { 'bump-only': 3.0, infrared: 5.2, '3d-structured': 7.2, 'ai-camera': 8.2 };

function scoreBands(value: number | undefined, bands: Array<{ min?: number; max?: number; score: number }>, fallback: number): number {
    if (value === undefined) return fallback;
    for (const band of bands) {
        const minOk = band.min === undefined || value >= band.min;
        const maxOk = band.max === undefined || value <= band.max;
        if (minOk && maxOk) return band.score;
    }
    return fallback;
}

function clamp(v: number): number { return Math.max(0, Math.min(10, v)); }

function computeScoresFromSpecs(specs: Record<string, unknown>): RobotVacuumScores {
    const heightBands = [
        { max: 7.9, score: 9.8 },
        { min: 8.0, max: 8.9, score: 8.7 },
        { min: 9.0, max: 9.9, score: 7.4 },
        { min: 10.0, max: 10.9, score: 6.2 },
        { min: 11.0, score: 5.0 },
    ];
    const runtimeBands = [
        { max: 60, score: 4.0 },
        { min: 61, max: 90, score: 6.0 },
        { min: 91, max: 120, score: 7.2 },
        { min: 121, max: 150, score: 8.2 },
        { min: 151, score: 8.8 },
    ];
    const noiseBands = [
        { max: 55, score: 9.5 },
        { min: 56, max: 60, score: 8.5 },
        { min: 61, max: 65, score: 7.5 },
        { min: 66, max: 70, score: 6.5 },
        { min: 71, max: 75, score: 5.5 },
        { min: 76, score: 4.8 },
    ];

    let c1 = NAVIGATION_SCORES[specs.navigationType as string] || 5.0;
    const mapFeatures = specs.mapFeatures as Record<string, boolean> | undefined;
    if (mapFeatures?.noGoZones) c1 += 0.3;
    if (mapFeatures?.multiFloor) c1 += 0.3;
    if (mapFeatures?.roomNaming) c1 += 0.2;

    let c3 = MOP_TYPE_SCORES[specs.mopType as string] || 5.0;
    if (specs.mopLift === true) c3 += 0.6;
    if (specs.dockType === 'auto-wash' || specs.dockType === 'all-in-one') c3 += 0.4;

    let c7 = scoreBands(specs.runtimeMinutes as number | undefined, runtimeBands, 6.5);
    if (specs.rechargeResume === true) c7 += 0.7;

    let c10 = OBSTACLE_DETECTION_SCORES[specs.obstacleDetection as string] || 3.0;

    return {
        c1: clamp(c1),
        c2: 6.0, // Default for appTier
        c3: clamp(c3),
        c4: clamp(BRUSH_TYPE_SCORES[specs.brushType as string] || 5.8),
        c5: clamp(scoreBands(specs.heightCm as number, heightBands, 6.0)),
        c6: 6.0, // Default for partsAvailabilityBr
        c7: clamp(c7),
        c8: clamp(scoreBands(specs.noiseDb as number | undefined, noiseBands, 6.5)),
        c9: clamp(DOCK_TYPE_SCORES[specs.dockType as string] || 4.5),
        c10: clamp(c10),
    };
}

function deriveTagsFromSpecs(specs: Record<string, unknown>): RobotVacuumTags {
    return {
        hasLidar: specs.navigationType === 'lidar',
        hasVslam: specs.navigationType === 'vslam',
        hasSmartNav: specs.navigationType === 'lidar' || specs.navigationType === 'vslam',
        trueMopping: specs.mopType === 'vibrating' || specs.mopType === 'rotating',
        hasRotatingMop: specs.mopType === 'rotating',
        hasMopLift: specs.mopLift === true,
        lowProfile: (specs.heightCm as number) <= 8.5,
        ultraLowProfile: (specs.heightCm as number) <= 7.5,
        allInOneDock: specs.dockType === 'all-in-one',
        autoEmptyDock: specs.dockType === 'auto-empty' || specs.dockType === 'all-in-one',
        autoWashDock: specs.dockType === 'auto-wash' || specs.dockType === 'all-in-one',
        goodForPets: specs.brushType === 'rubber' || specs.brushType === 'anti-tangle',
        advancedAvoidance: specs.obstacleDetection === '3d-structured' || specs.obstacleDetection === 'ai-camera',
        hasAiCamera: specs.obstacleDetection === 'ai-camera',
        quiet: specs.noiseDb !== undefined && (specs.noiseDb as number) <= 60,
        longRuntime: specs.runtimeMinutes !== undefined && (specs.runtimeMinutes as number) >= 150,
        hasRechargeResume: specs.rechargeResume === true,
        hasGoodApp: specs.appTier === 'good' || specs.appTier === 'excellent',
        goodPartsBrazil: specs.partsAvailabilityBr === 'good' || specs.partsAvailabilityBr === 'abundant',
    };
}

// ============================================
// FILE PARSING (same as migrate script)
// ============================================

function extractObjectBlock(content: string, startMarker: string): string | null {
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) return null;

    let braceStart = content.indexOf('{', startIdx);
    if (braceStart === -1) return null;

    let braceCount = 0;
    let braceEnd = -1;
    for (let i = braceStart; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                braceEnd = i;
                break;
            }
        }
    }

    if (braceEnd === -1) return null;
    return content.substring(braceStart + 1, braceEnd);
}

function parseSimpleObject(content: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    const stringPairs = content.matchAll(/(\w+):\s*['"]([^'"]*)['"]/g);
    for (const match of stringPairs) {
        const [, key, value] = match;
        result[key] = value;
    }

    const numPairs = content.matchAll(/(\w+):\s*(\d+(?:\.\d+)?)[,\s\n}]/g);
    for (const match of numPairs) {
        const [, key, value] = match;
        if (!(key in result)) {
            result[key] = parseFloat(value);
        }
    }

    const boolPairs = content.matchAll(/(\w+):\s*(true|false)[,\s\n}]/g);
    for (const match of boolPairs) {
        const [, key, value] = match;
        if (!(key in result)) {
            result[key] = value === 'true';
        }
    }

    return result;
}

interface ParsedProduct {
    id: string;
    structuredSpecs: Record<string, unknown> | null;
    filePath: string;
}

function parseProductFile(filePath: string): ParsedProduct | null {
    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes("categoryId: 'robot-vacuum'") && !content.includes('categoryId: "robot-vacuum"')) {
        return null;
    }

    const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
    const id = idMatch ? idMatch[1] : path.basename(filePath).replace('products.entry.', '').replace('.ts', '');

    // Check for structuredSpecs
    const structuredSpecsBlock = extractObjectBlock(content, 'structuredSpecs:');
    const structuredSpecs = structuredSpecsBlock ? parseSimpleObject(structuredSpecsBlock) : null;

    return { id, structuredSpecs, filePath };
}

function findProductFiles(): string[] {
    const files: string[] = [];
    const allFiles = fs.readdirSync(DATA_DIR);

    for (const file of allFiles) {
        if (file.startsWith('products.entry.') && file.endsWith('.ts')) {
            files.push(path.join(DATA_DIR, file));
        }
    }

    return files;
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);
    const writeSnapshot = args.includes('--write-snapshot');

    console.log('========================================');
    console.log('Robot Vacuums QA Quality Gate');
    console.log(`Mode: ${writeSnapshot ? 'WRITE SNAPSHOT' : 'VALIDATE'}`);
    console.log('========================================\n');

    // Find and parse all robot vacuum products
    const productFiles = findProductFiles();
    const products: ParsedProduct[] = [];

    for (const filePath of productFiles) {
        const parsed = parseProductFile(filePath);
        if (parsed) {
            products.push(parsed);
        }
    }

    console.log(`Found ${products.length} robot vacuum products\n`);

    // Validate each product
    const results: ValidationResult[] = [];
    let schemaErrors = 0;
    let fallbackCount = 0;
    let noSpecsCount = 0;

    for (const product of products) {
        const result: ValidationResult = {
            productId: product.id,
            hasStructuredSpecs: product.structuredSpecs !== null,
            schemaValid: false,
            schemaErrors: [],
            isFallback: false,
            scores: null,
            tags: null,
        };

        if (!product.structuredSpecs) {
            result.schemaErrors.push('structuredSpecs not found');
            result.isFallback = true;
            noSpecsCount++;
            fallbackCount++;
        } else {
            // Validate schema
            const validation = validateSpecs(product.structuredSpecs);
            result.schemaValid = validation.valid;
            result.schemaErrors = validation.errors;

            if (!validation.valid) {
                schemaErrors++;
                result.isFallback = true;
                fallbackCount++;
            } else {
                // Compute scores and tags
                result.scores = roundScores(computeScoresFromSpecs(product.structuredSpecs));
                result.tags = deriveTagsFromSpecs(product.structuredSpecs);
                result.isFallback = false;
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
    if (schemaErrors > 0 || noSpecsCount > 0) {
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

    // Handle snapshot
    if (writeSnapshot) {
        // Generate snapshot
        const validResults = results.filter(r => r.schemaValid && r.scores && r.tags);

        const snapshot: Snapshot = {
            version: 1,
            generatedAt: new Date().toISOString(),
            productCount: validResults.length,
            items: validResults.map(r => ({
                id: r.productId,
                scores: r.scores!,
                tags: r.tags!,
            })).sort((a, b) => a.id.localeCompare(b.id)),
        };

        // Ensure directory exists
        if (!fs.existsSync(SNAPSHOT_DIR)) {
            fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
        }

        fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2), 'utf-8');
        console.log(`✅ Snapshot written to: ${SNAPSHOT_FILE}`);
        console.log(`   Products in snapshot: ${snapshot.productCount}`);

        if (fallbackCount > 0) {
            console.log(`\n⚠️  WARNING: ${fallbackCount} product(s) would use fallback!`);
            process.exit(1);
        }

        process.exit(0);
    }

    // Validate mode: compare with snapshot
    if (!fs.existsSync(SNAPSHOT_FILE)) {
        console.log('❌ Snapshot file not found!');
        console.log('   Run with --write-snapshot to generate it first.');
        console.log(`   Expected: ${SNAPSHOT_FILE}`);
        process.exit(1);
    }

    const snapshot: Snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'));
    console.log(`--- SNAPSHOT COMPARISON (v${snapshot.version}) ---`);
    console.log(`Snapshot products: ${snapshot.productCount}`);
    console.log(`Current products: ${products.length}`);
    console.log('');

    // Compare
    const diffs: DiffItem[] = [];
    const snapshotMap = new Map(snapshot.items.map(item => [item.id, item]));
    const currentMap = new Map(results.filter(r => r.scores).map(r => [r.productId, r]));

    // Check for missing/added products
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

    // Compare scores and tags
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
        console.log('   - Schema: OK');
        console.log('   - Fallback: 0');
        console.log('   - Snapshot: 0 diffs');
        process.exit(0);
    }

    // Print diffs
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
        console.log('   npx tsx scripts/qa-robot-vacuums.ts --write-snapshot');
    }

    process.exit(1);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
