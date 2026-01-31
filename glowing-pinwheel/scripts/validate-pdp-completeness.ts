#!/usr/bin/env npx ts-node
/**
 * @file validate-pdp-completeness.ts
 * @description Validates PDP completeness against the spec
 * 
 * Usage:
 *   npx ts-node scripts/validate-pdp-completeness.ts
 *   npx ts-node scripts/validate-pdp-completeness.ts --product mondial-afn-80-bi
 * 
 * Exit Codes:
 *   0 = PASS (all modules OK)
 *   1 = WARN (acceptable coming_soon for immature categories)
 *   2 = FAIL (REQUIRED modules missing or invalid)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// TYPES (inline to avoid import issues in scripts)
// ============================================

type ModuleRequirement = 'REQUIRED' | 'REQUIRED_WHEN_MATURE' | 'OPTIONAL';
type ModuleStatus = 'PASS' | 'WARN' | 'FAIL';

interface ModuleSpec {
    id: string;
    name: string;
    requirement: ModuleRequirement;
    allowedComingSoon: boolean;
    rules: {
        requiredFields?: string[];
        minItems?: number;
        customValidator?: string;
    };
    immmatureReason?: string;
}

interface ModuleValidationResult {
    moduleId: string;
    moduleName: string;
    requirement: ModuleRequirement;
    status: ModuleStatus;
    reason?: string;
}

interface ProductValidationResult {
    productId: string;
    categoryId: string;
    isCategoryMature: boolean;
    categoryProductCount: number;
    modules: ModuleValidationResult[];
    overallStatus: ModuleStatus;
    failCount: number;
    warnCount: number;
    passCount: number;
}

// ============================================
// CONSTANTS
// ============================================

const MATURITY_THRESHOLD = 2;
const MOCKS_DIR = path.join(__dirname, '../src/data/mocks');
const UNIFIED_VOICE_CACHE_DIR = path.join(__dirname, '../src/data/unified-voice-cache');

// Categories that support contextual scoring (HMUM)
const CONTEXTUAL_SCORING_CATEGORIES = [
    'tv', 'smart-tv', 'fridge', 'geladeira', 'air_conditioner',
    'robot-vacuum', 'monitor', 'notebook', 'washer', 'air_fryer'
];

// Categories that support interactive tools
const TOOLS_SUPPORTED_CATEGORIES = [
    'tv', 'fridge', 'air_conditioner', 'robot-vacuum',
    'monitor', 'notebook', 'washer', 'washer_dryer', 'air_fryer'
];

// ============================================
// PDP MODULES SPEC
// ============================================

const PDP_MODULES_SPEC: ModuleSpec[] = [
    {
        id: 'header',
        name: 'Header (Score + Title)',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: { requiredFields: ['overallScore', 'title', 'subtitle'] },
    },
    {
        id: 'audit_verdict',
        name: 'Veredito da Auditoria',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: { requiredFields: ['solution', 'attentionPoint', 'technicalConclusion'] },
    },
    {
        id: 'product_dna',
        name: 'DNA do Produto (Radar)',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: { requiredFields: ['dimensions'], minItems: 10 },
    },
    {
        id: 'decision_faq',
        name: 'Perguntas Decisivas',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: { minItems: 3 },
    },
    {
        id: 'simulators',
        name: 'Simuladores Inteligentes',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: { requiredFields: ['sizeAlert', 'energyAlert'] },
    },
    {
        id: 'simulator_recommendations',
        name: 'Recomendações nos Simuladores',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'Primeiro produto da categoria — alternativas serão ativadas quando houver mais itens',
        rules: { customValidator: 'hasRecommendedProducts' },
    },
    {
        id: 'context_score',
        name: 'Score Contextual (HMUM)',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'HMUM em fase de calibração para esta categoria',
        rules: { customValidator: 'supportsContextualScoring' },
    },
    {
        id: 'community_consensus',
        name: 'Consenso da Comunidade',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'Dados de comunidade sendo coletados',
        rules: { requiredFields: ['rating', 'bullets'], minItems: 3 },
    },
    {
        id: 'interactive_tools',
        name: 'Ferramentas Interativas',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'Ferramentas em desenvolvimento para esta categoria',
        rules: { customValidator: 'categorySupportsTools' },
    },
    {
        id: 'manual_link',
        name: 'Link do Manual',
        requirement: 'OPTIONAL',
        allowedComingSoon: true,
        rules: { customValidator: 'hasValidManualLink' },
    },
];

// ============================================
// HELPERS
// ============================================

function loadAllMocks(): Record<string, any>[] {
    const mocks: Record<string, any>[] = [];
    const files = fs.readdirSync(MOCKS_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(MOCKS_DIR, file), 'utf-8');
            const data = JSON.parse(content);
            if (data.product?.id) {
                mocks.push(data);
            }
        } catch (e) {
            // Skip invalid files
        }
    }

    return mocks;
}

function getCategoryProductCount(mocks: any[], categoryId: string): number {
    const normalizedCategory = categoryId.toLowerCase().replace(/-/g, '_');
    return mocks.filter(m => {
        const mockCat = (m.product?.category || '').toLowerCase().replace(/-/g, '_');
        return mockCat === normalizedCategory;
    }).length;
}

function supportsContextualScoring(categoryId: string): boolean {
    const normalized = categoryId.toLowerCase().replace(/-/g, '_');
    return CONTEXTUAL_SCORING_CATEGORIES.some(c =>
        c.toLowerCase().replace(/-/g, '_') === normalized
    );
}

function categorySupportsTools(categoryId: string): boolean {
    const normalized = categoryId.toLowerCase().replace(/-/g, '_');
    return TOOLS_SUPPORTED_CATEGORIES.some(c =>
        c.toLowerCase().replace(/-/g, '_') === normalized
    );
}

/**
 * Load Unified Voice cache for a product
 */
