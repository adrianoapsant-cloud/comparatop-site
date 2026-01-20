'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// ACCORDION COMPONENT
// ============================================
// Collapsible sections for dense data on mobile.
// Features:
// - Default closed state
// - Smooth height animation
// - Mobile-first (can be open by default on desktop)

interface AccordionProps {
    /** Title shown in the header */
    title: string;
    /** Optional icon to show before title */
    icon?: ReactNode;
    /** Content to show when expanded */
    children: ReactNode;
    /** Start expanded (default: false) */
    defaultOpen?: boolean;
    /** Always expand on desktop (md+) */
    expandOnDesktop?: boolean;
    className?: string;
}

export function Accordion({
    title,
    icon,
    children,
    defaultOpen = false,
    expandOnDesktop = true,
    className,
}: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn('border border-gray-200 rounded-xl overflow-hidden bg-white', className)}>
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center justify-between gap-3 p-4',
                    'text-left hover:bg-gray-50 transition-colors',
                    // Hide toggle on desktop if expandOnDesktop is true
                    expandOnDesktop && 'md:pointer-events-none'
                )}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="text-gray-400">
                            {icon}
                        </div>
                    )}
                    <span className="font-semibold text-text-primary">
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        'text-gray-400',
                        expandOnDesktop && 'md:hidden'
                    )}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>

            {/* Content - Always visible on desktop if expandOnDesktop */}
            {expandOnDesktop ? (
                <>
                    {/* Mobile: Animated collapse */}
                    <div className="md:hidden">
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 border-t border-gray-100">
                                        {children}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Desktop: Always visible */}
                    <div className="hidden md:block border-t border-gray-100 p-4">
                        {children}
                    </div>
                </>
            ) : (
                /* Both: Animated collapse */
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-0 border-t border-gray-100">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

// ============================================
// ACCORDION GROUP
// ============================================

interface AccordionGroupProps {
    children: ReactNode;
    className?: string;
}

export function AccordionGroup({ children, className }: AccordionGroupProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {children}
        </div>
    );
}

// ============================================
// SIMPLE COLLAPSIBLE (No border, inline style)
// ============================================

interface CollapsibleProps {
    trigger: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export function Collapsible({ trigger, children, defaultOpen = false, className }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={className}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left"
            >
                {trigger}
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
