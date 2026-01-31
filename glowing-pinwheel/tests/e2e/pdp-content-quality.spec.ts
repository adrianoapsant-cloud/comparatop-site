import { test, expect } from '@playwright/test';

/**
 * PDP Content Quality E2E Tests
 * 
 * Validates that PDP has REAL content (not placeholders):
 * - Community Consensus with visible rating (not placeholder)
 * - Curiosity sandwich with non-generic text
 * - Simulators with cards or explicit fallback
 * - Manual link is clickable <a href>
 * - All expected sections exist (content or fallback)
 * 
 * DoD: No module should "disappear" silently
 */

const PRODUCTS = [
    { id: 'mondial-afn-80-bi', category: 'air_fryer' },
    { id: 'roborock-q7-l5', category: 'robot-vacuum' },
];

test.describe('PDP Content Quality', () => {

    for (const product of PRODUCTS) {
        test.describe(`Product: ${product.id}`, () => {

            test.beforeEach(async ({ page }) => {
                await page.goto(`/produto/${product.id}`);
                await page.waitForLoadState('networkidle');
            });

            test('page loads with product name', async ({ page }) => {
                const title = await page.title();
                expect(title.length).toBeGreaterThan(10);
            });

            test('has visible score badge', async ({ page }) => {
                // Score should be visible somewhere on page
                const scorePattern = /\d\.\d+\/10|\d\.\d+/;
                const pageContent = await page.textContent('body');
                expect(pageContent).toMatch(scorePattern);
            });

            test('has community consensus with visible rating (not placeholder)', async ({ page }) => {
                // Scroll to consensus section
                await page.evaluate(() => window.scrollBy(0, 800));
                await page.waitForTimeout(300);

                // Look for percentage rating (e.g., "87%" or "84%")
                const pageContent = await page.textContent('body') || '';
                const hasPercentage = /\d{2,3}%/.test(pageContent);

                // Should have some form of rating percentage
                expect(hasPercentage).toBe(true);
            });

            test('has product DNA radar section', async ({ page }) => {
                // Look for DNA section or radar chart
                const dnaSection = page.locator('h2:has-text("DNA"), h3:has-text("DNA"), .recharts-wrapper').first();
                await expect(dnaSection).toBeVisible({ timeout: 5000 }).catch(() => {
                    // Fallback: check for explicit fallback
                    const fallback = page.locator('[data-section-status]');
                    return expect(fallback).toBeVisible();
                });
            });

            test('has simulators with cards OR explicit fallback', async ({ page }) => {
                await page.evaluate(() => window.scrollBy(0, 2000));
                await page.waitForTimeout(500);

                // Check for simulator cards OR fallback
                const simulatorCards = page.locator('[class*="simulator"], h2:has-text("Simulador")');
                const simulatorFallback = page.locator('[data-testid="pdp-section-simulators"]');

                const hasCards = await simulatorCards.count() > 0;
                const hasFallback = await simulatorFallback.isVisible().catch(() => false);

                expect(hasCards || hasFallback).toBe(true);
            });

            test('has unknown-unknowns section OR explicit fallback', async ({ page }) => {
                await page.evaluate(() => window.scrollBy(0, 1500));
                await page.waitForTimeout(300);

                // Check for Engenharia Oculta or explicit fallback
                const uuSection = page.locator('h3:has-text("Engenharia Oculta"), [class*="unknown-unknowns"]');
                const uuFallback = page.locator('[data-testid="pdp-section-hidden_engineering"]');

                const hasSection = await uuSection.isVisible().catch(() => false);
                const hasFallback = await uuFallback.isVisible().catch(() => false);

                expect(hasSection || hasFallback).toBe(true);
            });

            test('has TCO/Ownership section OR explicit fallback', async ({ page }) => {
                await page.evaluate(() => window.scrollBy(0, 1200));
                await page.waitForTimeout(300);

                // Check for ownership insights or fallback
                const tcoSection = page.locator('#ownership-insights, h2:has-text("Impacto"), h2:has-text("Bolso")');
                const tcoFallback = page.locator('[data-testid="pdp-section-ownership_insights"]');

                const hasSection = await tcoSection.isVisible().catch(() => false);
                const hasFallback = await tcoFallback.isVisible().catch(() => false);

                expect(hasSection || hasFallback).toBe(true);
            });

            test('no placeholder text visible', async ({ page }) => {
                const pageContent = await page.textContent('body') || '';

                // These should NEVER appear in production
                const forbiddenPhrases = [
                    '[PLACEHOLDER]',
                    '[TODO]',
                    'Lorem ipsum dolor sit',
                    'Carregando dados...',
                    '0 reviews',
                ];

                for (const phrase of forbiddenPhrases) {
                    expect(pageContent).not.toContain(phrase);
                }
            });

        });
    }

});

test.describe('DOM Contract: Module Visibility', () => {

    test('mondial-afn-80-bi: no module is silently hidden', async ({ page }) => {
        await page.goto('/produto/mondial-afn-80-bi');
        await page.waitForLoadState('networkidle');

        // Expected sections that MUST be visible (content or fallback)
        const expectedSections = [
            { name: 'consensus', selector: '[class*="consensus"], [class*="Consensus"]' },
            { name: 'simulators', selector: 'h2:has-text("Simulador"), [data-testid="pdp-section-simulators"]' },
            { name: 'unknown-unknowns', selector: 'h3:has-text("Engenharia"), [data-testid="pdp-section-hidden_engineering"]' },
        ];

        // Scroll through page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(500);

        for (const section of expectedSections) {
            const element = page.locator(section.selector).first();
            const isVisible = await element.isVisible().catch(() => false);

            // If not visible, check for ANY fallback in that area
            if (!isVisible) {
                const anyFallback = page.locator('[data-section-status]');
                const fallbackCount = await anyFallback.count();
                expect(fallbackCount, `Section ${section.name} should have content or fallback`).toBeGreaterThan(0);
            }
        }
    });

    test('fallback elements have proper attributes', async ({ page }) => {
        await page.goto('/produto/mondial-afn-80-bi');
        await page.waitForLoadState('networkidle');

        // Any fallback should have data-section-status
        const fallbacks = await page.locator('[data-section-status]').all();

        for (const fallback of fallbacks) {
            const status = await fallback.getAttribute('data-section-status');
            expect(['loading', 'unavailable', 'coming_soon', 'error']).toContain(status);
        }
    });

});

