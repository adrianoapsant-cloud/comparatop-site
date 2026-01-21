'use client';

/**
 * InlineDataCorrectionCTA
 * 
 * Inline CTA button for triggering data correction modal.
 * Designed to be placed at the end of PDP sections.
 */

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataCorrectionModal } from './DataCorrectionModal';

// ============================================
// TYPES
// ============================================

export interface InlineDataCorrectionCTAProps {
    /** Unique identifier for the section (e.g., 'pdp_specs', 'pdp_tco') */
    elementId: string;
    /** Human-readable section label (e.g., 'Ficha Técnica') */
    sectionLabel: string;
    /** Product slug for context */
    productSlug?: string;
    /** Custom button label */
    label?: string;
    /** Additional CSS classes */
    className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function InlineDataCorrectionCTA({
    elementId,
    sectionLabel,
    productSlug,
    label = 'Corrigir esta seção',
    className,
}: InlineDataCorrectionCTAProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={cn(
                'flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3',
                'py-3 px-4 mt-4',
                'bg-gray-50/80 border border-dashed border-gray-200 rounded-lg',
                className
            )}>
                <span className="text-sm text-gray-500 text-center">
                    Encontrou uma informação incorreta?
                </span>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5',
                        'text-sm font-medium text-amber-700',
                        'bg-amber-50 hover:bg-amber-100 border border-amber-200',
                        'rounded-lg transition-colors'
                    )}
                >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {label}
                </button>
            </div>

            <DataCorrectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                elementId={elementId}
                sectionLabel={sectionLabel}
                productSlug={productSlug}
            />
        </>
    );
}

export default InlineDataCorrectionCTA;
