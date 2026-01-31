'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ============================================
// TYPES
// ============================================

interface ComparisonProduct {
    id: string;
    name: string;
    shortName?: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
}

interface ComparisonContextType {
    /** Currently selected products */
    selectedProducts: ComparisonProduct[];

    /** Maximum number of products allowed */
    maxProducts: number;

    /** Check if a product is selected */
    isSelected: (productId: string) => boolean;

    /** Add a product to comparison */
    addProduct: (product: ComparisonProduct) => boolean;

    /** Remove a product from comparison */
    removeProduct: (productId: string) => void;

    /** Toggle product selection */
    toggleProduct: (product: ComparisonProduct) => boolean;

    /** Clear all selections */
    clearAll: () => void;

    /** Check if can add more products */
    canAddMore: boolean;

    /** Get count of selected */
    count: number;
}

// ============================================
// CONTEXT
// ============================================

const ComparisonContext = createContext<ComparisonContextType | null>(null);

const STORAGE_KEY = 'comparatop_comparison';
const MAX_PRODUCTS = 4;

// ============================================
// PROVIDER
// ============================================

interface ComparisonProviderProps {
    children: ReactNode;
    maxProducts?: number;
}

export function ComparisonProvider({
    children,
    maxProducts = MAX_PRODUCTS
}: ComparisonProviderProps) {
    const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setSelectedProducts(parsed.slice(0, maxProducts));
                }
            }
        } catch (e) {
            console.warn('Failed to load comparison from localStorage:', e);
        }
        setIsHydrated(true);
    }, [maxProducts]);

    // Save to localStorage on change
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
            } catch (e) {
                console.warn('Failed to save comparison to localStorage:', e);
            }
        }
    }, [selectedProducts, isHydrated]);

    const isSelected = useCallback((productId: string) => {
        return selectedProducts.some(p => p.id === productId);
    }, [selectedProducts]);

    const addProduct = useCallback((product: ComparisonProduct): boolean => {
        if (selectedProducts.length >= maxProducts) {
            return false; // Limit reached
        }

        if (isSelected(product.id)) {
            return true; // Already selected
        }

        // Ensure same category (can only compare products from same category)
        if (selectedProducts.length > 0 && selectedProducts[0].categoryId !== product.categoryId) {
            return false; // Different category
        }

        setSelectedProducts(prev => [...prev, product]);
        return true;
    }, [selectedProducts, maxProducts, isSelected]);

    const removeProduct = useCallback((productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    }, []);

    const toggleProduct = useCallback((product: ComparisonProduct): boolean => {
        if (isSelected(product.id)) {
            removeProduct(product.id);
            return true;
        }
        return addProduct(product);
    }, [isSelected, addProduct, removeProduct]);

    const clearAll = useCallback(() => {
        setSelectedProducts([]);
    }, []);

    const canAddMore = selectedProducts.length < maxProducts;
    const count = selectedProducts.length;

    const value: ComparisonContextType = {
        selectedProducts,
        maxProducts,
        isSelected,
        addProduct,
        removeProduct,
        toggleProduct,
        clearAll,
        canAddMore,
        count,
    };

    return (
        <ComparisonContext.Provider value={value}>
            {children}
        </ComparisonContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useComparison() {
    const context = useContext(ComparisonContext);

    // Return safe fallback when context is null (not inside provider)
    // This prevents runtime errors during SSR or when component is rendered
    // outside the provider tree
    if (!context) {
        console.warn('[ComparisonContext] useComparison called outside ComparisonProvider - returning no-op fallback');
        return {
            selectedProducts: [],
            maxProducts: 4,
            isSelected: () => false,
            addProduct: () => false,
            removeProduct: () => { },
            toggleProduct: () => false,
            clearAll: () => { },
            canAddMore: false,
            count: 0,
        } as ComparisonContextType;
    }

    return context;
}

export type { ComparisonProduct, ComparisonContextType };
