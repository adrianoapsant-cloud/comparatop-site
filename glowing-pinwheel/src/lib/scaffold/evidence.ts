/**
 * @file evidence.ts
 * @description P5-1: Evidence Gate - Define campos críticos e validação
 */

import type { EvidenceMap, Source } from './schemas/common';

// ============================================
// CRITICAL FIELDS (sempre obrigatórios com --strict)
// ============================================

/**
 * Campos sempre críticos (todas as categorias)
 */
export const ALWAYS_CRITICAL_FIELDS = [
    'product.brand',
    'product.model',
    'price.valueBRL',
    'price.sourceUrl',
    'sources[0].url',
] as const;

/**
 * Campos críticos por categoria (specs que disparam regras determinísticas)
 */
export const CRITICAL_FIELDS_BY_CATEGORY: Record<string, string[]> = {
    'robot-vacuum': [
        'specs.suctionPa',
        'specs.navigationType',
        'specs.hasSelfEmpty',
    ],
    'tv': [
        'specs.screenSize',
        'specs.panelType',
        'specs.resolution',
        'specs.refreshRate',
    ],
    'fridge': [
        'specs.capacityLiters',
        'specs.hasFrostFree',
        'specs.hasInverter',
        'energy.inmetroKwhYear',
    ],
    'air_conditioner': [
        'specs.btus',
        'specs.hasInverter',
        'specs.inverterType',
        'energy.labelKwhMonth',
    ],
    'smartwatch': [
        'specs.batteryDays',
        'specs.hasGps',
        'specs.hasNfc',
    ],
    'smartphone': [
        'specs.storage',
        'specs.ram',
        'specs.certification',
        'specs.fiveG',
    ],
    'laptop': [
        'specs.processor',
        'specs.ram',
        'specs.storage',
    ],
    'washer': [
        'specs.capacityKg',
        'specs.hasInverter',
    ],
    'monitor': [
        'specs.screenSize',
        'specs.resolution',
        'specs.refreshRate',
    ],
    'tablet': [
        'specs.storage',
        'specs.displaySize',
    ],
    'soundbar': [
        'specs.watts',
        'specs.hasDolbyAtmos',
    ],
};

// ============================================
// VALIDATION
// ============================================

export interface EvidenceValidationResult {
    valid: boolean;
    missingEvidence: Array<{
        fieldPath: string;
        reason: string;
    }>;
    warnings: string[];
}

/**
 * Valida se todos os campos críticos têm evidência
 */
export function validateEvidence(
    categoryId: string,
    input: Record<string, unknown>,
    evidenceMap: EvidenceMap,
    sources: Source[],
    priceSourceUrl: string
): EvidenceValidationResult {
    const missingEvidence: EvidenceValidationResult['missingEvidence'] = [];
    const warnings: string[] = [];

    // Coletar URLs válidas das sources
    const validUrls = new Set<string>([
        priceSourceUrl,
        ...sources.map(s => s.url),
    ]);

    // Campos sempre críticos
    for (const fieldPath of ALWAYS_CRITICAL_FIELDS) {
        const value = getValueByPath(input, fieldPath);
        if (value === undefined) {
            missingEvidence.push({
                fieldPath,
                reason: 'Campo obrigatório ausente',
            });
            continue;
        }

        // Para campos sempre críticos, price.sourceUrl é evidência default
        // Não exigir evidence explícito para product.brand/model/price.*
        if (!fieldPath.startsWith('product.') && !fieldPath.startsWith('price.') && !fieldPath.startsWith('sources')) {
            const evidence = evidenceMap?.[fieldPath];
            if (!evidence) {
                warnings.push(`${fieldPath}: sem evidência explícita, usando price.sourceUrl como default`);
            } else if (!validUrls.has(evidence.sourceUrl)) {
                missingEvidence.push({
                    fieldPath,
                    reason: `sourceUrl não está em sources[]: ${evidence.sourceUrl}`,
                });
            }
        }
    }

    // Campos críticos da categoria
    const categoryCriticalFields = CRITICAL_FIELDS_BY_CATEGORY[categoryId] || [];
    for (const fieldPath of categoryCriticalFields) {
        const value = getValueByPath(input, fieldPath);
        if (value === undefined) {
            // Campo não existe - não é erro de evidência, é campo ausente
            continue;
        }

        const evidence = evidenceMap?.[fieldPath];
        if (!evidence) {
            missingEvidence.push({
                fieldPath,
                reason: 'Campo crítico da categoria sem evidência',
            });
        } else if (!validUrls.has(evidence.sourceUrl)) {
            missingEvidence.push({
                fieldPath,
                reason: `sourceUrl não está em sources[]: ${evidence.sourceUrl}`,
            });
        }
    }

    return {
        valid: missingEvidence.length === 0,
        missingEvidence,
        warnings,
    };
}

/**
 * Acessa valor por path (ex: "specs.btus" → input.specs.btus)
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current: unknown = obj;

    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[part];
    }

    return current;
}

/**
 * Gera lista de campos críticos para uma categoria
 */
export function getCriticalFields(categoryId: string): string[] {
    return [
        ...ALWAYS_CRITICAL_FIELDS,
        ...(CRITICAL_FIELDS_BY_CATEGORY[categoryId] || []),
    ];
}

/**
 * Gera repair prompt para campos sem evidência
 */
export function generateEvidenceRepairPrompt(
    categoryId: string,
    missingEvidence: EvidenceValidationResult['missingEvidence']
): string {
    return `# 🔴 Evidence Gate Failed (--strict)

O input falhou na validação de evidências. Para passar com --strict, adicione o campo \`evidence\` ao JSON.

## Categoria
\`${categoryId}\`

## Campos Sem Evidência
${missingEvidence.map(m => `- \`${m.fieldPath}\`: ${m.reason}`).join('\n')}

## Formato Esperado

\`\`\`json
{
  "product": { ... },
  "price": { ... },
  "sources": [
    { "url": "https://amazon.com.br/...", "type": "amazon" },
    { "url": "https://manufacturer.com/...", "type": "manufacturer" }
  ],
  "specs": { ... },
  "evidence": {
${missingEvidence.map(m => `    "${m.fieldPath}": { "sourceUrl": "https://...", "note": "Fonte oficial" }`).join(',\n')}
  }
}
\`\`\`

## Regras
1. Cada \`sourceUrl\` no evidence deve estar presente em \`sources[]\` ou ser igual a \`price.sourceUrl\`
2. \`note\` é opcional mas recomendado (ex: "Ficha técnica página X", "Screenshot do anúncio")
3. Campos que não existem no input não precisam de evidência
`;
}
