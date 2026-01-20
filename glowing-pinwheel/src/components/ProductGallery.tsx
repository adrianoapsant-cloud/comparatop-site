'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
    ChevronLeft, ChevronRight, Maximize2, X, Play,
    Rotate3d, ZoomIn
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
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProductGallery({ items, productName, compareButton }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1); // For mobile pinch gesture simulation
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Refs for interactions
    const heroRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const zoomLensRef = useRef<HTMLDivElement>(null);

    const haptic = useHaptic();

    // Guard: Handle empty items array
    const safeItems = items.length > 0 ? items : [{ type: 'image' as const, url: `https://placehold.co/500x500?text=${encodeURIComponent(productName)}` }];
    const activeItem = safeItems[activeIndex] || safeItems[0];

    // Reset states when changing items
    useEffect(() => {
        setIsVideoPlaying(false);
        setZoomLevel(1);
    }, [activeIndex]);

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
        heroRef.current.classList.add('zoomed');
    };

    const handleMouseLeave = () => {
        if (!heroRef.current) return;
        heroRef.current.classList.remove('zoomed');
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

        // Standard Image with Desktop Zoom - With Next.js Image for LCP
        return (
            <div
                ref={heroRef}
                className="w-full h-full relative overflow-hidden cursor-crosshair md:cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => window.innerWidth < 768 && setIsLightboxOpen(true)}
                style={{
                    '--url': `url(${activeItem.url})`,
                    '--zoom-x': '50%',
                    '--zoom-y': '50%',
                } as React.CSSProperties}
            >
                {/* 
                 * LCP Optimization: Using next/image with priority for hero
                 * fill + sizes ensures proper CLS handling
                 */}
                <div className="relative w-full h-full p-4">
                    <Image
                        src={activeItem.url}
                        alt={activeItem.alt || productName}
                        fill
                        priority={activeIndex === 0}  // Only first image is priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain transition-opacity duration-200"
                    />
                </div>

                {/* Inner Zoom Lens (Desktop) */}
                <div className="hidden md:block absolute inset-0 opacity-0 transition-opacity bg-no-repeat bg-[#ffffff] pointer-events-none z-10 [&.zoomed]:opacity-100"
                    style={{
                        backgroundImage: 'var(--url)',
                        backgroundPosition: 'var(--zoom-x) var(--zoom-y)',
                        backgroundSize: '200%', // 2x Zoom level
                    }}
                />
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

                {/* Mobile: Counter Badge 1/N */}
                <div className="md:hidden absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 backdrop-blur rounded-full">
                    <span className="text-xs font-bold text-white tracking-widest">
                        {activeIndex + 1}/{safeItems.length}
                    </span>
                </div>

                {/* Main Content */}
                {renderHeroContent()}

                {/* Mobile: Swipe affordance / Navigation */}
                <div className="md:hidden absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent pointer-events-none opacity-0 transition-opacity" />

                {/* Lightbox Trigger Icon (Mobile) */}
                <div className="md:hidden absolute bottom-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                    <Maximize2 size={18} className="text-text-primary" />
                </div>
            </div>

            {/* MOBILE: Horizontal Carousel (Below) */}
            <div
                ref={carouselRef}
                className="md:hidden flex gap-3 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide"
            >
                {safeItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            'snap-center flex-shrink-0 w-20 h-20 rounded-xl border relative bg-white',
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
                        {/* Peek: Add margin right to last item to show end */}
                        {idx === safeItems.length - 1 && <div className="w-6 flex-shrink-0" />}
                    </button>
                ))}
            </div>

            {/* LIGHTBOX MODAL (Mobile Fullscreen) */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black text-white touch-none animate-in fade-in duration-200">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
                        <span className="text-sm font-medium">{activeIndex + 1} / {safeItems.length}</span>
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="p-2 bg-white/10 rounded-full"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Main Zoomable Image */}
                    <div className="flex items-center justify-center h-full w-full overflow-hidden">
                        {/* Note: Simply rendering image focused for now, implementing real Pinch-to-Zoom requires gesture libs or complex touch logic. 
                            Using simple max-scale toggle for MVP. */}
                        <img
                            src={activeItem.url}
                            className={cn(
                                "w-full h-auto max-h-screen object-contain transition-transform duration-300",
                                zoomLevel > 1 && "scale-150 cursor-grab"
                            )}
                            onClick={() => setZoomLevel(z => z === 1 ? 2 : 1)}
                            alt=""
                        />
                    </div>

                    {/* Footer Hint */}
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                        <p className="text-xs text-white/60">Toque duas vezes para ampliar</p>
                    </div>
                </div>
            )}
        </div>
    );
}
