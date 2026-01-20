'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComparisonEngineConfig } from '@/lib/tools-config';

// ============================================
// SIMULATION DISCLAIMER COMPONENT
// ============================================

interface SimulationDisclaimerProps {
    type: 'image-slider' | 'audio-switch';
}

function SimulationDisclaimer({ type }: SimulationDisclaimerProps) {
    if (type === 'image-slider') {
        return (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <span className="text-xl flex-shrink-0">🖥️</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Nota Técnica:</strong> Simulação aproximada. A percepção de contraste
                    ou resolução está limitada pela qualidade da sua tela atual. O resultado real
                    ao vivo é superior.
                </p>
            </div>
        );
    }

    if (type === 'audio-switch') {
        return (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <span className="text-xl flex-shrink-0">🎧</span>
                <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Nota Técnica:</strong> Para perceber a diferença real de graves e
                    detalhes, o uso de fones de ouvido é obrigatório. Alto-falantes de celular
                    não refletem a realidade.
                </p>
            </div>
        );
    }

    return null;
}

// ============================================
// IMAGE SLIDER MODE
// ============================================

interface ImageSliderProps {
    config: ComparisonEngineConfig;
}

function ImageSlider({ config }: ImageSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setSliderPosition(percentage);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        handleMove(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleMove(e.clientX);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                handleMove(e.touches[0].clientX);
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, handleMove]);

    return (
        <div className="space-y-4">
            {/* Image Comparison Container */}
            <div
                ref={containerRef}
                className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none bg-gray-900"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* After Image (Background - Full width) */}
                <div className="absolute inset-0">
                    <img
                        src={config.media.after}
                        alt={config.media.labelAfter}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                    {/* After Label */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {config.media.labelAfter}
                    </div>
                </div>

                {/* Before Image (Clipped by slider position) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <img
                        src={config.media.before}
                        alt={config.media.labelBefore}
                        className="w-full h-full object-cover"
                        style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }}
                        draggable={false}
                    />
                    {/* Before Label */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-gray-700/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {config.media.labelBefore}
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                    {/* Handle Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                        <div className="flex gap-0.5">
                            <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
                            <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Drag Hint (shows briefly) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-2 pointer-events-none">
                    <span>←</span>
                    <span>Arraste para comparar</span>
                    <span>→</span>
                </div>
            </div>

            {/* Description */}
            {config.description && (
                <p className="text-sm text-text-secondary text-center">
                    {config.description}
                </p>
            )}
        </div>
    );
}

// ============================================
// AUDIO SWITCH MODE
// ============================================

interface AudioSwitchProps {
    config: ComparisonEngineConfig;
}

function AudioSwitch({ config }: AudioSwitchProps) {
    const [activeTrack, setActiveTrack] = useState<'before' | 'after'>('before');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const beforeAudioRef = useRef<HTMLAudioElement>(null);
    const afterAudioRef = useRef<HTMLAudioElement>(null);

    // Get active audio element
    const getActiveAudio = useCallback(() => {
        return activeTrack === 'before' ? beforeAudioRef.current : afterAudioRef.current;
    }, [activeTrack]);

    const getInactiveAudio = useCallback(() => {
        return activeTrack === 'before' ? afterAudioRef.current : beforeAudioRef.current;
    }, [activeTrack]);

    // Sync audio elements
    useEffect(() => {
        const activeAudio = getActiveAudio();
        const inactiveAudio = getInactiveAudio();

        if (activeAudio && inactiveAudio) {
            // Sync time
            inactiveAudio.currentTime = activeAudio.currentTime;

            // Play/pause state
            if (isPlaying) {
                activeAudio.play().catch(() => { });
                inactiveAudio.pause();
            } else {
                activeAudio.pause();
                inactiveAudio.pause();
            }

            // Mute state
            activeAudio.muted = isMuted;
            inactiveAudio.muted = true; // Always mute inactive
        }
    }, [activeTrack, isPlaying, isMuted, getActiveAudio, getInactiveAudio]);

    // Update time display
    useEffect(() => {
        const audio = getActiveAudio();
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [getActiveAudio]);

    // Toggle play/pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Switch tracks (CRITICAL: maintain currentTime)
    const switchTrack = (track: 'before' | 'after') => {
        if (track === activeTrack) return;

        const currentAudio = getActiveAudio();
        const time = currentAudio?.currentTime || 0;

        // Set the new track
        setActiveTrack(track);

        // After state update, the useEffect will sync the times
        const newActiveAudio = track === 'before' ? beforeAudioRef.current : afterAudioRef.current;
        if (newActiveAudio) {
            newActiveAudio.currentTime = time;
            if (isPlaying) {
                newActiveAudio.play().catch(() => { });
            }
        }
    };

    // Seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);

        if (beforeAudioRef.current) beforeAudioRef.current.currentTime = time;
        if (afterAudioRef.current) afterAudioRef.current.currentTime = time;
    };

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            {/* Hidden Audio Elements */}
            <audio ref={beforeAudioRef} src={config.media.before} preload="metadata" />
            <audio ref={afterAudioRef} src={config.media.after} preload="metadata" />

            {/* Player Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 space-y-6">
                {/* Track Visualization */}
                <div className="flex items-center justify-center gap-4 py-6">
                    <div className={cn(
                        'w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300',
                        activeTrack === 'before'
                            ? 'bg-gray-700 scale-110 ring-2 ring-gray-500'
                            : 'bg-gray-800 scale-90 opacity-50'
                    )}>
                        <span className="text-3xl">📺</span>
                    </div>

                    <div className="text-white text-2xl font-bold">VS</div>

                    <div className={cn(
                        'w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300',
                        activeTrack === 'after'
                            ? 'bg-emerald-600 scale-110 ring-2 ring-emerald-400'
                            : 'bg-gray-800 scale-90 opacity-50'
                    )}>
                        <span className="text-3xl">🔊</span>
                    </div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => switchTrack('before')}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all',
                            activeTrack === 'before'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        )}
                    >
                        {config.media.labelBefore}
                    </button>
                    <button
                        onClick={() => switchTrack('after')}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all',
                            activeTrack === 'after'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        )}
                    >
                        {config.media.labelAfter}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer 
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white 
                                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-4 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                    </button>

                    <div className="w-11" /> {/* Spacer for balance */}
                </div>
            </div>

            {/* Description */}
            {config.description && (
                <p className="text-sm text-text-secondary text-center">
                    {config.description}
                </p>
            )}
        </div>
    );
}

