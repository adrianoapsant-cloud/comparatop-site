'use client';

import React, { useState, useCallback, memo } from 'react';
import type { ScoringContext, ContextOption } from '@/lib/scoring/types';

// ============================================
// TYPES
// ============================================

interface ContextSelectorProps {
    /** Available contexts for selection */
    contexts: ScoringContext[];
    /** Currently selected context ID */
    selectedContextId: string;
    /** Callback when context changes */
    onContextChange: (contextId: string) => void;
    /** Optional grouping by context.group */
    grouped?: boolean;
    /** Show context description on hover */
    showDescriptions?: boolean;
    /** Compact mode for mobile */
    compact?: boolean;
    /** Optional CSS class name */
    className?: string;
}

interface ContextChipProps {
    context: ScoringContext;
    isSelected: boolean;
    onClick: () => void;
    showDescription?: boolean;
    compact?: boolean;
}

// ============================================
// CONTEXT CHIP COMPONENT
// ============================================

const ContextChip = memo(function ContextChip({
    context,
    isSelected,
    onClick,
    showDescription,
    compact,
}: ContextChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={showDescription ? context.description : context.name}
            className={`
        context-chip
        ${isSelected ? 'context-chip--selected' : ''}
        ${compact ? 'context-chip--compact' : ''}
      `}
            aria-pressed={isSelected}
        >
            {context.icon && (
                <span className="context-chip__icon" aria-hidden="true">
                    {context.icon}
                </span>
            )}
            <span className="context-chip__label">
                {context.name}
            </span>
            {isSelected && (
                <span className="context-chip__check" aria-hidden="true">
                    ✓
                </span>
            )}
        </button>
    );
});

// ============================================
// CONTEXT GROUP COMPONENT
// ============================================

interface ContextGroupProps {
    groupName: string;
    contexts: ScoringContext[];
    selectedContextId: string;
    onContextChange: (contextId: string) => void;
    showDescriptions?: boolean;
    compact?: boolean;
}

const ContextGroup = memo(function ContextGroup({
    groupName,
    contexts,
    selectedContextId,
    onContextChange,
    showDescriptions,
    compact,
}: ContextGroupProps) {
    return (
        <div className="context-group">
            <span className="context-group__label">{groupName}</span>
            <div className="context-group__chips">
                {contexts.map((context) => (
                    <ContextChip
                        key={context.id}
                        context={context}
                        isSelected={context.id === selectedContextId}
                        onClick={() => onContextChange(context.id)}
                        showDescription={showDescriptions}
                        compact={compact}
                    />
                ))}
            </div>
        </div>
    );
});

// ============================================
// MAIN CONTEXT SELECTOR COMPONENT
// ============================================

export function ContextSelector({
    contexts,
    selectedContextId,
    onContextChange,
    grouped = false,
    showDescriptions = true,
    compact = false,
    className = '',
}: ContextSelectorProps) {
    const handleContextClick = useCallback(
        (contextId: string) => {
            if (contextId !== selectedContextId) {
                onContextChange(contextId);
            }
        },
        [selectedContextId, onContextChange]
    );

    // Group contexts by their group property
    const groupedContexts = React.useMemo(() => {
        if (!grouped) return null;

        const groups: Record<string, ScoringContext[]> = {};
        for (const context of contexts) {
            const groupName = context.group || 'Outros';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(context);
        }
        return groups;
    }, [contexts, grouped]);

    return (
        <div className={`context-selector ${compact ? 'context-selector--compact' : ''} ${className}`}>
            <div className="context-selector__header">
                <span className="context-selector__title">
                    🎯 Seu Perfil de Uso
                </span>
                <span className="context-selector__subtitle">
                    Selecione para ver a nota contextualizada
                </span>
            </div>

            <div className="context-selector__content">
                {grouped && groupedContexts ? (
                    // Render grouped view
                    Object.entries(groupedContexts).map(([groupName, groupContexts]) => (
                        <ContextGroup
                            key={groupName}
                            groupName={groupName}
                            contexts={groupContexts}
                            selectedContextId={selectedContextId}
                            onContextChange={handleContextClick}
                            showDescriptions={showDescriptions}
                            compact={compact}
                        />
                    ))
                ) : (
                    // Render flat view (horizontally scrollable)
                    <div className="context-selector__chips">
                        {contexts.map((context) => (
                            <ContextChip
                                key={context.id}
                                context={context}
                                isSelected={context.id === selectedContextId}
                                onClick={() => handleContextClick(context.id)}
                                showDescription={showDescriptions}
                                compact={compact}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* CSS Styles */}
            <style jsx>{`
        .context-selector {
          --cs-bg: #f8f9fa;
          --cs-border: #e9ecef;
          --cs-text: #495057;
          --cs-text-muted: #6c757d;
          --cs-primary: #0066cc;
          --cs-primary-bg: #e7f1ff;
          --cs-chip-bg: #ffffff;
          --cs-chip-border: #dee2e6;
          --cs-chip-hover: #f1f3f5;
          --cs-success: #28a745;
          
          background: var(--cs-bg);
          border: 1px solid var(--cs-border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .context-selector--compact {
          padding: 12px;
        }
        
        .context-selector__header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }
        
        .context-selector__title {
          font-size: 14px;
          font-weight: 600;
          color: var(--cs-text);
        }
        
        .context-selector__subtitle {
          font-size: 12px;
          color: var(--cs-text-muted);
        }
        
        .context-selector__content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .context-selector__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          padding-bottom: 4px;
        }
        
        /* Hide scrollbar on mobile for cleaner look */
        @media (max-width: 768px) {
          .context-selector__chips {
            flex-wrap: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .context-selector__chips::-webkit-scrollbar {
            display: none;
          }
        }
        
        .context-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .context-group__label {
          font-size: 11px;
          font-weight: 600;
          color: var(--cs-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .context-group__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        /* Context Chip Button */
        :global(.context-chip) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--cs-chip-bg);
          border: 1px solid var(--cs-chip-border);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--cs-text);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        :global(.context-chip:hover) {
          background: var(--cs-chip-hover);
          border-color: var(--cs-primary);
        }
        
        :global(.context-chip--selected) {
          background: var(--cs-primary-bg);
          border-color: var(--cs-primary);
          color: var(--cs-primary);
        }
        
        :global(.context-chip--compact) {
          padding: 6px 10px;
          font-size: 12px;
        }
        
        :global(.context-chip__icon) {
          font-size: 16px;
          line-height: 1;
        }
        
        :global(.context-chip--compact .context-chip__icon) {
          font-size: 14px;
        }
        
        :global(.context-chip__label) {
          line-height: 1.2;
        }
        
        :global(.context-chip__check) {
          color: var(--cs-success);
          font-size: 12px;
          font-weight: 700;
        }
        
        /* Animation for selection change */
        :global(.context-chip--selected) {
          animation: chip-select 0.3s ease-out;
        }
        
        @keyframes chip-select {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .context-selector {
            --cs-bg: #1a1a2e;
            --cs-border: #2d2d44;
            --cs-text: #e1e1e6;
            --cs-text-muted: #8b8b9a;
            --cs-primary: #4da6ff;
            --cs-primary-bg: #1a3a5c;
            --cs-chip-bg: #252538;
            --cs-chip-border: #3d3d56;
            --cs-chip-hover: #2d2d44;
          }
        }
      `}</style>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ContextSelector;
export type { ContextSelectorProps, ContextOption };
