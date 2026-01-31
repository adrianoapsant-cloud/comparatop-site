/**
 * CtDetails - Wrapper component for CT-styled native <details>/<summary>
 * 
 * Uses HTML5 native details/summary for zero-JS accordion behavior.
 * Consistent styling with CT design system.
 */

import React from 'react';

interface CtDetailsProps {
    /** Title shown in the summary */
    title: React.ReactNode;
    /** Whether to open by default */
    defaultOpen?: boolean;
    /** Optional badge on the right side (e.g., "Técnico", "Evidências") */
    rightBadge?: React.ReactNode;
    /** Badge style variant */
    badgeVariant?: 'default' | 'tech' | 'evidence';
    /** Content shown when expanded */
    children: React.ReactNode;
    /** Optional className for the container */
    className?: string;
    /** Use soft variant (lighter background) */
    soft?: boolean;
}

export function CtDetails({
    title,
    defaultOpen = false,
    rightBadge,
    badgeVariant = 'default',
    children,
    className = '',
    soft = false,
}: CtDetailsProps) {
    const containerClass = soft ? 'ct-details-soft' : 'ct-details';

    const badgeClass = badgeVariant === 'tech'
        ? 'ct-details-badge ct-details-badge--tech'
        : badgeVariant === 'evidence'
            ? 'ct-details-badge ct-details-badge--evidence'
            : 'ct-details-badge';

    return (
        <details
            className={`${containerClass} ${className}`}
            open={defaultOpen}
        >
            <summary className="ct-summary">
                <span className="ct-summary-content">
                    {title}
                </span>
                {rightBadge && (
                    <span className={badgeClass}>
                        {rightBadge}
                    </span>
                )}
                <span className="ct-chevron" aria-hidden="true">
                    ▾
                </span>
            </summary>
            <div className="ct-details-body">
                {children}
            </div>
        </details>
    );
}

export default CtDetails;
