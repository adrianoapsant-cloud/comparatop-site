#!/usr/bin/env npx tsx
/**
 * @file debug-pdp-vm-diff.ts
 * @description Compara ViewModel de dois produtos para identificar onde dados se perdem
 * 
 * Usage: npx tsx scripts/debug-pdp-vm-diff.ts --product1 roborock-q7-l5 --product2 mondial-afn-80-bi
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface MockData {
    product?: Record<string, unknown>;
    header?: Record<string, unknown>;
    auditVerdict?: Record<string, unknown>;
    productDna?: Record<string, unknown>;
    simulators?: Record<string, unknown>;
    decisionFAQ?: unknown[];
    tco?: Record<string, unknown>;
    repairability?: Record<string, unknown>;
    unknownUnknowns?: unknown[];
    communityConsensus?: Record<string, unknown>;
    curiositySandwich?: Record<string, unknown>;
    manualUrl?: string;
}

interface UnifiedVoiceCache {
    productId: string;
    generatedAt: string;
    source: string;
    communityConsensus?: Record<string, unknown>;
    curiositySandwich?: Record<string, unknown>;
}

interface ModuleStatus {
    present: boolean;
    sourceLayer: 'mock' | 'unified-voice-cache' | 'unknown-unknowns' | 'shadow-engine' | 'generated' | 'missing';
    keyFieldsNonEmpty: boolean;
    missingFields: string[];
}

interface ViewModelComparison {
    moduleName: string;
    product1: ModuleStatus;
    product2: ModuleStatus;
}

// ============================================
// DATA LOADERS
// ============================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MOCKS_DIR = path.join(PROJECT_ROOT, 'src/data/mocks');
const UV_CACHE_DIR = path.join(PROJECT_ROOT, 'src/data/unified-voice-cache');
const UU_DATA_PATH = path.join(PROJECT_ROOT, 'src/data/unknown-unknowns-data.ts');

function loadMock(productId: string): MockData | null {
    const mockPath = path.join(MOCKS_DIR, `${productId}.json`);
    try {
        if (!fs.existsSync(mockPath)) return null;
        return JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    } catch {
        return null;
    }
}

function loadUnifiedVoiceCache(productId: string): UnifiedVoiceCache | null {
    const cachePath = path.join(UV_CACHE_DIR, `${productId}.json`);
    try {
        if (!fs.existsSync(cachePath)) return null;
        return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch {
        return null;
    }
}

function hasUnknownUnknowns(productId: string): boolean {
    try {
        const content = fs.readFileSync(UU_DATA_PATH, 'utf-8');
        return content.includes(`'${productId}'`) || content.includes(`"${productId}"`);
    } catch {
        return false;
    }
}

// ============================================
// MODULE ANALYZERS
// ============================================

function analyzeModule(
    moduleName: string,
    mock: MockData | null,
    uvCache: UnifiedVoiceCache | null,
    hasUU: boolean
): ModuleStatus {
    const result: ModuleStatus = {
        present: false,
        sourceLayer: 'missing',
        keyFieldsNonEmpty: false,
        missingFields: [],
    };

    switch (moduleName) {
        case 'header':
            if (mock?.header) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = !!(mock.header.title && mock.header.overallScore);
                if (!mock.header.title) result.missingFields.push('header.title');
                if (!mock.header.overallScore) result.missingFields.push('header.overallScore');
                if (!mock.header.badges) result.missingFields.push('header.badges');
            }
            break;

        case 'auditVerdict':
            if (mock?.auditVerdict) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = !!(
                    mock.auditVerdict.solution &&
                    mock.auditVerdict.attentionPoint &&
                    mock.auditVerdict.technicalConclusion
                );
                if (!mock.auditVerdict.solution) result.missingFields.push('auditVerdict.solution');
                if (!mock.auditVerdict.attentionPoint) result.missingFields.push('auditVerdict.attentionPoint');
                if (!mock.auditVerdict.dontBuyIf) result.missingFields.push('auditVerdict.dontBuyIf');
            }
            break;

        case 'productDna':
            if (mock?.productDna) {
                result.present = true;
                result.sourceLayer = 'mock';
                const dims = mock.productDna.dimensions as unknown[] | undefined;
                result.keyFieldsNonEmpty = !!(dims && dims.length >= 5);
                if (!dims || dims.length < 10) result.missingFields.push(`productDna.dimensions (got ${dims?.length || 0}/10)`);
            }
            break;

        case 'simulators':
            if (mock?.simulators) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = !!(
                    mock.simulators.sizeAlert ||
                    mock.simulators.soundAlert ||
                    mock.simulators.energyAlert
                );
                if (!mock.simulators.sizeAlert) result.missingFields.push('simulators.sizeAlert');
                if (!mock.simulators.soundAlert) result.missingFields.push('simulators.soundAlert');
                if (!mock.simulators.energyAlert) result.missingFields.push('simulators.energyAlert');
            }
            break;

        case 'decisionFAQ':
            if (mock?.decisionFAQ && Array.isArray(mock.decisionFAQ)) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = mock.decisionFAQ.length >= 3;
                if (mock.decisionFAQ.length < 4) result.missingFields.push(`decisionFAQ (got ${mock.decisionFAQ.length}/4+)`);
            }
            break;

        case 'communityConsensus':
            // Priority: Unified Voice Cache > Mock
            if (uvCache?.communityConsensus) {
                result.present = true;
                result.sourceLayer = 'unified-voice-cache';
                const cc = uvCache.communityConsensus;
                result.keyFieldsNonEmpty = !!(
                    cc.rating &&
                    cc.totalReviews &&
                    cc.bullets
                );
                if (!cc.rating) result.missingFields.push('communityConsensus.rating');
                if (!cc.bullets) result.missingFields.push('communityConsensus.bullets');
                if (!cc.topPraise) result.missingFields.push('communityConsensus.topPraise');
            } else if (mock?.communityConsensus) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = true;
            }
            break;

        case 'curiositySandwich':
            // Priority: Unified Voice Cache > Mock
            if (uvCache?.curiositySandwich) {
                result.present = true;
                result.sourceLayer = 'unified-voice-cache';
                const cs = uvCache.curiositySandwich;
                result.keyFieldsNonEmpty = !!(cs.hook && cs.insight);
                if (!cs.hook) result.missingFields.push('curiositySandwich.hook');
                if (!cs.insight) result.missingFields.push('curiositySandwich.insight');
            } else if (mock?.curiositySandwich) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = true;
            }
            break;

        case 'unknownUnknowns':
            if (hasUU) {
                result.present = true;
                result.sourceLayer = 'unknown-unknowns';
                result.keyFieldsNonEmpty = true;
            } else if (mock?.unknownUnknowns) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = (mock.unknownUnknowns as unknown[]).length >= 5;
            }
            break;

        case 'tco':
            if (mock?.tco) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = !!(mock.tco.monthlyEnergyCost || mock.tco.totalCost5Years);
            } else {
                // TCO is generated by shadow-engine at runtime
                result.present = true;
                result.sourceLayer = 'generated';
                result.keyFieldsNonEmpty = true;
                result.missingFields.push('tco (generated at runtime - check shadow-engine mapping)');
            }
            break;

        case 'repairability':
            if (mock?.repairability) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = !!(mock.repairability.score || mock.repairability.index);
            } else {
                result.sourceLayer = 'shadow-engine';
                result.missingFields.push('repairability (requires shadow-engine component mapping)');
            }
            break;

        case 'manualUrl':
            if (mock?.manualUrl) {
                result.present = true;
                result.sourceLayer = 'mock';
                result.keyFieldsNonEmpty = mock.manualUrl.startsWith('http');
            }
            break;
    }

    return result;
}

// ============================================
// MAIN COMPARISON
// ============================================

function compareViewModels(productId1: string, productId2: string): void {
    console.log('\n' + '='.repeat(80));
    console.log('🔬 PDP ViewModel Diff - Part B');
    console.log('='.repeat(80));
    console.log(`\nComparing: ${productId1} (gold) vs ${productId2} (broken)\n`);

    const mock1 = loadMock(productId1);
    const mock2 = loadMock(productId2);
    const uv1 = loadUnifiedVoiceCache(productId1);
    const uv2 = loadUnifiedVoiceCache(productId2);
    const hasUU1 = hasUnknownUnknowns(productId1);
    const hasUU2 = hasUnknownUnknowns(productId2);

    // Status check
    console.log('📁 Data Sources Status:');
    console.log(`  ${productId1}:`);
    console.log(`    Mock: ${mock1 ? '✅' : '❌'}`);
    console.log(`    UV Cache: ${uv1 ? '✅' : '❌'}`);
    console.log(`    UU Data: ${hasUU1 ? '✅' : '❌'}`);
    console.log(`  ${productId2}:`);
    console.log(`    Mock: ${mock2 ? '✅' : '❌'}`);
    console.log(`    UV Cache: ${uv2 ? '✅' : '❌'}`);
    console.log(`    UU Data: ${hasUU2 ? '✅' : '❌'}`);
    console.log();

    // Modules to compare
    const modules = [
        'header',
        'auditVerdict',
        'productDna',
        'communityConsensus',
        'curiositySandwich',
        'simulators',
        'decisionFAQ',
        'unknownUnknowns',
        'tco',
        'repairability',
        'manualUrl',
    ];

    const comparisons: ViewModelComparison[] = modules.map(moduleName => ({
        moduleName,
        product1: analyzeModule(moduleName, mock1, uv1, hasUU1),
        product2: analyzeModule(moduleName, mock2, uv2, hasUU2),
    }));

    // Print comparison table
    console.log('┌' + '─'.repeat(25) + '┬' + '─'.repeat(25) + '┬' + '─'.repeat(25) + '┐');
    console.log(`│ ${'Module'.padEnd(23)} │ ${productId1.slice(0, 23).padEnd(23)} │ ${productId2.slice(0, 23).padEnd(23)} │`);
    console.log('├' + '─'.repeat(25) + '┼' + '─'.repeat(25) + '┼' + '─'.repeat(25) + '┤');

    comparisons.forEach(({ moduleName, product1, product2 }) => {
        const status1 = product1.present
            ? (product1.keyFieldsNonEmpty ? '✅ ' + product1.sourceLayer : '⚠️ ' + product1.sourceLayer)
            : '❌ missing';
        const status2 = product2.present
            ? (product2.keyFieldsNonEmpty ? '✅ ' + product2.sourceLayer : '⚠️ ' + product2.sourceLayer)
            : '❌ missing';

        console.log(`│ ${moduleName.padEnd(23)} │ ${status1.padEnd(23)} │ ${status2.padEnd(23)} │`);
    });

    console.log('└' + '─'.repeat(25) + '┴' + '─'.repeat(25) + '┴' + '─'.repeat(25) + '┘');

    // Top 10 missing fields
    console.log('\n📋 Top Missing Fields in', productId2, '(vs', productId1 + '):');
    const allMissing: string[] = [];
    comparisons.forEach(({ moduleName, product1, product2 }) => {
        if (product1.present && !product2.present) {
            allMissing.push(`${moduleName} (entire module missing)`);
        }
        if (product2.missingFields.length > 0) {
            allMissing.push(...product2.missingFields);
        }
    });

    if (allMissing.length === 0) {
        console.log('  ✅ No critical missing fields detected!');
    } else {
        allMissing.slice(0, 10).forEach((field, idx) => {
            console.log(`  ${idx + 1}. ${field}`);
        });
    }

    // Summary
    console.log('\n' + '─'.repeat(80));
    console.log('📊 SUMMARY:');
    const p2Missing = comparisons.filter(c => !c.product2.present && c.product1.present);
    const p2Incomplete = comparisons.filter(c => c.product2.present && !c.product2.keyFieldsNonEmpty && c.product1.keyFieldsNonEmpty);

    if (p2Missing.length > 0) {
        console.log(`  ❌ Modules missing in ${productId2}: ${p2Missing.map(c => c.moduleName).join(', ')}`);
    }
    if (p2Incomplete.length > 0) {
        console.log(`  ⚠️ Modules incomplete in ${productId2}: ${p2Incomplete.map(c => c.moduleName).join(', ')}`);
    }
    if (p2Missing.length === 0 && p2Incomplete.length === 0) {
        console.log('  ✅ All modules have data! Check UI wiring if components still missing.');
    }

    console.log('─'.repeat(80));
    console.log();
}

// ============================================
// CLI
// ============================================

const args = process.argv.slice(2);
let product1 = 'roborock-q7-l5';
let product2 = 'mondial-afn-80-bi';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--product1' && args[i + 1]) product1 = args[i + 1];
    if (args[i] === '--product2' && args[i + 1]) product2 = args[i + 1];
}

compareViewModels(product1, product2);
