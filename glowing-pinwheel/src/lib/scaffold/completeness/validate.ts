/**
 * @file validate.ts
 * @description P11: Validation logic reutilizável para scaffolder
 * 
 * Exit Codes:
 *   0 - OK, passed all checks
 *   1 - Warnings only (missing recommended fields)
 *   2 - Errors (missing required fields, schema invalid, or strict evidence failure)
 */

import { z } from 'zod';

// ============================================
// TYPES
// ============================================

export interface CompletenessContract {
    categoryId: string;
    maturity: 'production' | 'stub';
    requiredFieldsProducts: string[];
    requiredFieldsMock: string[];
    evidenceRequiredFields: string[];
    recommendedFields: string[];
}

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

export interface RepairPrompt {
    categoryId: string;
    missingRequired: string[];
    missingEvidence: string[];
    suggestedJson: Record<string, unknown>;
}

export interface ValidateOptions {
    strict: boolean;
    reportOutPath?: string;
    repairPromptOutPath?: string;
    allowWriteOnWarnings: boolean;
}

export interface ValidateDecision {
    canWrite: boolean;
    exitCode: 0 | 1 | 2;
    reason: string;
    result: ValidationResult;
    repairPrompt: RepairPrompt;
    report: string;
}

// ============================================
// INLINE SCHEMA (avoid import issues)
// ============================================

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
// BASE FIELDS
// ============================================

const BASE_PRODUCT_FIELDS = [
    'product.name', 'product.brand', 'product.model', 'product.categoryId',
    'price.valueBRL', 'price.sourceUrl', 'sources',
];

const BASE_EVIDENCE_FIELDS = ['product.brand', 'product.model', 'price.valueBRL'];

const BASE_RECOMMENDED_FIELDS = [
    'scoreReasons.c1', 'scoreReasons.c2', 'scoreReasons.c3',
    'badges', 'offers', 'mainCompetitor',
];

// ============================================
// DEFAULT CONTRACT
// ============================================

export function getDefaultContract(categoryId: string): CompletenessContract {
    return {
        categoryId,
        maturity: 'stub',
        requiredFieldsProducts: BASE_PRODUCT_FIELDS,
        requiredFieldsMock: BASE_PRODUCT_FIELDS,
        evidenceRequiredFields: BASE_EVIDENCE_FIELDS,
        recommendedFields: BASE_RECOMMENDED_FIELDS,
    };
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
// CORE VALIDATION
// ============================================

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

export function generateReport(result: ValidationResult, options: ValidateOptions): string {
    const statusIcon = result.overallPass ? '✅' : '❌';
    const schemaIcon = result.schemaValid ? '✅' : '❌';

    let report = `# Product Completeness Report

**Category**: \`${result.categoryId}\` (${result.maturity})
**Status**: ${statusIcon} ${result.overallPass ? 'PASS' : 'FAIL'}
**Completeness**: ${result.completenessPercent}%
**Mode**: ${options.strict ? 'STRICT' : 'NORMAL'}

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
    if (result.missingRequiredFields.length > 0 || (options.strict && result.missingEvidenceFields.length > 0)) {
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
// DECISION LOGIC
// ============================================

/**
 * Decide if write is allowed based on validation result and options.
 * 
 * Policy:
 * - missingRequired => block ALWAYS, exit 2
 * - strict + missingEvidence => block, exit 2
 * - only missingRecommended => allow (if allowWriteOnWarnings), exit 1
 * - all ok => allow, exit 0
 */
export function makeWriteDecision(
    result: ValidationResult,
    options: ValidateOptions
): ValidateDecision {
    const repairPrompt = generateRepairPrompt(result);
    const report = generateReport(result, options);

    // Case 1: Schema invalid or missing required
    if (!result.schemaValid || result.missingRequiredFields.length > 0) {
        return {
            canWrite: false,
            exitCode: 2,
            reason: 'WRITE BLOCKED: Missing required fields or schema invalid',
            result,
            repairPrompt,
            report,
        };
    }

    // Case 2: Strict mode + missing evidence
    if (options.strict && result.missingEvidenceFields.length > 0) {
        return {
            canWrite: false,
            exitCode: 2,
            reason: 'WRITE BLOCKED (STRICT): Missing evidence for required fields',
            result,
            repairPrompt,
            report,
        };
    }

    // Case 3: Only missing recommended
    if (result.missingRecommendedFields.length > 0) {
        return {
            canWrite: options.allowWriteOnWarnings,
            exitCode: 1,
            reason: options.allowWriteOnWarnings
                ? 'WRITE ALLOWED with warnings (missing recommended)'
                : 'WRITE BLOCKED: Missing recommended fields',
            result,
            repairPrompt,
            report,
        };
    }

    // Case 4: All OK
    return {
        canWrite: true,
        exitCode: 0,
        reason: 'WRITE ALLOWED: All checks passed',
        result,
        repairPrompt,
        report,
    };
}
