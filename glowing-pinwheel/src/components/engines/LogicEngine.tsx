'use client';

import { useState, useMemo } from 'react';
import { Check, X, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LogicEngineConfig } from '@/lib/tools-config';

// ============================================
// TYPES
// ============================================

interface SelectedItems {
    [key: string]: string | null;
}

// ============================================
// COMPATIBILITY RESULT COMPONENT
// ============================================

interface CompatibilityResultProps {
    isCompatible: boolean;
    errors: string[];
    warnings: string[];
}

function CompatibilityResult({ isCompatible, errors, warnings }: CompatibilityResultProps) {
    if (errors.length === 0 && warnings.length === 0) {
        return null; // Nothing selected yet
    }

    return (
        <div className="mt-6 space-y-3">
            {/* Main Result */}
            <div
                className={cn(
                    'p-4 rounded-xl flex items-center gap-3',
                    isCompatible
                        ? 'bg-emerald-50 border-2 border-emerald-200'
                        : 'bg-red-50 border-2 border-red-200'
                )}
            >
                <div
                    className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                        isCompatible ? 'bg-emerald-500' : 'bg-red-500'
                    )}
                >
                    {isCompatible ? (
                        <Check size={24} className="text-white" />
                    ) : (
                        <X size={24} className="text-white" />
                    )}
                </div>
                <div>
                    <h3
                        className={cn(
                            'font-display font-bold text-lg',
                            isCompatible ? 'text-emerald-800' : 'text-red-800'
                        )}
                    >
                        {isCompatible ? '✅ Compatível!' : '❌ Incompatível'}
                    </h3>
                    <p className={cn('text-sm', isCompatible ? 'text-emerald-600' : 'text-red-600')}>
                        {isCompatible
                            ? 'Todas as peças são compatíveis entre si. Pode montar!'
                            : 'Existem problemas de compatibilidade.'}
                    </p>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <div
                            key={index}
                            className="p-3 bg-red-100 border border-red-200 rounded-lg flex items-start gap-2"
                        >
                            <X size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="space-y-2">
                    {warnings.map((warning, index) => (
                        <div
                            key={index}
                            className="p-3 bg-amber-100 border border-amber-200 rounded-lg flex items-start gap-2"
                        >
                            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700">{warning}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// DROPDOWN SELECTOR COMPONENT
// ============================================

interface DropdownSelectorProps {
    category: LogicEngineConfig['categories'][0];
    selectedValue: string | null;
    onSelect: (itemId: string) => void;
}

function DropdownSelector({ category, selectedValue, onSelect }: DropdownSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedItem = category.items.find((item) => item.id === selectedValue);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-primary">{category.label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'w-full p-4 rounded-xl border-2 text-left flex items-center justify-between',
                        'transition-all hover:border-accent-primary/50',
                        selectedValue
                            ? 'bg-white border-accent-primary/30'
                            : 'bg-gray-50 border-gray-200'
                    )}
                >
                    <div>
                        {selectedItem ? (
                            <>
                                <div className="font-semibold text-text-primary">{selectedItem.name}</div>
                                {selectedItem.subtitle && (
                                    <div className="text-xs text-text-muted">{selectedItem.subtitle}</div>
                                )}
                            </>
                        ) : (
                            <span className="text-text-muted">Selecione {category.label.toLowerCase()}...</span>
                        )}
                    </div>
                    <ChevronDown
                        size={20}
                        className={cn('text-gray-400 transition-transform', isOpen && 'rotate-180')}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-y-auto">
                        {category.items.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    onSelect(item.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    'w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between',
                                    'border-b border-gray-100 last:border-0',
                                    selectedValue === item.id && 'bg-accent-primary/5'
                                )}
                            >
                                <div>
                                    <div className="font-medium text-text-primary">{item.name}</div>
                                    {item.subtitle && (
                                        <div className="text-xs text-text-muted">{item.subtitle}</div>
                                    )}
                                </div>
                                {selectedValue === item.id && (
                                    <Check size={16} className="text-accent-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// MAIN LOGIC ENGINE COMPONENT
// ============================================

interface LogicEngineProps {
    config: LogicEngineConfig;
    className?: string;
}

export function LogicEngine({ config, className }: LogicEngineProps) {
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

    // Get item specs by ID
    const getItemSpecs = (categoryId: string, itemId: string | null) => {
        if (!itemId) return null;
        const category = config.categories.find((c) => c.id === categoryId);
        if (!category) return null;
        const item = category.items.find((i) => i.id === itemId);
        return item?.specs || null;
    };

    // Check compatibility
    const { isCompatible, errors, warnings } = useMemo(() => {
        const errorList: string[] = [];
        const warningList: string[] = [];

        // Check if all required categories are selected
        const allSelected = config.categories.every((cat) => selectedItems[cat.id]);
        if (!allSelected) {
            return { isCompatible: false, errors: [], warnings: [] };
        }

        // Run each rule
        for (const rule of config.rules) {
            const targetSpecs = getItemSpecs(rule.targetCategory, selectedItems[rule.targetCategory]);
            const sourceSpecs = getItemSpecs(rule.sourceCategory, selectedItems[rule.sourceCategory]);

            if (!targetSpecs || !sourceSpecs) continue;

            const targetValue = targetSpecs[rule.targetSpec];
            const sourceValue = sourceSpecs[rule.sourceSpec];

            let passes = false;

            switch (rule.condition) {
                case 'equals':
                    passes = targetValue === sourceValue;
                    break;
                case 'notEquals':
                    passes = targetValue !== sourceValue;
                    break;
                case 'greaterThan':
                    passes = Number(targetValue) > Number(sourceValue);
                    break;
                case 'greaterThanOrEquals':
                    passes = Number(targetValue) >= Number(sourceValue);
                    break;
                case 'lessThan':
                    passes = Number(targetValue) < Number(sourceValue);
                    break;
                case 'contains':
                    passes = String(targetValue).includes(String(sourceValue));
                    break;
            }

            if (!passes) {
                const message = rule.errorMessage
                    .replace('{target}', String(targetValue))
                    .replace('{source}', String(sourceValue));

                if (rule.severity === 'warning') {
                    warningList.push(message);
                } else {
                    errorList.push(message);
                }
            }
        }

        return {
            isCompatible: errorList.length === 0,
            errors: errorList,
            warnings: warningList,
        };
    }, [selectedItems, config.categories, config.rules]);

    const handleSelect = (categoryId: string, itemId: string) => {
        setSelectedItems((prev) => ({
            ...prev,
            [categoryId]: itemId,
        }));
    };

    return (
        <div className={cn('bg-white rounded-2xl p-6 shadow-xl border border-gray-100', className)}>
            {/* Title */}
            <h2 className="font-display text-xl font-bold text-text-primary mb-2 text-center">
                {config.title}
            </h2>
            {config.description && (
                <p className="text-sm text-text-secondary text-center mb-6">{config.description}</p>
            )}

            {/* Dropdowns */}
            <div className="space-y-4">
                {config.categories.map((category) => (
                    <DropdownSelector
                        key={category.id}
                        category={category}
                        selectedValue={selectedItems[category.id] || null}
                        onSelect={(itemId) => handleSelect(category.id, itemId)}
                    />
                ))}
            </div>

            {/* Result */}
            <CompatibilityResult
                isCompatible={isCompatible}
                errors={errors}
                warnings={warnings}
            />
        </div>
    );
}
