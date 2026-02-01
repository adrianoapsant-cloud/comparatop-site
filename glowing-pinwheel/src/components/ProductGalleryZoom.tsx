'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface GalleryImage {
    src: string;
    alt: string;
    width: number;
    height: number;
    hiResSrc?: string;
}

interface ProductGalleryZoomProps {
    images: GalleryImage[];
    initialIndex?: number;
}

// ============================================
// CONSTANTS
// ============================================
const LENS_SIZE = 150; // Size of lens overlay on image
const ZOOM_PANEL_SIZE = 400; // Size of zoom result panel
const ZOOM_FACTOR = 2.5;
const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3];

// ============================================
// MAIN COMPONENT
// ============================================
export function ProductGalleryZoom({ images, initialIndex = 0 }: ProductGalleryZoomProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isZooming, setIsZooming] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    const activeImage = images[activeIndex] || images[0];
    const zoomSrc = activeImage?.hiResSrc || activeImage?.src;

    // Calculate zoom panel position (appears to the right of image)
    const updatePanelPosition = useCallback(() => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        setPanelPos({
            top: rect.top + window.scrollY,
            left: rect.right + 16, // 16px gap to the right
        });
    }, []);

    // Mouse handlers for Window Zoom
    const handleMouseEnter = useCallback(() => {
        if (window.innerWidth < 1024) return; // Disable on mobile/tablet
        updatePanelPosition();
        setIsZooming(true);
    }, [updatePanelPosition]);

    const handleMouseLeave = useCallback(() => {
        setIsZooming(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!imageRef.current || window.innerWidth < 1024) return;

        const rect = imageRef.current.getBoundingClientRect();
        // Clamp position within image bounds
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        setMousePos({ x, y });
    }, []);

    // Lens position (centered on cursor)
    const lensStyle = {
        width: LENS_SIZE,
        height: LENS_SIZE,
        left: mousePos.x - LENS_SIZE / 2,
        top: mousePos.y - LENS_SIZE / 2,
    };

    // Zoom panel background position - area under cursor should be centered in panel
    const getZoomBgPosition = () => {
        if (!imageRef.current) return { backgroundPosition: '0 0', backgroundSize: '100%' };

        const rect = imageRef.current.getBoundingClientRect();

        // Background size is the original image scaled up
        const bgW = rect.width * ZOOM_FACTOR;
        const bgH = rect.height * ZOOM_FACTOR;

        // Calculate offset so that the mouse position is centered in the panel
        // Formula: -(mousePos * zoom) + (panelSize / 2)
        const bgX = -(mousePos.x * ZOOM_FACTOR) + (ZOOM_PANEL_SIZE / 2);
        const bgY = -(mousePos.y * ZOOM_FACTOR) + (ZOOM_PANEL_SIZE / 2);

        return {
            backgroundImage: `url("${zoomSrc}")`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            backgroundSize: `${bgW}px ${bgH}px`,
            backgroundRepeat: 'no-repeat',
        };
    };

    // Navigation
    const goTo = (index: number) => {
        if (index >= 0 && index < images.length) {
            setActiveIndex(index);
            setIsZooming(false);
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col lg:flex-row gap-3">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:max-h-[400px]">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => goTo(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden bg-white transition-all ${idx === activeIndex
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>

            {/* Main image container */}
            <div className="relative flex-1 order-1 lg:order-2">
                <div
                    ref={imageRef}
                    className="relative aspect-square bg-white rounded-xl overflow-hidden cursor-crosshair"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    onClick={() => setIsModalOpen(true)}
                >
                    {/* Optimized Image with next/image for LCP */}
                    <div className="relative w-full h-full p-4">
                        <Image
                            src={activeImage.src}
                            alt={activeImage.alt}
                            fill
                            priority={activeIndex === 0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Lens overlay (desktop only) - semi-transparent box following cursor */}
                    {isZooming && (
                        <div
                            className="absolute pointer-events-none border-2 border-blue-500 bg-blue-500/20 transition-opacity duration-150"
                            style={lensStyle}
                        />
                    )}

                    {/* Hint (when not zooming) */}
                    {!isZooming && (
                        <div className="hidden lg:flex absolute bottom-4 right-4 items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur rounded-full text-white text-xs pointer-events-none">
                            <ZoomIn size={14} /> Passe o mouse para ampliar
                        </div>
                    )}

                    {/* Mobile hint */}
                    <div className="lg:hidden absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur rounded-full text-white text-xs pointer-events-none">
                        <ZoomIn size={14} /> Toque para ampliar
                    </div>
                </div>

                {/* ZOOM PANEL - Portal positioned to the right of image (desktop only) */}
                {isZooming && typeof window !== 'undefined' && createPortal(
                    <div
                        className="fixed z-[9999] bg-white rounded-xl shadow-2xl border overflow-hidden pointer-events-none"
                        style={{
                            width: ZOOM_PANEL_SIZE,
                            height: ZOOM_PANEL_SIZE,
                            top: panelPos.top,
                            left: panelPos.left,
                            ...getZoomBgPosition(),
                        }}
                    />,
                    document.body
                )}
            </div>

            {/* Modal/Lightbox */}
            {isModalOpen && (
                <GalleryModal
                    images={images}
                    activeIndex={activeIndex}
                    onClose={() => setIsModalOpen(false)}
                    onNavigate={goTo}
                />
            )}
        </div>
    );
}

// ============================================
// MODAL COMPONENT
// ============================================
interface GalleryModalProps {
    images: GalleryImage[];
    activeIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

function GalleryModal({ images, activeIndex, onClose, onNavigate }: GalleryModalProps) {
    const [zoom, setZoom] = useState(2); // Start at 200% (natural size)
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [showHint, setShowHint] = useState(true);
    const [mounted, setMounted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const lastTapRef = useRef(0);
    const touchStartRef = useRef({ x: 0, y: 0, dist: 0 });

    const activeImage = images[activeIndex];
    const zoomIndex = ZOOM_LEVELS.indexOf(zoom);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(false), 3000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        setZoom(2); // Reset to default 200%
        setPan({ x: 0, y: 0 });
    }, [activeIndex]);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Keyboard
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape': onClose(); break;
                case 'ArrowLeft': if (activeIndex > 0) onNavigate(activeIndex - 1); break;
                case 'ArrowRight': if (activeIndex < images.length - 1) onNavigate(activeIndex + 1); break;
                case '+': case '=': zoomIn(); break;
                case '-': zoomOut(); break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [activeIndex, images.length, onClose, onNavigate]);

    useEffect(() => { containerRef.current?.focus(); }, []);

    const zoomIn = useCallback(() => {
        const next = Math.min(zoomIndex + 1, ZOOM_LEVELS.length - 1);
        setZoom(ZOOM_LEVELS[next]);
    }, [zoomIndex]);

    const zoomOut = useCallback(() => {
        const next = Math.max(zoomIndex - 1, 0);
        setZoom(ZOOM_LEVELS[next]);
        if (ZOOM_LEVELS[next] === 1) setPan({ x: 0, y: 0 });
    }, [zoomIndex]);

    const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
        } else if (e.touches.length === 2) {
            e.preventDefault(); // Prevent page zoom
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            touchStartRef.current = { x: 0, y: 0, dist };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent page scroll/zoom behind modal
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const delta = dist - touchStartRef.current.dist;
            if (Math.abs(delta) > 30) {
                delta > 0 ? zoomIn() : zoomOut();
                touchStartRef.current.dist = dist;
            }
        } else if (e.touches.length === 1 && zoom > 1) {
            const dx = e.touches[0].clientX - touchStartRef.current.x;
            const dy = e.touches[0].clientY - touchStartRef.current.y;
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            zoom === 1 ? setZoom(2) : resetZoom();
        }
        lastTapRef.current = now;

        if (zoom === 1 && e.changedTouches.length === 1) {
            const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
            if (Math.abs(dx) > 80) {
                dx > 0 && activeIndex > 0 ? onNavigate(activeIndex - 1) :
                    dx < 0 && activeIndex < images.length - 1 ? onNavigate(activeIndex + 1) : null;
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom === 1) return;
        const startX = e.clientX, startY = e.clientY, startPan = { ...pan };
        const move = (ev: MouseEvent) => setPan({ x: startPan.x + ev.clientX - startX, y: startPan.y + ev.clientY - startY });
        const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };

    if (!mounted) return null;

    return createPortal(
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center overscroll-contain"
            style={{ touchAction: 'none' }}
            onClick={onClose}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
        >
            <button onClick={onClose} className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100" aria-label="Fechar">
                <X size={24} />
            </button>

            <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-semibold">
                {activeIndex + 1} / {images.length}
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-white rounded-full shadow-lg p-1">
                <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"><ZoomOut size={20} /></button>
                <span className="flex items-center px-2 text-sm font-medium min-w-[50px] justify-center">{Math.round(zoom * 50)}%</span>
                <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"><ZoomIn size={20} /></button>
                {zoom > 1 && <button onClick={(e) => { e.stopPropagation(); resetZoom(); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"><RotateCcw size={18} /></button>}
            </div>

            {activeIndex > 0 && (
                <button onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100">
                    <ChevronLeft size={24} />
                </button>
            )}
            {activeIndex < images.length - 1 && (
                <button onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100">
                    <ChevronRight size={24} />
                </button>
            )}

            <div
                className="relative w-full h-full max-w-[90vw] max-h-[80vh] flex items-center justify-center overflow-hidden select-none"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                style={{ cursor: zoom > 1 ? 'grab' : 'default', touchAction: 'none' }}
            >
                <img
                    src={zoom > 1 && activeImage.hiResSrc ? activeImage.hiResSrc : activeImage.src}
                    alt={activeImage.alt}
                    className="max-w-full max-h-full object-contain transition-transform duration-150"
                    style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
                    draggable={false}
                />
            </div>

            {showHint && (
                <div className="lg:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/70 text-white text-sm rounded-full">
                    Use dois dedos para ampliar
                </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/90 backdrop-blur rounded-xl p-2 max-w-[90vw] overflow-x-auto">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); onNavigate(idx); }}
                        className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden bg-white ${idx === activeIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                        <img src={img.src} alt="" className="w-full h-full object-contain" />
                    </button>
                ))}
            </div>
        </div>,
        document.body
    );
}

export default ProductGalleryZoom;