// ============================================
// CTA BUTTON
// ============================================

interface CTAButtonProps {
    config: ComparisonEngineConfig;
}

function CTAButton({ config }: CTAButtonProps) {
    if (!config.cta) return null;

    return (
        <a
            href={config.cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'w-full mt-6 py-4 rounded-xl',
                'bg-gradient-to-r from-emerald-600 to-emerald-500',
                'hover:from-emerald-500 hover:to-emerald-400',
                'text-white font-body font-bold text-lg',
                'flex items-center justify-center gap-3',
                'shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-500/40',
                'transition-all'
            )}
        >
            <span>Quero a qualidade {config.cta.productName}</span>
            <ExternalLink size={18} />
        </a>
    );
}

// ============================================
// MAIN COMPARISON ENGINE COMPONENT
// ============================================

interface ComparisonEngineProps {
    config: ComparisonEngineConfig;
    className?: string;
}

export function ComparisonEngine({ config, className }: ComparisonEngineProps) {
    return (
        <div className={cn('bg-white rounded-2xl p-6 shadow-xl border border-gray-100', className)}>
            {/* Title */}
            <h2 className="font-display text-xl font-bold text-text-primary mb-4 text-center">
                {config.title}
            </h2>

            {/* Disclaimer */}
            <SimulationDisclaimer type={config.type} />

            {/* Content based on type */}
            {config.type === 'image-slider' && <ImageSlider config={config} />}
            {config.type === 'audio-switch' && <AudioSwitch config={config} />}

            {/* CTA */}
            <CTAButton config={config} />
        </div>
    );
}
