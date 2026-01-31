'use client';

/**
 * SimplifiedPDP - FAQ Section
 * Renderiza perguntas frequentes com acordeon
 */

import React, { useState } from 'react';
import { PDPDataContract, FAQItem } from '../hooks/usePDPData';

interface FAQSectionProps {
    data: PDPDataContract;
}

export function FAQSection({ data }: FAQSectionProps) {
    const items = data.faq;
    const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));

    if (!items?.length || items.length < 3) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[FAQSection] Hidden: insufficient FAQ items for', data.product.id, '(need 3+, got', items?.length || 0, ')');
        }
        return null;
    }

    const toggleIndex = (index: number) => {
        setOpenIndexes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <section className="pdp-faq py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                ❓ Perguntas de quem estava em dúvida
            </h2>
            <p className="text-sm text-gray-500 mb-4">
                Respostas honestas para decisões práticas
            </p>

            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                        {/* Question */}
                        <button
                            className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                            onClick={() => toggleIndex(i)}
                        >
                            <span className="font-medium text-gray-900">{item.question}</span>
                            <span className="text-gray-500 text-xl">
                                {openIndexes.has(i) ? '−' : '+'}
                            </span>
                        </button>

                        {/* Answer */}
                        {openIndexes.has(i) && (
                            <div className="px-4 py-3 bg-white text-sm text-gray-700 leading-relaxed">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FAQSection;
