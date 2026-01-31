/**
 * @file scaffold-dry.ts
 * @description Dry-run do scaffolder para validar input e mostrar derivações
 * 
 * Uso:
 *   echo '{ ... }' | npx tsx scripts/scaffold-dry.ts
 *   npx tsx scripts/scaffold-dry.ts < input.json
 * 
 * Output:
 *   - Validação do input contra OpusRawInputSchema
 *   - Derivação de energia com audit trail
 *   - Regras determinísticas disparadas
 *   - Campos faltantes
 */

async function main() {
    // Imports
    const { validateOpusRawInput, OpusRawInputSchema } = await import('../src/lib/scaffold/schemas');
    const { getCategoryScaffoldSpec } = await import('../src/config/category-scaffold-specs');

    // Ler JSON do stdin
    let inputJson = '';
    const chunks: string[] = [];

    // Se não tem argumento, usa exemplo
    if (process.argv.length > 2 && process.argv[2] === '--example') {
        inputJson = JSON.stringify(EXAMPLE_INPUT, null, 2);
        console.log('Usando exemplo embutido:\n');
        console.log(inputJson);
        console.log('\n' + '='.repeat(60) + '\n');
    } else {
        // Ler do stdin
        process.stdin.setEncoding('utf8');
        for await (const chunk of process.stdin) {
            chunks.push(chunk);
        }
        inputJson = chunks.join('');
    }

    if (!inputJson.trim()) {
        console.log('Uso: npx tsx scripts/scaffold-dry.ts < input.json');
        console.log('     npx tsx scripts/scaffold-dry.ts --example');
        process.exit(0);
    }

    // Parse JSON
    let input: unknown;
    try {
        input = JSON.parse(inputJson);
    } catch (e) {
        console.error('❌ JSON inválido:', e);
        process.exit(2);
    }

    // Validar contra schema
    console.log('🔍 Validando input contra OpusRawInputSchema...\n');
    const validation = validateOpusRawInput(input);

    interface DryRunOutput {
        validation: {
            success: boolean;
            errors: string[];
        };
        derivedEnergy: {
            kwhMonth: number;
            source: string;
            formula: string;
            warnings: string[];
        } | null;
        firedRules: {
            id: string;
            description: string;
            modifier: { scoreKey: string; delta: number };
        }[];
        missingFields: string[];
        warnings: string[];
    }

    const output: DryRunOutput = {
        validation: {
            success: validation.success,
            errors: validation.errors || [],
        },
        derivedEnergy: null,
        firedRules: [],
        missingFields: [],
        warnings: [],
    };

    if (!validation.success) {
        console.log('❌ Validação falhou:');
        for (const err of output.validation.errors) {
            console.log(`   - ${err}`);
        }
        console.log('\n' + JSON.stringify(output, null, 2));
        process.exit(2);
    }

    console.log('✅ Validação OK\n');

    // Obter spec da categoria
    const data = validation.data!;
    const spec = getCategoryScaffoldSpec(data.product.categoryId);

    if (!spec) {
        output.warnings.push(`Categoria ${data.product.categoryId} não tem scaffold spec`);
        console.log(JSON.stringify(output, null, 2));
        process.exit(0);
    }

    // ============================================
    // DERIVAR ENERGIA
    // ============================================
    console.log('⚡ Derivando consumo de energia...\n');

    const energy = data.energy || {};
    let kwhMonth = 0;
    let energySource = 'baseline';
    let energyFormula = '';
    const energyWarnings: string[] = [];

    for (const source of spec.energy.consumptionPriority) {
        if (source === 'inmetro' && energy.inmetroKwhYear) {
            kwhMonth = energy.inmetroKwhYear / 12;
            energySource = 'inmetro';
            energyFormula = `${energy.inmetroKwhYear} kWh/ano ÷ 12 = ${kwhMonth.toFixed(2)} kWh/mês`;
            break;
        }
        if (source === 'label' && energy.labelKwhMonth) {
            kwhMonth = energy.labelKwhMonth;
            energySource = 'label';
            energyFormula = `${energy.labelKwhMonth} kWh/mês (direto da etiqueta)`;
            break;
        }
        if (source === 'wattsUsage' && energy.wattsTypical && energy.usageHoursPerDay) {
            kwhMonth = (energy.wattsTypical * energy.usageHoursPerDay * 30) / 1000;
            energySource = 'wattsUsage';
            energyFormula = `${energy.wattsTypical}W × ${energy.usageHoursPerDay}h/dia × 30 dias ÷ 1000 = ${kwhMonth.toFixed(2)} kWh/mês`;
            break;
        }
        if (source === 'baseline') {
            kwhMonth = spec.energy.baseline.defaultKwhMonth;
            energySource = 'baseline';
            energyFormula = `Fallback: ${kwhMonth} kWh/mês (baseline categoria)`;
            energyWarnings.push('Usando baseline - considere adicionar dados de energia reais');
            break;
        }
    }

    // Validar bounds
    const bounds = spec.energy.bounds;
    if (kwhMonth < bounds.hardMin || kwhMonth > bounds.hardMax) {
        energyWarnings.push(`ERRO: ${kwhMonth} kWh/mês fora dos limites [${bounds.hardMin}, ${bounds.hardMax}]`);
    } else if (kwhMonth < bounds.softMin || kwhMonth > bounds.softMax) {
        energyWarnings.push(`WARN: ${kwhMonth} kWh/mês fora do range normal [${bounds.softMin}, ${bounds.softMax}]`);
    }

    output.derivedEnergy = {
        kwhMonth: Math.round(kwhMonth * 100) / 100,
        source: energySource,
        formula: energyFormula,
        warnings: energyWarnings,
    };

    console.log(`   Fonte: ${energySource}`);
    console.log(`   Fórmula: ${energyFormula}`);
    console.log(`   Resultado: ${kwhMonth.toFixed(2)} kWh/mês`);
    if (energyWarnings.length > 0) {
        console.log('   Warnings:', energyWarnings.join('; '));
    }
    console.log('');

    // ============================================
    // APLICAR REGRAS DETERMINÍSTICAS
    // ============================================
    console.log('📋 Aplicando regras determinísticas...\n');

    const specs = data.specs as Record<string, unknown>;
    for (const rule of spec.deterministicRules) {
        const fired = rule.condition(specs);
        if (fired) {
            output.firedRules.push({
                id: rule.id,
                description: rule.description,
                modifier: rule.modifier,
            });
            console.log(`   ✓ ${rule.id}: ${rule.description}`);
        } else {
            console.log(`   ○ ${rule.id}: não disparou`);
        }
    }
    console.log('');

    // ============================================
    // VERIFICAR CAMPOS FALTANTES
    // ============================================
    const recommendedFields = ['heightCm', 'batteryMah', 'runtimeMinutes', 'mopType'];
    for (const field of recommendedFields) {
        if (specs[field] === undefined) {
            output.missingFields.push(field);
        }
    }

    if (output.missingFields.length > 0) {
        console.log('⚠️  Campos recomendados ausentes:', output.missingFields.join(', '));
    }

    // ============================================
    // OUTPUT FINAL
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('📄 OUTPUT JSON:\n');
    console.log(JSON.stringify(output, null, 2));
}

