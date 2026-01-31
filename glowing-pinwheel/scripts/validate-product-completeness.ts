#!/usr/bin/env npx tsx
/**
 * @file validate-product-completeness.ts
 * @description P10-A: Validador de completude de produto (import fix)
 * 
 * Exit Codes:
 *   0 - OK, passed all checks
 *   1 - Warnings only (missing recommended fields)
 *   2 - Errors (missing required fields or schema invalid)
 * 
 * Usage:
 *   npx tsx scripts/validate-product-completeness.ts --category tv --in samples/tv.input.json
 *   npx tsx scripts/validate-product-completeness.ts --category tv --in samples/tv.input.json --strict
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');

// ============================================
// INLINE COMPLETENESS CONTRACT (avoid import issues)
// ============================================

interface CompletenessContract {
    categoryId: string;
    maturity: 'production' | 'stub';
    requiredFieldsProducts: string[];
    requiredFieldsMock: string[];
    evidenceRequiredFields: string[];
    recommendedFields: string[];
}

// Load contracts dynamically
function loadContracts(): Record<string, CompletenessContract> {
    const contractsPath = path.join(PROJECT_ROOT, 'src', 'lib', 'scaffold', 'completeness', 'index.ts');

    // For tsx: we use dynamic require with ts-node compatibility
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const module = require(contractsPath);
        return module.ALL_CONTRACTS || {};
    } catch {
        console.error('⚠️ Could not load contracts dynamically, using fallback');
        return {};
    }
}

// Base fields
const BASE_PRODUCT_FIELDS = [
    'product.name', 'product.brand', 'product.model', 'product.categoryId',
    'price.valueBRL', 'price.sourceUrl', 'sources',
];

const BASE_EVIDENCE_FIELDS = ['product.brand', 'product.model', 'price.valueBRL'];

function getDefaultContract(categoryId: string): CompletenessContract {
    return {
        categoryId,
        maturity: 'stub',
        requiredFieldsProducts: BASE_PRODUCT_FIELDS,
        requiredFieldsMock: BASE_PRODUCT_FIELDS,
        evidenceRequiredFields: BASE_EVIDENCE_FIELDS,
        recommendedFields: [],
    };
}

// ============================================
// SCHEMA VALIDATION (inline to avoid import)
// ============================================

import { z } from 'zod';

const SourceSchema = z.object({
    url: z.string().url(),
    accessedAt: z.string().optional(),
    type: z.enum(['amazon', 'manufacturer', 'review', 'marketplace', 'inmetro', 'other']).optional(),
});

const PriceInfoSchema = z.object({
    valueBRL: z.number().positive(),
    observedAt: z.string(),
    sourceUrl: z.string().url(),
    currency: z.literal('BRL').default('BRL'),
});

const GenericInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.string().min(1),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: z.record(z.string(), z.unknown()).optional(),
    evidence: z.record(z.string(), z.object({
        sourceUrl: z.string().url(),
        note: z.string().optional(),
    })).optional(),
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

// ============================================
// ARGS
// ============================================

interface Args {
    category: string;
    inputPath: string;
    strict: boolean;
    outputReport: string | null;
    repairPromptOut: string | null;
}

function parseArgs(): Args {
    const args = process.argv.slice(2);
    const result: Args = {
        category: '',
        inputPath: '',
        strict: false,
        outputReport: null,
        repairPromptOut: null,
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--category' && args[i + 1]) {
            result.category = args[i + 1];
            i++;
        } else if (args[i] === '--in' && args[i + 1]) {
            result.inputPath = args[i + 1];
            i++;
        } else if (args[i] === '--strict') {
            result.strict = true;
        } else if (args[i] === '--report-out' && args[i + 1]) {
            result.outputReport = args[i + 1];
            i++;
        } else if (args[i] === '--repair-prompt-out' && args[i + 1]) {
            result.repairPromptOut = args[i + 1];
            i++;
        }
    }

    return result;
}

// ============================================
// UTILS
// ============================================

function getNestedValue(obj: unknown, fieldPath: string): unknown {
    const parts = fieldPath.split('.');
    let current: unknown = obj;

    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[part];
    }

    return current;
}

function isValuePresent(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
}

// ============================================
// VALIDATOR
// ============================================

export interface ValidationResult {
    categoryId: string;
    maturity: 'production' | 'stub';
    schemaValid: boolean;
    schemaErrors: string[];

    requiredFieldsChecked: number;
    requiredFieldsPassed: number;
    missingRequiredFields: string[];

    evidenceFieldsChecked: number;
    evidenceFieldsPassed: number;
    missingEvidenceFields: string[];

    recommendedFieldsChecked: number;
    recommendedFieldsPassed: number;
    missingRecommendedFields: string[];

    overallPass: boolean;
    completenessPercent: number;
}

export function validateInput(
    categoryId: string,
    data: unknown,
    contract: CompletenessContract
): ValidationResult {
    const result: ValidationResult = {
        categoryId,
        maturity: contract.maturity,
        schemaValid: true,
        schemaErrors: [],
        requiredFieldsChecked: contract.requiredFieldsMock.length,
        requiredFieldsPassed: 0,
        missingRequiredFields: [],
        evidenceFieldsChecked: contract.evidenceRequiredFields.length,
        evidenceFieldsPassed: 0,
        missingEvidenceFields: [],
        recommendedFieldsChecked: contract.recommendedFields.length,
        recommendedFieldsPassed: 0,
        missingRecommendedFields: [],
        overallPass: true,
        completenessPercent: 0,
    };

    // 1. Validate schema
    const parseResult = GenericInputSchema.safeParse(data);
    if (!parseResult.success) {
        result.schemaValid = false;
        result.schemaErrors = parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
        result.overallPass = false;
    }

    // 2. Check required fields
    for (const field of contract.requiredFieldsMock) {
        const value = getNestedValue(data, field);
        if (isValuePresent(value)) {
            result.requiredFieldsPassed++;
        } else {
            result.missingRequiredFields.push(field);
        }
    }

    // 3. Check evidence fields
    const evidenceMap = getNestedValue(data, 'evidence') as Record<string, unknown> | undefined;
    for (const field of contract.evidenceRequiredFields) {
        const hasEvidence = evidenceMap && field in evidenceMap;
        if (hasEvidence) {
            result.evidenceFieldsPassed++;
        } else {
            result.missingEvidenceFields.push(field);
        }
    }

    // 4. Check recommended fields
    for (const field of contract.recommendedFields) {
        const value = getNestedValue(data, field);
        if (isValuePresent(value)) {
            result.recommendedFieldsPassed++;
        } else {
            result.missingRecommendedFields.push(field);
        }
    }

    // 5. Calculate completeness
    const totalChecks = result.requiredFieldsChecked + result.evidenceFieldsChecked;
    const totalPassed = result.requiredFieldsPassed + result.evidenceFieldsPassed;
    result.completenessPercent = totalChecks > 0
        ? Math.round((totalPassed / totalChecks) * 100)
        : 100;

    // 6. Overall pass (required fields must be present)
    if (result.missingRequiredFields.length > 0) {
        result.overallPass = false;
    }

    return result;
}

// ============================================
// REPAIR PROMPT
// ============================================

export interface RepairPrompt {
    categoryId: string;
    missingRequired: string[];
    missingEvidence: string[];
    suggestedJson: Record<string, unknown>;
}

export function generateRepairPrompt(result: ValidationResult): RepairPrompt {
    const suggestedJson: Record<string, unknown> = {};

    for (const field of result.missingRequiredFields) {
        suggestedJson[field] = 'TODO';
    }

    if (result.missingEvidenceFields.length > 0) {
        const evidenceObj: Record<string, unknown> = {};
        for (const field of result.missingEvidenceFields) {
            evidenceObj[field] = { sourceUrl: 'https://...', note: 'Fonte oficial' };
        }
        suggestedJson['evidence'] = evidenceObj;
    }

    return {
        categoryId: result.categoryId,
        missingRequired: result.missingRequiredFields,
        missingEvidence: result.missingEvidenceFields,
        suggestedJson,
    };
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport(result: ValidationResult, strict: boolean): string {
    const statusIcon = result.overallPass ? '✅' : '❌';
    const schemaIcon = result.schemaValid ? '✅' : '❌';

    let report = `# Product Completeness Report

**Category**: \`${result.categoryId}\` (${result.maturity})
**Status**: ${statusIcon} ${result.overallPass ? 'PASS' : 'FAIL'}
**Completeness**: ${result.completenessPercent}%
**Mode**: ${strict ? 'STRICT' : 'NORMAL'}

## Schema Validation

${schemaIcon} Schema: ${result.schemaValid ? 'Valid' : 'Invalid'}

${result.schemaErrors.length > 0 ? result.schemaErrors.map(e => `- ❌ ${e}`).join('\n') : '_No errors._'}

## Required Fields (${result.requiredFieldsPassed}/${result.requiredFieldsChecked})

${result.missingRequiredFields.length === 0
            ? '✅ All required fields present.'
            : result.missingRequiredFields.map(f => `- ❌ MISSING: \`${f}\``).join('\n')}

## Evidence Fields (${result.evidenceFieldsPassed}/${result.evidenceFieldsChecked})

${result.missingEvidenceFields.length === 0
            ? '✅ All evidence fields have sourceUrl.'
            : result.missingEvidenceFields.map(f => `- ⚠️ NO EVIDENCE: \`${f}\``).join('\n')}

## Recommended Fields (${result.recommendedFieldsPassed}/${result.recommendedFieldsChecked})

${result.missingRecommendedFields.length === 0
            ? '✅ All recommended fields present.'
            : result.missingRecommendedFields.slice(0, 5).map(f => `- ⚠️ MISSING: \`${f}\``).join('\n')}
${result.missingRecommendedFields.length > 5 ? `\n... and ${result.missingRecommendedFields.length - 5} more` : ''}
`;

    // Add repair prompt if there are missing fields
    if (result.missingRequiredFields.length > 0 || (strict && result.missingEvidenceFields.length > 0)) {
        const repair = generateRepairPrompt(result);
        report += `
## Repair Prompt

Para completar o cadastro, adicione os seguintes campos:

\`\`\`json
${JSON.stringify(repair.suggestedJson, null, 2)}
\`\`\`
`;
    }

    return report;
}

// ============================================
// MAIN
// ============================================

const args = parseArgs();

if (!args.category || !args.inputPath) {
    console.error('Usage: npx tsx scripts/validate-product-completeness.ts --category <id> --in <path> [--strict] [--report-out <path>] [--repair-prompt-out <path>]');
    console.error('\nExit Codes:');
    console.error('  0 - OK');
    console.error('  1 - Warnings (missing recommended)');
    console.error('  2 - Errors (missing required or schema invalid)');
    process.exit(2);
}

// Resolve input path
let inputFile = args.inputPath;
if (!path.isAbsolute(inputFile)) {
    inputFile = path.join(PROJECT_ROOT, inputFile);
}

// Check if file exists
if (!fs.existsSync(inputFile)) {
    console.error(`❌ ERRO: Arquivo não encontrado: ${inputFile}`);
    process.exit(2);
}

// Load input
const rawData = fs.readFileSync(inputFile, 'utf-8');
let inputData: unknown;
try {
    inputData = JSON.parse(rawData);
} catch {
    console.error(`❌ ERRO: JSON inválido: ${inputFile}`);
    process.exit(2);
}

// Get contract
const contracts = loadContracts();
const contract = contracts[args.category] || getDefaultContract(args.category);

// Validate
const result = validateInput(args.category, inputData, contract);
const report = generateReport(result, args.strict);

// Output report
console.log(report);

// Save report if requested
if (args.outputReport) {
    const outputPath = path.isAbsolute(args.outputReport)
        ? args.outputReport
        : path.join(PROJECT_ROOT, args.outputReport);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, report, 'utf-8');
    console.log(`📁 Report saved to: ${outputPath}`);
}

// Save repair prompt if requested
if (args.repairPromptOut) {
    const repair = generateRepairPrompt(result);
    const repairPath = path.isAbsolute(args.repairPromptOut)
        ? args.repairPromptOut
        : path.join(PROJECT_ROOT, args.repairPromptOut);
    fs.mkdirSync(path.dirname(repairPath), { recursive: true });
    fs.writeFileSync(repairPath, JSON.stringify(repair, null, 2), 'utf-8');
    console.log(`📁 Repair prompt saved to: ${repairPath}`);
}

// Exit code based on result
if (!result.schemaValid || result.missingRequiredFields.length > 0) {
    console.error(`\n🔴 Validation FAILED: Missing required fields or schema errors.`);
    process.exit(2);
}

if (args.strict && result.missingEvidenceFields.length > 0) {
    console.error(`\n🔴 STRICT MODE: Missing evidence for required fields.`);
    process.exit(2);
}

if (result.missingRecommendedFields.length > 0) {
    console.log(`\n⚠️ Validation passed with warnings (missing recommended fields).`);
    process.exit(1);
}

console.log(`\n✅ Validation passed.`);
process.exit(0);
