'use client';

/**
 * ComparisonTableClient - Client wrapper for comparison table with diff toggle
 * 
 * Features:
 * - Toggle: "Mostrar apenas diferenças"
 * - Quick Verdict: top 3 differences at glance
 * - Diff Highlighting: subtle highlight on different cells
 * - CTAs: primary (best product) + secondary
 * - Mobile sticky CTA bar
 * - Mobile-friendly tooltips on click
 */

import React, { useState, useMemo } from 'react';
import { isDifferent } from '@/lib/compare/diff';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

// ============================================
// Types
// ============================================

export interface CompareCell {
    raw: unknown;
    display: React.ReactNode;
}

export interface CompareRow {
    id: string;
    section: string;
    label: string;
    tooltip?: string; // Explanatory text for the field
    left: CompareCell;
    right: CompareCell;
}

interface ComparisonTableClientProps {
    rows: CompareRow[];
    leftName: string;
    rightName: string;
    leftSlug: string;
    rightSlug: string;
    leftScore?: number | null;
    rightScore?: number | null;
    leftPrice?: string;
    rightPrice?: string;
}

// ============================================
// Component
// ============================================

export function ComparisonTableClient({
    rows,
    leftName,
    rightName,
    leftSlug,
    rightSlug,
    leftScore,
    rightScore,
    leftPrice,
    rightPrice,
}: ComparisonTableClientProps) {
    const [showDiffOnly, setShowDiffOnly] = useState(false);

    // Calculate which rows are different
    const rowsWithDiff = useMemo(() => {
        return rows.map(row => ({
            ...row,
            isDifferent: isDifferent(row.left.raw, row.right.raw),
        }));
    }, [rows]);

    // Filter rows based on toggle
    const filteredRows = useMemo(() => {
        if (!showDiffOnly) return rowsWithDiff;
        return rowsWithDiff.filter(row => row.isDifferent);
    }, [rowsWithDiff, showDiffOnly]);

    // Group rows by section
    const sections = useMemo(() => {
        const sectionMap = new Map<string, typeof filteredRows>();
        for (const row of filteredRows) {
            const section = row.section || 'Geral';
            if (!sectionMap.has(section)) {
                sectionMap.set(section, []);
            }
            sectionMap.get(section)!.push(row);
        }
        return sectionMap;
    }, [filteredRows]);

    // Get all unique sections from original rows (to show empty state)
    const allSections = useMemo(() => {
        const sectionSet = new Set<string>();
        for (const row of rows) {
            sectionSet.add(row.section || 'Geral');
        }
        return Array.from(sectionSet);
    }, [rows]);

    // Count differences
    const diffCount = useMemo(() => {
        return rowsWithDiff.filter(row => row.isDifferent).length;
    }, [rowsWithDiff]);

    // Quick verdict: top 3 differences from "Resumo" section
    const quickVerdictItems = useMemo(() => {
        const resumoRows = rowsWithDiff
            .filter(row => row.section === 'Resumo' && row.isDifferent)
            .slice(0, 3);
        return resumoRows;
    }, [rowsWithDiff]);

    // Determine "winner" for CTA
    const winner = useMemo(() => {
        const lScore = typeof leftScore === 'number' ? leftScore : 0;
        const rScore = typeof rightScore === 'number' ? rightScore : 0;

        if (lScore > rScore) return 'left';
        if (rScore > lScore) return 'right';
        return 'left'; // default to left if tie
    }, [leftScore, rightScore]);

    const winnerName = winner === 'left' ? leftName : rightName;
    const winnerSlug = winner === 'left' ? leftSlug : rightSlug;
    const loserName = winner === 'left' ? rightName : leftName;
    const loserSlug = winner === 'left' ? rightSlug : leftSlug;

    return (
        <div className="space-y-4">
            {/* Quick Verdict */}
            {quickVerdictItems.length > 0 ? (
                <div className="ct-compare-verdict">
                    <h3 className="ct-compare-verdict-title">
                        ⚡ Principais diferenças
                    </h3>
                    <ul className="ct-compare-verdict-list">
                        {quickVerdictItems.map(item => (
                            <li key={item.id} className="ct-compare-verdict-item">
                                <span className="font-medium">{item.label}:</span>
                                <span className="text-gray-600">
                                    {leftName}: {item.left.display} vs {rightName}: {item.right.display}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="ct-compare-verdict">
                    <h3 className="ct-compare-verdict-title">
                        ✓ Produtos muito similares no resumo
                    </h3>
                    <p className="text-sm text-gray-600">
                        As principais métricas são equivalentes entre os dois produtos.
                    </p>
                </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
                <a
                    href={`/produto/${winnerSlug}?simplified=true`}
                    className="ct-btn ct-btn-primary text-center flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Ver {winnerName}
                    {typeof leftScore === 'number' && typeof rightScore === 'number' && leftScore !== rightScore && (
                        <span className="ml-1 text-xs opacity-80">(melhor nota)</span>
                    )}
                </a>
                <a
                    href={`/produto/${loserSlug}?simplified=true`}
                    className="ct-btn ct-btn-secondary text-center flex-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Ver {loserName}
                </a>
            </div>

            {/* Toggle Bar */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="diff-toggle"
                        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                        Mostrar apenas diferenças
                    </label>
                    <span className="ct-chip ct-evidence--medium text-xs">
                        {diffCount} diferenças
                    </span>
                </div>
                <div className="relative">
                    <input
                        type="checkbox"
                        id="diff-toggle"
                        checked={showDiffOnly}
                        onChange={(e) => setShowDiffOnly(e.target.checked)}
                        className="sr-only peer"
                    />
                    <label
                        htmlFor="diff-toggle"
                        className="
                            w-11 h-6 bg-gray-300 rounded-full cursor-pointer
                            peer-checked:bg-blue-600
                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                            after:bg-white after:rounded-full after:h-5 after:w-5
                            after:transition-transform after:duration-200
                            peer-checked:after:translate-x-5
                            block
                            focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
                        "
                    />
                </div>
            </div>

            {/* No differences message */}
            {showDiffOnly && filteredRows.length === 0 && (
                <div className="ct-card-soft p-6 text-center">
                    <p className="text-gray-500 text-sm">
                        ✓ Nenhuma diferença relevante encontrada entre os produtos.
                    </p>
                </div>
            )}

            {/* Table */}
            {filteredRows.length > 0 && (
                <div className="overflow-x-auto ct-card-soft">
                    <table className="min-w-[600px] w-full border-separate border-spacing-0">
                        {/* Header */}
                        <thead>
                            <tr>
                                {/* Corner cell */}
                                <th className="ct-sticky-corner bg-ct-surface border-b border-r border-ct-border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                    Critério
                                </th>
                                {/* Left product header */}
                                <th className="ct-sticky-top bg-ct-surface border-b border-ct-border px-4 py-3 text-center">
                                    <div className="font-bold text-gray-900">{leftName}</div>
                                    {leftPrice && (
                                        <div className="text-sm text-emerald-600 font-semibold">
                                            {leftPrice}
                                        </div>
                                    )}
                                </th>
                                {/* Right product header */}
                                <th className="ct-sticky-top bg-ct-surface border-b border-ct-border px-4 py-3 text-center">
                                    <div className="font-bold text-gray-900">{rightName}</div>
                                    {rightPrice && (
                                        <div className="text-sm text-emerald-600 font-semibold">
                                            {rightPrice}
                                        </div>
                                    )}
                                </th>
                            </tr>
                        </thead>

                        {/* Body - grouped by sections */}
                        <tbody>
                            {allSections.map(sectionName => {
                                const sectionRows = sections.get(sectionName) || [];
                                const isEmpty = sectionRows.length === 0;

                                return (
                                    <React.Fragment key={sectionName}>
                                        {/* Section header */}
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="ct-compare-section px-4 py-2 border-b border-ct-border"
                                            >
                                                {sectionName}
                                            </td>
                                        </tr>

                                        {/* Section rows or empty state */}
                                        {isEmpty ? (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="px-4 py-3 text-center text-sm text-gray-400 italic border-b border-ct-border"
                                                >
                                                    Sem diferenças relevantes nesta seção
                                                </td>
                                            </tr>
                                        ) : (
                                            sectionRows.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                                    {/* Label - sticky left */}
                                                    <td className={`ct-sticky-left bg-ct-surface border-b border-r border-ct-border px-4 py-3 text-sm text-gray-700 ${row.isDifferent ? 'ct-diff-label' : 'font-medium'}`}>
                                                        <span className="flex items-center gap-1.5">
                                                            {row.label}
                                                            {row.tooltip && (
                                                                <InfoTooltip text={row.tooltip} />
                                                            )}
                                                        </span>
                                                    </td>
                                                    {/* Left value */}
                                                    <td className={`border-b border-ct-border px-4 py-3 text-center text-sm text-gray-900 ${row.isDifferent ? 'ct-diff-cell' : ''}`}>
                                                        {row.left.display}
                                                    </td>
                                                    {/* Right value */}
                                                    <td className={`border-b border-ct-border px-4 py-3 text-center text-sm text-gray-900 ${row.isDifferent ? 'ct-diff-cell' : ''}`}>
                                                        {row.right.display}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mobile Sticky CTA Bar */}
            <div className="ct-sticky-cta-bar md:hidden">
                <div className="flex gap-2">
                    <a
                        href={`/produto/${winnerSlug}?simplified=true`}
                        className="ct-btn ct-btn-primary flex-1 text-center text-sm py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Ver {winnerName.split(' ').slice(0, 2).join(' ')}
                    </a>
                    <a
                        href={`/produto/${loserSlug}?simplified=true`}
                        className="ct-btn ct-btn-secondary flex-1 text-center text-sm py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Ver {loserName.split(' ').slice(0, 2).join(' ')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ComparisonTableClient;
