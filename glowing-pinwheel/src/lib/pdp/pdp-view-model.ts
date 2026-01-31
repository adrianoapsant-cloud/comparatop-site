/**
 * @file pdp-view-model.ts
 * @description Central PDP ViewModel builder and validator
 * 
 * This module centralizes the assembly of all PDP data from 4 layers:
 * 1. Mock JSON: product, header, auditVerdict, productDna, simulators, decisionFAQ
 * 2. Unknown Unknowns: Hidden engineering data per category
 * 3. Unified Voice API: curiosity_sandwich, community_consensus
 * 4. Shadow Engine: TCO, repairability, component map
 * 
 * The validator ensures no section is "missing" - sections show either
 * real data or explicit "not available" state.
 * 
 * @version 1.0.0
 */

import { getUnknownUnknowns } from '@/data/unknown-unknowns-data';

// ============================================
// TYPES
// ============================================

/**
 * Section availability states
 */
export type SectionState = 'available' | 'not_available' | 'missing';

/**
 * Individual section status
 */
export interface SectionStatus {
    id: string;
    name: string;
    state: SectionState;
    reason?: string;
    itemCount?: number;
}

/**
 * Full PDP ViewModel for validation
 */
export interface PdpViewModel {
    productId: string;
    categoryId: string;

    // Layer 1: Mock JSON
    product: SectionStatus;
    header: SectionStatus;
    auditVerdict: SectionStatus;
    productDna: SectionStatus;
    simulators: SectionStatus;
    decisionFAQ: SectionStatus;

    // Layer 2: Unknown Unknowns
    hiddenEngineering: SectionStatus;

    // Layer 3: Unified Voice API (runtime)
    curiositySandwich: SectionStatus;
    communityConsensus: SectionStatus;

    // Layer 4: Shadow Engine (runtime)
    tcoDetails: SectionStatus;
    repairabilityIndex: SectionStatus;
    componentMap: SectionStatus;

    // UI Sections (composite)
    interactiveTools: SectionStatus;
    buyKitButton: SectionStatus;
    photosSection: SectionStatus;
    faqSection: SectionStatus;
}

/**
 * Validation result
 */
export interface PdpViewModelValidation {
    valid: boolean;
    productId: string;
    categoryId: string;
    missingSections: SectionStatus[];
    availableSections: SectionStatus[];
    notAvailableSections: SectionStatus[];
    summary: string;
}

// ============================================
// P21 REQUIRED SECTIONS
// ============================================

/**
 * Sections that MUST exist (either 'available' or 'not_available', never 'missing')
 */
export const P21_REQUIRED_SECTIONS = [
    'product',
    'header',
    'auditVerdict',
    'productDna',
    'simulators',
    'decisionFAQ',
    'hiddenEngineering',
    'curiositySandwich',
    'communityConsensus',
    'tcoDetails',
    'repairabilityIndex',
    'interactiveTools',
    'buyKitButton',
    'photosSection',
    'faqSection',
] as const;

// ============================================
// VIEW MODEL BUILDER
// ============================================

/**
 * Build PDP ViewModel from all data sources
 */
export function buildPdpViewModel(
    productId: string,
    categoryId: string,
    mockData: Record<string, unknown> | null,
    unifiedVoiceData?: {
        curiosity_sandwich?: { icon: string; text: string };
        community_consensus?: { approval_percentage?: number };
    },
    shadowEngineData?: {
        tco?: { totalCost?: number };
        repairability?: { score?: number };
        componentMap?: unknown[];
    }
): PdpViewModel {

    // Layer 1: Mock JSON
    const product = mockData?.product;
    const header = mockData?.header;
    const auditVerdict = mockData?.auditVerdict;
    const productDna = mockData?.productDna;
    const simulators = mockData?.simulators;
    const decisionFAQ = mockData?.decisionFAQ;
    const gallery = (product as Record<string, unknown>)?.gallery;

    // Layer 2: Unknown Unknowns
    const uu = getUnknownUnknowns(categoryId);
    const uuItems = uu?.items || [];

    // Layer 3: Unified Voice (passed from API)
    const curiosity = unifiedVoiceData?.curiosity_sandwich;
    const consensus = unifiedVoiceData?.community_consensus;

    // Layer 4: Shadow Engine (passed from runtime)
    const tco = shadowEngineData?.tco;
    const repairability = shadowEngineData?.repairability;
    const componentMap = shadowEngineData?.componentMap;

    return {
        productId,
        categoryId,

        // Layer 1
        product: {
            id: 'product',
            name: 'Product Info',
            state: product ? 'available' : 'missing',
        },
        header: {
            id: 'header',
            name: 'Header/Score',
            state: header ? 'available' : 'missing',
        },
        auditVerdict: {
            id: 'auditVerdict',
            name: 'Audit Verdict',
            state: auditVerdict ? 'available' : 'missing',
        },
        productDna: {
            id: 'productDna',
            name: 'Product DNA',
            state: productDna ? 'available' : 'missing',
        },
        simulators: {
            id: 'simulators',
            name: 'Simulators',
            state: simulators ? 'available' : 'not_available',
            reason: !simulators ? 'Not configured for this category' : undefined,
        },
        decisionFAQ: {
            id: 'decisionFAQ',
            name: 'Decision FAQ',
            state: Array.isArray(decisionFAQ) ? (decisionFAQ.length > 0 ? 'available' : 'not_available') : 'missing',
            itemCount: Array.isArray(decisionFAQ) ? decisionFAQ.length : 0,
        },

        // Layer 2
        hiddenEngineering: {
            id: 'hiddenEngineering',
            name: 'Hidden Engineering (5+ items)',
            state: uuItems.length >= 5 ? 'available' : (uuItems.length > 0 ? 'not_available' : 'not_available'),
            itemCount: uuItems.length,
            reason: uuItems.length < 5 ? `Only ${uuItems.length} items (need 5+)` : undefined,
        },

        // Layer 3
        curiositySandwich: {
            id: 'curiositySandwich',
            name: 'Curiosity Sandwich',
            state: curiosity?.text ? 'available' : 'not_available',
            reason: !curiosity ? 'Generated at runtime from Unified Voice API' : undefined,
        },
        communityConsensus: {
            id: 'communityConsensus',
            name: 'Community Consensus',
            state: consensus?.approval_percentage !== undefined ? 'available' : 'not_available',
            reason: !consensus ? 'Generated at runtime from Unified Voice API' : undefined,
        },

        // Layer 4
        tcoDetails: {
            id: 'tcoDetails',
            name: 'TCO Details',
            state: tco?.totalCost !== undefined ? 'available' : 'not_available',
            reason: !tco ? 'Calculated at runtime by Shadow Engine' : undefined,
        },
        repairabilityIndex: {
            id: 'repairabilityIndex',
            name: 'Repairability Index',
            state: repairability?.score !== undefined ? 'available' : 'not_available',
            reason: !repairability ? 'Calculated at runtime by Shadow Engine' : undefined,
        },
        componentMap: {
            id: 'componentMap',
            name: 'Component Map',
            state: componentMap && componentMap.length > 0 ? 'available' : 'not_available',
            reason: !componentMap ? 'Requires component mapping for category' : undefined,
        },

        // UI Sections
        interactiveTools: {
            id: 'interactiveTools',
            name: 'Interactive Tools',
            state: categorySupportsTools(categoryId) ? 'available' : 'not_available',
            reason: !categorySupportsTools(categoryId) ? 'Tools not configured for this category' : undefined,
        },
        buyKitButton: {
            id: 'buyKitButton',
            name: 'Buy Kit Button',
            state: 'available', // Always available - links to marketplace
        },
        photosSection: {
            id: 'photosSection',
            name: 'Photos Section',
            state: gallery && Array.isArray(gallery) && gallery.length > 0 ? 'available' : 'not_available',
            reason: !gallery ? 'No gallery images in product data' : undefined,
        },
        faqSection: {
            id: 'faqSection',
            name: 'FAQ Section',
            state: Array.isArray(decisionFAQ) && decisionFAQ.length > 0 ? 'available' : 'not_available',
            reason: !decisionFAQ || (Array.isArray(decisionFAQ) && decisionFAQ.length === 0) ? 'No FAQ data available' : undefined,
        },
    };
}

