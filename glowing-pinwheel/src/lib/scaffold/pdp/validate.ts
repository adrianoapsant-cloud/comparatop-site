/**
 * @file validate.ts
 * @description PDP Modules Validator - Valida mocks contra o contrato de módulos obrigatórios
 * 
 * Exit codes:
 *   0 = Válido (todos os módulos presentes e corretos)
 *   1 = Warning (módulos opcionais ausentes ou __CT_TODO__ presente)
 *   2 = Erro crítico (módulo obrigatório ausente ou mismatch de categoria)
 */

import {
    PDP_CONTRACT,
    REQUIRED_MOCK_MODULES,
    REQUIRED_AUDIT_VERDICT_SECTIONS,
    PRODUCT_DNA_RULES,
    REQUIRED_PRODUCT_FIELDS,
    REQUIRED_HEADER_FIELDS,
    REQUIRED_DIMENSION_FIELDS,
} from './contract';
import { getAllCategoryIds } from '@/data/categories';
import { HMUM_CONFIG_ALIASES, getHmumConfigForCategory } from '@/lib/scoring/hmum/configs';

// ============================================
// TYPES
// ============================================

export interface ValidationError {
    code: string;
    severity: 'error' | 'warning';
    message: string;
    path?: string;
}

export interface PdpValidationResult {
    exitCode: 0 | 1 | 2;
    productId: string;
    categoryId: string;
    resolvedCategoryId: string;
    errors: ValidationError[];
    warnings: ValidationError[];
    summary: string;
}

// ============================================
// CATEGORY RESOLUTION
// ============================================

/**
 * Resolve categoryId para o canônico
 * Usa HMUM_CONFIG_ALIASES para mapear aliases → canônico
 */
