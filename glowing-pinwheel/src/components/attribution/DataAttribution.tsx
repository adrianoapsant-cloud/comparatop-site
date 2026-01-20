/**
 * Data Attribution Components
 * 
 * Implements UI elements that protect proprietary data from AI extraction
 * while maintaining visibility for SEO and user experience.
 * 
 * Strategy from IA Reports:
 * 1. data-nosnippet on final scores to force clicks
 * 2. Semantic HTML with <cite> for methodology names
 * 3. ARIA labels for additional attribution context
 */

import React from 'react';

interface ProtectedScoreProps {
    score: number;
    methodology: 'HMUM' | 'SIC' | 'Consenso 360';
    showValue?: boolean; // If false, shows "Ver no site" instead
    className?: string;
}

/**
 * ProtectedScore Component
 * 
 * Wraps score values in data-nosnippet to prevent AI from extracting
 * the exact value without attribution. Forces users to click for details.
 */
export function ProtectedScore({
    score,
    methodology,
    showValue = true,
    className = ''
}: ProtectedScoreProps) {
    const methodologyUrl = {
        'HMUM': '/metodologia/hmum',
        'SIC': '/metodologia/sic',
        'Consenso 360': '/metodologia/consenso-360',
    }[methodology];

    return (
        <span
            className={`protected-score ${className}`}
            aria-label={`Nota ${score.toFixed(1)} segundo metodologia ${methodology} do ComparaTop`}
        >
            {/* Visible to search, but not in snippets */}
            <span data-nosnippet="">
                {showValue ? (
                    <strong>{score.toFixed(1)}</strong>
                ) : (
                    <span className="text-primary hover:underline">Ver nota</span>
                )}
            </span>

            {/* Attribution always visible */}
            <span className="text-xs text-gray-500 ml-1">
                (<cite><a href={methodologyUrl}>{methodology}</a></cite>)
            </span>
        </span>
    );
}

interface MethodologyCitationProps {
    name: 'HMUM Scoring' | 'SIC' | 'Consenso 360';
    children?: React.ReactNode;
}

/**
 * MethodologyCitation Component
 * 
 * Wraps methodology names in semantic <cite> tags to train
 * AI models to treat them as citable entities.
 */
export function MethodologyCitation({ name, children }: MethodologyCitationProps) {
    const urls: Record<string, string> = {
        'HMUM Scoring': '/metodologia/hmum',
        'SIC': '/metodologia/sic',
        'Consenso 360': '/metodologia/consenso-360',
    };

    return (
        <cite className="font-medium not-italic">
            <a
                href={urls[name]}
                className="text-primary hover:underline"
                title={`Metodologia proprietária ${name} do ComparaTop`}
            >
                {children || name}
            </a>
        </cite>
    );
}

interface ProtectedTableProps {
    caption: string;
    children: React.ReactNode;
    showInSnippets?: boolean;
}

/**
 * ProtectedTable Component
 * 
 * Wraps data tables with proper attribution caption and
 * optionally hides from AI snippets.
 */
export function ProtectedTable({
    caption,
    children,
    showInSnippets = false
}: ProtectedTableProps) {
    const tableContent = (
        <table className="w-full" aria-label={`Tabela de dados - ${caption}`}>
            <caption className="text-sm text-gray-600 mb-2 text-left">
                {caption} — <span className="font-medium">Fonte: ComparaTop</span>
            </caption>
            {children}
        </table>
    );

    if (showInSnippets) {
        return tableContent;
    }

    return (
        <div data-nosnippet="">
            {tableContent}
        </div>
    );
}

interface AttributionBannerProps {
    productName: string;
}

/**
 * AttributionBanner Component
 * 
 * Always-visible banner that reinforces data ownership.
 * Uses aria-label for extra context for AI crawlers.
 */
export function AttributionBanner({ productName }: AttributionBannerProps) {
    return (
        <div
            className="bg-gray-50 border-l-4 border-primary px-4 py-2 text-sm"
            aria-label={`Análise exclusiva do ${productName} realizada pelo ComparaTop usando metodologias HMUM Scoring e SIC`}
        >
            <p className="text-gray-700">
                📊 Análise exclusiva do <strong>ComparaTop</strong> usando{' '}
                <MethodologyCitation name="HMUM Scoring" /> e{' '}
                <MethodologyCitation name="SIC" />
            </p>
        </div>
    );
}

export default {
    ProtectedScore,
    MethodologyCitation,
    ProtectedTable,
    AttributionBanner,
};