/**
 * Check if category supports interactive tools
 */
function categorySupportsTools(categoryId: string): boolean {
    const supportedCategories = [
        'tv', 'fridge', 'air_conditioner', 'robot-vacuum',
        'monitor', 'laptop', 'washer', 'washer_dryer', 'air_fryer',
    ];
    return supportedCategories.includes(categoryId);
}

// ============================================
// VALIDATOR
// ============================================

/**
 * Validate PDP ViewModel against P21 requirements
 * 
 * Rule: Sections must be 'available' or 'not_available' (with explicit state).
 *       'missing' state means the section silently disappeared = FAIL.
 */
export function validatePdpViewModel(viewModel: PdpViewModel): PdpViewModelValidation {
    const allSections: SectionStatus[] = [
        viewModel.product,
        viewModel.header,
        viewModel.auditVerdict,
        viewModel.productDna,
        viewModel.simulators,
        viewModel.decisionFAQ,
        viewModel.hiddenEngineering,
        viewModel.curiositySandwich,
        viewModel.communityConsensus,
        viewModel.tcoDetails,
        viewModel.repairabilityIndex,
        viewModel.interactiveTools,
        viewModel.buyKitButton,
        viewModel.photosSection,
        viewModel.faqSection,
    ];

    const missingSections = allSections.filter(s => s.state === 'missing');
    const availableSections = allSections.filter(s => s.state === 'available');
    const notAvailableSections = allSections.filter(s => s.state === 'not_available');

    const valid = missingSections.length === 0;

    let summary: string;
    if (valid) {
        summary = `✅ PDP Valid: ${availableSections.length} sections available, ${notAvailableSections.length} explicitly not available`;
    } else {
        summary = `❌ PDP Invalid: ${missingSections.length} sections MISSING (${missingSections.map(s => s.name).join(', ')})`;
    }

    return {
        valid,
        productId: viewModel.productId,
        categoryId: viewModel.categoryId,
        missingSections,
        availableSections,
        notAvailableSections,
        summary,
    };
}

/**
 * Format validation result for console output
 */
export function formatViewModelValidation(result: PdpViewModelValidation): string {
    const lines: string[] = [];

    lines.push(`Product: ${result.productId} (${result.categoryId})`);
    lines.push(result.summary);

    if (result.missingSections.length > 0) {
        lines.push('\n❌ MISSING SECTIONS (must fix):');
        result.missingSections.forEach(s => {
            lines.push(`  • ${s.name}`);
        });
    }

    if (result.notAvailableSections.length > 0) {
        lines.push('\nℹ️ Not Available (explicit state - OK):');
        result.notAvailableSections.forEach(s => {
            lines.push(`  • ${s.name}${s.reason ? `: ${s.reason}` : ''}`);
        });
    }

    return lines.join('\n');
}

// ============================================
// DEV BANNER HELPER
// ============================================

/**
 * Generate DEV banner content for missing sections
 */
export function generateDevBanner(result: PdpViewModelValidation): string | null {
    if (result.valid) return null;

    return `🚨 PDP INCOMPLETE - ${result.missingSections.length} section(s) missing:\n${result.missingSections.map(s => `• ${s.name}`).join('\n')}`;
}
