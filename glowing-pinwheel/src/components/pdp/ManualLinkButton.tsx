/**
 * @file ManualLinkButton.tsx
 * @description Renders manual URL as clickable link (not text)
 * 
 * Compliance: E) Manual must be <a href="..." target="_blank" rel="noopener noreferrer">
 */

import { FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualLinkButtonProps {
    manualUrl?: string;
    className?: string;
    variant?: 'button' | 'inline';
}

/**
 * Renders manual as clickable link
 * Returns null if no URL provided
 */
export function ManualLinkButton({
    manualUrl,
    className,
    variant = 'button'
}: ManualLinkButtonProps) {
    if (!manualUrl) {
        return null;
    }

    const isValidUrl = manualUrl.startsWith('http://') || manualUrl.startsWith('https://');

    if (!isValidUrl) {
        console.warn('[ManualLinkButton] Invalid URL format:', manualUrl);
        return null;
    }

    if (variant === 'inline') {
        return (
            <a
                href={manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="manual-link"
                className={cn(
                    'inline-flex items-center gap-1 text-blue-600 hover:text-blue-800',
                    'underline underline-offset-2 transition-colors',
                    className
                )}
            >
                <FileText size={14} />
                Manual (PDF)
                <ExternalLink size={12} />
            </a>
        );
    }

    return (
        <a
            href={manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="manual-link"
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700',
                'text-slate-700 dark:text-slate-300 text-sm font-medium',
                'transition-colors',
                className
            )}
        >
            <FileText size={16} />
            Manual do Produto (PDF)
            <ExternalLink size={14} />
        </a>
    );
}

export default ManualLinkButton;
