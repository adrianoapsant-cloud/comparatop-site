'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface InfoTooltipProps {
    text: string;
}

/**
 * InfoTooltip - Mobile-friendly tooltip that shows on click/tap
 * Uses portal to escape overflow containers
 * Auto-adjusts position to stay within viewport
 */
export function InfoTooltip({ text }: InfoTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 256 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Only render portal on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate position when opening - ensure tooltip stays in viewport
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const padding = 16;
            const viewportWidth = window.innerWidth;

            // Adjust tooltip width for mobile
            let tooltipWidth = Math.min(256, viewportWidth - (padding * 2));
            const tooltipHeight = 120; // approximate

            // Calculate left position - center under button, but keep in viewport
            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

            // Keep within viewport horizontally
            if (left < padding) {
                left = padding;
            } else if (left + tooltipWidth > viewportWidth - padding) {
                left = viewportWidth - tooltipWidth - padding;
            }

            // Calculate top - prefer below button, but flip above if needed
            let top = rect.bottom + 8;

            // If tooltip would go off bottom, show above
            if (top + tooltipHeight > window.innerHeight - padding) {
                top = rect.top - tooltipHeight - 8;
                // If still negative, just show at top
                if (top < padding) {
                    top = padding;
                }
            }

            setPosition({ top, left, width: tooltipWidth });
        }
    }, [isOpen]);

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent | TouchEvent) {
            const target = event.target as Node;
            if (
                buttonRef.current && !buttonRef.current.contains(target) &&
                tooltipRef.current && !tooltipRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        }

        // Close on escape key
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Close on scroll
    useEffect(() => {
        if (!isOpen) return;
        const handleScroll = () => setIsOpen(false);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen]);

    const tooltipContent = isOpen && mounted ? createPortal(
        <div
            ref={tooltipRef}
            className="fixed z-[9999] p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xl"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                maxWidth: 'calc(100vw - 32px)',
            }}
        >
            <p className="leading-relaxed pr-6 text-xs">{text}</p>
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-sm font-bold"
                aria-label="Fechar"
            >
                ✕
            </button>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] text-gray-400 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 flex-shrink-0"
                aria-label="Mais informações"
                aria-expanded={isOpen}
            >
                ?
            </button>
            {tooltipContent}
        </>
    );
}
