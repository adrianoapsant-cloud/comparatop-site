#!/usr/bin/env npx ts-node
/**
 * Robot Vacuum Specs Migration Script
 * 
 * Migrates legacy product data to structured specs
 * 
 * Usage:
 *   npx ts-node scripts/migrate-robot-vacuum-specs.ts --dry-run  # Preview changes
 *   npx ts-node scripts/migrate-robot-vacuum-specs.ts --write    # Apply changes
 * 
 * Output:
 *   migrationReports/robot-vacuums-specs-report.json
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES (inline to avoid import issues)
// ============================================

interface RobotVacuumSpecs {
    navigationType: 'random' | 'gyro' | 'vslam' | 'lidar';
    mopType: 'none' | 'static' | 'vibrating' | 'rotating';
    brushType: 'suction-only' | 'bristle' | 'rubber' | 'anti-tangle';
    dockType: 'basic' | 'auto-empty' | 'auto-wash' | 'all-in-one';
    obstacleDetection: 'bump-only' | 'infrared' | '3d-structured' | 'ai-camera';
    heightCm: number;
    noiseDb?: number;
    runtimeMinutes?: number;
    batteryMah?: number;
    rechargeResume?: boolean;
    mopLift?: boolean;
    appTier?: 'none' | 'basic' | 'advanced';
    mapFeatures?: {
        noGoZones?: boolean;
        multiFloor?: boolean;
        roomNaming?: boolean;
    };
}

interface MigrationResult {
    productId: string;
    filePath: string;
    status: 'already-migrated' | 'migrated' | 'failed' | 'dry-run';
    inferredCount: number;
    missingFields: string[];
    usedDefaults: string[];
    errors: string[];
    specs?: Partial<RobotVacuumSpecs>;
}

interface MigrationReport {
    timestamp: string;
    mode: 'dry-run' | 'write';
    totalProducts: number;
    alreadyHadSpecs: number;
    migrated: number;
    failedValidation: number;
    usedFallbackDefaultsCount: Record<string, number>;
    missingByField: Record<string, number>;
    examples: MigrationResult[];
}

// ============================================
// DEFAULTS (same as legacyMapper)
// ============================================

const FALLBACK_SPECS: RobotVacuumSpecs = {
    navigationType: 'gyro',
    mopType: 'static',
    brushType: 'bristle',
    dockType: 'basic',
    obstacleDetection: 'bump-only',
    heightCm: 9.5,
};

// ============================================
// HELPERS
// ============================================

function safeString(...sources: unknown[]): string {
    for (const source of sources) {
        if (typeof source === 'string' && source.trim()) {
            return source.toLowerCase().trim();
        }
    }
    return '';
}

function safeNumber(...sources: unknown[]): number | undefined {
    for (const source of sources) {
        if (typeof source === 'number' && !isNaN(source) && source > 0) {
            return source;
        }
        if (typeof source === 'string') {
            const parsed = parseFloat(source);
            if (!isNaN(parsed) && parsed > 0) return parsed;
        }
    }
    return undefined;
}

// ============================================
// INFERENCE (same as legacyMapper)
// ============================================

type LegacyProduct = {
    id?: string;
    categoryId?: string;
    specs?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
    technicalSpecs?: Record<string, unknown>;
    productDimensions?: { height?: number };
};

function inferNavigationType(p: LegacyProduct): RobotVacuumSpecs['navigationType'] | undefined {
    const sources = [
        p.attributes?.navigationType,
        p.technicalSpecs?.navigation,
        p.technicalSpecs?.navigationType,
        p.specs?.navigationType,
    ];
    const str = safeString(...sources);

    if (str.includes('lidar')) return 'lidar';
    if (str.includes('vslam') || str.includes('câmera') || str.includes('camera')) return 'vslam';
    if (str.includes('giroscóp') || str.includes('gyro') || str.includes('giroscop')) return 'gyro';
    if (str.includes('aleatória') || str.includes('aleator') || str.includes('random')) return 'random';

    if (p.technicalSpecs?.lidar === true) return 'lidar';
    if (p.technicalSpecs?.camera === true && p.technicalSpecs?.lidar !== true) return 'vslam';

    return undefined;
}

function inferMopType(p: LegacyProduct): RobotVacuumSpecs['mopType'] | undefined {
    const sources = [
        p.attributes?.mopType,
        p.technicalSpecs?.mopType,
        p.specs?.mopType,
    ];
    const str = safeString(...sources);

    if (str.includes('rotativ') || str.includes('dual mop') || str.includes('rotating')) return 'rotating';
    if (str.includes('vibra') || str.includes('sonic')) return 'vibrating';
    if (str.includes('pano') || str.includes('arrasto') || str.includes('static') || str.includes('microfibra')) return 'static';
    if (p.attributes?.hasMop === false || p.technicalSpecs?.hasMop === false) return 'none';
    if (p.attributes?.hasMop === true) return 'static';

    return undefined;
}

function inferBrushType(p: LegacyProduct): RobotVacuumSpecs['brushType'] | undefined {
    const sources = [
        p.attributes?.brushType,
        p.technicalSpecs?.brushType,
        p.specs?.brushType,
    ];
    const str = safeString(...sources);

    // Exact enum value matches first
    if (str === 'anti-tangle') return 'anti-tangle';
    if (str === 'rubber') return 'rubber';
    if (str === 'bristle') return 'bristle';
    if (str === 'suction-only') return 'suction-only';

    // Keyword-based detection
    if (str.includes('suction-only') || str.includes('sucção direta') || str.includes('sem escova')) return 'suction-only';
    if (str.includes('anti') || str.includes('tangle') || str.includes('emaranhamento') || str.includes('zero-tangle')) return 'anti-tangle';
    if (str.includes('rubber') || str.includes('borracha') || str.includes('silicone')) return 'rubber';
    if (str.includes('single') || str.includes('escova') || str.includes('bristle')) return 'bristle';

    return undefined;
}

function inferDockType(p: LegacyProduct): RobotVacuumSpecs['dockType'] | undefined {
    const sources = [
        p.attributes?.dockType,
        p.technicalSpecs?.dockType,
        p.specs?.dockType,
    ];
    const str = safeString(...sources);

    // Exact enum value matches first
    if (str === 'all-in-one') return 'all-in-one';
    if (str === 'auto-wash') return 'auto-wash';
    if (str === 'auto-empty') return 'auto-empty';
    if (str === 'basic') return 'basic';

    // Keyword-based detection
    if (str.includes('all-in-one') || str.includes('all in one') || str.includes('completo')) return 'all-in-one';
    if (str.includes('lava') || str.includes('wash') || str.includes('auto mop')) return 'auto-wash';
    if (str.includes('autoesvaz') || str.includes('auto-esvaz') || str.includes('auto-empty')) return 'auto-empty';
    if (str.includes('sem dock') || str.includes('manual')) return 'basic';

    const hasAutoEmpty = p.attributes?.hasAutoEmpty || p.technicalSpecs?.autoEmpty;
    const hasAutoMopWash = p.technicalSpecs?.autoMopWash;

    if (hasAutoEmpty && hasAutoMopWash) return 'all-in-one';
    if (hasAutoMopWash) return 'auto-wash';
    if (hasAutoEmpty) return 'auto-empty';

    return undefined;
}

function inferObstacleDetection(p: LegacyProduct): RobotVacuumSpecs['obstacleDetection'] | undefined {
    const sources = [
        p.technicalSpecs?.obstacleDetection,
        p.specs?.obstacleDetection,
    ];
    const str = safeString(...sources);

    // Exact enum value matches first
    if (str === 'ai-camera') return 'ai-camera';
    if (str === '3d-structured') return '3d-structured';
    if (str === 'infrared') return 'infrared';
    if (str === 'bump-only') return 'bump-only';

    // Keyword-based detection
    if (str.includes('ai') || str.includes('ia') || str.includes('câmera') || str.includes('camera')) return 'ai-camera';
    if (str.includes('3d') || str.includes('estruturad')) return '3d-structured';
    if (str.includes('infravermelho') || str.includes('infra')) return 'infrared';
    if (str.includes('impacto') || str.includes('bump') || str.includes('sensor')) return 'bump-only';

    return undefined;
}

function inferHeightCm(p: LegacyProduct): number | undefined {
    const height = safeNumber(
        p.productDimensions?.height,
        p.technicalSpecs?.height,
        p.specs?.height,
    );
    if (height !== undefined) {
        return height > 50 ? height / 10 : height;
    }
    return undefined;
}

function inferSpecs(p: LegacyProduct): { specs: Partial<RobotVacuumSpecs>; missingFields: string[] } {
    const specs: Partial<RobotVacuumSpecs> = {};
    const missingFields: string[] = [];

    const nav = inferNavigationType(p);
    if (nav) specs.navigationType = nav; else missingFields.push('navigationType');

    const mop = inferMopType(p);
    if (mop) specs.mopType = mop; else missingFields.push('mopType');

    const brush = inferBrushType(p);
    if (brush) specs.brushType = brush; else missingFields.push('brushType');

    const dock = inferDockType(p);
    if (dock) specs.dockType = dock; else missingFields.push('dockType');

    const obstacle = inferObstacleDetection(p);
    if (obstacle) specs.obstacleDetection = obstacle; else missingFields.push('obstacleDetection');

    const height = inferHeightCm(p);
    if (height !== undefined) specs.heightCm = height; else missingFields.push('heightCm');

    // Optional fields
    const noise = safeNumber(p.technicalSpecs?.noiseLevel, p.specs?.noiseLevel);
    if (noise !== undefined) specs.noiseDb = noise;

    const runtime = safeNumber(p.attributes?.runtimeMinutes, p.technicalSpecs?.runtimeMinutes);
    if (runtime !== undefined) specs.runtimeMinutes = runtime;

    const battery = safeNumber(p.attributes?.batteryMah, p.technicalSpecs?.batteryCapacity);
    if (battery !== undefined) specs.batteryMah = battery;

    return { specs, missingFields };
}

function mergeWithDefaults(inferred: Partial<RobotVacuumSpecs>): { specs: RobotVacuumSpecs; usedDefaults: string[] } {
    const usedDefaults: string[] = [];
    const merged = { ...FALLBACK_SPECS };

    // Only fill in fields not already inferred
    if (inferred.navigationType) merged.navigationType = inferred.navigationType; else usedDefaults.push('navigationType');
    if (inferred.mopType) merged.mopType = inferred.mopType; else usedDefaults.push('mopType');
    if (inferred.brushType) merged.brushType = inferred.brushType; else usedDefaults.push('brushType');
    if (inferred.dockType) merged.dockType = inferred.dockType; else usedDefaults.push('dockType');
    if (inferred.obstacleDetection) merged.obstacleDetection = inferred.obstacleDetection; else usedDefaults.push('obstacleDetection');
    if (inferred.heightCm !== undefined) merged.heightCm = inferred.heightCm; else usedDefaults.push('heightCm');

    // Optional fields
    if (inferred.noiseDb !== undefined) merged.noiseDb = inferred.noiseDb;
    if (inferred.runtimeMinutes !== undefined) merged.runtimeMinutes = inferred.runtimeMinutes;
    if (inferred.batteryMah !== undefined) merged.batteryMah = inferred.batteryMah;

    return { specs: merged, usedDefaults };
}

// ============================================
// PRODUCT FILE HANDLING
// ============================================

function hasValidStructuredSpecs(specs: Record<string, unknown> | undefined): boolean {
    if (!specs) return false;
    const validNavTypes = ['random', 'gyro', 'vslam', 'lidar'];
    const validMopTypes = ['none', 'static', 'vibrating', 'rotating'];
    const validBrushTypes = ['bristle', 'rubber', 'anti-tangle'];
    const validDockTypes = ['basic', 'auto-empty', 'auto-wash', 'all-in-one'];
    const validObstacleTypes = ['bump-only', 'infrared', '3d-structured', 'ai-camera'];

    if (!validNavTypes.includes(specs.navigationType as string)) return false;
    if (!validMopTypes.includes(specs.mopType as string)) return false;
    if (!validBrushTypes.includes(specs.brushType as string)) return false;
    if (!validDockTypes.includes(specs.dockType as string)) return false;
    if (!validObstacleTypes.includes(specs.obstacleDetection as string)) return false;
    if (typeof specs.heightCm !== 'number') return false;

    return true;
}

function findProductFiles(dataDir: string): string[] {
    const files: string[] = [];

    // Find all .ts files in the data directory
    const allFiles = fs.readdirSync(dataDir);

    for (const file of allFiles) {
        if (file.startsWith('products.entry.') && file.endsWith('.ts')) {
            files.push(path.join(dataDir, file));
        }
    }

    return files;
}

function parseProductFile(filePath: string): { product: LegacyProduct; exportName: string } | null {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if it's a robot vacuum
    if (!content.includes("categoryId: 'robot-vacuum'") && !content.includes('categoryId: "robot-vacuum"')) {
        return null;
    }

    // Extract product ID
    const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
    const id = idMatch ? idMatch[1] : path.basename(filePath).replace('products.entry.', '').replace('.ts', '');

    // Extract export name
    const exportMatch = content.match(/export\s+const\s+(\w+)/);
    const exportName = exportMatch ? exportMatch[1] : 'product';

    // Parse key fields manually (avoid eval/import issues)
    const product: LegacyProduct = { id };

    // Extract specs block content (handling nested objects)
    const specsBlock = extractObjectBlock(content, 'specs:');
    if (specsBlock) {
        product.specs = parseSimpleObject(specsBlock);
    }

    // Extract attributes block content (handling nested objects)  
    const attrsBlock = extractObjectBlock(content, 'attributes:');
    if (attrsBlock) {
        product.attributes = parseSimpleObject(attrsBlock);
    }

    // Extract technicalSpecs block content (handling nested objects)
    const techBlock = extractObjectBlock(content, 'technicalSpecs:');
    if (techBlock) {
        product.technicalSpecs = parseSimpleObject(techBlock);
    }

    // Extract productDimensions
    const dimBlock = extractObjectBlock(content, 'productDimensions:');
    if (dimBlock) {
        const dims = parseSimpleObject(dimBlock);
        if (dims.height !== undefined) {
            product.productDimensions = { height: dims.height as number };
        }
    }

    return { product, exportName };
}

/**
 * Extract the content of an object block by counting braces
 * This handles nested objects properly
 */
