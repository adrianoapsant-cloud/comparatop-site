/**
 * Audit script: checks completeness of all robot vacuum product entries.
 * Run with: npx tsx scripts/audit-robot-vacuums.ts
 */
import { ROBOT_VACUUM_PRODUCTS } from '../src/data/robot-vacuum';

// Fields to check (grouped by importance)
const CRITICAL_FIELDS = ['id', 'categoryId', 'name', 'brand', 'model', 'price', 'imageUrl', 'scores', 'status'] as const;
const IMPORTANT_FIELDS = ['scoreReasons', 'technicalSpecs', 'structuredSpecs', 'specs', 'offers', 'voc', 'manualUrl', 'lastUpdated', 'useSimplifiedPDP'] as const;
const PDP_FIELDS = ['gallery', 'featureBenefits', 'auditVerdict', 'productDna', 'productDimensions', 'badges', 'painPointsSolved', 'mainCompetitor', 'recommendedAccessory', 'benefitSubtitle'] as const;
const ADVANCED_FIELDS = ['tcoData', 'extendedTco', 'decisionFAQ', 'evidenceLevel', 'contextualScoreRange', 'contextualScoreConfidence', 'tcoTotalRange', 'tcoConfidence', 'contextModifiers', 'scoring_facts', 'scoring_category', 'asin'] as const;

interface AuditResult {
    id: string;
    name: string;
    brand: string;
    price: number;
    fileSize: string;
    criticalScore: number;
    criticalMax: number;
    criticalMissing: string[];
    importantScore: number;
    importantMax: number;
    importantMissing: string[];
    pdpScore: number;
    pdpMax: number;
    pdpMissing: string[];
    advancedScore: number;
    advancedMax: number;
    advancedMissing: string[];
    totalScore: number;
    totalMax: number;
    percentage: number;
    offersCount: number;
    galleryCount: number;
    hasVoC: boolean;
    vocReviews: number;
    scoreCount: number;
    scoreReasonsCount: number;
    dnaDimensions: number;
    issues: string[];
}

function hasField(obj: Record<string, unknown>, field: string): boolean {
    const val = obj[field];
    if (val === undefined || val === null) return false;
    if (typeof val === 'string' && val.trim() === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val as object).length === 0) return false;
    return true;
}

function auditProduct(p: Record<string, unknown>): AuditResult {
    const issues: string[] = [];

    // Critical fields
    const criticalMissing: string[] = [];
    for (const f of CRITICAL_FIELDS) {
        if (!hasField(p, f)) criticalMissing.push(f);
    }

    // Important fields
    const importantMissing: string[] = [];
    for (const f of IMPORTANT_FIELDS) {
        if (!hasField(p, f)) importantMissing.push(f);
    }

    // PDP fields
    const pdpMissing: string[] = [];
    for (const f of PDP_FIELDS) {
        if (!hasField(p, f)) pdpMissing.push(f);
    }

    // Advanced fields
    const advancedMissing: string[] = [];
    for (const f of ADVANCED_FIELDS) {
        if (!hasField(p, f)) advancedMissing.push(f);
    }

    // Detailed checks
    const scores = (p.scores as Record<string, number>) || {};
    const scoreCount = Object.keys(scores).length;
    if (scoreCount < 10) issues.push(`Only ${scoreCount}/10 scores`);

    const scoreReasons = (p.scoreReasons as Record<string, string>) || {};
    const scoreReasonsCount = Object.keys(scoreReasons).length;
    if (scoreReasonsCount < 10) issues.push(`Only ${scoreReasonsCount}/10 scoreReasons`);

    const offers = (p.offers as unknown[]) || [];
    if (offers.length === 0) issues.push('No offers');
    if (offers.length < 2) issues.push(`Only ${offers.length} offer(s)`);

    // Check offer quality
    for (const o of offers as Array<Record<string, unknown>>) {
        if (!o.affiliateUrl) issues.push(`Offer ${o.store}: missing affiliateUrl`);
        if (!o.inStock) issues.push(`Offer ${o.store}: out of stock`);
    }

    const gallery = (p.gallery as string[]) || [];
    if (gallery.length < 3) issues.push(`Gallery has only ${gallery.length} images`);

    const voc = p.voc as Record<string, unknown> | undefined;
    const vocReviews = voc?.totalReviews as number || 0;

    const productDna = p.productDna as Record<string, unknown> | undefined;
    const dimensions = (productDna?.dimensions as unknown[]) || [];

    if (dimensions.length < 10) issues.push(`productDna has only ${dimensions.length}/10 dimensions`);

    // Check image URLs for known bad patterns
    const imageUrl = p.imageUrl as string || '';
    if (imageUrl.includes('aplus-media-library')) issues.push('imageUrl uses aplus-media (403 risk)');
    if (!imageUrl) issues.push('No imageUrl');

    // Check status
    if (p.status !== 'published') issues.push(`Status: ${p.status || 'undefined'}`);

    // Check for type import (legacy cast)
    // (this would need file-level check, skip for now)

    const criticalScore = CRITICAL_FIELDS.length - criticalMissing.length;
    const importantScore = IMPORTANT_FIELDS.length - importantMissing.length;
    const pdpScore = PDP_FIELDS.length - pdpMissing.length;
    const advancedScore = ADVANCED_FIELDS.length - advancedMissing.length;
    const totalScore = criticalScore + importantScore + pdpScore + advancedScore;
    const totalMax = CRITICAL_FIELDS.length + IMPORTANT_FIELDS.length + PDP_FIELDS.length + ADVANCED_FIELDS.length;

    return {
        id: p.id as string,
        name: p.name as string,
        brand: p.brand as string,
        price: p.price as number,
        fileSize: '',
        criticalScore,
        criticalMax: CRITICAL_FIELDS.length,
        criticalMissing,
        importantScore,
        importantMax: IMPORTANT_FIELDS.length,
        importantMissing,
        pdpScore,
        pdpMax: PDP_FIELDS.length,
        pdpMissing,
        advancedScore,
        advancedMax: ADVANCED_FIELDS.length,
        advancedMissing,
        totalScore,
        totalMax,
        percentage: Math.round((totalScore / totalMax) * 100),
        offersCount: offers.length,
        galleryCount: gallery.length,
        hasVoC: !!voc,
        vocReviews,
        scoreCount,
        scoreReasonsCount,
        dnaDimensions: dimensions.length,
        issues,
    };
}

