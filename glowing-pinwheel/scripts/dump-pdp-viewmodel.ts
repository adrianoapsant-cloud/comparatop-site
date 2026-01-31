/**
 * @file dump-pdp-viewmodel.ts
 * @description Debug script to dump PDP ViewModel status for products
 * 
 * Usage: npx ts-node --transpile-only scripts/dump-pdp-viewmodel.ts
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Import from source files
const MOCKS_DIR = path.resolve(__dirname, '../src/data/mocks');

interface SectionStatus {
    id: string;
    name: string;
    state: 'available' | 'not_available' | 'missing';
    source: 'Mock' | 'UnknownUnknowns' | 'UnifiedVoice' | 'ShadowEngine' | 'Generated';
    reason?: string;
    itemCount?: number;
    missingFields?: string[];
}

interface ModuleMap {
    [key: string]: SectionStatus;
}

// ============================================
// LOAD MOCK DATA
// ============================================

function loadMock(productId: string): Record<string, unknown> | null {
    const mockPath = path.join(MOCKS_DIR, `${productId}.json`);
    if (!fs.existsSync(mockPath)) {
        console.log(`❌ Mock not found: ${mockPath}`);
        return null;
    }

    const content = fs.readFileSync(mockPath, 'utf-8');
    return JSON.parse(content);
}

// ============================================
// ANALYZE PDP MODULES
// ============================================

function analyzePdpModules(productId: string, mockData: Record<string, unknown> | null): ModuleMap {
    const modules: ModuleMap = {};

    // Layer 1: Mock JSON sections
    const mockSections = [
        { id: 'product', name: 'Product Info', key: 'product' },
        { id: 'header', name: 'Header/Score', key: 'header' },
        { id: 'auditVerdict', name: 'Audit Verdict', key: 'auditVerdict' },
        { id: 'productDna', name: 'Product DNA (Radar)', key: 'productDna' },
        { id: 'simulators', name: 'Simulators', key: 'simulators' },
        { id: 'decisionFAQ', name: 'Decision FAQ', key: 'decisionFAQ' },
    ];

    for (const section of mockSections) {
        const data = mockData?.[section.key];
        const missingFields: string[] = [];

        if (!data) {
            modules[section.id] = {
                id: section.id,
                name: section.name,
                state: mockData ? 'not_available' : 'missing',
                source: 'Mock',
                reason: mockData ? `Key "${section.key}" not in mock` : 'Mock file not found',
            };
        } else {
            // Validate content
            if (section.key === 'productDna') {
                const dna = data as { dimensions?: unknown[] };
                if (!dna.dimensions || !Array.isArray(dna.dimensions)) {
                    missingFields.push('dimensions array');
                } else if (dna.dimensions.length < 10) {
                    missingFields.push(`dimensions (only ${dna.dimensions.length}, need 10)`);
                }
            }

            if (section.key === 'decisionFAQ') {
                const faq = data as unknown[];
                if (!Array.isArray(faq) || faq.length === 0) {
                    missingFields.push('FAQ items');
                }
            }

            if (section.key === 'simulators') {
                const sim = data as Record<string, unknown>;
                if (!sim.sizeAlert && !sim.soundAlert && !sim.energyAlert) {
                    missingFields.push('at least one alert type');
                }
            }

            modules[section.id] = {
                id: section.id,
                name: section.name,
                state: missingFields.length > 0 ? 'not_available' : 'available',
                source: 'Mock',
                reason: missingFields.length > 0 ? missingFields.join(', ') : undefined,
                missingFields: missingFields.length > 0 ? missingFields : undefined,
            };
        }
    }

    // Get category from mock
    const categoryId = (mockData?.product as Record<string, unknown>)?.category as string || 'unknown';

    // Layer 2: Unknown Unknowns - check if category is mapped
    const UU_CATEGORIES = [
        'robot-vacuum', 'tv', 'smartphone', 'laptop', 'fridge', 'geladeira',
        'air_conditioner', 'washer', 'washer_dryer', 'dishwasher', 'air_fryer',
        'airfryer', 'microwave', 'freezer', 'soundbar', 'smartwatch', 'monitor'
    ];

    const uuMapped = UU_CATEGORIES.includes(categoryId.toLowerCase());
    modules['hiddenEngineering'] = {
        id: 'hiddenEngineering',
        name: 'Hidden Engineering (5+ items)',
        state: uuMapped ? 'available' : 'not_available',
        source: 'UnknownUnknowns',
        reason: uuMapped ? `Category "${categoryId}" mapped` : `Category "${categoryId}" NOT mapped in UU registry`,
    };

    // Layer 3: Unified Voice (runtime only)  
    modules['curiositySandwich'] = {
        id: 'curiositySandwich',
        name: 'Curiosity Sandwich',
        state: 'not_available',
        source: 'UnifiedVoice',
        reason: 'Generated at runtime via Gemini API',
    };

    modules['communityConsensus'] = {
        id: 'communityConsensus',
        name: 'Community Consensus',
        state: 'not_available',
        source: 'UnifiedVoice',
        reason: 'Generated at runtime via Gemini API (has fallback in component)',
    };

    // Layer 4: Shadow Engine (runtime only)
    modules['tcoDetails'] = {
        id: 'tcoDetails',
        name: 'TCO Details',
        state: 'not_available',
        source: 'ShadowEngine',
        reason: 'Calculated at runtime (has fallback OwnershipInsights)',
    };

    modules['repairabilityIndex'] = {
        id: 'repairabilityIndex',
        name: 'Repairability Index',
        state: 'not_available',
        source: 'ShadowEngine',
        reason: 'Requires component mapping',
    };

    // UI Sections - check if category supports tools
    const TOOL_CATEGORIES = ['tv', 'fridge', 'air_conditioner', 'robot-vacuum', 'monitor', 'laptop', 'washer', 'washer_dryer'];
    const supportsTools = TOOL_CATEGORIES.includes(categoryId.toLowerCase());

    modules['interactiveTools'] = {
        id: 'interactiveTools',
        name: 'Interactive Tools',
        state: supportsTools ? 'available' : 'not_available',
        source: 'Generated',
        reason: supportsTools ? `Category "${categoryId}" supports tools` : `Category "${categoryId}" has no tools configured`,
    };

    modules['buyKitButton'] = {
        id: 'buyKitButton',
        name: 'Buy Kit Button',
        state: 'available',
        source: 'Generated',
    };

    const gallery = (mockData?.product as Record<string, unknown>)?.gallery;
    modules['photosSection'] = {
        id: 'photosSection',
        name: 'Photos Section',
        state: gallery && Array.isArray(gallery) && (gallery as unknown[]).length > 0 ? 'available' : 'not_available',
        source: 'Mock',
        reason: !gallery ? 'No gallery in product data' : undefined,
    };

    return modules;
}

// ============================================
// PRINT REPORT
// ============================================

function printModuleMap(productId: string, modules: ModuleMap): void {
    console.log('\n' + '='.repeat(80));
    console.log(`📦 PRODUCT: ${productId}`);
    console.log('='.repeat(80));

    const available = Object.values(modules).filter(m => m.state === 'available');
    const notAvailable = Object.values(modules).filter(m => m.state === 'not_available');
    const missing = Object.values(modules).filter(m => m.state === 'missing');

    console.log(`\n✅ AVAILABLE (${available.length}):`);
    for (const m of available) {
        console.log(`   • ${m.name} [${m.source}]`);
    }

    console.log(`\n⚠️  NOT AVAILABLE (${notAvailable.length}) - should show fallback:`);
    for (const m of notAvailable) {
        console.log(`   • ${m.name} [${m.source}]`);
        if (m.reason) console.log(`     └─ ${m.reason}`);
    }

    if (missing.length > 0) {
        console.log(`\n❌ MISSING (${missing.length}) - CRITICAL - section will DISAPPEAR:`);
        for (const m of missing) {
            console.log(`   • ${m.name} [${m.source}]`);
            if (m.reason) console.log(`     └─ ${m.reason}`);
        }
    }
}

function printDiff(goldId: string, gold: ModuleMap, problemId: string, problem: ModuleMap): void {
    console.log('\n' + '='.repeat(80));
    console.log(`📊 DIFF: ${goldId} (gold) vs ${problemId} (problem)`);
    console.log('='.repeat(80));

    const allKeys = new Set([...Object.keys(gold), ...Object.keys(problem)]);
    let diffs = 0;

    for (const key of allKeys) {
        const g = gold[key];
        const p = problem[key];

        if (!g || !p) {
            console.log(`\n🔴 ${key}: Only in ${g ? 'gold' : 'problem'}`);
            diffs++;
            continue;
        }

        if (g.state !== p.state) {
            const icon = p.state === 'available' ? '🟢' :
                p.state === 'not_available' ? '🟡' : '🔴';
            console.log(`\n${icon} ${p.name}:`);
            console.log(`   Gold: ${g.state} | Problem: ${p.state}`);
            if (p.reason) console.log(`   Reason: ${p.reason}`);
            diffs++;
        }
    }

    if (diffs === 0) {
        console.log('\n✅ No differences found!');
    }
}

// ============================================
// MAIN
// ============================================

async function main() {
    const products = ['roborock-q7-l5', 'mondial-afn-80-bi'];
    const moduleMaps: Record<string, ModuleMap> = {};

    for (const productId of products) {
        console.log(`\n🔍 Loading ${productId}...`);
        const mockData = loadMock(productId);
        moduleMaps[productId] = analyzePdpModules(productId, mockData);
        printModuleMap(productId, moduleMaps[productId]);
    }

    // Print diff
    printDiff('roborock-q7-l5', moduleMaps['roborock-q7-l5'], 'mondial-afn-80-bi', moduleMaps['mondial-afn-80-bi']);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Analysis complete');
    console.log('='.repeat(80));
}

main().catch(console.error);
