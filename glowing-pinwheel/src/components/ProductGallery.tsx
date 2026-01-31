'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
    ChevronLeft, ChevronRight, Maximize2, X, Play,
    Rotate3d, ZoomIn, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

// ============================================
// TYPES
// ============================================

export type MediaType = 'image' | 'video' | '360';

export interface GalleryItem {
    type: MediaType;
    url: string; // Image URL or Video Poster or 360 sprite
    videoUrl?: string; // For video type
    alt?: string;
}

interface ProductGalleryProps {
    items: GalleryItem[];
    productName: string;
    compareButton?: React.ReactNode; // Optional compare toggle slot
    affiliateUrl?: string; // Link de afiliado para redirecionar ao clicar na imagem
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProductGallery({ items, productName, compareButton, affiliateUrl }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isZooming, setIsZooming] = useState(false);

    // Refs for interactions
    const heroRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

    const haptic = useHaptic();

    // Guard: Handle empty items array
    const safeItems = items.length > 0 ? items : [{ type: 'image' as const, url: `https://placehold.co/500x500?text=${encodeURIComponent(productName)}` }];
    const activeItem = safeItems[activeIndex] || safeItems[0];

    // Reset states when changing items
    useEffect(() => {
        setIsVideoPlaying(false);
        setZoomLevel(1);
        setIsZooming(false);
    }, [activeIndex]);

    // ============================================
    // NAVIGATION HELPERS
    // ============================================
    const goToNext = useCallback(() => {
        if (activeIndex < safeItems.length - 1) {
            setActiveIndex(prev => prev + 1);
            haptic.trigger();
        }
    }, [activeIndex, safeItems.length, haptic]);

