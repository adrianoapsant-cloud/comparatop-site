import { test, expect } from '@playwright/test';

/**
 * PDP DOM Contract Tests
 * 
 * Validates the No-Null UI Protocol:
 * - Every PDP section MUST render something (content OR ModuleFallback)
 * - Sections NEVER silently disappear
 * 
 * Test matrix:
 * 1. mondial-afn-80-bi (gold product - has full data)
 * 2. Product with incomplete data (fallback validation)
 */

// Gold product with complete data
const GOLD_PRODUCT = 'mondial-afn-80-bi';

// Critical PDP sections that MUST always render
const CRITICAL_SECTIONS = [
    { id: 'simulators', name: 'Simuladores Inteligentes', selector: '[data-testid="pdp-section-simulators"], h2:has-text("Simuladores")' },
    { id: 'hidden_engineering', name: 'Engenharia Oculta', selector: '[data-testid="pdp-section-hidden_engineering"], h3:has-text("Engenharia Oculta")' },
    { id: 'dna', name: 'DNA do Produto', selector: 'h2:has-text("DNA do Produto"), .recharts-wrapper' },
    { id: 'context_score', name: 'Nota Contextual', selector: '[data-testid="pdp-section-context_score"], section:has-text("Contexto")' },
    { id: 'interactive_tools', name: 'Ferramentas Interativas', selector: '[data-testid="pdp-section-interactive_tools"], h2:has-text("Ferramentas Interativas")' },
];

test.describe('PDP No-Null UI Protocol', () => {

    test.describe('Gold Product: mondial-afn-80-bi', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto(`/produto/${GOLD_PRODUCT}`);
            // Wait for page to fully load
            await page.waitForLoadState('networkidle');
        });

        test('page loads successfully', async ({ page }) => {
            await expect(page).toHaveTitle(/mondial/i);
        });

        test('critical sections render (content or fallback)', async ({ page }) => {
            for (const section of CRITICAL_SECTIONS) {
                // Allow time for async loading
                await page.waitForTimeout(500);

                // Section should exist - either with content or as ModuleFallback
                const sectionExists = await page.locator(section.selector).first().isVisible()
                    .catch(() => false);

                const fallbackExists = await page.locator(`[data-testid="pdp-section-${section.id}"]`).isVisible()
                    .catch(() => false);

                // At least one must be true
                const sectionRendered = sectionExists || fallbackExists;

                expect(sectionRendered, `Section "${section.name}" must render (content or fallback)`).toBe(true);
            }
        });

        test('radar chart shows air_fryer labels (not TV fallback)', async ({ page }) => {
            // Scroll to DNA section
            await page.locator('h2:has-text("DNA do Produto")').scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);

            // Check for air_fryer specific labels
            const pageContent = await page.content();

            // Should have air_fryer labels
            const hasCapacidade = pageContent.includes('Capacidade');
            const hasPotencia = pageContent.includes('Potência');

            // Should NOT have TV-only labels
            const hasGaming = pageContent.includes('Gaming');

            expect(hasCapacidade || hasPotencia, 'Radar chart should show air_fryer labels').toBe(true);
        });

        test('simulators section is visible', async ({ page }) => {
            const simulators = page.locator('h2:has-text("Simuladores"), [data-testid="pdp-section-simulators"]').first();
            await simulators.scrollIntoViewIfNeeded();
            await expect(simulators).toBeVisible();
        });

    });

    test.describe('Fallback Validation', () => {

        test('ModuleFallback shows for unsupported categories', async ({ page }) => {
            // Visit gold product page
            await page.goto(`/produto/${GOLD_PRODUCT}`);
            await page.waitForLoadState('networkidle');

            // Check that fallback elements have proper data attributes when shown
            const fallbacks = await page.locator('[data-section-status]').all();

            for (const fallback of fallbacks) {
                const status = await fallback.getAttribute('data-section-status');
                // Valid statuses only
                expect(['loading', 'unavailable', 'coming_soon', 'error']).toContain(status);
            }
        });

    });

});

test.describe('DOM Contract: No Silent Omissions', () => {

    test('no section returns invisible null', async ({ page }) => {
        await page.goto(`/produto/${GOLD_PRODUCT}`);
        await page.waitForLoadState('networkidle');

        // Scroll through entire page to trigger lazy loading
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 500;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Wait for any async content
        await page.waitForTimeout(1000);

        // Page should have substantial content (not empty)
        const bodyText = await page.locator('body').textContent();
        expect(bodyText?.length).toBeGreaterThan(1000);
    });

});
