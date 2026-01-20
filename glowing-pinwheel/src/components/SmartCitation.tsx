'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface MetadataResponse {
    title?: string;
    description?: string;
    image?: string | null;
    logo?: string;
    domain?: string;
    url?: string;
    isCompetitor?: boolean;
    isBlocked?: boolean;
    fromCache?: boolean;
    error?: string;
}

interface SmartCitationProps {
    /** URL da fonte citada */
    href: string;
    /** Texto do badge */
    children: React.ReactNode;
    /** Se false, desabilita navegação (apenas informativo) */
    clickable?: boolean;
    /** Título customizado (sobrescreve API) */
    customTitle?: string;
    /** Descrição customizada (sobrescreve API) */
    customDescription?: string;
    /** Imagem/ícone customizada (sobrescreve API) */
    customImage?: string;
    /** Classes CSS adicionais */
    className?: string;
}

// ============================================
// HOOK: useHoverIntent
// ============================================

interface UseHoverIntentOptions {
    enterDelay?: number;
    leaveDelay?: number;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
}

function useHoverIntent(options: UseHoverIntentOptions = {}) {
    const {
        enterDelay = 200,
        leaveDelay = 150,
        onHoverStart,
        onHoverEnd,
    } = options;

    const [isHovering, setIsHovering] = useState(false);
    const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isOverTrigger = useRef(false);
    const isOverTarget = useRef(false);

    useEffect(() => {
        return () => {
            if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
            if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        };
    }, []);

    const handleShow = useCallback(() => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        if (isHovering) return;

        enterTimeoutRef.current = setTimeout(() => {
            setIsHovering(true);
            onHoverStart?.();
        }, enterDelay);
    }, [isHovering, enterDelay, onHoverStart]);

    const handleHide = useCallback(() => {
        if (enterTimeoutRef.current) {
            clearTimeout(enterTimeoutRef.current);
            enterTimeoutRef.current = null;
        }

        leaveTimeoutRef.current = setTimeout(() => {
            if (!isOverTrigger.current && !isOverTarget.current) {
                setIsHovering(false);
                onHoverEnd?.();
            }
        }, leaveDelay);
    }, [leaveDelay, onHoverEnd]);

    const triggerMouseEnter = useCallback(() => {
        isOverTrigger.current = true;
        handleShow();
    }, [handleShow]);

    const triggerMouseLeave = useCallback(() => {
        isOverTrigger.current = false;
        handleHide();
    }, [handleHide]);

    const targetMouseEnter = useCallback(() => {
        isOverTarget.current = true;
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
    }, []);

    const targetMouseLeave = useCallback(() => {
        isOverTarget.current = false;
        handleHide();
    }, [handleHide]);

    const close = useCallback(() => {
        if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        isOverTrigger.current = false;
        isOverTarget.current = false;
        setIsHovering(false);
        onHoverEnd?.();
    }, [onHoverEnd]);

    return {
        isHovering,
        triggerProps: {
            onMouseEnter: triggerMouseEnter,
            onMouseLeave: triggerMouseLeave,
        },
        targetProps: {
            onMouseEnter: targetMouseEnter,
            onMouseLeave: targetMouseLeave,
        },
        close,
    };
}

// ============================================
// SMART CITATION COMPONENT (Authority Badge Style)
// ============================================

export function SmartCitation({
    href,
    children,
    clickable = true,
    customTitle,
    customDescription,
    customImage,
    className,
}: SmartCitationProps) {
    const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLSpanElement>(null);
    const hasFetched = useRef(false);

    // Check if we have custom static data (no API fetch needed)
    const hasStaticData = Boolean(customTitle || customDescription);

    const { isHovering, triggerProps, targetProps, close } = useHoverIntent({
        enterDelay: hasStaticData ? 100 : 200, // Faster for static data
        leaveDelay: 150,
        onHoverStart: () => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY + 8,
                    left: Math.max(16, Math.min(rect.left + window.scrollX - 100, window.innerWidth - 336)),
                });
            }

            // Only fetch if no static data provided
            if (!hasStaticData && !hasFetched.current && !metadata) {
                fetchMetadata();
            }
        },
    });

    const fetchMetadata = async () => {
        if (loading) return;

        setLoading(true);
        hasFetched.current = true;

        try {
            const response = await fetch(`/api/preview?url=${encodeURIComponent(href)}`);
            const data: MetadataResponse = await response.json();
            setMetadata(data);
        } catch (err) {
            console.error('SmartCitation fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Build display data (prioritize custom props)
    const displayData = {
        title: customTitle || metadata?.title || new URL(href).hostname,
        description: customDescription || metadata?.description || '',
        image: customImage || metadata?.logo || `https://www.google.com/s2/favicons?domain=${new URL(href).hostname}&sz=32`,
    };

    // Handle click
    const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        if (!clickable) {
            e.preventDefault();
            return;
        }
        window.open(href, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            {/* Authority Badge Trigger */}
            <span
                ref={triggerRef}
                {...triggerProps}
                className={cn(
                    // Badge/Chip base style
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md',
                    'bg-slate-100 hover:bg-slate-200',
                    'text-slate-700 text-sm font-medium',
                    'border border-slate-200',
                    'transition-all duration-150',
                    // Cursor based on clickable
                    clickable ? 'cursor-pointer hover:shadow-sm' : 'cursor-help',
                    className
                )}
                role={clickable ? 'button' : 'note'}
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleClick(e);
                    }
                }}
            >
                {/* Badge Icon */}
                {customImage ? (
                    <img
                        src={customImage}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                )}

                {/* Badge Text */}
                <span>{children}</span>

                {/* External link indicator (only if clickable) */}
                {clickable && (
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                )}
            </span>

            {/* Hovercard */}
            {isHovering && (
                <div
                    {...targetProps}
                    className={cn(
                        'fixed z-50 w-80',
                        'bg-white rounded-xl shadow-2xl border border-gray-100',
                        'animate-in fade-in-0 zoom-in-95 duration-150',
                        'overflow-hidden'
                    )}
                    style={{
                        top: position.top,
                        left: position.left,
                    }}
                >
                    {/* Loading State */}
                    {loading && !hasStaticData && (
                        <div className="p-4 space-y-3 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                        </div>
                    )}

                    {/* Content (Static or Fetched) */}
                    {(hasStaticData || metadata || !loading) && (
                        <div className="p-4">
                            {/* Header with Icon */}
                            <div className="flex items-start gap-3 mb-3">
                                <img
                                    src={displayData.image}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${new URL(href).hostname}&sz=64`;
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                        {displayData.title}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        {new URL(href).hostname}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {displayData.description && (
                                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                                    {displayData.description}
                                </p>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                    Fonte verificada
                                </span>
                                {clickable ? (
                                    <button
                                        onClick={() => {
                                            window.open(href, '_blank', 'noopener,noreferrer');
                                            close();
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                    >
                                        Visitar <ExternalLink className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                        ✓ Auditado
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