    const goToPrev = useCallback(() => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
            haptic.trigger();
        }
    }, [activeIndex, haptic]);

    // ============================================
    // DESKTOP ZOOM LOGIC (Mouseover)
    // ============================================
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!heroRef.current || !activeItem || activeItem.type !== 'image' || window.innerWidth < 768) return;

        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;

        heroRef.current.style.setProperty('--zoom-x', `${x}%`);
        heroRef.current.style.setProperty('--zoom-y', `${y}%`);
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    // ============================================
    // MOBILE SWIPE LOGIC (Touch events)
    // ============================================
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;

        // Only trigger horizontal swipe if horizontal movement > vertical (avoid scroll interference)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < 0) goToNext();
            else goToPrev();
        }
    };

    // ============================================
    // RENDERING HELPERS
    // ============================================

    const renderHeroContent = () => {
        if (!activeItem) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Carregando...</span>
                </div>
            );
        }

        if (activeItem.type === 'video') {
            if (isVideoPlaying && activeItem.videoUrl) {
                return (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <iframe
                            src={`${activeItem.videoUrl}?autoplay=1&mute=0&controls=1`}
                            className="w-full h-full aspect-video"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                );
            }
            return (
                <div
                    className="w-full h-full relative cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                >
                    <img
                        src={activeItem.url}
                        alt={activeItem.alt || productName}
                        className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={32} className="text-brand-core ml-1" fill="currentColor" />
                        </div>
                    </div>
                </div>
            );
        }

        if (activeItem.type === '360') {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 relative cursor-grab active:cursor-grabbing">
                    <img
                        src={activeItem.url}
                        alt={activeItem.alt || productName}
                        className="w-full h-full object-contain p-8"
                    />
                    <div className="absolute bottom-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
                        <Rotate3d size={20} className="text-brand-core" />
                        <span className="text-xs font-semibold text-text-secondary">Arraste para girar</span>
                    </div>
                </div>
            );
        }

        // Imagem com zoom hover e lightbox ao clicar (independente de affiliateUrl)
        return (
            <div
                ref={heroRef}
                className="w-full h-full relative overflow-hidden touch-pan-y cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsLightboxOpen(true)}
                style={{ '--zoom-x': '50%', '--zoom-y': '50%' } as React.CSSProperties}
            >
                <div className="relative w-full h-full p-4">
                    <Image
                        src={activeItem.url}
                        alt={activeItem.alt || productName}
                        fill
                        priority={activeIndex === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={cn(
                            "object-contain transition-opacity duration-200",
                            isZooming && "md:opacity-0"
                        )}
                    />
                </div>

                <div
                    className={cn(
                        "hidden md:block absolute inset-0 bg-no-repeat bg-white pointer-events-none z-10 transition-opacity duration-200",
                        isZooming ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        backgroundImage: `url(${activeItem.url})`,
                        backgroundPosition: 'var(--zoom-x) var(--zoom-y)',
                        backgroundSize: '200%',
                    }}
                />

                {!isZooming && (
                    <div className="hidden md:flex absolute bottom-4 right-4 z-20 items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur rounded-full text-white text-xs">
                        <Maximize2 size={14} /> Ampliar
                    </div>
                )}
            </div>
        );
    };

    // ============================================
    // POSITION DOTS (Mobile)
    // ============================================
    const PositionDots = () => {
        if (safeItems.length <= 1) return null;
        return (
            <div className="md:hidden flex justify-center gap-2 py-3">
                {safeItems.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setActiveIndex(idx); haptic.trigger(); }}
                        aria-label={`Ver imagem ${idx + 1}`}
                        className={cn(
                            "rounded-full transition-all duration-300",
                            idx === activeIndex
                                ? "w-6 h-2 bg-brand-core"
                                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                        )}
                    />
                ))}
            </div>
        );
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">

            {/* DESKTOP: Vertical Thumbnails (Left) */}
            <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0 h-[500px] overflow-y-auto scrollbar-hide py-1">
                {safeItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            'w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 relative bg-white',
                            'transition-all duration-200 ease-out hover:scale-[1.02]',
                            activeIndex === idx
                                ? 'border-brand-core shadow-md ring-2 ring-brand-core/20'
                                : 'border-gray-100 hover:border-gray-300'
                        )}
                    >
                        <img
                            src={item.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-contain p-1"
                        />
                        {/* Media Icons */}
                        {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                    <Play size={12} className="text-brand-core ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        )}
                        {item.type === '360' && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-brand-core text-white rounded-full flex items-center justify-center text-[10px]">
                                360
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* HERO SECTION */}
            <div className="relative flex-1 bg-white rounded-2xl border border-gray-100/50 shadow-sm overflow-hidden aspect-square md:aspect-auto md:h-[500px]">

                {/* Compare Toggle - Top Left (passed from parent) */}
                {compareButton && (
                    <div className="absolute top-4 left-4 z-20">
                        {compareButton}
                    </div>
                )}

                {/* Mobile: Swipe hint on first view */}
                {safeItems.length > 1 && (
                    <div className="md:hidden absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 backdrop-blur rounded-full">
                        <span className="text-xs font-medium text-white">
                            ← Deslize →
                        </span>
                    </div>
                )}

                {/* Main Content */}
                {renderHeroContent()}

                {/* Desktop Navigation Arrows (only if multiple items) */}
                {safeItems.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            disabled={activeIndex === 0}
                            className={cn(
                                "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all",
                                activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:scale-105"
                            )}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={activeIndex === safeItems.length - 1}
                            className={cn(
                                "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all",
                                activeIndex === safeItems.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:scale-105"
                            )}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Lightbox Trigger Icon (Mobile) */}
                <div className="md:hidden absolute bottom-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                    <Maximize2 size={18} className="text-text-primary" />
                </div>
            </div>

            {/* MOBILE: Position Dots (below hero) */}
            <PositionDots />

            {/* MOBILE: Horizontal Thumbnail Carousel (Below dots) */}
            <div
                ref={carouselRef}
                className="md:hidden flex gap-3 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide"
            >
                {safeItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            'snap-center flex-shrink-0 w-16 h-16 rounded-lg border relative bg-white',
                            activeIndex === idx
                                ? 'border-brand-core ring-2 ring-brand-core/10'
                                : 'border-gray-200'
                        )}
                    >
                        <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-contain p-1"
                        />
                    </button>
                ))}
            </div>

            {/* LIGHTBOX MODAL - Mercado Livre Style (Portal to body) */}
            {isLightboxOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    {/* Close button - top right */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={24} className="text-gray-700" />
                    </button>

                    {/* Counter badge - top left */}
                    <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white rounded-full shadow-lg">
                        <span className="text-sm font-semibold text-gray-700">
                            {activeIndex + 1} / {safeItems.length}
                        </span>
                    </div>

                    {/* Main content card - larger for better zoom */}
                    <div
                        className="relative z-10 bg-white rounded-lg shadow-2xl w-[95vw] max-w-[1200px] h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Image container - Amazon-style zoom */}
                        <div
                            className="flex items-center justify-center h-full relative overflow-hidden p-4 md:p-8"
                        >
                            {zoomLevel === 1 ? (
                                /* Normal view - clickable image */
                                <>
                                    <img
                                        src={activeItem.url}
                                        alt={activeItem.alt || productName}
                                        className="max-w-full max-h-full object-contain select-none cursor-zoom-in"
                                        onClick={() => setZoomLevel(2.5)}
                                        draggable={false}
                                    />
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full text-white text-xs pointer-events-none">
                                        <ZoomIn size={14} /> Clique para ampliar
                                    </div>
                                </>
                            ) : (
                                /* Zoomed view - Pan with mouse/touch using transform */
                                <div
                                    className="w-full h-full cursor-crosshair relative overflow-hidden"
                                    onClick={() => setZoomLevel(1)}
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width - 0.5) * -100;
                                        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -100;
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = `scale(2.5) translate(${x}%, ${y}%)`;
                                    }}
                                    onTouchMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const touch = e.touches[0];
                                        const x = ((touch.clientX - rect.left) / rect.width - 0.5) * -100;
                                        const y = ((touch.clientY - rect.top) / rect.height - 0.5) * -100;
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = `scale(2.5) translate(${x}%, ${y}%)`;
                                    }}
                                >
                                    <img
                                        src={activeItem.url}
                                        alt={activeItem.alt || productName}
                                        className="w-full h-full object-contain select-none transition-transform duration-75"
                                        style={{ transform: 'scale(2.5) translate(0%, 0%)' }}
                                        draggable={false}
                                    />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full text-white text-xs pointer-events-none">
                                        Mova para explorar • Clique para sair
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail strip - bottom */}
                        {safeItems.length > 1 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-center gap-2 overflow-x-auto">
                                {safeItems.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={cn(
                                            "w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden bg-white transition-all",
                                            idx === activeIndex
                                                ? "border-blue-500 ring-2 ring-blue-200"
                                                : "border-gray-200 hover:border-gray-400"
                                        )}
                                    >
                                        <img
                                            src={item.url}
                                            alt=""
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation arrows - sides */}
                    {safeItems.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                disabled={activeIndex === 0}
                                className={cn(
                                    "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white rounded-full shadow-lg transition-all",
                                    activeIndex === 0
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:bg-gray-100 hover:scale-105"
                                )}
                            >
                                <ChevronLeft size={28} className="text-gray-700" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                disabled={activeIndex === safeItems.length - 1}
                                className={cn(
                                    "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white rounded-full shadow-lg transition-all",
                                    activeIndex === safeItems.length - 1
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:bg-gray-100 hover:scale-105"
                                )}
                            >
                                <ChevronRight size={28} className="text-gray-700" />
                            </button>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

