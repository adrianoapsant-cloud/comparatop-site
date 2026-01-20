#!/usr/bin/env npx tsx
/**
 * Lighthouse Performance Testing Script
 * 
 * Runs Lighthouse 3x per route and calculates median metrics.
 * Usage: npx tsx scripts/run-lighthouse.ts
 * 
 * Requirements:
 * - Chrome installed
 * - Dev server running on localhost:3000
 */

import { execSync, spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ============================================
// CONFIGURATION
// ============================================

const ROUTES = [
    { name: 'Home', path: '/' },
    { name: 'PLP Smart TVs', path: '/categorias/smart-tvs' },
    { name: 'PDP Samsung QN90C', path: '/produto/samsung-qn90c-65' },
    { name: 'VS Battle', path: '/vs/samsung-qn90c-65-vs-tcl-c735-65' }
];

const BASE_URL = 'http://localhost:3000';
const RUNS_PER_ROUTE = 3;
const OUTPUT_DIR = join(process.cwd(), '.next', 'lighthouse');

interface LighthouseMetrics {
    performance: number;
    lcp: number;  // Largest Contentful Paint (ms)
    cls: number;  // Cumulative Layout Shift
    tbt: number;  // Total Blocking Time (ms)
    fcp: number;  // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
}

interface RouteResult {
    name: string;
    path: string;
    runs: LighthouseMetrics[];
    median: LighthouseMetrics;
}

// ============================================
// HELPERS
// ============================================

function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function checkDevServer(): boolean {
    try {
        execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}`, { encoding: 'utf8' });
        return true;
    } catch {
        return false;
    }
}

async function runLighthouse(url: string): Promise<LighthouseMetrics | null> {
    return new Promise((resolve) => {
        try {
            // Run lighthouse CLI and capture JSON output
            const result = execSync(
                `npx lighthouse "${url}" --output=json --quiet --chrome-flags="--headless --no-sandbox" --only-categories=performance`,
                {
                    encoding: 'utf8',
                    maxBuffer: 50 * 1024 * 1024,
                    timeout: 120000
                }
            );

            const report = JSON.parse(result);
            const audits = report.audits;

            resolve({
                performance: Math.round(report.categories.performance.score * 100),
                lcp: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
                cls: parseFloat((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
                tbt: Math.round(audits['total-blocking-time']?.numericValue || 0),
                fcp: Math.round(audits['first-contentful-paint']?.numericValue || 0),
                ttfb: Math.round(audits['server-response-time']?.numericValue || 0)
            });
        } catch (error) {
            console.error(`  ❌ Lighthouse failed for ${url}:`, (error as Error).message);
            resolve(null);
        }
    });
}

function calculateMedian(runs: LighthouseMetrics[]): LighthouseMetrics {
    return {
        performance: median(runs.map(r => r.performance)),
        lcp: median(runs.map(r => r.lcp)),
        cls: parseFloat(median(runs.map(r => r.cls)).toFixed(3)),
        tbt: median(runs.map(r => r.tbt)),
        fcp: median(runs.map(r => r.fcp)),
        ttfb: median(runs.map(r => r.ttfb))
    };
}

function formatResults(results: RouteResult[]): string {
    let output = '## Lighthouse Performance Results\n\n';
    output += `**Date**: ${new Date().toISOString().split('T')[0]}\n`;
    output += `**Runs per route**: ${RUNS_PER_ROUTE}\n\n`;

    output += '### Median Metrics by Route\n\n';
    output += '| Route | Perf | LCP | CLS | TBT | FCP | TTFB |\n';
    output += '|-------|------|-----|-----|-----|-----|------|\n';

    for (const result of results) {
        const m = result.median;
        const perfColor = m.performance >= 90 ? '🟢' : m.performance >= 50 ? '🟡' : '🔴';
        const lcpColor = m.lcp <= 2500 ? '🟢' : m.lcp <= 4000 ? '🟡' : '🔴';
        const clsColor = m.cls <= 0.1 ? '🟢' : m.cls <= 0.25 ? '🟡' : '🔴';

        output += `| ${result.name} | ${perfColor} ${m.performance} | ${lcpColor} ${m.lcp}ms | ${clsColor} ${m.cls} | ${m.tbt}ms | ${m.fcp}ms | ${m.ttfb}ms |\n`;
    }

    output += '\n### Core Web Vitals Targets\n';
    output += '| Metric | Good | Needs Improvement | Poor |\n';
    output += '|--------|------|-------------------|------|\n';
    output += '| LCP | ≤ 2500ms 🟢 | ≤ 4000ms 🟡 | > 4000ms 🔴 |\n';
    output += '| CLS | ≤ 0.1 🟢 | ≤ 0.25 🟡 | > 0.25 🔴 |\n';
    output += '| TBT | ≤ 200ms 🟢 | ≤ 600ms 🟡 | > 600ms 🔴 |\n';

    return output;
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('🔦 Lighthouse Performance Testing\n');
    console.log('Checking dev server...');

    if (!checkDevServer()) {
        console.error('❌ Dev server not running on localhost:3000');
        console.error('   Run: npm run dev');
        process.exit(1);
    }

    console.log('✅ Dev server is running\n');

    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const results: RouteResult[] = [];

    for (const route of ROUTES) {
        console.log(`\n📍 Testing: ${route.name} (${route.path})`);
        const url = `${BASE_URL}${route.path}`;
        const runs: LighthouseMetrics[] = [];

        for (let i = 1; i <= RUNS_PER_ROUTE; i++) {
            console.log(`  Run ${i}/${RUNS_PER_ROUTE}...`);
            const metrics = await runLighthouse(url);
            if (metrics) {
                runs.push(metrics);
                console.log(`    Performance: ${metrics.performance}, LCP: ${metrics.lcp}ms, CLS: ${metrics.cls}`);
            }
        }

        if (runs.length > 0) {
            results.push({
                name: route.name,
                path: route.path,
                runs,
                median: calculateMedian(runs)
            });
        }
    }

    // Generate report
    const report = formatResults(results);
    const reportPath = join(OUTPUT_DIR, 'report.md');
    writeFileSync(reportPath, report);

    console.log('\n' + '='.repeat(60));
    console.log('📊 LIGHTHOUSE RESULTS');
    console.log('='.repeat(60));
    console.log(report);
    console.log(`\n📁 Full report saved to: ${reportPath}`);

    // Check for failures
    const failures = results.filter(r => r.median.performance < 50 || r.median.lcp > 4000 || r.median.cls > 0.25);
    if (failures.length > 0) {
        console.log('\n⚠️ Some routes have poor performance:');
        failures.forEach(f => console.log(`   - ${f.name}: Performance ${f.median.performance}`));
        process.exit(1);
    }

    console.log('\n✅ All routes passed performance thresholds');
    process.exit(0);
}

main().catch(console.error);