// Run audit
console.log('='.repeat(80));
console.log('AUDITORIA DE ROBÔS ASPIRADORES - ComparaTop');
console.log(`Total de produtos: ${ROBOT_VACUUM_PRODUCTS.length}`);
console.log('='.repeat(80));

const results: AuditResult[] = ROBOT_VACUUM_PRODUCTS.map(p => auditProduct(p as unknown as Record<string, unknown>));

// Sort by percentage descending
results.sort((a, b) => b.percentage - a.percentage);

// Print ranking
console.log('\n📊 RANKING DE COMPLETUDE\n');
console.log('Pos | Completude | Produto                                    | Crítico | Import. | PDP  | Adv. | Ofertas | Gallery | VoC');
console.log('-'.repeat(140));

results.forEach((r, i) => {
    const pos = String(i + 1).padStart(2);
    const pct = `${r.percentage}%`.padStart(4);
    const name = `${r.brand} ${r.name}`.substring(0, 42).padEnd(42);
    const crit = `${r.criticalScore}/${r.criticalMax}`.padStart(3);
    const imp = `${r.importantScore}/${r.importantMax}`.padStart(3);
    const pdp = `${r.pdpScore}/${r.pdpMax}`.padStart(3);
    const adv = `${r.advancedScore}/${r.advancedMax}`.padStart(3);
    const offers = String(r.offersCount).padStart(2);
    const gal = String(r.galleryCount).padStart(2);
    const voc = r.hasVoC ? `✅ (${r.vocReviews})` : '❌';

    console.log(`#${pos} |   ${pct}   | ${name} | ${crit}  |  ${imp}  | ${pdp} | ${adv} |    ${offers}   |    ${gal}   | ${voc}`);
});

// Print details for each product
console.log('\n\n📋 DETALHES POR PRODUTO\n');
results.forEach((r, i) => {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`#${i + 1} ${r.brand} ${r.name} (${r.id})`);
    console.log(`   Completude: ${r.percentage}% (${r.totalScore}/${r.totalMax})`);
    console.log(`   Preço: R$${r.price} | Scores: ${r.scoreCount}/10 | Razões: ${r.scoreReasonsCount}/10 | DNA: ${r.dnaDimensions}/10`);

    if (r.criticalMissing.length > 0) console.log(`   🔴 Críticos faltando: ${r.criticalMissing.join(', ')}`);
    if (r.importantMissing.length > 0) console.log(`   🟡 Importantes faltando: ${r.importantMissing.join(', ')}`);
    if (r.pdpMissing.length > 0) console.log(`   🔵 PDP faltando: ${r.pdpMissing.join(', ')}`);
    if (r.advancedMissing.length > 0) console.log(`   ⚪ Avançados faltando: ${r.advancedMissing.join(', ')}`);
    if (r.issues.length > 0) console.log(`   ⚠️  Issues: ${r.issues.join(' | ')}`);
});

// Summary
console.log('\n\n' + '='.repeat(80));
console.log('📈 RESUMO');
console.log('='.repeat(80));
const best = results[0];
console.log(`\n🏆 MAIS COMPLETO: ${best.brand} ${best.name} (${best.percentage}%)`);
console.log(`   ID: ${best.id}`);
if (best.issues.length > 0) console.log(`   Issues restantes: ${best.issues.join(' | ')}`);

const avgPct = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);
console.log(`\n📊 Média geral: ${avgPct}%`);
console.log(`   Produtos 100%: ${results.filter(r => r.percentage === 100).length}`);
console.log(`   Produtos >80%: ${results.filter(r => r.percentage >= 80).length}`);
console.log(`   Produtos >60%: ${results.filter(r => r.percentage >= 60).length}`);
console.log(`   Produtos <50%: ${results.filter(r => r.percentage < 50).length}`);