function loadUnifiedVoiceCache(productId: string): any | null {
    const cachePath = path.join(UNIFIED_VOICE_CACHE_DIR, `${productId}.json`);
    try {
        if (!fs.existsSync(cachePath)) {
            return null;
        }
        const content = fs.readFileSync(cachePath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return null;
    }
}

// ============================================
// VALIDATORS
// ============================================

function validateModule(
    spec: ModuleSpec,
    mockData: any,
    isMature: boolean,
    categoryId: string
): ModuleValidationResult {
    const result: ModuleValidationResult = {
        moduleId: spec.id,
        moduleName: spec.name,
        requirement: spec.requirement,
        status: 'PASS',
    };

    // Check custom validators first
    if (spec.rules.customValidator) {
        switch (spec.rules.customValidator) {
            case 'supportsContextualScoring':
                if (!supportsContextualScoring(categoryId)) {
                    result.status = 'PASS';
                    result.reason = 'Category does not require contextual scoring';
                    return result;
                }
                break;
            case 'categorySupportsTools':
                if (!categorySupportsTools(categoryId)) {
                    result.status = 'PASS';
                    result.reason = 'Category does not require interactive tools';
                    return result;
                }
                break;
            case 'hasRecommendedProducts':
                // Check simulators.soundAlert.suggestions
                const suggestions = mockData.simulators?.soundAlert?.suggestions;
                if (!suggestions || suggestions.length === 0) {
                    if (!isMature && spec.allowedComingSoon) {
                        result.status = 'WARN';
                        result.reason = spec.immmatureReason;
                    } else if (isMature) {
                        result.status = 'FAIL';
                        result.reason = 'Mature category requires recommendedProducts in simulators';
                    }
                }
                return result;
            case 'hasValidManualLink':
                // Optional - just check if exists and is valid URL
                const manualUrl = mockData.product?.manualUrl;
                if (manualUrl && !manualUrl.startsWith('http')) {
                    result.status = 'WARN';
                    result.reason = 'Manual URL exists but is not a valid HTTP link';
                }
                return result;
        }
    }

    // Get the data section for this module
    let dataSection: any;
    switch (spec.id) {
        case 'header':
            dataSection = mockData.header;
            break;
        case 'audit_verdict':
            dataSection = mockData.auditVerdict;
            break;
        case 'product_dna':
            dataSection = mockData.productDna;
            break;
        case 'decision_faq':
            dataSection = mockData.decisionFAQ;
            break;
        case 'simulators':
            dataSection = mockData.simulators;
            break;
        case 'community_consensus':
            // Check mock first, then Unified Voice cache
            dataSection = mockData.communityConsensus;
            if (!dataSection) {
                const cache = loadUnifiedVoiceCache(mockData.product?.id);
                dataSection = cache?.communityConsensus;
            }
            break;
        default:
            dataSection = mockData[spec.id];
    }

    // Check required fields
    if (spec.rules.requiredFields) {
        for (const field of spec.rules.requiredFields) {
            if (!dataSection || dataSection[field] === undefined || dataSection[field] === null) {
                if (spec.requirement === 'REQUIRED') {
                    result.status = 'FAIL';
                    result.reason = `Missing required field: ${field}`;
                    return result;
                } else if (spec.requirement === 'REQUIRED_WHEN_MATURE') {
                    if (isMature) {
                        result.status = 'FAIL';
                        result.reason = `Mature category missing: ${field}`;
                    } else if (spec.allowedComingSoon) {
                        result.status = 'WARN';
                        result.reason = spec.immmatureReason || `Immature category: ${field} allowed coming_soon`;
                    }
                    return result;
                }
            }
        }
    }

    // Check minItems
    if (spec.rules.minItems !== undefined) {
        let items: any[] = [];

        if (spec.id === 'decision_faq') {
            items = mockData.decisionFAQ || [];
        } else if (spec.id === 'product_dna') {
            items = mockData.productDna?.dimensions || [];
        } else if (spec.id === 'community_consensus') {
            items = dataSection?.bullets || [];
        } else if (Array.isArray(dataSection)) {
            items = dataSection;
        }

        if (items.length < spec.rules.minItems) {
            if (spec.requirement === 'REQUIRED') {
                result.status = 'FAIL';
                result.reason = `Need ${spec.rules.minItems} items, found ${items.length}`;
            } else if (spec.requirement === 'REQUIRED_WHEN_MATURE' && isMature) {
                result.status = 'FAIL';
                result.reason = `Mature category needs ${spec.rules.minItems} items, found ${items.length}`;
            } else if (spec.allowedComingSoon) {
                result.status = 'WARN';
                result.reason = spec.immmatureReason || `Only ${items.length}/${spec.rules.minItems} items`;
            }
        }
    }

    return result;
}

function validateProduct(mockData: any, allMocks: any[]): ProductValidationResult {
    const productId = mockData.product?.id || 'unknown';
    const categoryId = mockData.product?.category || 'unknown';
    const categoryProductCount = getCategoryProductCount(allMocks, categoryId);
    const isMature = categoryProductCount >= MATURITY_THRESHOLD;

    const modules: ModuleValidationResult[] = [];

    for (const spec of PDP_MODULES_SPEC) {
        modules.push(validateModule(spec, mockData, isMature, categoryId));
    }

    const failCount = modules.filter(m => m.status === 'FAIL').length;
    const warnCount = modules.filter(m => m.status === 'WARN').length;
    const passCount = modules.filter(m => m.status === 'PASS').length;

    let overallStatus: ModuleStatus = 'PASS';
    if (failCount > 0) overallStatus = 'FAIL';
    else if (warnCount > 0) overallStatus = 'WARN';

    return {
        productId,
        categoryId,
        isCategoryMature: isMature,
        categoryProductCount,
        modules,
        overallStatus,
        failCount,
        warnCount,
        passCount,
    };
}

// ============================================
// MAIN
// ============================================

function main() {
    const args = process.argv.slice(2);
    const productFilter = args.includes('--product')
        ? args[args.indexOf('--product') + 1]
        : null;

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           PDP COMPLETENESS VALIDATOR v1.0                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const allMocks = loadAllMocks();
    console.log(`Found ${allMocks.length} product mocks\n`);

    // Count products by category
    const categoryStats: Record<string, number> = {};
    for (const mock of allMocks) {
        const cat = mock.product?.category || 'unknown';
        categoryStats[cat] = (categoryStats[cat] || 0) + 1;
    }
    console.log('Category Maturity:');
    for (const [cat, count] of Object.entries(categoryStats)) {
        const mature = count >= MATURITY_THRESHOLD ? '✓ MATURE' : '○ Immature';
        console.log(`  ${cat}: ${count} products (${mature})`);
    }
    console.log('');

    // Validate products
    const mocksToValidate = productFilter
        ? allMocks.filter(m => m.product?.id === productFilter)
        : allMocks;

    if (mocksToValidate.length === 0) {
        console.error(`No products found${productFilter ? ` matching "${productFilter}"` : ''}`);
        process.exit(2);
    }

    let hasAnyFail = false;
    let hasAnyWarn = false;

    for (const mock of mocksToValidate) {
        const result = validateProduct(mock, allMocks);

        console.log('─'.repeat(60));
        console.log(`Product: ${result.productId}`);
        console.log(`Category: ${result.categoryId} (${result.categoryProductCount} products, ${result.isCategoryMature ? 'MATURE' : 'IMMATURE'})`);
        console.log(`Overall: ${result.overallStatus} (${result.passCount} PASS, ${result.warnCount} WARN, ${result.failCount} FAIL)\n`);

        console.log('Module Results:');
        for (const mod of result.modules) {
            const icon = mod.status === 'PASS' ? '✅' : mod.status === 'WARN' ? '⚠️' : '❌';
            const reason = mod.reason ? ` — ${mod.reason}` : '';
            console.log(`  ${icon} ${mod.moduleName} [${mod.requirement}]${reason}`);
        }
        console.log('');

        if (result.overallStatus === 'FAIL') hasAnyFail = true;
        if (result.overallStatus === 'WARN') hasAnyWarn = true;
    }

    // Summary
    console.log('═'.repeat(60));
    if (hasAnyFail) {
        console.log('❌ VALIDATION FAILED - Required modules missing');
        process.exit(2);
    } else if (hasAnyWarn) {
        console.log('⚠️ VALIDATION PASSED WITH WARNINGS - Immature categories allowed');
        process.exit(1);
    } else {
        console.log('✅ VALIDATION PASSED - All modules complete');
        process.exit(0);
    }
}

main();
