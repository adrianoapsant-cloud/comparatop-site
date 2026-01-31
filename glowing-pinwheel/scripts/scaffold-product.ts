#!/usr/bin/env npx tsx
/**
 * @file scaffold-product.ts
 * @description CLI para scaffolding de produtos com escrita real de arquivos
 * 
 * ARQUITETURA P3: Data-driven multi-categoria
 * - Busca schema/spec por --category
 * - Templates gold por categoria (ou minimal para categorias sem template)
 * - Derivação de energia auditável
 * - Regras determinísticas de scoring
 * 
 * USO:
 *   npx tsx scripts/scaffold-product.ts --category robot-vacuum < input.json
 *   npx tsx scripts/scaffold-product.ts --category tv --in samples/tv.input.json
 *   npx tsx scripts/scaffold-product.ts --category robot-vacuum --dry-run < input.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Import registries
import { parseOpusRawInput, isSupportedCategory, listSupportedCategories, type OpusRawInput } from '../src/lib/scaffold/schemas/index';
import { getSpec, type CategoryScaffoldSpec, type DeterministicRule } from '../src/lib/scaffold/specs/index';
import { getMockTemplatePath, loadMockTemplate, hasGoldTemplate, hasAnyTemplate } from '../src/lib/scaffold/templates/index';
import { normalizeByCategory, type NormalizationChange, type NormalizationResult } from '../src/lib/scaffold/normalize/index';
import { validateEvidence, generateEvidenceRepairPrompt, getCriticalFields, type EvidenceValidationResult } from '../src/lib/scaffold/evidence';
import {
    validateInput as validateCompleteness,
    makeWriteDecision,
    generateRepairPrompt as generateCompletenessRepair,
    getDefaultContract,
    type ValidateOptions,
    type ValidateDecision
} from '../src/lib/scaffold/completeness/validate';
import {
    applyProductionRecommendedDefaults,
    generateAutofillReportSection,
    isProductionCategory,
    PRODUCTION_CATEGORIES,
} from '../src/lib/scaffold/completeness/autofill-recommended';

// PDP Module Gate (P21)
import { validatePdpModules, formatValidationResult } from '../src/lib/scaffold/pdp/validate';
import { getUnknownUnknowns } from '../src/data/unknown-unknowns-data';

// ============================================
// CONSTANTS
// ============================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'generated');
const PRODUCTS_DIR = path.join(GENERATED_DIR, 'products');
const MOCKS_DIR = path.join(GENERATED_DIR, 'mocks');
const REPORTS_DIR = path.join(GENERATED_DIR, 'reports');
const PRODUCT_LOADER_PATH = path.join(PROJECT_ROOT, 'src', 'lib', 'product-loader.ts');

// ============================================
// INTERFACES
// ============================================

interface CLIArgs {
    category: string;
    inputPath?: string;
    dryRun: boolean;
    noMock: boolean;
    noRegistryPatch: boolean;
    productId?: string;
    strict: boolean;
    reportOut?: string;
    repairPromptOut?: string;
    allowWriteOnWarnings: boolean;
    outdir?: string;  // P12: custom output directory
}

interface EnergyDerivation {
    source: 'inmetro' | 'label' | 'wattsUsage' | 'baseline';
    kwhMonth: number;
    calculation?: string;
}

interface FiredRule {
    ruleId: string;
    description: string;
    scoreKey: string;
    delta: number;
}

// ============================================
// CLI ARGUMENT PARSING
// ============================================

function parseArgs(): CLIArgs {
    const args = process.argv.slice(2);
    const result: CLIArgs = {
        category: '',
        dryRun: false,
        noMock: false,
        noRegistryPatch: false,
        strict: false,
        allowWriteOnWarnings: true,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--category' && args[i + 1]) {
            result.category = args[++i];
        } else if (arg.startsWith('--category=')) {
            result.category = arg.split('=')[1];
        } else if (arg === '--in' && args[i + 1]) {
            result.inputPath = args[++i];
        } else if (arg.startsWith('--in=')) {
            result.inputPath = arg.split('=')[1];
        } else if (arg === '--id' && args[i + 1]) {
            result.productId = args[++i];
        } else if (arg.startsWith('--id=')) {
            result.productId = arg.split('=')[1];
        } else if (arg === '--dry-run') {
            result.dryRun = true;
        } else if (arg === '--no-mock') {
            result.noMock = true;
        } else if (arg === '--no-registry-patch') {
            result.noRegistryPatch = true;
        } else if (arg === '--strict') {
            result.strict = true;
        } else if (arg === '--report-out' && args[i + 1]) {
            result.reportOut = args[++i];
        } else if (arg === '--repair-prompt-out' && args[i + 1]) {
            result.repairPromptOut = args[++i];
        } else if (arg === '--no-allow-write-on-warnings') {
            result.allowWriteOnWarnings = false;
        } else if (arg === '--outdir' && args[i + 1]) {
            result.outdir = args[++i];
        }
    }

    return result;
}

function printUsage(): void {
    const categories = listSupportedCategories().join(', ');
    console.log(`
scaffold-product - CLI para scaffolding de produtos ComparaTop

USO:
  npx tsx scripts/scaffold-product.ts --category <category> [options] < input.json
  npx tsx scripts/scaffold-product.ts --category <category> --in <file.json> [options]

OPÇÕES:
  --category <id>      Categoria do produto (obrigatório). Ex: ${categories}
  --in <path>          Caminho do arquivo JSON de entrada (alternativa ao stdin)
  --id <productId>     ID customizado do produto (opcional, derivado do nome se ausente)
  --dry-run            Apenas valida e mostra o que seria gerado, sem escrever arquivos
  --no-mock            Não gera arquivo mock PDP
  --no-registry-patch  Não adiciona produto à whitelist AVAILABLE_EXTENDED_DATA

CATEGORIAS SUPORTADAS:
  ${categories}

EXEMPLOS:
  echo '{"product":{"name":"Test",...}}' | npx tsx scripts/scaffold-product.ts --category robot-vacuum
  npx tsx scripts/scaffold-product.ts --category tv --in samples/tv.input.json
  npx tsx scripts/scaffold-product.ts --category robot-vacuum --dry-run < input.json

SAÍDA:
  - src/data/generated/products/<productId>.ts   (export do produto)
  - src/data/generated/mocks/<productId>.json    (mock PDP baseado em template)
  - src/data/generated/reports/<productId>.md    (audit report)
`);
}

// ============================================
// INPUT READING
// ============================================

async function readInput(inputPath?: string): Promise<unknown> {
    let jsonString: string;

    if (inputPath) {
        const fullPath = path.resolve(process.cwd(), inputPath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Arquivo não encontrado: ${fullPath}`);
        }
        jsonString = fs.readFileSync(fullPath, 'utf-8');
    } else {
        jsonString = await new Promise<string>((resolve, reject) => {
            let data = '';
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', (chunk: string) => data += chunk);
            process.stdin.on('end', () => resolve(data));
            process.stdin.on('error', reject);

            setTimeout(() => {
                if (!data) {
                    reject(new Error('Timeout: nenhum input recebido via stdin'));
                }
            }, 30000);
        });
    }

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        throw new Error(`JSON inválido: ${e instanceof Error ? e.message : String(e)}`);
    }
}

// ============================================
// PRODUCT ID GENERATION
// ============================================

function generateProductId(input: OpusRawInput, customId?: string): string {
    if (customId) {
        return slugify(customId);
    }

    const product = input.product as { brand: string; model: string };
    return slugify(`${product.brand}-${product.model}`);
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
}

// ============================================
// ENERGY DERIVATION
// ============================================

function deriveEnergy(input: OpusRawInput, spec: CategoryScaffoldSpec): EnergyDerivation {
    const energy = (input as { energy?: Record<string, number> }).energy;
    const priority = spec.energy.consumptionPriority;
    const baseline = spec.energy.baseline;

    for (const source of priority) {
        switch (source) {
            case 'inmetro':
                if (energy?.inmetroKwhYear) {
                    const kwhMonth = energy.inmetroKwhYear / 12;
                    return {
                        source: 'inmetro',
                        kwhMonth: Math.round(kwhMonth * 100) / 100,
                        calculation: `INMETRO ${energy.inmetroKwhYear} kWh/ano ÷ 12 = ${kwhMonth.toFixed(2)} kWh/mês`,
                    };
                }
                break;
            case 'label':
                if (energy?.labelKwhMonth) {
                    return {
                        source: 'label',
                        kwhMonth: energy.labelKwhMonth,
                        calculation: `Etiqueta: ${energy.labelKwhMonth} kWh/mês`,
                    };
                }
                break;
            case 'wattsUsage':
                if (energy?.wattsTypical && energy?.usageHoursPerDay) {
                    const kwhMonth = (energy.wattsTypical * energy.usageHoursPerDay * 30) / 1000;
                    return {
                        source: 'wattsUsage',
                        kwhMonth: Math.round(kwhMonth * 100) / 100,
                        calculation: `${energy.wattsTypical}W × ${energy.usageHoursPerDay}h/dia × 30 dias ÷ 1000 = ${kwhMonth.toFixed(2)} kWh/mês`,
                    };
                }
                break;
            case 'baseline':
                return {
                    source: 'baseline',
                    kwhMonth: baseline.defaultKwhMonth,
                    calculation: `Baseline da categoria: ${baseline.defaultKwhMonth} kWh/mês`,
                };
        }
    }

    return {
        source: 'baseline',
        kwhMonth: baseline.defaultKwhMonth,
        calculation: `Fallback baseline: ${baseline.defaultKwhMonth} kWh/mês`,
    };
}

// ============================================
// DETERMINISTIC SCORING
// ============================================

function applyDeterministicRules(
    specs: Record<string, unknown>,
    rules: DeterministicRule[],
    baseScores: Record<string, number>
): { scores: Record<string, number>; firedRules: FiredRule[] } {
    const scores = { ...baseScores };
    const firedRules: FiredRule[] = [];

    for (const rule of rules) {
        try {
            if (rule.condition(specs)) {
                const { scoreKey, delta } = rule.modifier;
                const oldValue = scores[scoreKey] ?? 5.0;
                const newValue = Math.min(10, Math.max(0, oldValue + delta));
                scores[scoreKey] = Math.round(newValue * 10) / 10;

                firedRules.push({
                    ruleId: rule.id,
                    description: rule.description,
                    scoreKey,
                    delta,
                });
            }
        } catch {
            // Rule condition failed - skip silently
        }
    }

    return { scores, firedRules };
}

// ============================================
// PRODUCT DRAFT GENERATION
// ============================================

function generateProductDraft(
    input: OpusRawInput,
    productId: string,
    categoryId: string,
    scores: Record<string, number>,
    energy: EnergyDerivation
): Record<string, unknown> {
    const now = new Date().toISOString();
    const product = input.product as { name: string; brand: string; model: string; asin?: string };
    const price = input.price as { valueBRL: number };
    const specs = input.specs as Record<string, unknown>;

    // Score reasons (placeholders)
    const scoreReasons: Record<string, string> = {};
    for (const key of Object.keys(scores)) {
        scoreReasons[key] = 'TODO: Preencher justificativa editorial';
    }

    // Feature benefits (placeholders)
    const featureBenefits = [
        { icon: 'sparkles', title: 'TODO: Título 1', description: 'TODO: Descrição do benefício 1' },
        { icon: 'zap', title: 'TODO: Título 2', description: 'TODO: Descrição do benefício 2' },
        { icon: 'shield', title: 'TODO: Título 3', description: 'TODO: Descrição do benefício 3' },
    ];

    // Recommended accessory (from input JSON or null)
    const inputAccessory = (input as Record<string, unknown>).recommendedAccessory as {
        asin?: string;
        name?: string;
        shortName?: string;
        price?: number;
        imageUrl?: string;
        reason?: string;
        affiliateUrl?: string;
    } | undefined;

    const recommendedAccessory = inputAccessory?.asin ? {
        asin: inputAccessory.asin,
        name: inputAccessory.name || 'Acessório Recomendado',
        shortName: inputAccessory.shortName || inputAccessory.name?.substring(0, 40) || 'Acessório',
        price: inputAccessory.price || 0,
        imageUrl: inputAccessory.imageUrl || '',
        reason: inputAccessory.reason || 'Acessório compatível recomendado.',
        affiliateUrl: inputAccessory.affiliateUrl || `https://www.amazon.com.br/dp/${inputAccessory.asin}?tag=comparatop06-20`,
    } : undefined;

    const draft: Record<string, unknown> = {
        id: productId,
        categoryId,
        name: product.name,
        shortName: `${product.brand} ${product.model}`,
        brand: product.brand,
        model: product.model,
        price: price.valueBRL,
        imageUrl: `/images/products/${productId}.webp`,
        asin: product.asin,
        status: 'draft',
        scores,
        scoreReasons,
        attributes: { ...specs },
        specs: {
            ...specs,
            energyKwhMonth: energy.kwhMonth,
        },
        featureBenefits,
        lastUpdated: now,
        offers: [],
        badges: [],
        gallery: [],
        priceHistory: [],
    };

    // Only add recommendedAccessory if present
    if (recommendedAccessory) {
        draft.recommendedAccessory = recommendedAccessory;
        console.log(`✅ Acessório recomendado encontrado: ${recommendedAccessory.shortName}`);
    }

    return draft;
}

// ============================================
// MOCK GENERATION
// ============================================

function generateMock(
    input: OpusRawInput,
    productId: string,
    categoryId: string,
    energy: EnergyDerivation,
    firedRules: FiredRule[]
): Record<string, unknown> {
    const product = input.product as { name: string; brand: string };

    // Carregar template (gold ou minimal)
    const template = loadMockTemplate(categoryId, PROJECT_ROOT);

    // Se não existir template, usar estrutura mínima inline
    const baseTemplate: Record<string, unknown> = template || {
        product: {},
        header: { overallScore: 7.0, scoreLabel: 'Bom', badges: [] },
        auditVerdict: {},
        productDna: { dimensions: [] },
        simulators: {},
        decisionFAQ: [],
    };

    // Calculate raw input hash for audit trail
    const rawInputHash = crypto.createHash('md5')
        .update(JSON.stringify(input))
        .digest('hex')
        .substring(0, 8);

    // Fill slots from input
    const mock: Record<string, unknown> = {
        ...baseTemplate,
        product: {
            id: productId,
            name: product.name,
            brand: product.brand,
            category: categoryId,
            releaseYear: new Date().getFullYear(),
        },
        header: {
            ...((baseTemplate.header as Record<string, unknown>) || {}),
            overallScore: 7.0,
            scoreLabel: 'Bom',
            title: product.name,
            subtitle: `TODO: Preencher subtitle editorial para ${product.brand}`,
            badges: [],
        },
        meta: {
            scaffold: {
                generatedAt: new Date().toISOString(),
                rawInputHash,
                categoryId,
                derivedEnergy: energy,
                firedRulesCount: firedRules.length,
                status: 'draft',
            },
        },
        auditVerdict: {
            solution: {
                title: 'A Solução',
                icon: 'checkCircle',
                color: 'emerald',
                items: ['TODO: Preencher pontos positivos'],
            },
            attentionPoint: {
                title: 'Ponto de Atenção',
                icon: 'alertTriangle',
                color: 'amber',
                items: ['TODO: Preencher pontos de atenção'],
            },
            technicalConclusion: {
                title: 'Conclusão Técnica',
                icon: 'clipboard',
                color: 'blue',
                text: 'TODO: Preencher conclusão técnica editorial',
            },
            dontBuyIf: {
                title: 'Não Compre Se',
                icon: 'xCircle',
                color: 'red',
                items: ['TODO: Preencher contra-indicações'],
            },
        },
        decisionFAQ: [
            {
                id: 'placeholder',
                icon: 'HelpCircle',
                question: 'TODO: Preencher FAQ 1',
                answer: 'TODO: Preencher resposta',
            },
        ],
    };

    return mock;
}
// ============================================
// AUDIT REPORT GENERATION (P5.5-B)
// ============================================

interface EvidenceMapEntry {
    fieldPath: string;
    value: unknown;
    sourceUrl: string | null;
    note: string | null;
    status: 'OK' | 'MISSING' | 'INVALID';
}

function generateEvidenceMapSection(
    categoryId: string,
    input: Record<string, unknown>,
    evidenceMap: Record<string, { sourceUrl: string; note?: string }> | undefined,
    validUrls: Set<string>
): { entries: EvidenceMapEntry[]; markdown: string } {
    const criticalFields = getCriticalFields(categoryId);
    const entries: EvidenceMapEntry[] = [];

    for (const fieldPath of criticalFields) {
        const value = getNestedValue(input, fieldPath);
        if (value === undefined) continue;

        const evidence = evidenceMap?.[fieldPath];
        let status: EvidenceMapEntry['status'] = 'MISSING';
        let sourceUrl: string | null = null;
        let note: string | null = null;

        if (evidence) {
            sourceUrl = evidence.sourceUrl;
            note = evidence.note || null;
            status = validUrls.has(evidence.sourceUrl) ? 'OK' : 'INVALID';
        }

        entries.push({ fieldPath, value, sourceUrl, note, status });
    }

    const markdown = `## Evidence Map

| Campo | Valor | Source URL | Nota | Status |
|-------|-------|------------|------|--------|
${entries.map(e => `| \`${e.fieldPath}\` | ${formatValue(e.value)} | ${e.sourceUrl ? `[link](${e.sourceUrl})` : '_N/A_'} | ${e.note || '_-_'} | ${statusBadge(e.status)} |`).join('\n')}
`;

    return { entries, markdown };
}

function formatValue(v: unknown): string {
    if (v === null || v === undefined) return '_null_';
    if (typeof v === 'boolean') return v ? '✓' : '✗';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string') return v.length > 40 ? v.substring(0, 37) + '...' : v;
    return JSON.stringify(v).substring(0, 40);
}

function statusBadge(s: 'OK' | 'MISSING' | 'INVALID'): string {
    switch (s) {
        case 'OK': return '✅ OK';
        case 'MISSING': return '⚠️ MISSING';
        case 'INVALID': return '❌ INVALID';
    }
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current: unknown = obj;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return current;
}

function generateAuditReport(
    input: OpusRawInput,
    productId: string,
    categoryId: string,
    energy: EnergyDerivation,
    firedRules: FiredRule[],
    missingFields: string[],
    warnings: string[],
    hasTemplate: boolean,
    normChanges: NormalizationChange[],
    normWarnings: string[],
    evidenceValidation: EvidenceValidationResult
): string {
    const now = new Date().toISOString();
    const product = input.product as { name: string; brand: string; model: string; asin?: string };
    const price = input.price as { valueBRL: number; sourceUrl: string };
    const sources = input.sources as Array<{ url: string; type?: string }>;
    const evidenceMap = (input as Record<string, unknown>).evidence as Record<string, { sourceUrl: string; note?: string }> | undefined;

    // Collect valid URLs
    const validUrls = new Set<string>([price.sourceUrl, ...sources.map(s => s.url)]);

    // Generate Evidence Map
    const { markdown: evidenceMapMd } = generateEvidenceMapSection(
        categoryId,
        input as Record<string, unknown>,
        evidenceMap,
        validUrls
    );

    // Baseline vs Real
    const baselineVsReal = `## Baseline vs Real

| Dado | Fonte | Valor |
|------|-------|-------|
| Consumo | \`${energy.source}\` | ${energy.kwhMonth} kWh/mês |
| Cálculo | ${energy.source === 'baseline' ? '⚠️ Baseline (default)' : '✅ Input real'} | ${energy.calculation || '_N/A_'} |
`;

    // Normalization Log
    const normLogMd = `## Normalization Log

${normChanges.length === 0 ? '_Nenhuma normalização aplicada._\n' : ''}
${normChanges.length > 0 ? `| Campo | Raw | Normalizado | Razão |
|-------|-----|-------------|-------|
${normChanges.map(c => `| \`${c.fieldPath}\` | ${formatValue(c.rawValue)} | ${formatValue(c.normalizedValue)} | ${c.reason} |`).join('\n')}
` : ''}
${normWarnings.length > 0 ? `\n**Warnings de normalização:**\n${normWarnings.map(w => `- ${w}`).join('\n')}` : ''}
`;

    return `# Scaffold Audit Report: ${productId}

## Metadados
- **Gerado em**: ${now}
- **Categoria**: ${categoryId}
- **Status**: draft
- **Template**: ${hasTemplate ? 'Gold' : 'Minimal (sem template gold)'}
- **Input Hash**: ${crypto.createHash('md5').update(JSON.stringify(input)).digest('hex').substring(0, 8)}

## Produto
| Campo | Valor |
|-------|-------|
| Nome | ${product.name} |
| Marca | ${product.brand} |
| Modelo | ${product.model} |
| Preço | R$ ${price.valueBRL.toLocaleString('pt-BR')} |
| ASIN | ${product.asin || 'N/A'} |

${evidenceMapMd}

## Rules Fired (Regras Determinísticas)
${firedRules.length === 0 ? '_Nenhuma regra disparou._\n' : ''}
${firedRules.map((r, i) => `${i + 1}. **${r.ruleId}**: ${r.description} → \`${r.scoreKey}\` += ${r.delta}`).join('\n')}

${baselineVsReal}

${normLogMd}

## Campos Recomendados Ausentes
${missingFields.length === 0 ? '_Todos os campos recomendados estão presentes._\n' : ''}
${missingFields.map(f => `- \`${f}\``).join('\n')}

## Warnings
${warnings.length === 0 ? '_Nenhum warning._\n' : ''}
${warnings.map(w => `- ${w}`).join('\n')}
${evidenceValidation.warnings.length > 0 ? `\n**Evidence Warnings:**\n${evidenceValidation.warnings.map(w => `- ${w}`).join('\n')}` : ''}

## Fontes Consultadas
${sources.map((s, i) => `${i + 1}. [${s.type || 'other'}](${s.url})`).join('\n')}

## Próximos Passos
1. [ ] Revisar e ajustar scores em \`src/data/generated/products/${productId}.ts\`
2. [ ] Preencher conteúdo editorial no mock \`src/data/generated/mocks/${productId}.json\`
3. [ ] Adicionar imagem do produto em \`public/images/products/${productId}.webp\`
4. [ ] Rodar \`npm run validate:product -- --id=${productId}\`
5. [ ] Se aprovado, mover para \`src/data/products.ts\` e status: 'published'
`;
}

// ============================================
// REPAIR PROMPT GENERATION
// ============================================

function generateRepairPrompt(errors: string[], categoryId: string): string {
    return `# Repair Prompt - Corrija os Erros no Input

O JSON fornecido falhou na validação. Corrija APENAS os campos abaixo:

## Categoria
\`${categoryId}\`

## Erros Encontrados
${errors.map(e => `- ${e}`).join('\n')}

## Instruções
1. Revise o JSON original
2. Corrija apenas os campos listados acima
3. Reenvie o JSON corrigido para o scaffolder

## Formato Esperado (${categoryId})
\`\`\`json
{
  "product": {
    "name": "Nome completo do produto",
    "brand": "Marca",
    "model": "Modelo",
    "categoryId": "${categoryId}"
  },
  "price": {
    "valueBRL": 1999.00,
    "observedAt": "2026-01-22",
    "sourceUrl": "https://..."
  },
  "sources": [
    { "url": "https://...", "type": "amazon" }
  ],
  "specs": {
    // Specs específicos da categoria ${categoryId}
  }
}
\`\`\`
`;
}

// ============================================
// FILE WRITING
// ============================================

function ensureDirectories(): void {
    [PRODUCTS_DIR, MOCKS_DIR, REPORTS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

function writeProductFile(productId: string, productDraft: Record<string, unknown>): string {
    const filePath = path.join(PRODUCTS_DIR, `${productId}.ts`);
    const constName = `PRODUCT_${productId.toUpperCase().replace(/-/g, '_')}`;

    const content = `/**
 * @file ${productId}.ts
 * @description Produto gerado via scaffold-product CLI
 * @status draft
 * @generated ${new Date().toISOString()}
 */

