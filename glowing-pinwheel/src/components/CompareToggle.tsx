'use client';

import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComparison, type ComparisonProduct } from '@/contexts/ComparisonContext';
import { useToast } from '@/contexts/ToastContext';
import { useHaptic } from '@/hooks/useHaptic';

interface CompareToggleProps {
    product: ComparisonProduct;
    className?: string;
}

/**
 * Checkbox overlay for selecting products to compare.
 * Shows in the corner of product images.
 */
export function CompareToggle({ product, className }: CompareToggleProps) {
    const { isSelected, toggleProduct, canAddMore, maxProducts } = useComparison();
    const { showToast } = useToast();
    const haptic = useHaptic();

    const selected = isSelected(product.id);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        haptic.trigger('tap');

        if (!selected && !canAddMore) {
            showToast(`Máximo de ${maxProducts} produtos para comparação`, 'warning');
            return;
        }

        const success = toggleProduct(product);

        if (!success && !selected) {
            showToast('Só é possível comparar produtos da mesma categoria', 'warning');
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                // Base styles
                'absolute top-3 left-3 z-10',
                'flex items-center justify-center',
                'w-8 h-8 rounded-lg',
                'border-2 transition-all duration-150',
                // State styles
                selected
                    ? 'bg-action-primary border-action-primary text-white scale-100'
                    : 'bg-white/80 border-gray-300 text-gray-400 hover:border-action-primary hover:text-action-primary',
                // Micro-interaction
                'active:scale-90',
                className
            )}
            aria-label={selected ? 'Remover da comparação' : 'Adicionar à comparação'}
            aria-pressed={selected}
        >
            {selected ? (
                <Check size={18} className="animate-scale-in" />
            ) : (
                <Plus size={18} />
            )}
        </button>
    );
}
