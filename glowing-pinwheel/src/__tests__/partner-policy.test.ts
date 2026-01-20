/**
 * Partner Policy Tests
 * 
 * Tests for affiliate partner policies compliance
 */

import { describe, test, expect } from 'vitest';
import {
    getPartnerPolicy,
    canShowPrice,
    canShowPriceAlert,
    shouldUseNeutralCta,
    getPartnerCtaLabel,
    isAmazon,
    PARTNER_POLICIES,
} from '@/config/partner-policy';

describe('Partner Policy Configuration', () => {
    describe('Amazon Compliance', () => {
        test('Amazon should NOT show price', () => {
            expect(canShowPrice('amazon')).toBe(false);
        });

        test('Amazon should NOT allow price alerts', () => {
            expect(canShowPriceAlert('amazon')).toBe(false);
        });

        test('Amazon should use neutral CTA', () => {
            expect(shouldUseNeutralCta('amazon')).toBe(true);
        });

        test('Amazon CTA should be "Ver preço na Amazon"', () => {
            expect(getPartnerCtaLabel('amazon')).toBe('Ver preço na Amazon');
        });

        test('Amazon should NOT allow side-by-side compare', () => {
            const policy = getPartnerPolicy('amazon');
            expect(policy.allowSideBySideCompare).toBe(false);
        });
    });

    describe('Mercado Livre', () => {
        test('Mercado Livre should show price', () => {
            expect(canShowPrice('mercadolivre')).toBe(true);
        });

        test('Mercado Livre should allow price alerts', () => {
            expect(canShowPriceAlert('mercadolivre')).toBe(true);
        });

        test('Mercado Livre should NOT use neutral CTA', () => {
            expect(shouldUseNeutralCta('mercadolivre')).toBe(false);
        });
    });

    describe('Other Partners', () => {
        test('Magalu should show price', () => {
            expect(canShowPrice('magalu')).toBe(true);
        });

        test('Shopee should show price', () => {
            expect(canShowPrice('shopee')).toBe(true);
        });
    });

    describe('Helpers', () => {
        test('isAmazon returns true for amazon', () => {
            expect(isAmazon('amazon')).toBe(true);
            expect(isAmazon('Amazon')).toBe(true);
            expect(isAmazon('AMAZON')).toBe(true);
        });

        test('isAmazon returns false for other partners', () => {
            expect(isAmazon('mercadolivre')).toBe(false);
            expect(isAmazon('magalu')).toBe(false);
        });

        test('Unknown partner returns permissive defaults', () => {
            const policy = getPartnerPolicy('unknown-partner');
            expect(policy.showPrice).toBe(true);
            expect(policy.allowPriceAlert).toBe(true);
        });
    });
});

describe('Policy Structure', () => {
    test('All partners have required fields', () => {
        const requiredFields = [
            'displayName',
            'showPrice',
            'showInstallments',
            'allowPriceAlert',
            'allowSideBySideCompare',
            'neutralCta',
            'ctaLabel',
        ];

        for (const [partnerId, policy] of Object.entries(PARTNER_POLICIES)) {
            for (const field of requiredFields) {
                expect(policy, `${partnerId} missing ${field}`).toHaveProperty(field);
            }
        }
    });
});