import type { Product } from '@/types/category';

export const ${constName}: Product = ${JSON.stringify(productDraft, null, 4)};
`;

    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
}

function writeMockFile(productId: string, mock: Record<string, unknown>): string {
    const filePath = path.join(MOCKS_DIR, `${productId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(mock, null, 4), 'utf-8');
    return filePath;
}

function writeReportFile(productId: string, report: string): string {
    const filePath = path.join(REPORTS_DIR, `${productId}.md`);
    fs.writeFileSync(filePath, report, 'utf-8');
    return filePath;
}

function writeRepairPrompt(errors: string[], categoryId: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(REPORTS_DIR, `${timestamp}-repair-prompt.txt`);
    fs.writeFileSync(filePath, generateRepairPrompt(errors, categoryId), 'utf-8');
    return filePath;
}

// ============================================
// REGISTRY PATCH (AVAILABLE_EXTENDED_DATA)
// ============================================

function patchExtendedDataRegistry(productId: string): { patched: boolean; message: string } {
    if (!fs.existsSync(PRODUCT_LOADER_PATH)) {
        return { patched: false, message: `Arquivo não encontrado: ${PRODUCT_LOADER_PATH}` };
    }

    const content = fs.readFileSync(PRODUCT_LOADER_PATH, 'utf-8');

    if (content.includes(`'${productId}'`)) {
        return { patched: false, message: 'Produto já está na whitelist AVAILABLE_EXTENDED_DATA' };
    }

    const regex = /(export const AVAILABLE_EXTENDED_DATA = \[[\s\S]*?)(    \/\/ Add more product IDs)/;
    const match = content.match(regex);

    if (!match) {
        return {
            patched: false,
            message: 'Não foi possível localizar AVAILABLE_EXTENDED_DATA. Adicione manualmente:\n' +
                `    '${productId}',`
        };
    }

    const newContent = content.replace(
        regex,
        `$1    '${productId}',  // Gerado via scaffold-product\n$2`
    );

    fs.writeFileSync(PRODUCT_LOADER_PATH, newContent, 'utf-8');
    return { patched: true, message: `Adicionado '${productId}' à AVAILABLE_EXTENDED_DATA` };
}

// ============================================
// GENERATED REGISTRY (index.ts)
// ============================================

function updateGeneratedRegistry(productId: string): void {
    const indexPath = path.join(GENERATED_DIR, 'index.ts');
    const constName = `PRODUCT_${productId.toUpperCase().replace(/-/g, '_')}`;
    const importLine = `import { ${constName} } from './products/${productId}';\n`;

    if (!fs.existsSync(indexPath)) {
        const content = `/**
 * @file index.ts
 * @description Registry de produtos gerados via scaffold-product
 * @generated ${new Date().toISOString()}
 * 
 * IMPORTANTE: Este arquivo é gerado automaticamente.
 * Para adicionar produtos ao runtime, importe GENERATED_PRODUCTS em src/data/products.ts
 */

import type { Product } from '@/types/category';

${importLine}
export const GENERATED_PRODUCTS: Product[] = [
    ${constName},
];
`;
        fs.writeFileSync(indexPath, content, 'utf-8');
        return;
    }

    let content = fs.readFileSync(indexPath, 'utf-8');

    if (content.includes(constName)) {
        return;
    }

    const lastImportMatch = content.match(/^import[^;]+;[\r\n]/gm);
    if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        content = content.replace(lastImport, lastImport + importLine);
    }

    content = content.replace(
        /export const GENERATED_PRODUCTS: Product\[\] = \[/,
        `export const GENERATED_PRODUCTS: Product[] = [\n    ${constName},`
    );

    fs.writeFileSync(indexPath, content, 'utf-8');
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
    const args = parseArgs();

    // Validate required args
    if (!args.category) {
        printUsage();
        console.error('\n❌ ERRO: --category é obrigatório');
        process.exit(1);
    }

    // Check if category is supported
    if (!isSupportedCategory(args.category)) {
        console.error(`❌ ERRO: Categoria '${args.category}' não suportada pelo scaffolder`);
        console.error(`Categorias disponíveis: ${listSupportedCategories().join(', ')}`);
        process.exit(2);
    }

    // Get category spec
    const spec = getSpec(args.category);
    if (!spec) {
        console.error(`❌ ERRO: Spec não encontrada para categoria '${args.category}'`);
        process.exit(2);
    }

    // Read input
    let rawInput: unknown;
    try {
        rawInput = await readInput(args.inputPath);
    } catch (error) {
        console.error(`❌ ERRO ao ler input: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }

    // Validate input with category-specific schema
    const validation = parseOpusRawInput(args.category, rawInput);
    if (!validation.success) {
        console.error('\n❌ VALIDAÇÃO FALHOU - Input não conforme com schema da categoria\n');
        validation.errors?.forEach(e => console.error(`  • ${e}`));

        if (!args.dryRun) {
            ensureDirectories();
            const repairPath = writeRepairPrompt(validation.errors || [], args.category);
            console.error(`\n📝 Repair prompt salvo em: ${repairPath}`);
        }
        process.exit(1);
    }

    const input = validation.data!;
    const product = input.product as { brand: string; model: string };
    console.log(`\n✅ Input validado com sucesso para ${product.brand} ${product.model}`);

    // ============================================
    // EVIDENCE GATE (P5.5-A)
    // ============================================
    const evidenceMap = (input as Record<string, unknown>).evidence as Record<string, { sourceUrl: string; note?: string }> | undefined;
    const sources = input.sources as any[]; // Cast to any to avoid TS union type mismatch issues in validateEvidence
    const priceSourceUrl = (input.price as { sourceUrl: string }).sourceUrl;

    const evidenceValidation = validateEvidence(
        args.category,
        input as Record<string, unknown>,
        evidenceMap,
        sources,
        priceSourceUrl
    );

    // Report evidence warnings (even without --strict)
    if (evidenceValidation.warnings.length > 0) {
        console.log(`⚠️  Evidence warnings: ${evidenceValidation.warnings.length}`);
        evidenceValidation.warnings.forEach(w => console.log(`   - ${w}`));
    }

    // With --strict: fail if missing evidence for critical fields
    if (args.strict && !evidenceValidation.valid) {
        console.error('\n🔴 EVIDENCE GATE FAILED (--strict)\n');
        console.error('Campos críticos sem evidência:');
        evidenceValidation.missingEvidence.forEach(m => console.error(`  • ${m.fieldPath}: ${m.reason}`));

        if (!args.dryRun) {
            ensureDirectories();
            const repairPrompt = generateEvidenceRepairPrompt(args.category, evidenceValidation.missingEvidence);
            const repairPath = path.join(REPORTS_DIR, `repair-evidence-${Date.now()}.md`);
            fs.writeFileSync(repairPath, repairPrompt, 'utf-8');
            console.error(`\n📝 Evidence repair prompt salvo em: ${repairPath}`);
        } else {
            console.error('\n📋 Repair prompt (dry-run):');
            console.error(generateEvidenceRepairPrompt(args.category, evidenceValidation.missingEvidence));
        }
        process.exit(2);
    }

    if (args.strict && evidenceValidation.valid) {
        console.log(`✅ Evidence Gate PASS: ${getCriticalFields(args.category).length} campos críticos verificados`);
    }

    // Generate product ID
    const productId = generateProductId(input, args.productId);
    console.log(`🔑 Product ID: ${productId}`);

    // Normalize specs BEFORE applying rules
    const rawSpecs = input.specs as Record<string, unknown>;
    const normalization = normalizeByCategory(args.category, rawSpecs);
    const { normalizedSpecs, changes: normChanges, warnings: normWarnings } = normalization;

    if (normChanges.length > 0) {
        console.log(`🔄 Normalização: ${normChanges.length} campos ajustados`);
        normChanges.forEach(c => console.log(`   - ${c.fieldPath}: "${c.rawValue}" → "${c.normalizedValue}" (${c.reason})`));
    }
    if (normWarnings.length > 0) {
        console.log(`⚠️  Warnings de normalização: ${normWarnings.length}`);
        normWarnings.forEach(w => console.log(`   - ${w}`));
    }

    // Derive energy
    const energy = deriveEnergy(input, spec!);
    console.log(`⚡ Energia derivada: ${energy.kwhMonth} kWh/mês (${energy.source})`);

    // Apply deterministic rules using NORMALIZED specs
    const { scores, firedRules } = applyDeterministicRules(
        normalizedSpecs,
        spec!.deterministicRules,
        spec!.defaultScores
    );
    console.log(`🎯 Regras aplicadas: ${firedRules.length}`);
    firedRules.forEach(r => console.log(`   - ${r.ruleId}: ${r.scoreKey} += ${r.delta}`));

    // Check template availability
    const hasTemplate = hasGoldTemplate(args.category);
    if (!hasTemplate) {
        console.log(`ℹ️  Categoria '${args.category}' não tem template gold - usando template minimal`);
    }

    // ========================================
    // P12: COMPLETENESS VALIDATION GATE (ALWAYS RUNS)
    // ========================================

    // P13: Auto-fill recommended fields for production categories (placeholders)
    const autofillResult = applyProductionRecommendedDefaults(
        input as Record<string, unknown>,
        args.category,
        scores
    );
    if (autofillResult.placeholdersCreated > 0) {
        console.log(`\n🔧 Auto-filled ${autofillResult.placeholdersCreated} recommended fields (production defaults)`);
        autofillResult.fieldsAutofilled.forEach(f => console.log(`   - ${f}`));
    }

    const contract = getDefaultContract(args.category);
    const validationResult = validateCompleteness(args.category, input, contract);

    const validateOptions: ValidateOptions = {
        strict: args.strict,
        reportOutPath: args.reportOut,
        repairPromptOutPath: args.repairPromptOut,
        allowWriteOnWarnings: args.allowWriteOnWarnings,
    };

    const decision = makeWriteDecision(validationResult, validateOptions);

    // Save reports if paths provided (always, even in dry-run)
    if (args.reportOut) {
        const reportPath = path.resolve(PROJECT_ROOT, args.reportOut);
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, decision.report, 'utf-8');
        console.log(`📁 Completeness report: ${reportPath}`);
    }

    if (args.repairPromptOut) {
        const repairPath = path.resolve(PROJECT_ROOT, args.repairPromptOut);
        fs.mkdirSync(path.dirname(repairPath), { recursive: true });
        fs.writeFileSync(repairPath, JSON.stringify(decision.repairPrompt, null, 2), 'utf-8');
        console.log(`📁 Repair prompt: ${repairPath}`);
    }

    // Log completeness status
    console.log(`\n📋 Completeness: ${validationResult.completenessPercent}%`);
    console.log(`   Required: ${validationResult.requiredFieldsPassed}/${validationResult.requiredFieldsChecked}`);
    console.log(`   Evidence: ${validationResult.evidenceFieldsPassed}/${validationResult.evidenceFieldsChecked}`);
    console.log(`   Decision: ${decision.canWrite ? '✅ ALLOWED' : '❌ BLOCKED'} (exit ${decision.exitCode})`);

    // Check if write is blocked
    if (!decision.canWrite) {
        console.error(`\n🔴 ${decision.reason}`);
        if (args.repairPromptOut) {
            console.error(`   Repair prompt saved to: ${args.repairPromptOut}`);
        }
        console.error(`\nPara corrigir, adicione os campos faltantes:`);
        if (validationResult.missingRequiredFields.length > 0) {
            console.error(`   Missing required: ${validationResult.missingRequiredFields.join(', ')}`);
        }
        if (validationResult.missingEvidenceFields.length > 0 && args.strict) {
            console.error(`   Missing evidence: ${validationResult.missingEvidenceFields.join(', ')}`);
        }
        process.exit(decision.exitCode);
    }

    console.log(`\n✅ ${decision.reason}`);

    // DRY RUN: Stop here after validation
    if (args.dryRun) {
        console.log('\n📋 DRY RUN - Validation completed, no files written\n');
        console.log('Resultado:');
        console.log(JSON.stringify({
            productId,
            categoryId: args.category,
            validation: {
                canWrite: decision.canWrite,
                exitCode: decision.exitCode,
                completenessPercent: validationResult.completenessPercent,
            },
            normalization: {
                changesCount: normChanges.length,
                changes: normChanges,
                warningsCount: normWarnings.length,
                warnings: normWarnings,
            },
            energy,
            firedRules,
            scores,
            hasGoldTemplate: hasTemplate,
        }, null, 2));
        process.exit(decision.exitCode);
    }

    // Ensure directories exist
    ensureDirectories();

    // Generate product draft
    const productDraft = generateProductDraft(input, productId, args.category, scores, energy);
    const warnings: string[] = [];
    const filesWritten: string[] = [];

    // Write product file
    const productPath = writeProductFile(productId, productDraft);
    filesWritten.push(productPath);
    console.log(`📁 Produto escrito: ${productPath}`);

    // Update generated registry
    updateGeneratedRegistry(productId);
    const registryPath = path.join(GENERATED_DIR, 'index.ts');
    console.log(`📁 Registry atualizado: ${registryPath}`);

    // Write mock (if not disabled)
    if (!args.noMock) {
        const mock = generateMock(input, productId, args.category, energy, firedRules);

        // ============================================
        // PDP MODULE GATE (P21) - BLOCKS WRITE IF INVALID
        // ============================================
        const pdpValidation = validatePdpModules(mock, args.category);
        console.log('\n📋 PDP Module Validation:');
        console.log(formatValidationResult(pdpValidation));

        // Check Unknown Unknowns availability (informational)
        const uu = getUnknownUnknowns(args.category);
        const uuCount = uu?.items?.length ?? 0;
        if (uuCount === 0) {
            console.warn(`⚠️ No Unknown Unknowns data for category '${args.category}'`);
        } else if (uuCount < 5) {
            console.warn(`⚠️ Unknown Unknowns: ${uuCount} items (recommended: 5+)`);
        } else {
            console.log(`✅ Unknown Unknowns: ${uuCount} items available`);
        }

        // GATE: Block write if validation fails
        if (pdpValidation.exitCode === 2) {
            console.error('\n🔴 PDP MODULE GATE FAILED - WRITE BLOCKED');
            console.error('Mock is missing required PDP modules:');
            pdpValidation.errors.forEach(e => console.error(`  • [${e.path || 'N/A'}] ${e.message}`));
            console.error('\nFix the mock template or input data and try again.');
            process.exit(2);
        }

        const mockPath = writeMockFile(productId, mock);
        filesWritten.push(mockPath);
        console.log(`📁 Mock escrito: ${mockPath}`);
    }

    // Write audit report
    const report = generateAuditReport(
        input, productId, args.category, energy, firedRules, [], warnings, hasTemplate,
        normChanges, normWarnings, evidenceValidation
    );
    const reportPath = writeReportFile(productId, report);
    filesWritten.push(reportPath);
    console.log(`📁 Report escrito: ${reportPath}`);

    // Patch registry (if not disabled and mock was written)
    let patchInstructions: string | undefined;
    if (!args.noRegistryPatch && !args.noMock) {
        const patchResult = patchExtendedDataRegistry(productId);
        if (patchResult.patched) {
            console.log(`✅ ${patchResult.message}`);
        } else {
            patchInstructions = patchResult.message;
            console.log(`ℹ️  ${patchResult.message}`);
        }
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ SCAFFOLD COMPLETO\n');
    console.log('Arquivos gerados:');
    filesWritten.forEach(f => console.log(`  - ${path.relative(PROJECT_ROOT, f)}`));

    console.log('\nPróximos passos:');
    console.log(`  1. npm run validate:product -- --id=${productId}`);
    console.log('  2. Preencha os TODOs nos arquivos gerados');
    console.log('  3. Adicione imagem do produto');
    console.log('  4. Quando pronto, mude status para "published"');

    if (patchInstructions) {
        console.log(`\n⚠️  Patch manual necessário:\n${patchInstructions}`);
    }
}

main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
