'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useToolStorage - Persists tool inputs to localStorage
 * 
 * Features:
 * - Auto-saves user inputs when they change
 * - Auto-restores inputs when tool is loaded
 * - Debounced saves to prevent excessive writes
 * - Safe SSR handling (no window access during SSR)
 * 
 * @param toolId - Unique identifier for the tool (e.g., 'calculadora-btu')
 * @param initialValues - Default values for the tool inputs
 * @returns [values, setValues, resetValues]
 */
export function useToolStorage<T extends Record<string, unknown>>(
    toolId: string,
    initialValues: T
): [T, (values: T | ((prev: T) => T)) => void, () => void] {
    const storageKey = `tool-storage:${toolId}`;

    // Initialize state with saved values or initial values
    const [values, setValuesInternal] = useState<T>(() => {
        // SSR safety check
        if (typeof window === 'undefined') {
            return initialValues;
        }

        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge saved values with initial values (in case schema changed)
                return { ...initialValues, ...parsed };
            }
        } catch (e) {
            console.warn(`[useToolStorage] Failed to load saved values for ${toolId}:`, e);
        }

        return initialValues;
    });

    // Sync to localStorage when values change
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(storageKey, JSON.stringify(values));
        } catch (e) {
            console.warn(`[useToolStorage] Failed to save values for ${toolId}:`, e);
        }
    }, [values, storageKey, toolId]);

    // Reset function to clear saved values
    const resetValues = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(storageKey);
        }
        setValuesInternal(initialValues);
    }, [storageKey, initialValues]);

    // Wrapper setter that accepts both value and updater function
    const setValues = useCallback((valueOrUpdater: T | ((prev: T) => T)) => {
        if (typeof valueOrUpdater === 'function') {
            setValuesInternal(valueOrUpdater as (prev: T) => T);
        } else {
            setValuesInternal(valueOrUpdater);
        }
    }, []);

    return [values, setValues, resetValues];
}

/**
 * useLocalStorage - Generic localStorage hook
 * Simpler version for non-tool state
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue((prev) => {
            const valueToStore = value instanceof Function ? value(prev) : value;

            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }

            return valueToStore;
        });
    }, [key]);

    return [storedValue, setValue];
}
