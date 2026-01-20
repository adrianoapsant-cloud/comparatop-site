'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Headphones, Tv, Zap, Calculator, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TOOL TRIGGER MODAL SYSTEM
// ============================================
// Encapsulates heavy tools (GeometryEngine, ComparisonEngine) in modals
// to reduce scroll fatigue on product pages.

// ============================================
// FULLSCREEN MODAL
// ============================================

interface ToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

function ToolModal({ isOpen, onClose, title, children }: ToolModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex flex-col md:inset-4 md:rounded-2xl overflow-hidden bg-bg-ground"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                            <h2 className="font-display text-lg font-bold text-text-primary">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============================================
// TOOL TRIGGER CARD (Teaser)
// ============================================

type ToolType = 'geometry' | 'comparison-visual' | 'comparison-audio' | 'calculator' | 'quiz';

const TOOL_ICONS: Record<ToolType, typeof Ruler> = {
    'geometry': Ruler,
    'comparison-visual': Tv,
    'comparison-audio': Headphones,
    'calculator': Calculator,
    'quiz': Sparkles,
};

const TOOL_COLORS: Record<ToolType, string> = {
    'geometry': 'from-indigo-500 to-purple-500',
    'comparison-visual': 'from-amber-500 to-orange-500',
    'comparison-audio': 'from-blue-500 to-cyan-500',
    'calculator': 'from-emerald-500 to-teal-500',
    'quiz': 'from-pink-500 to-rose-500',
};

interface ToolTriggerProps {
    /** Type of tool - determines icon and color */
    type: ToolType;
    /** Title shown on the teaser card */
    title: string;
    /** Description shown on the teaser card */
    description: string;
    /** Optional highlight text (e.g., "AR Disponível") */
    badge?: string;
    /** The actual tool component to render in the modal */
    children: ReactNode;
    /** Modal title (defaults to card title) */
    modalTitle?: string;
    className?: string;
}

export function ToolTrigger({
    type,
    title,
    description,
    badge,
    children,
    modalTitle,
    className,
}: ToolTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = TOOL_ICONS[type] || Zap;
    const gradientColor = TOOL_COLORS[type] || 'from-gray-500 to-gray-600';

    return (
        <>
            {/* Teaser Card */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'w-full p-4 rounded-2xl border-2 border-gray-200',
                    'bg-gradient-to-br from-white to-gray-50',
                    'hover:border-gray-300 hover:shadow-lg',
                    'transition-all group text-left',
                    className
                )}
            >
                <div className="flex items-center gap-4">
                    {/* Icon Circle */}
                    <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                        'bg-gradient-to-br', gradientColor,
                        'shadow-lg group-hover:scale-110 transition-transform'
                    )}>
                        <Icon size={24} className="text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-text-primary">
                                {title}
                            </h3>
                            {badge && (
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-text-muted line-clamp-2">
                            {description}
                        </p>
                    </div>

                    {/* Arrow */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                        <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </button>

            {/* Modal */}
            <ToolModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={modalTitle || title}
            >
                {children}
            </ToolModal>
        </>
    );
}

// ============================================
// TOOL GRID (Container for multiple triggers)
// ============================================

export function ToolGrid({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('grid gap-3 md:grid-cols-2', className)}>
            {children}
        </div>
    );
}

// ============================================
// QUICK TOOL TRIGGERS (Pre-configured)
// ============================================

interface QuickToolProps {
    children: ReactNode;
    className?: string;
}

export function GeometryToolTrigger({ children, className }: QuickToolProps) {
    return (
        <ToolTrigger
            type="geometry"
            title="Será que cabe?"
            description="Verifique se as dimensões são compatíveis com seu espaço"
            badge="Teste Rápido"
            modalTitle="Verificador de Dimensões"
            className={className}
        >
            {children}
        </ToolTrigger>
    );
}

export function VisualComparisonTrigger({ children, className }: QuickToolProps) {
    return (
        <ToolTrigger
            type="comparison-visual"
            title="Veja a diferença na tela"
            description="Compare a qualidade de imagem entre diferentes tecnologias"
            badge="Interativo"
            modalTitle="Comparador de Imagem"
            className={className}
        >
            {children}
        </ToolTrigger>
    );
}

export function AudioComparisonTrigger({ children, className }: QuickToolProps) {
    return (
        <ToolTrigger
            type="comparison-audio"
            title="Ouça a diferença"
            description="Compare a qualidade de áudio entre equipamentos"
            badge="Use Fones 🎧"
            modalTitle="Comparador de Áudio"
            className={className}
        >
            {children}
        </ToolTrigger>
    );
}

export function CalculatorTrigger({ children, title, description, className }: QuickToolProps & { title: string; description: string }) {
    return (
        <ToolTrigger
            type="calculator"
            title={title}
            description={description}
            modalTitle={title}
            className={className}
        >
            {children}
        </ToolTrigger>
    );
}