function extractObjectBlock(content: string, startMarker: string): string | null {
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) return null;

    // Find opening brace
    let braceStart = content.indexOf('{', startIdx);
    if (braceStart === -1) return null;

    // Count braces to find matching closing brace
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

    // Match key: 'value' or key: "value" or key: number patterns
    // This regex matches quoted strings properly
    const stringPairs = content.matchAll(/(\w+):\s*['"]([^'"]*)['"]/g);
    for (const match of stringPairs) {
        const [, key, value] = match;
        result[key] = value;
    }

    // Match key: number patterns
    const numPairs = content.matchAll(/(\w+):\s*(\d+(?:\.\d+)?)[,\s\n}]/g);
    for (const match of numPairs) {
        const [, key, value] = match;
        if (!(key in result)) { // Don't overwrite strings
            result[key] = parseFloat(value);
        }
    }

    // Match key: true/false patterns
    const boolPairs = content.matchAll(/(\w+):\s*(true|false)[,\s\n}]/g);
    for (const match of boolPairs) {
        const [, key, value] = match;
        if (!(key in result)) {
            result[key] = value === 'true';
        }
    }

    return result;
}


function generateSpecsBlock(specs: RobotVacuumSpecs): string {
    const lines = [
        `    // Structured specs for scoring module`,
        `    structuredSpecs: {`,
        `        navigationType: '${specs.navigationType}',`,
        `        mopType: '${specs.mopType}',`,
        `        brushType: '${specs.brushType}',`,
        `        dockType: '${specs.dockType}',`,
        `        obstacleDetection: '${specs.obstacleDetection}',`,
        `        heightCm: ${specs.heightCm},`,
    ];

    if (specs.noiseDb !== undefined) {
        lines.push(`        noiseDb: ${specs.noiseDb},`);
    }
    if (specs.runtimeMinutes !== undefined) {
        lines.push(`        runtimeMinutes: ${specs.runtimeMinutes},`);
    }
    if (specs.batteryMah !== undefined) {
        lines.push(`        batteryMah: ${specs.batteryMah},`);
    }

    lines.push(`    },`);

    return lines.join('\n');
}