// ============================================
// EXEMPLO DE INPUT
// ============================================

const EXAMPLE_INPUT = {
    product: {
        name: 'Roborock S8 Pro Ultra',
        brand: 'Roborock',
        model: 'S8 Pro Ultra',
        categoryId: 'robot-vacuum',
        asin: 'B0BXXXXXXX',
    },
    price: {
        valueBRL: 7499.00,
        observedAt: '2026-01-22',
        sourceUrl: 'https://www.amazon.com.br/dp/B0BXXXXXXX',
    },
    sources: [
        { url: 'https://www.amazon.com.br/dp/B0BXXXXXXX', type: 'amazon' },
        { url: 'https://us.roborock.com/pages/roborock-s8-pro-ultra', type: 'manufacturer' },
    ],
    energy: {
        wattsTypical: 68,
        usageHoursPerDay: 2,
    },
    specs: {
        navigationType: 'LiDAR',
        suctionPa: 6000,
        hasSelfEmpty: true,
        hasMop: true,
        mopType: 'vibrating',
        heightCm: 9.6,
        batteryMah: 5200,
        runtimeMinutes: 180,
    },
    meta: {
        cadastradoPor: 'opus',
        cadastradoEm: '2026-01-22',
        notas: 'Exemplo para dry-run do scaffolder',
    },
};

main().catch(console.error);
