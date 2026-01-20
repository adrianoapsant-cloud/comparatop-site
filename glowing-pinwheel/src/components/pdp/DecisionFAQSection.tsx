'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
    Scale,
    Volume2,
    Dog,
    Wrench,
    HelpCircle,
    Zap,
    Timer,
    Sparkles,
    Wifi,
    Battery,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface DecisionFAQItem {
    id: string;
    icon: string;
    question: string;
    answer: string;
}

interface DecisionFAQSectionProps {
    items: DecisionFAQItem[];
    className?: string;
}

// ============================================
// ICON MAP
// ============================================

const ICON_MAP: Record<string, LucideIcon> = {
    Scale,
    Volume2,
    Dog,
    Wrench,
    HelpCircle,
    Zap,
    Timer,
    Sparkles,
    Wifi,
    Battery,
};

function getIcon(iconName: string): LucideIcon {
    return ICON_MAP[iconName] || HelpCircle;
}

// ============================================
// SINGLE FAQ ITEM (Custom Accordion)
// ============================================

function FAQItem({ item }: { item: DecisionFAQItem }) {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = getIcon(item.icon);

    return (
        <div
            className={cn(
                'bg-white dark:bg-slate-800/50 rounded-lg border transition-colors',
                isOpen
                    ? 'border-amber-300 dark:border-amber-600'
                    : 'border-slate-200 dark:border-slate-700'
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-lg"
            >
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 text-sm md:text-base">
                        {item.question}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-slate-400"
                >
                    <ChevronDown size={20} />
                </motion.div>
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
                        <div className="px-4 pb-4 pl-[60px]">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DecisionFAQSection({ items, className = '' }: DecisionFAQSectionProps) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className={cn('py-12', className)}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                        Perguntas de quem estava em dúvida
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Respostas honestas para decisões práticas
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 md:p-6">
                    <div className="space-y-2">
                        {items.map((item) => (
                            <FAQItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DecisionFAQSection;
