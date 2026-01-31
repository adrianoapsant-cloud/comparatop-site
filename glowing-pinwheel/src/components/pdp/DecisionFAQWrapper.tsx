'use client';

import { useState, useEffect } from 'react';
import { DecisionFAQSection } from '@/components/pdp/DecisionFAQSection';
import { getProductExtendedData } from '@/lib/product-loader';
import { ModuleFallback } from '@/components/pdp/ModuleFallback';
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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getProductExtendedData(productId).then((data) => {
            if (data?.decisionFAQ && data.decisionFAQ.length > 0) {
                setFaqItems(data.decisionFAQ);
            }
            setIsLoaded(true);
        });
    }, [productId]);

    // Show loading state while fetching
    if (!isLoaded) {
        return (
            <ModuleFallback
                sectionId="decisionFAQ"
                sectionName="Perguntas Decisivas"
                status="loading"
                reason="Carregando perguntas frequentes..."
            />
        );
    }

    // Show unavailable if no FAQ items after load
    if (!faqItems || faqItems.length === 0) {
        return (
            <ModuleFallback
                sectionId="decisionFAQ"
                sectionName="Perguntas Decisivas"
                status="coming_soon"
                reason="Perguntas frequentes em preparação para este produto"
            />
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <DecisionFAQSection items={faqItems} />
        </section>
    );
}
