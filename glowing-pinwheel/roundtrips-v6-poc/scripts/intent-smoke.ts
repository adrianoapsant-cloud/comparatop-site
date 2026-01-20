/**
 * Intent Detection Smoke Tests
 * Run: npx tsx scripts/intent-smoke.ts
 * 
 * Tests the detectIntents() function against known prompts
 * to prevent regression in consumption/manual detection.
 */

// ===========================================
// COPY OF INTENT DETECTION LOGIC (for testing)
// ===========================================

interface IntentResult {
    catalog: boolean;
    comparison: boolean;
    details: boolean;
    manual: boolean;
}

const CATALOG_INTENT_PATTERNS = [
    /\b(tv|tvs|televisão|televisor|smart\s*tv)\b/i,
    /\b(geladeira|refrigerador|freezer)\b/i,
    /\b(mostrar?|mostr[ea]|lista[re]?|listar)\b/i,
    /\b(recomend[ae]|sugest[ãa]o|sugir[ae])\b/i,
    /\b(opç[õo]es|alternativas|escolhas)\b/i,
    /\b(quais|quantas?|vocês têm|voces tem)\b/i,
    /\b(barata|barato|econômic[ao]|custo.benefício)\b/i,
];

const COMPARISON_INTENT_PATTERNS = [
    /\b(compar[ae]|compare|comparação|comparar)\b/i,
    /\b(lado\s*a\s*lado|versus|vs\.?)\b/i,
    /\b(diferenças?|diferença)\b/i,
    /\b(melhores?\s*(2|duas|dois)|top\s*2|as?\s*2)\b/i,
    /\b(maiores?\s*notas?)\b/i,
];

const DETAILS_INTENT_PATTERNS = [
    // Consumo de energia
    /\b(consumo|consumir|consome)\b/i,
    /\bkwh\b/i,
    /\bkwh\s*\/?\s*m[eê]s\b/i,
    /\b(watts?|watt)\b/i,
    /\b(energia|eletricidade)\b/i,
    /\benergia\s+por\s+m[eê]s\b/i,

    // Conjugações de "gastar" - TODAS
    /\b(gasta|gastam|gasto|gastar|gastando|gastou|gastaria|gastariam)\b/i,
    /\bgasto\s+mensal\b/i,
    /\bgasto\s+de\s+energia\b/i,

    // Custo
    /\bquanto\s+(custa|gasta|consome|gastam?|vai\s+gastar)\b/i,
    /\bcusto\s+(mensal|de\s+energia)\b/i,

    // Período mensal
    /\bpor\s+m[eê]s\b/i,
    /\b(mensal|mensalmente)\b/i,

    // Garantia
    /\b(garantia|warranty)\b/i,
];

const MANUAL_INTENT_PATTERNS = [
    /\b(manual|manuais)\b/i,
    /\btem\s+manual\b/i,
    /\bmanual\s+(do\s+produto|de\s+instru[çc][õo]es)\b/i,
    /\b(especifica[çc][ãa]o|especificaç[õo]es)\b/i,
    /\bficha\s*t[eé]cnica\b/i,
    /\bdados\s+t[eé]cnicos\b/i,
    /\b(pdf|download)\b/i,
    /\bdocumento\b/i,
    /\binstru[çc][õo]es\b/i,
];

function detectIntents(text: string): IntentResult {
    return {
        catalog: CATALOG_INTENT_PATTERNS.some(p => p.test(text)),
        comparison: COMPARISON_INTENT_PATTERNS.some(p => p.test(text)),
        details: DETAILS_INTENT_PATTERNS.some(p => p.test(text)) || MANUAL_INTENT_PATTERNS.some(p => p.test(text)),
        manual: MANUAL_INTENT_PATTERNS.some(p => p.test(text)),
    };
}

// ===========================================
// TEST CASES
// ===========================================

interface TestCase {
    prompt: string;
    expected: Partial<IntentResult>;
    description: string;
}

const TEST_CASES: TestCase[] = [
    // DETAILS: Consumo/Energia
    {
        prompt: "quanto gastam por mês?",
        expected: { details: true },
        description: "Conjugação 'gastam' deve ativar details"
    },
    {
        prompt: "quanto gasta de energia?",
        expected: { details: true },
        description: "Conjugação 'gasta' deve ativar details"
    },
    {
        prompt: "qual o consumo mensal?",
        expected: { details: true },
        description: "'consumo mensal' deve ativar details"
    },
    {
        prompt: "quantos kWh/mês?",
        expected: { details: true },
        description: "'kWh/mês' deve ativar details"
    },
    {
        prompt: "gasto de energia por mês",
        expected: { details: true },
        description: "'gasto de energia por mês' deve ativar details"
    },

    // MANUAL: Documentação
    {
        prompt: "tem manual?",
        expected: { details: true, manual: true },
        description: "'tem manual' deve ativar details e manual"
    },
    {
        prompt: "onde baixo o PDF?",
        expected: { details: true, manual: true },
        description: "'PDF' deve ativar details e manual"
    },
    {
        prompt: "ficha técnica",
        expected: { details: true, manual: true },
        description: "'ficha técnica' deve ativar details e manual"
    },

    // MULTI-INTENT: Catalog + Manual
    {
        prompt: "tem manual? quais TVs vocês têm?",
        expected: { catalog: true, details: true, manual: true },
        description: "Multi-intent: catalog + manual juntos"
    },

    // COMPARISON
    {
        prompt: "compare as 2 melhores",
        expected: { comparison: true },
        description: "'compare as 2 melhores' deve ativar comparison"
    },

    // CATALOG
    {
        prompt: "quais TVs vocês têm?",
        expected: { catalog: true },
        description: "'quais TVs' deve ativar catalog"
    },
    {
        prompt: "me mostra as geladeiras",
        expected: { catalog: true },
        description: "'mostra geladeiras' deve ativar catalog"
    },
];

// ===========================================
// TEST RUNNER
// ===========================================

function runTests(): void {
    console.log("\n🧪 INTENT DETECTION SMOKE TESTS\n");
    console.log("=".repeat(60));

    let passed = 0;
    let failed = 0;
    const failures: string[] = [];

    for (const testCase of TEST_CASES) {
        const result = detectIntents(testCase.prompt);
        let testPassed = true;

        // Check each expected flag
        for (const [key, expectedValue] of Object.entries(testCase.expected)) {
            const actualValue = result[key as keyof IntentResult];
            if (actualValue !== expectedValue) {
                testPassed = false;
                break;
            }
        }

        if (testPassed) {
            console.log(`✅ PASS: ${testCase.description}`);
            console.log(`   Prompt: "${testCase.prompt}"`);
            passed++;
        } else {
            console.log(`❌ FAIL: ${testCase.description}`);
            console.log(`   Prompt: "${testCase.prompt}"`);
            console.log(`   Expected: ${JSON.stringify(testCase.expected)}`);
            console.log(`   Got:      ${JSON.stringify(result)}`);
            failures.push(testCase.description);
            failed++;
        }
        console.log("");
    }

    console.log("=".repeat(60));
    console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed\n`);

    if (failed > 0) {
        console.log("❌ FAILURES:");
        failures.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
        console.log("");
        process.exit(1);
    } else {
        console.log("✅ ALL TESTS PASSED!\n");
        process.exit(0);
    }
}

runTests();
