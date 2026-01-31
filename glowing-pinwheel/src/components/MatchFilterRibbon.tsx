'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Filter, X, Lock, Star, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CriteriaConfig, FilterChip, TrophyLevel, UserPreferences } from '@/core/match/types';

// ============================================
// FILTER POPOVER (Desktop) - Rendered via Portal
// ============================================

interface FilterPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (level: TrophyLevel) => void;
    currentLevel: TrophyLevel;
    label: string;
    anchorRect: DOMRect | null;
}

function FilterPopover({
    isOpen,
    onClose,
    onSelect,
    currentLevel,
    label,
    anchorRect,
}: FilterPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate position after mount to ensure popover stays within viewport
    useEffect(() => {
        if (!anchorRect || !mounted) return;

        const popoverWidth = 260; // min-w-[260px]
        const padding = 16;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = anchorRect.left;
        let top = anchorRect.bottom + 8;

        // Adjust horizontal position if popover would go off-screen
        if (left + popoverWidth > viewportWidth - padding) {
            left = viewportWidth - popoverWidth - padding;
        }
        if (left < padding) {
            left = padding;
        }

        // If popover would go below viewport, show above the button instead
        const popoverHeight = 280; // approximate height
        if (top + popoverHeight > viewportHeight - padding) {
            top = anchorRect.top - popoverHeight - 8;
        }

        setPosition({ top, left });
    }, [anchorRect, mounted]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const popoverContent = (
        <AnimatePresence>
            {isOpen && anchorRect && (
                <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 10000,
                    }}
                    className="bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-[260px] max-w-[calc(100vw-32px)]"
                >
                    <p className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider border-b border-gray-100 mb-2">
                        Prioridade: {label}
                    </p>

                    <button
                        onClick={() => { onSelect('gold'); onClose(); }}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
                            'transition-colors text-left',
                            currentLevel === 'gold'
                                ? 'bg-amber-100 text-amber-800'
                                : 'hover:bg-gray-100 text-text-primary'
                        )}
                    >
                        <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            currentLevel === 'gold' ? 'bg-amber-500 text-white' : 'bg-gray-200'
                        )}>
                            <Lock size={18} />
                        </div>
                        <div>
                            <span className="font-semibold text-sm">🔒 É Essencial</span>
                            <p className="text-xs text-text-muted">Produtos devem atender este critério</p>
                        </div>
                    </button>

                    <button
                        onClick={() => { onSelect('silver'); onClose(); }}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
                            'transition-colors text-left',
                            currentLevel === 'silver'
                                ? 'bg-gray-200 text-gray-800'
                                : 'hover:bg-gray-100 text-text-primary'
                        )}
                    >
                        <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            currentLevel === 'silver' ? 'bg-gray-500 text-white' : 'bg-gray-200'
                        )}>
                            <Star size={18} />
                        </div>
                        <div>
                            <span className="font-semibold text-sm">⭐ Seria Bom</span>
                            <p className="text-xs text-text-muted">Preferência secundária</p>
                        </div>
                    </button>

                    {currentLevel !== 'none' && (
                        <>
                            <div className="border-t border-gray-100 my-2" />
                            <button
                                onClick={() => { onSelect('none'); onClose(); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <X size={14} />
                                Remover Filtro
                            </button>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(popoverContent, document.body);
}

// ============================================
// FILTER DRAWER (Mobile) - Full Screen Bottom Sheet via Portal
// ============================================

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (level: TrophyLevel) => void;
    currentLevel: TrophyLevel;
    label: string;
    icon: string;
}

function FilterDrawer({
    isOpen,
    onClose,
    onSelect,
    currentLevel,
    label,
    icon,
}: FilterDrawerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on back button (mobile)
    useEffect(() => {
        const handlePopState = () => {
            if (isOpen) onClose();
        };
        if (isOpen) {
            window.history.pushState({ drawer: true }, '');
            window.addEventListener('popstate', handlePopState);
        }
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const drawerContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 10000,
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '24px',
                            paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
                            zIndex: 10001,
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {/* Handle */}
                        <div
                            style={{
                                width: '40px',
                                height: '4px',
                                backgroundColor: '#d1d5db',
                                borderRadius: '4px',
                                margin: '0 auto 24px',
                            }}
                        />

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '32px' }}>{icon}</span>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                    {label}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                    Qual a importância deste critério?
                                </p>
                            </div>
                        </div>

                        {/* Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => { onSelect('gold'); onClose(); }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: currentLevel === 'gold' ? '2px solid #f59e0b' : '2px solid transparent',
                                    backgroundColor: currentLevel === 'gold' ? '#fef3c7' : '#f9fafb',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: currentLevel === 'gold' ? '#f59e0b' : '#e5e7eb',
                                    color: currentLevel === 'gold' ? 'white' : '#6b7280',
                                }}>
                                    <Lock size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>🔒 É Essencial</span>
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                        Não mostrar produtos que não atendem
                                    </p>
                                </div>
                                {currentLevel === 'gold' && (
                                    <span style={{ color: '#f59e0b', fontSize: '20px' }}>✓</span>
                                )}
                            </button>

                            <button
                                onClick={() => { onSelect('silver'); onClose(); }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: currentLevel === 'silver' ? '2px solid #6b7280' : '2px solid transparent',
                                    backgroundColor: currentLevel === 'silver' ? '#e5e7eb' : '#f9fafb',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: currentLevel === 'silver' ? '#6b7280' : '#e5e7eb',
                                    color: currentLevel === 'silver' ? 'white' : '#6b7280',
                                }}>
                                    <Star size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>⭐ Seria Bom</span>
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                        Preferência, mas não obrigatório
                                    </p>
                                </div>
                                {currentLevel === 'silver' && (
                                    <span style={{ color: '#6b7280', fontSize: '20px' }}>✓</span>
                                )}
                            </button>
                        </div>

                        {/* Remove Filter */}
                        {currentLevel !== 'none' && (
                            <button
                                onClick={() => { onSelect('none'); onClose(); }}
                                style={{
                                    width: '100%',
                                    marginTop: '16px',
                                    padding: '12px',
                                    color: '#ef4444',
                                    fontWeight: '600',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Remover Este Filtro
                            </button>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '16px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '12px',
                                fontWeight: '600',
                                color: '#1f2937',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Fechar
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(drawerContent, document.body);
}

// ============================================
// TROPHY CHIP COMPONENT
// ============================================

interface TrophyChipProps {
    chip: FilterChip;
    onSelect: (criteriaId: string, level: TrophyLevel) => void;
}

function TrophyChip({ chip, onSelect }: TrophyChipProps) {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleClick = () => {
        if (isMobile) {
            setDrawerOpen(true);
        } else {
            if (buttonRef.current) {
                setAnchorRect(buttonRef.current.getBoundingClientRect());
            }
            setPopoverOpen(true);
        }
    };

    const handleSelect = (level: TrophyLevel) => {
        onSelect(chip.criteriaId, level);
    };

    const getTrophyIcon = (level: TrophyLevel) => {
        switch (level) {
            case 'gold': return '🔒';
            case 'silver': return '⭐';
            default: return '';
        }
    };

    const getChipStyles = (level: TrophyLevel) => {
        switch (level) {
            case 'gold':
                return 'bg-gradient-to-r from-amber-400 to-amber-500 border-amber-500 text-white shadow-md';
            case 'silver':
                return 'bg-gradient-to-r from-gray-300 to-gray-400 border-gray-400 text-gray-800 shadow-md';
            default:
                return 'bg-white border-gray-200 text-text-secondary hover:border-brand-core/50';
        }
    };

    return (
        <>
            <motion.button
                ref={buttonRef}
                onClick={handleClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-2 flex-shrink-0',
                    'rounded-full border-2 transition-all duration-200',
                    'text-xs font-semibold whitespace-nowrap',
                    getChipStyles(chip.level)
                )}
            >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
                {chip.level !== 'none' && (
                    <span className="ml-0.5">{getTrophyIcon(chip.level)}</span>
                )}
                <ChevronDown size={12} className={cn(
                    'transition-transform',
                    isPopoverOpen && 'rotate-180'
                )} />
            </motion.button>

            {/* Desktop Popover - AnimatePresence is now inside the portal */}
            <FilterPopover
                isOpen={isPopoverOpen}
                onClose={() => setPopoverOpen(false)}
                onSelect={handleSelect}
                currentLevel={chip.level}
                label={chip.label}
                anchorRect={anchorRect}
            />

            {/* Mobile Drawer - AnimatePresence is now inside the portal */}
            <FilterDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSelect={handleSelect}
                currentLevel={chip.level}
                label={chip.label}
                icon={chip.icon}
            />
        </>
    );
}

// ============================================
// MAIN FILTER RIBBON COMPONENT
// ============================================

interface MatchFilterRibbonProps {
    criteria: CriteriaConfig[];
    chips: FilterChip[];
    onChipsChange: (chips: FilterChip[]) => void;
    onOpenFilters?: () => void;
    className?: string;
}

export function MatchFilterRibbon({
    criteria,
    chips,
    onChipsChange,
    onOpenFilters,
    className,
}: MatchFilterRibbonProps) {
    // LIMIT: 1 gold, 2 silver max
    const handleSelect = useCallback((criteriaId: string, level: TrophyLevel) => {
        let newChips = [...chips];

        // If selecting gold, remove any existing gold (only 1 allowed)
        if (level === 'gold') {
            newChips = newChips.map(chip => ({
                ...chip,
                level: chip.level === 'gold' ? 'none' : chip.level,
            }));
        }

        // If selecting silver and already have 2, remove the oldest silver
        if (level === 'silver') {
            const currentSilvers = newChips.filter(c => c.level === 'silver' && c.criteriaId !== criteriaId);
            if (currentSilvers.length >= 2) {
                // Remove the first silver (oldest)
                const firstSilverId = currentSilvers[0].criteriaId;
                newChips = newChips.map(chip => ({
                    ...chip,
                    level: chip.criteriaId === firstSilverId ? 'none' : chip.level,
                }));
            }
        }

        // Now apply the new selection
        newChips = newChips.map(chip => {
            if (chip.criteriaId !== criteriaId) return chip;
            return { ...chip, level };
        });

        onChipsChange(newChips);
    }, [chips, onChipsChange]);

    const activeCount = chips.filter(c => c.level !== 'none').length;
    const goldCount = chips.filter(c => c.level === 'gold').length;
    const silverCount = chips.filter(c => c.level === 'silver').length;

    const handleClearAll = () => {
        const clearedChips = chips.map(c => ({ ...c, level: 'none' as TrophyLevel }));
        onChipsChange(clearedChips);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'sticky top-0 z-30 bg-white/95 backdrop-blur-sm',
                'border-b border-gray-100 shadow-sm',
                'py-3 px-4',
                className
            )}
        >
            {/* Header with active count - showing limits */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2 flex items-center gap-3 text-xs text-text-muted"
            >
                <span>🎯 Seu perfil:</span>
                <span className={cn(
                    "px-2 py-0.5 rounded-full font-medium",
                    goldCount === 1 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"
                )}>
                    🥇 {goldCount}/1 Essencial (×5)
                </span>
                <span className={cn(
                    "px-2 py-0.5 rounded-full font-medium",
                    silverCount > 0 ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-400"
                )}>
                    🥈 {silverCount}/2 Desejáveis (×3)
                </span>
                <span className="text-gray-400">
                    Outros: ×1
                </span>
            </motion.div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                {/* More Filters Button */}
                <button
                    onClick={onOpenFilters}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-2 flex-shrink-0',
                        'rounded-full border-2 border-brand-core/30',
                        'bg-brand-core/5 text-brand-core',
                        'text-xs font-semibold whitespace-nowrap',
                        'hover:bg-brand-core/10 transition-colors'
                    )}
                >
                    <Filter size={14} />
                    <span>Filtros</span>
                </button>

                {/* Separator */}
                <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

                {/* Criteria Chips */}
                {chips.map((chip) => (
                    <TrophyChip
                        key={chip.criteriaId}
                        chip={chip}
                        onSelect={handleSelect}
                    />
                ))}

                {/* Clear All */}
                <AnimatePresence>
                    {activeCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center gap-2 flex-shrink-0"
                        >
                            <div className="w-px h-6 bg-gray-200" />
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:text-red-600 whitespace-nowrap"
                            >
                                <X size={12} />
                                Limpar
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ============================================
// HOOK: Convert Chips to UserPreferences
// ============================================

export function useMatchFilters(criteria: CriteriaConfig[], categoryId: string) {
    const [chips, setChips] = useState<FilterChip[]>(() =>
        criteria.map(c => ({
            criteriaId: c.id,
            label: c.label,
            icon: c.icon || '⭐',
            level: 'none' as TrophyLevel,
        }))
    );

    // Update chips when criteria changes
    useEffect(() => {
        setChips(criteria.map(c => ({
            criteriaId: c.id,
            label: c.label,
            icon: c.icon || '⭐',
            level: 'none' as TrophyLevel,
        })));
    }, [criteria]);

    const preferences: UserPreferences = {
        categoryId,
        preferences: chips
            .filter(c => c.level !== 'none')
            .map(c => ({
                criteriaId: c.criteriaId,
                level: c.level,
            })),
    };

    return {
        chips,
        setChips,
        preferences,
        hasActiveFilters: chips.some(c => c.level !== 'none'),
    };
}
