'use client';

import { useState, useEffect } from 'react';
import { DecisionFAQSection } from '@/components/pdp/DecisionFAQSection';
import { getProductExtendedData } from '@/lib/product-loader';
import type { DecisionFAQItem } from '@/config/product-json-schema';

interface DecisionFAQWrapperProps {
    productId: string;
}

/**
 * Client-side wrapper for DecisionFAQ section
 * Loads extended data dynamically and renders FAQ if available
 * Positioned as FINAL OBJECTION BREAKER at the end of page content
 */
export function DecisionFAQWrapper({ productId }: DecisionFAQWrapperProps) {
    const [faqItems, setFaqItems] = useState<DecisionFAQItem[] | null>(null);

    useEffect(() => {
        getProductExtendedData(productId).then((data) => {
            if (data?.decisionFAQ && data.decisionFAQ.length > 0) {
                setFaqItems(data.decisionFAQ);
            }
        });
    }, [productId]);

    if (!faqItems || faqItems.length === 0) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <DecisionFAQSection items={faqItems} />
        </section>
    );
}
