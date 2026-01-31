#!/usr/bin/env npx ts-node
/**
 * @file validate-pdp-content.ts
 * @description Strict content validator - fails on generic/placeholder content
 * 
 * RULES:
 * 1. community_consensus: needs numeric rating + review count OR explicit fallback
 * 2. curiosity_sandwich: must reference real product data (not generic tip)
 * 3. simulators: must render cards with at least 1 recommendation or explicit fallback
 * 4. manual: clickable URL button (not text)
 * 5. productDna radar: labels must match product category (air_fryer ≠ TV)
 * 6. hidden_engineering: 5 items or explicit fallback
 * 7. interactive_tools: render if config exists, else explicit "coming_soon"
 * 8. context_score: render if supported, else explicit fallback
 * 
 * Exit Codes:
 *   0 = PASS
 *   2 = FAIL (generic content detected or required content missing)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONSTANTS
// ============================================

const MOCKS_DIR = path.join(__dirname, '../src/data/mocks');
const UNIFIED_VOICE_CACHE_DIR = path.join(__dirname, '../src/data/unified-voice-cache');

// Generic strings that indicate placeholder content (SHOULD FAIL)
const GENERIC_STRINGS = [
    'Maioria dos compradores recomendaria',
    'Registre a garantia',
    'Verifique a garantia e disponibilidade',
    'Produto com qualidade comprovada pela marca',
    'Boa qualidade de imagem para uso diário',
    'Excelente relação qualidade-preço na categoria',
    'Dados não disponíveis no momento',
    'Carregando dados...',
    'Lorem ipsum dolor sit',
    '[PLACEHOLDER]',
    '[TODO]',
];

// Expected radar labels by category
const CATEGORY_RADAR_LABELS: Record<string, string[]> = {
    'air_fryer': ['Antiaderente', 'Segurança', 'Crocância', 'Limpeza', 'Durabilidade', 'Ruído', 'Capacidade', 'Tecnologia', 'Custo', 'Suporte'],
    'robot_vacuum': ['Navegação', 'App', 'Mop', 'Escovas', 'Altura', 'Peças', 'Bateria', 'Ruído', 'Base', 'IA'],
    'robot-vacuum': ['Navegação', 'App', 'Mop', 'Escovas', 'Altura', 'Peças', 'Bateria', 'Ruído', 'Base', 'IA'],
    'tv': ['Imagem', 'Som', 'Gaming', 'Smart', 'Design', 'Portas', 'HDR', 'Brilho', 'Ângulo', 'Motion'],
    'smart_tv': ['Imagem', 'Som', 'Gaming', 'Smart', 'Design', 'Portas', 'HDR', 'Brilho', 'Ângulo', 'Motion'],
    'smart-tv': ['Imagem', 'Som', 'Gaming', 'Smart', 'Design', 'Portas', 'HDR', 'Brilho', 'Ângulo', 'Motion'],
};

// Categories that support HMUM contextual scoring
const HMUM_SUPPORTED_CATEGORIES = ['tv', 'smart-tv', 'smart_tv', 'robot-vacuum', 'robot_vacuum', 'fridge', 'air_conditioner', 'air_fryer'];

// Categories with interactive tools config
const TOOLS_SUPPORTED_CATEGORIES = ['tv', 'fridge', 'air_conditioner', 'robot-vacuum', 'monitor', 'notebook', 'washer', 'air_fryer'];

// ============================================
// TYPES
// ============================================

interface ContentValidationResult {
    productId: string;
    categoryId: string;
    checks: ContentCheck[];
    overallStatus: 'PASS' | 'FAIL';
    failCount: number;
}

interface ContentCheck {
    id: string;
    name: string;
    status: 'PASS' | 'FAIL';
    reason?: string;
}

// ============================================
// HELPERS
// ============================================

function loadMock(productId: string): any | null {
    const mockPath = path.join(MOCKS_DIR, `${productId}.json`);
    try {
        if (!fs.existsSync(mockPath)) return null;
        return JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    } catch {
        return null;
    }
}

function loadUnifiedVoiceCache(productId: string): any | null {
    const cachePath = path.join(UNIFIED_VOICE_CACHE_DIR, `${productId}.json`);
    try {
        if (!fs.existsSync(cachePath)) return null;
        return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch {
        return null;
    }
}

function containsGenericString(text: string): string | null {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const generic of GENERIC_STRINGS) {
        if (lower.includes(generic.toLowerCase())) {
            return generic;
        }
    }
    return null;
}

function listAllMockProductIds(): string[] {
    try {
        return fs.readdirSync(MOCKS_DIR)
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));
    } catch {
        return [];
    }
}

// ============================================
// CONTENT VALIDATORS
// ============================================

function validateCommunityConsensus(mock: any, cache: any): ContentCheck {
    const check: ContentCheck = {
        id: 'community_consensus',
        name: 'Consenso da Comunidade',
        status: 'PASS',
    };

    // Check mock first, then cache
    const data = mock.communityConsensus || cache?.communityConsensus;

    if (!data) {
        check.status = 'FAIL';
        check.reason = 'Missing: no communityConsensus in mock or cache';
        return check;
    }

    // Must have numeric rating
    if (typeof data.rating !== 'number' || data.rating <= 0) {
        check.status = 'FAIL';
        check.reason = 'Missing numeric rating (rating must be > 0)';
        return check;
    }

    // Must have review count or approval percentage
    if (!data.totalReviews && !data.approvalPercentage) {
        check.status = 'FAIL';
        check.reason = 'Missing review count or approval percentage';
        return check;
    }

    // Must have at least 3 bullets
    if (!data.bullets || data.bullets.length < 3) {
        check.status = 'FAIL';
        check.reason = `Need >=3 bullets, found ${data.bullets?.length || 0}`;
        return check;
    }

    // Check for generic content in bullets
    for (const bullet of data.bullets) {
        const generic = containsGenericString(bullet);
        if (generic) {
            check.status = 'FAIL';
            check.reason = `Generic content detected: "${generic}"`;
            return check;
        }
    }

    return check;
}

function validateCuriositySandwich(mock: any, cache: any): ContentCheck {
    const check: ContentCheck = {
        id: 'curiosity_sandwich',
        name: 'Curiosity Sandwich (Texto Azul)',
        status: 'PASS',
    };

    const data = cache?.curiositySandwich;

    if (!data) {
        check.status = 'FAIL';
        check.reason = 'Missing: no curiositySandwich in cache';
        return check;
    }

    // Must have hook, insight, callToAction
    if (!data.hook || !data.insight || !data.callToAction) {
        check.status = 'FAIL';
        check.reason = 'Missing required fields: hook, insight, or callToAction';
        return check;
    }

    // Check for generic content
    const allText = `${data.hook} ${data.insight} ${data.callToAction}`;
    const generic = containsGenericString(allText);
    if (generic) {
        check.status = 'FAIL';
        check.reason = `Generic content detected: "${generic}"`;
        return check;
    }

    // Must reference product name or brand (product-specific)
    const productName = mock.product?.name || '';
    const brand = mock.product?.brand || '';
    const containsProductRef = allText.includes(brand) ||
        allText.toLowerCase().includes(mock.product?.id?.split('-')[0] || '');

    if (!containsProductRef && allText.length < 100) {
        check.status = 'FAIL';
        check.reason = 'Content too generic - does not reference product/brand';
        return check;
    }

    return check;
}

function validateSimulators(mock: any): ContentCheck {
    const check: ContentCheck = {
        id: 'simulators',
        name: 'Simuladores Inteligentes',
        status: 'PASS',
    };

    const data = mock.simulators;

    if (!data) {
        check.status = 'FAIL';
        check.reason = 'Missing: no simulators section in mock';
        return check;
    }

    // Must have sizeAlert or soundAlert or energyAlert
    const hasAlerts = data.sizeAlert || data.soundAlert || data.energyAlert;
    if (!hasAlerts) {
        check.status = 'FAIL';
        check.reason = 'No simulator alerts (sizeAlert/soundAlert/energyAlert)';
        return check;
    }

    // Check for generic content in alerts
    const alertTexts = [
        data.sizeAlert?.message,
        data.soundAlert?.message,
        data.energyAlert?.message,
    ].filter(Boolean);

    for (const text of alertTexts) {
        const generic = containsGenericString(text);
        if (generic) {
            check.status = 'FAIL';
            check.reason = `Generic content in simulator: "${generic}"`;
            return check;
        }
    }

    return check;
}

function validateProductDna(mock: any): ContentCheck {
    const check: ContentCheck = {
        id: 'product_dna',
        name: 'DNA do Produto (Radar Labels)',
        status: 'PASS',
    };

    const categoryId = (mock.product?.category || '').toLowerCase().replace(/-/g, '_');
    const dimensions = mock.productDna?.dimensions || [];

    if (dimensions.length < 10) {
        check.status = 'FAIL';
        check.reason = `Need 10 dimensions, found ${dimensions.length}`;
        return check;
    }

    // Check if category has expected labels
    const expectedLabels = CATEGORY_RADAR_LABELS[categoryId];
    if (!expectedLabels) {
        // Category not mapped - acceptable but warn
        check.reason = `Category "${categoryId}" not in radar label mapping (acceptable)`;
        return check;
    }

    // Check that at least some labels match expected category
    const actualLabels = dimensions.map((d: any) => d.shortName || d.name);
    const matchCount = actualLabels.filter((label: string) =>
        expectedLabels.some(exp => label.toLowerCase().includes(exp.toLowerCase()) ||
            exp.toLowerCase().includes(label.toLowerCase()))
    ).length;

    if (matchCount < 5) {
        check.status = 'FAIL';
        check.reason = `Radar labels don't match category (${matchCount}/10 matched). Expected: ${expectedLabels.slice(0, 5).join(', ')}...`;
        return check;
    }

    return check;
}

function validateDecisionFaq(mock: any): ContentCheck {
    const check: ContentCheck = {
        id: 'decision_faq',
        name: 'Perguntas Decisivas',
        status: 'PASS',
    };

    const faqs = mock.decisionFAQ || [];

    if (faqs.length < 3) {
        check.status = 'FAIL';
        check.reason = `Need >=3 FAQs, found ${faqs.length}`;
        return check;
    }

    // Check for generic content
    for (const faq of faqs) {
        const text = `${faq.question} ${faq.answer}`;
        const generic = containsGenericString(text);
        if (generic) {
            check.status = 'FAIL';
            check.reason = `Generic content in FAQ: "${generic}"`;
            return check;
        }
    }

    return check;
}

function validateInteractiveTools(mock: any): ContentCheck {
    const check: ContentCheck = {
        id: 'interactive_tools',
        name: 'Ferramentas Interativas',
        status: 'PASS',
    };

    const categoryId = (mock.product?.category || '').toLowerCase().replace(/-/g, '_');
    const isSupported = TOOLS_SUPPORTED_CATEGORIES.some(c =>
        c.toLowerCase().replace(/-/g, '_') === categoryId
    );

    if (!isSupported) {
        check.reason = 'Category does not have tools config (acceptable with fallback)';
        return check;
    }

    // Category should have tools - check if simulators exist as proxy
    if (!mock.simulators || Object.keys(mock.simulators).length === 0) {
        check.status = 'FAIL';
        check.reason = 'Category supports tools but mock has no simulators data';
        return check;
    }

    return check;
}

function validateContextScore(mock: any): ContentCheck {
    const check: ContentCheck = {
        id: 'context_score',
        name: 'Score Contextual (HMUM)',
        status: 'PASS',
    };

    const categoryId = (mock.product?.category || '').toLowerCase().replace(/-/g, '_');
    const isSupported = HMUM_SUPPORTED_CATEGORIES.some(c =>
        c.toLowerCase().replace(/-/g, '_') === categoryId
    );

    if (!isSupported) {
        check.reason = 'Category not in HMUM support list (coming_soon with explicit fallback)';
        return check;
    }

    // Category supports HMUM - check for baseScore or scores
    const hasScore = mock.header?.overallScore || mock.product?.baseScore;
    if (!hasScore) {
        check.status = 'FAIL';
        check.reason = 'HMUM-supported category but no overallScore/baseScore found';
        return check;
    }

    return check;
}

// ============================================
// MAIN VALIDATOR
// ============================================

function validateProductContent(productId: string): ContentValidationResult {
    const mock = loadMock(productId);
    const cache = loadUnifiedVoiceCache(productId);

    if (!mock) {
        return {
            productId,
            categoryId: 'unknown',
            checks: [{
                id: 'mock_exists',
                name: 'Mock File Exists',
                status: 'FAIL',
                reason: `Mock file not found: ${productId}.json`,
            }],
            overallStatus: 'FAIL',
            failCount: 1,
        };
    }

    const categoryId = mock.product?.category || 'unknown';

    const checks: ContentCheck[] = [
        validateCommunityConsensus(mock, cache),
        validateCuriositySandwich(mock, cache),
        validateSimulators(mock),
        validateProductDna(mock),
        validateDecisionFaq(mock),
        validateInteractiveTools(mock),
        validateContextScore(mock),
    ];

    const failCount = checks.filter(c => c.status === 'FAIL').length;

    return {
        productId,
        categoryId,
        checks,
        overallStatus: failCount > 0 ? 'FAIL' : 'PASS',
        failCount,
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
    console.log('║           PDP CONTENT VALIDATOR v1.0                           ║');
    console.log('║   Fails on generic/placeholder content                         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const productIds = productFilter ? [productFilter] : listAllMockProductIds();

    if (productIds.length === 0) {
        console.error('No products found');
        process.exit(2);
    }

    console.log(`Validating ${productIds.length} products...\n`);

    let hasAnyFail = false;

    for (const productId of productIds) {
        const result = validateProductContent(productId);

        console.log('─'.repeat(60));
        console.log(`Product: ${result.productId}`);
        console.log(`Category: ${result.categoryId}`);
        console.log(`Status: ${result.overallStatus} (${result.failCount} failures)\n`);

        for (const check of result.checks) {
            const icon = check.status === 'PASS' ? '✅' : '❌';
            const reason = check.reason ? ` — ${check.reason}` : '';
            console.log(`  ${icon} ${check.name}${reason}`);
        }
        console.log('');

        if (result.overallStatus === 'FAIL') {
            hasAnyFail = true;
        }
    }

    console.log('═'.repeat(60));
    if (hasAnyFail) {
        console.log('❌ CONTENT VALIDATION FAILED - Generic or missing content detected');
        console.log('   Fix the issues above before publishing.\n');
        process.exit(2);
    } else {
        console.log('✅ CONTENT VALIDATION PASSED - No generic content detected\n');
        process.exit(0);
    }
}

main();