function writeSpecsToFile(filePath: string, specs: RobotVacuumSpecs): boolean {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');

        // Check if structuredSpecs already exists
        if (content.includes('structuredSpecs:')) {
            console.log(`  [SKIP] structuredSpecs already exists in ${filePath}`);
            return false;
        }

        // Find a good insertion point (after 'specs:' block)
        const specsBlockEnd = content.indexOf('specs:');
        if (specsBlockEnd === -1) {
            console.log(`  [ERROR] Could not find specs: block in ${filePath}`);
            return false;
        }

        // Find the end of the specs block (matching closing brace)
        let braceCount = 0;
        let insertPos = specsBlockEnd;
        for (let i = specsBlockEnd; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    insertPos = i + 1;
                    break;
                }
            }
        }

        // Find the next line break for clean insertion
        const nextNewline = content.indexOf('\n', insertPos);
        if (nextNewline !== -1) {
            insertPos = nextNewline + 1;
        }

        // Insert the structuredSpecs block
        const specsBlock = generateSpecsBlock(specs);
        content = content.slice(0, insertPos) + '\n' + specsBlock + '\n' + content.slice(insertPos);

        fs.writeFileSync(filePath, content, 'utf-8');
        return true;
    } catch (error) {
        console.error(`  [ERROR] Failed to write to ${filePath}:`, error);
        return false;
    }
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--write');
    const dataDir = path.resolve(__dirname, '../src/data');
    const reportDir = path.resolve(__dirname, '../migrationReports');

    console.log('========================================');
    console.log('Robot Vacuum Specs Migration');
    console.log(`Mode: ${isDryRun ? 'DRY-RUN (no changes)' : 'WRITE (applying changes)'}`);
    console.log(`Data dir: ${dataDir}`);
    console.log('========================================\n');

    // Ensure report directory exists
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    // Find product files
    const productFiles = findProductFiles(dataDir);
    console.log(`Found ${productFiles.length} product entry files\n`);

    const results: MigrationResult[] = [];
    const fieldUsedDefaults: Record<string, number> = {};
    const fieldMissing: Record<string, number> = {};

    for (const filePath of productFiles) {
        const parsed = parseProductFile(filePath);
        if (!parsed) continue;

        const { product, exportName } = parsed;
        console.log(`Processing: ${product.id} (${exportName})`);

        // Check if already has structured specs
        if (hasValidStructuredSpecs(product.specs)) {
            console.log(`  [ALREADY MIGRATED] Has valid structuredSpecs`);
            results.push({
                productId: product.id || 'unknown',
                filePath,
                status: 'already-migrated',
                inferredCount: 0,
                missingFields: [],
                usedDefaults: [],
                errors: [],
            });
            continue;
        }

        // Infer specs
        const { specs: inferredSpecs, missingFields } = inferSpecs(product);
        const { specs: finalSpecs, usedDefaults } = mergeWithDefaults(inferredSpecs);

        // Track statistics
        for (const field of usedDefaults) {
            fieldUsedDefaults[field] = (fieldUsedDefaults[field] || 0) + 1;
        }
        for (const field of missingFields) {
            fieldMissing[field] = (fieldMissing[field] || 0) + 1;
        }

        console.log(`  Inferred: ${Object.keys(inferredSpecs).length} fields`);
        console.log(`  Missing: ${missingFields.join(', ') || 'none'}`);
        console.log(`  Used defaults: ${usedDefaults.join(', ') || 'none'}`);

        if (isDryRun) {
            console.log(`  [DRY-RUN] Would write:`, finalSpecs);
            results.push({
                productId: product.id || 'unknown',
                filePath,
                status: 'dry-run',
                inferredCount: Object.keys(inferredSpecs).length,
                missingFields,
                usedDefaults,
                errors: [],
                specs: finalSpecs,
            });
        } else {
            const success = writeSpecsToFile(filePath, finalSpecs);
            results.push({
                productId: product.id || 'unknown',
                filePath,
                status: success ? 'migrated' : 'failed',
                inferredCount: Object.keys(inferredSpecs).length,
                missingFields,
                usedDefaults,
                errors: success ? [] : ['Failed to write file'],
                specs: finalSpecs,
            });
            console.log(`  [${success ? 'MIGRATED' : 'FAILED'}]`);
        }
    }

    // Generate report
    const alreadyMigrated = results.filter(r => r.status === 'already-migrated').length;
    const migrated = results.filter(r => r.status === 'migrated' || r.status === 'dry-run').length;
    const failed = results.filter(r => r.status === 'failed').length;

    const report: MigrationReport = {
        timestamp: new Date().toISOString(),
        mode: isDryRun ? 'dry-run' : 'write',
        totalProducts: results.length,
        alreadyHadSpecs: alreadyMigrated,
        migrated,
        failedValidation: failed,
        usedFallbackDefaultsCount: fieldUsedDefaults,
        missingByField: fieldMissing,
        examples: results.slice(0, 10),
    };

    const reportPath = path.join(reportDir, 'robot-vacuums-specs-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    console.log('\n========================================');
    console.log('MIGRATION SUMMARY');
    console.log('========================================');
    console.log(`Total products: ${results.length}`);
    console.log(`Already migrated: ${alreadyMigrated}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Failed: ${failed}`);
    console.log(`\nReport saved to: ${reportPath}`);
    console.log('========================================\n');

    if (isDryRun) {
        console.log('This was a DRY-RUN. No files were modified.');
        console.log('Run with --write to apply changes.');
    }
}

main().catch(console.error);
