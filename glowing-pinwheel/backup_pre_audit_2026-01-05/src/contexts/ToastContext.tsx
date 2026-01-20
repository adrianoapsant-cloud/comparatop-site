'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type']) => void;
}

// ============================================
// CONTEXT
// ============================================

const ToastContext = createContext<ToastContextType | null>(null);

// ============================================
// TOAST COMPONENT
// ============================================

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const typeStyles = {
        info: 'bg-brand-core text-white',
        success: 'bg-emerald-500 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-500 text-white',
    };

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
                'animate-slide-in-up',
                typeStyles[toast.type]
            )}
        >
            <span className="font-body text-sm">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Fechar"
            >
                <X size={16} />
            </button>
        </div>
    );
}

// ============================================
// PROVIDER
// ============================================

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = `toast-${Date.now()}`;
        const newToast: Toast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}
