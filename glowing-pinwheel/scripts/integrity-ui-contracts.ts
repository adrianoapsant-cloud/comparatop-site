/**
 * @file integrity-ui-contracts.ts
 * @description Guardrails para evitar regressões em superfícies críticas (PDP/PLP)
 * 
 * P0 Contracts:
 * 1. PDP deve ter: ContextScoreSection, OwnershipInsights, ProductUnknownUnknownsWidget
 * 2. PLP deve ter: ComparaMatch, EditorialWinners, HybridProductList, pushState, ChatContext
 * 
 * Run: npx tsx scripts/integrity-ui-contracts.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const COLORS = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

interface ContractCheck {
    name: string;
    file: string;
    required: string[];
    anchors?: string[]; // Optional DOM anchors (id attributes)
    forbidden?: string[]; // Strings that MUST NOT be present (guardrails)
}

const UI_CONTRACTS: ContractCheck[] = [
    // ============================================
    // PDP (Product Detail Page) CONTRACTS
    // ============================================
    {
        name: 'PDP - ProductDetailPage.tsx',
        file: 'src/components/ProductDetailPage.tsx',
        required: [
            'ContextScoreSection',           // Score Contextual (HMUM v4)
            'OwnershipInsights',             // TCO Section
            'OwnershipInsightsExpanded',     // TCO with SIC components
            'ProductUnknownUnknownsWidget',  // Engenharia Oculta
            'analyzeProductOwnership',       // TCO calculation function
            'hasComponentMapping',           // SIC integration
        ],
        anchors: [
            'id="context-score"',
            'id="ownership-insights"',
            'id="unknown-unknowns"',
        ],
    },

    // ============================================
    // PLP (Category Listing Page) CONTRACTS
    // ============================================

    // Client Component - Interactive logic
    {
        name: 'PLP Client - CategoryPageClient.tsx',
        file: 'src/app/categorias/[slug]/CategoryPageClient.tsx',
        required: [
            'ComparaMatch',           // Filter ribbon
            'EditorialWinners',       // Winner badges
            'HybridProductList',      // Product grid
            'pushState',              // Pagination SEO
            'useChat',                // ChatContext integration
            'updateCatalogSnapshot',  // Catalog sync for chat
            'CategoryFilters',        // Sidebar filters
            'MatchFilterRibbon',      // Match chips
        ],
    },

    // Server Component - SSR + SEO
    {
        name: 'PLP Server - page.tsx',
        file: 'src/app/categorias/[slug]/page.tsx',
        required: [
            'generateMetadata',           // SEO metadata
            'categoryBreadcrumb',         // JSON-LD
            'CategoryPageClient',         // Client component import
            'getProductsByCategory',      // SSOT data fetch
            'SLUG_TO_CATEGORY',           // Route mapping
            'selectProductCards',         // VM selector
        ],
    },

    // ============================================
    // LINK CONTRACTS GUARDRAIL
    // ============================================
    // Ensures integrity-links.ts uses data-attribute based contracts
    // instead of fragile regex patterns
    {
        name: 'Link Contracts - No Regex Patterns',
        file: 'scripts/integrity-links.ts',
        required: [
            'data-integrity',                // Must check data-integrity attribute
            'aria-disabled',                 // Must check aria-disabled attribute
        ],
        forbidden: [
            'OPTIONAL_LINK_PATTERNS',        // Regex workaround MUST NOT exist
        ],
    },
];

function checkContract(contract: ContractCheck): { passed: boolean; errors: string[] } {
    const errors: string[] = [];
    const filePath = path.resolve(process.cwd(), contract.file);

    // Check file exists
    if (!fs.existsSync(filePath)) {
        return { passed: false, errors: [`File not found: ${contract.file}`] };
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check required strings
    for (const req of contract.required) {
        if (!content.includes(req)) {
            errors.push(`Missing required: "${req}"`);
        }
    }

    // Check forbidden strings (guardrails)
    if (contract.forbidden) {
        for (const forbidden of contract.forbidden) {
            if (content.includes(forbidden)) {
                errors.push(`FORBIDDEN pattern found: "${forbidden}" - This is a guardrail violation!`);
            }
        }
    }

    // Check anchors if specified
    if (contract.anchors) {
        for (const anchor of contract.anchors) {
            if (!content.includes(anchor)) {
                errors.push(`Missing anchor: "${anchor}"`);
            }
        }
    }

    return { passed: errors.length === 0, errors };
}

function runIntegrityCheck(): boolean {
    console.log(`\n${COLORS.cyan}═══════════════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.cyan}       UI CONTRACTS INTEGRITY CHECK${COLORS.reset}`);
    console.log(`${COLORS.cyan}       Protecting PDP & PLP from regressions${COLORS.reset}`);
    console.log(`${COLORS.cyan}═══════════════════════════════════════════════════${COLORS.reset}\n`);

    let allPassed = true;

    for (const contract of UI_CONTRACTS) {
        console.log(`${COLORS.yellow}Checking: ${contract.name}${COLORS.reset}`);

        const result = checkContract(contract);

        if (result.passed) {
            console.log(`  ${COLORS.green}✓ All ${contract.required.length} contracts satisfied${COLORS.reset}`);
            if (contract.anchors) {
                console.log(`  ${COLORS.green}✓ All ${contract.anchors.length} DOM anchors present${COLORS.reset}`);
            }
        } else {
            allPassed = false;
            console.log(`  ${COLORS.red}✗ FAILED - ${result.errors.length} violations${COLORS.reset}`);
            for (const error of result.errors) {
                console.log(`    ${COLORS.red}• ${error}${COLORS.reset}`);
            }
        }
        console.log();
    }

    // Summary
    console.log(`${COLORS.cyan}═══════════════════════════════════════════════════${COLORS.reset}`);
    if (allPassed) {
        console.log(`${COLORS.green}✓ ALL UI CONTRACTS PASSED${COLORS.reset}`);
        console.log(`${COLORS.green}  PDP and PLP surfaces are protected${COLORS.reset}`);
    } else {
        console.log(`${COLORS.red}✗ UI CONTRACT VIOLATIONS DETECTED${COLORS.reset}`);
        console.log(`${COLORS.red}  Fix the issues above before committing${COLORS.reset}`);
    }
    console.log(`${COLORS.cyan}═══════════════════════════════════════════════════${COLORS.reset}\n`);

    return allPassed;
}

// Run check
const success = runIntegrityCheck();
process.exit(success ? 0 : 1);
