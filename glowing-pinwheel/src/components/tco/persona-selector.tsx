'use client';

// ============================================================================
// PERSONA SELECTOR - Choose usage profile for TCO calculations
// ============================================================================
// Allows users to select their usage pattern (Gamer, Eco, Family)
// Connected to usePersona hook for URL state management
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { Gamepad2, Leaf, Users, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/hooks/use-url-state';
import type { UsagePersona } from '@/types/tco';

// ============================================
// TYPES
// ============================================

interface PersonaSelectorProps {
    /** Additional class names */
    className?: string;
    /** Show as horizontal cards (desktop) or dropdown (mobile) */
    variant?: 'cards' | 'dropdown' | 'auto';
    /** Show description text */
    showDescription?: boolean;
}

interface PersonaConfig {
    value: UsagePersona;
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    bgActive: string;
    borderActive: string;
}

// ============================================
// PERSONA CONFIGURATION
// ============================================

const PERSONA_CONFIG: PersonaConfig[] = [
    {
        value: 'gamer',
        label: 'Gamer',
        icon: <Gamepad2 className="w-5 h-5" />,
        description: 'Uso intenso (8h/dia), alta performance',
        color: 'text-violet-600',
        bgActive: 'bg-violet-50',
        borderActive: 'border-violet-300',
    },
    {
        value: 'eco',
        label: 'Econômico',
        icon: <Leaf className="w-5 h-5" />,
        description: 'Uso consciente, foco em eficiência',
        color: 'text-emerald-600',
        bgActive: 'bg-emerald-50',
        borderActive: 'border-emerald-300',
    },
    {
        value: 'family',
        label: 'Família',
        icon: <Users className="w-5 h-5" />,
        description: 'Uso misto, durabilidade',
        color: 'text-blue-600',
        bgActive: 'bg-blue-50',
        borderActive: 'border-blue-300',
    },
];

// ============================================
// CARD VARIANT
// ============================================

function PersonaCards({ className, showDescription = true }: Omit<PersonaSelectorProps, 'variant'>) {
    const { persona, setPersona } = usePersona();

    return (
        <div
            className={cn('flex gap-2', className)}
            role="radiogroup"
            aria-label="Selecione seu perfil de uso"
        >
            {PERSONA_CONFIG.map((config) => {
                const isActive = persona === config.value;

                return (
                    <button
                        key={config.value}
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setPersona(config.value)}
                        className={cn(
                            'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl',
                            'border-2 transition-all duration-200',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                            isActive
                                ? [config.bgActive, config.borderActive, config.color]
                                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                    >
                        {/* Icon */}
                        <span className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-lg',
                            isActive ? config.bgActive : 'bg-gray-100'
                        )}>
                            {config.icon}
                        </span>

                        {/* Label */}
                        <span className="font-medium text-sm">
                            {config.label}
                        </span>

                        {/* Description */}
                        {showDescription && (
                            <span className={cn(
                                'text-xs text-center leading-tight',
                                isActive ? 'opacity-80' : 'text-gray-400'
                            )}>
                                {config.description}
                            </span>
                        )}

                        {/* Active check */}
                        {isActive && (
                            <Check className="w-4 h-4 mt-1" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// DROPDOWN VARIANT
// ============================================

function PersonaDropdown({ className, showDescription = false }: Omit<PersonaSelectorProps, 'variant'>) {
    const { persona, setPersona } = usePersona();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedConfig = PERSONA_CONFIG.find(c => c.value === persona) || PERSONA_CONFIG[2];

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false);
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div className={cn('relative', className)} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl',
                    'border-2 transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                    'w-full justify-between',
                    isOpen
                        ? [selectedConfig.bgActive, selectedConfig.borderActive]
                        : 'border-gray-200 bg-white hover:border-gray-300'
                )}
            >
                <div className="flex items-center gap-2">
                    <span className={selectedConfig.color}>{selectedConfig.icon}</span>
                    <div className="text-left">
                        <span className="font-medium text-sm text-gray-900">
                            {selectedConfig.label}
                        </span>
                        {showDescription && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {selectedConfig.description}
                            </p>
                        )}
                    </div>
                </div>
                <ChevronDown className={cn(
                    'w-4 h-4 text-gray-400 transition-transform',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="listbox"
                    className={cn(
                        'absolute z-50 top-full left-0 right-0 mt-2',
                        'bg-white rounded-xl border border-gray-200 shadow-lg',
                        'py-1 overflow-hidden',
                        'animate-in fade-in-0 zoom-in-95'
                    )}
                >
                    {PERSONA_CONFIG.map((config) => {
                        const isSelected = persona === config.value;

                        return (
                            <button
                                key={config.value}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    setPersona(config.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3',
                                    'transition-colors',
                                    'hover:bg-gray-50',
                                    isSelected && config.bgActive
                                )}
                            >
                                <span className={config.color}>{config.icon}</span>
                                <div className="flex-1 text-left">
                                    <span className={cn(
                                        'font-medium text-sm',
                                        isSelected ? config.color : 'text-gray-900'
                                    )}>
                                        {config.label}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {config.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <Check className={cn('w-4 h-4', config.color)} />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * PersonaSelector - Choose usage profile for TCO calculations
 * 
 * Variants:
 * - 'cards': Horizontal card selector (best for desktop)
 * - 'dropdown': Dropdown menu (best for mobile)
 * - 'auto': Cards on md+ screens, dropdown on smaller
 * 
 * @example
 * ```tsx
 * <PersonaSelector />
 * <PersonaSelector variant="dropdown" />
 * <PersonaSelector variant="cards" showDescription={false} />
 * ```
 */
export function PersonaSelector({
    className,
    variant = 'auto',
    showDescription = true
}: PersonaSelectorProps) {
    if (variant === 'cards') {
        return <PersonaCards className={className} showDescription={showDescription} />;
    }

    if (variant === 'dropdown') {
        return <PersonaDropdown className={className} showDescription={showDescription} />;
    }

    // Auto variant: cards on md+, dropdown on smaller screens
    return (
        <>
            {/* Desktop: Cards */}
            <div className="hidden md:block">
                <PersonaCards className={className} showDescription={showDescription} />
            </div>

            {/* Mobile: Dropdown */}
            <div className="md:hidden">
                <PersonaDropdown className={className} showDescription={showDescription} />
            </div>
        </>
    );
}

// ============================================
// COMPACT VARIANT (for toolbars)
// ============================================

/**
 * PersonaSelectorCompact - Minimal version for tight spaces
 */
export function PersonaSelectorCompact({ className }: { className?: string }) {
    const { persona, setPersona } = usePersona();

    return (
        <div className={cn('inline-flex gap-1 p-1 bg-gray-100 rounded-lg', className)}>
            {PERSONA_CONFIG.map((config) => {
                const isActive = persona === config.value;

                return (
                    <button
                        key={config.value}
                        onClick={() => setPersona(config.value)}
                        title={`${config.label}: ${config.description}`}
                        className={cn(
                            'p-2 rounded-md transition-all duration-200',
                            isActive
                                ? [config.bgActive, config.color, 'shadow-sm']
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                        )}
                    >
                        {config.icon}
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default PersonaSelector;
export { PERSONA_CONFIG };