export function resolveCategoryId(input: string): string {
    // Se já é um categoryId canônico em RAW_CATEGORIES
    const canonicalIds = getAllCategoryIds();
    if (canonicalIds.includes(input)) {
        return input;
    }

    // Tentar resolver via alias reverso (slug legado → canônico)
    for (const [canonical, legacy] of Object.entries(HMUM_CONFIG_ALIASES)) {
        if (legacy === input || canonical === input) {
            return canonical;
        }
    }

    // Não encontrado - retorna original (vai falhar na validação)
    return input;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Valida módulos de um mock PDP
 */
export function validatePdpModules(
    mock: Record<string, unknown>,
    expectedCategoryId: string
): PdpValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Extrair dados do mock
    const product = mock.product as Record<string, unknown> | undefined;
    const productId = (product?.id as string) || 'unknown';
    const mockCategoryId = (product?.category as string) || '';
    const resolvedCategoryId = resolveCategoryId(mockCategoryId);
    const expectedResolved = resolveCategoryId(expectedCategoryId);

    // ============================================
    // A) Validação de categoria (CRÍTICO)
    // ============================================

    if (!mockCategoryId) {
        errors.push({
            code: 'MISSING_CATEGORY',
            severity: 'error',
            message: 'Mock não possui product.category',
            path: 'product.category',
        });
    } else if (resolvedCategoryId !== expectedResolved) {
        errors.push({
            code: 'CATEGORY_MISMATCH',
            severity: 'error',
            message: `Category mismatch: mock tem '${mockCategoryId}' (→${resolvedCategoryId}), esperado '${expectedCategoryId}' (→${expectedResolved})`,
            path: 'product.category',
        });
    }

    // Verificar se categoria existe em RAW_CATEGORIES
    const canonicalIds = getAllCategoryIds();
    if (mockCategoryId && !canonicalIds.includes(resolvedCategoryId)) {
        errors.push({
            code: 'UNKNOWN_CATEGORY',
            severity: 'error',
            message: `Categoria '${resolvedCategoryId}' não existe em RAW_CATEGORIES`,
            path: 'product.category',
        });
    }

    // ============================================
    // B) Validação de módulos obrigatórios
    // ============================================

    for (const module of REQUIRED_MOCK_MODULES) {
        if (!(module in mock)) {
            errors.push({
                code: 'MISSING_MODULE',
                severity: 'error',
                message: `Módulo obrigatório ausente: '${module}'`,
                path: module,
            });
        }
    }

    // ============================================
    // C) Validação de campos obrigatórios em product
    // ============================================

    if (product) {
        for (const field of REQUIRED_PRODUCT_FIELDS) {
            if (!(field in product) || product[field] === undefined || product[field] === '') {
                errors.push({
                    code: 'MISSING_PRODUCT_FIELD',
                    severity: 'error',
                    message: `Campo obrigatório ausente em product: '${field}'`,
                    path: `product.${field}`,
                });
            }
        }
    }

    // ============================================
    // D) Validação de header
    // ============================================

    const header = mock.header as Record<string, unknown> | undefined;
    if (header) {
        for (const field of REQUIRED_HEADER_FIELDS) {
            if (!(field in header) || header[field] === undefined) {
                errors.push({
                    code: 'MISSING_HEADER_FIELD',
                    severity: 'error',
                    message: `Campo obrigatório ausente em header: '${field}'`,
                    path: `header.${field}`,
                });
            }
        }
    }

    // ============================================
    // E) Validação de auditVerdict
    // ============================================

    const auditVerdict = mock.auditVerdict as Record<string, unknown> | undefined;
    if (auditVerdict) {
        for (const section of REQUIRED_AUDIT_VERDICT_SECTIONS) {
            if (!(section in auditVerdict)) {
                errors.push({
                    code: 'MISSING_AUDIT_SECTION',
                    severity: 'error',
                    message: `Seção obrigatória ausente em auditVerdict: '${section}'`,
                    path: `auditVerdict.${section}`,
                });
            }
        }
    }

    // ============================================
    // F) Validação de productDna
    // ============================================

    const productDna = mock.productDna as { dimensions?: unknown[] } | undefined;
    if (productDna) {
        const dimensions = productDna.dimensions as Record<string, unknown>[] | undefined;

        if (!dimensions || !Array.isArray(dimensions)) {
            errors.push({
                code: 'MISSING_DIMENSIONS',
                severity: 'error',
                message: 'productDna.dimensions ausente ou não é array',
                path: 'productDna.dimensions',
            });
        } else {
            // Verificar contagem
            if (dimensions.length < PRODUCT_DNA_RULES.minDimensions) {
                errors.push({
                    code: 'INSUFFICIENT_DIMENSIONS',
                    severity: 'error',
                    message: `productDna.dimensions tem ${dimensions.length} dimensões, mínimo é ${PRODUCT_DNA_RULES.minDimensions}`,
                    path: 'productDna.dimensions',
                });
            }

            // Verificar soma dos pesos
            const weightSum = dimensions.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
            if (Math.abs(weightSum - 1.0) > PRODUCT_DNA_RULES.weightSumTolerance) {
                errors.push({
                    code: 'INVALID_WEIGHT_SUM',
                    severity: 'error',
                    message: `Soma dos pesos em productDna.dimensions = ${weightSum.toFixed(2)}, esperado ~1.0`,
                    path: 'productDna.dimensions[].weight',
                });
            }

            // Verificar campos obrigatórios em cada dimensão
            dimensions.forEach((dim, index) => {
                for (const field of REQUIRED_DIMENSION_FIELDS) {
                    if (!(field in dim) || dim[field] === undefined) {
                        errors.push({
                            code: 'MISSING_DIMENSION_FIELD',
                            severity: 'error',
                            message: `Campo ausente em dimensão ${index}: '${field}'`,
                            path: `productDna.dimensions[${index}].${field}`,
                        });
                    }
                }
            });

            // Verificar que dimensões correspondem à categoria (via HMUM config)
            const hmumConfig = getHmumConfigForCategory(resolvedCategoryId);
            if (hmumConfig) {
                const expectedCriteriaIds = hmumConfig.criteria.map(c => c.id);
                const mockDimensionIds = dimensions.map(d => d.id as string);

                // Verificar se os IDs das dimensões correspondem aos critérios esperados
                // (pode ser c1, c2... ou nomes semânticos dependendo da implementação)
                // Por enquanto, apenas verificar contagem
            }
        }
    }

    // ============================================
    // G) Verificar __CT_TODO__ (warning)
    // ============================================

    const mockStr = JSON.stringify(mock);
    if (mockStr.includes('__CT_TODO__')) {
        warnings.push({
            code: 'HAS_PLACEHOLDERS',
            severity: 'warning',
            message: 'Mock contém placeholders __CT_TODO__ que precisam ser preenchidos',
        });
    }

    // ============================================
    // Determinar exit code
    // ============================================

    let exitCode: 0 | 1 | 2;
    let summary: string;

    if (errors.length > 0) {
        exitCode = 2;
        summary = `ERRO: ${errors.length} erros críticos encontrados`;
    } else if (warnings.length > 0) {
        exitCode = 1;
        summary = `WARNING: ${warnings.length} avisos encontrados`;
    } else {
        exitCode = 0;
        summary = 'Válido: todos os módulos PDP presentes e corretos';
    }

    return {
        exitCode,
        productId,
        categoryId: mockCategoryId,
        resolvedCategoryId,
        errors,
        warnings,
        summary,
    };
}

/**
 * Valida múltiplos mocks de uma vez
 */
export function validateAllMocks(
    mocks: Array<{ mock: Record<string, unknown>; expectedCategoryId: string }>
): { results: PdpValidationResult[]; overallExitCode: 0 | 1 | 2 } {
    const results = mocks.map(({ mock, expectedCategoryId }) =>
        validatePdpModules(mock, expectedCategoryId)
    );

    const hasErrors = results.some(r => r.exitCode === 2);
    const hasWarnings = results.some(r => r.exitCode === 1);

    return {
        results,
        overallExitCode: hasErrors ? 2 : hasWarnings ? 1 : 0,
    };
}

/**
 * Formata resultado de validação para console
 */
export function formatValidationResult(result: PdpValidationResult): string {
    const lines: string[] = [];

    const statusIcon = result.exitCode === 0 ? '✅' : result.exitCode === 1 ? '⚠️' : '❌';
    lines.push(`${statusIcon} ${result.productId} (${result.resolvedCategoryId})`);

    if (result.errors.length > 0) {
        lines.push('  Errors:');
        result.errors.forEach(e => lines.push(`    ❌ [${e.code}] ${e.message}`));
    }

    if (result.warnings.length > 0) {
        lines.push('  Warnings:');
        result.warnings.forEach(w => lines.push(`    ⚠️ [${w.code}] ${w.message}`));
    }

    return lines.join('\n');
}

export default { validatePdpModules, validateAllMocks, resolveCategoryId, formatValidationResult };
