"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { getEnergyRate, DEFAULT_ENERGY_RATE, ENERGY_RATES } from "@/lib/tco/energy-rates";

const REGION_STORAGE_KEY = "comparatop_user_region";
const RATE_STORAGE_KEY = "comparatop_energy_rate";
const DEFAULT_STATE = "SP";

// ============================================
// STATE NAME → CODE MAPPING
// ============================================

const STATE_NAME_TO_CODE: Record<string, string> = {
    'Acre': 'AC',
    'Alagoas': 'AL',
    'Amapá': 'AP',
    'Amazonas': 'AM',
    'Bahia': 'BA',
    'Ceará': 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    'Goiás': 'GO',
    'Maranhão': 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    'Pará': 'PA',
    'Paraíba': 'PB',
    'Paraná': 'PR',
    'Pernambuco': 'PE',
    'Piauí': 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    'Rondônia': 'RO',
    'Roraima': 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    'Sergipe': 'SE',
    'Tocantins': 'TO',
};

/**
 * Maps a Brazilian state name to its code (UF)
 */
function mapStateNameToCode(stateName: string | undefined): string | null {
    if (!stateName) return null;

    // Direct match
    if (STATE_NAME_TO_CODE[stateName]) {
        return STATE_NAME_TO_CODE[stateName];
    }

    // Fuzzy match (normalize accents and case)
    const normalized = stateName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    for (const [name, code] of Object.entries(STATE_NAME_TO_CODE)) {
        const normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        if (normalizedName === normalized || normalizedName.includes(normalized) || normalized.includes(normalizedName)) {
            return code;
        }
    }

    return null;
}

// ============================================
// CONTEXT TYPES
// ============================================

interface RegionContextType {
    /** Current state code (UF) */
    stateCode: string;
    /** Current state name */
    stateName: string;
    /** Energy rate for current state (R$/kWh) */
    energyRate: number;
    /** Set the user's region */
    setRegion: (stateCode: string) => void;
    /** Whether region has been explicitly set */
    isRegionSet: boolean;
    /** Source of the energy rate (supabase/mock/cache) */
    rateSource: 'supabase' | 'mock' | 'cache' | 'loading';
    /** Whether geolocation detection is in progress */
    isDetecting: boolean;
    /** Error from geolocation detection (if any) */
    detectionError: string | null;
    /** Manually trigger location detection */
    detectLocation: () => Promise<void>;
}

const RegionContext = createContext<RegionContextType | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function RegionProvider({ children }: { children: ReactNode }) {
    const [stateCode, setStateCode] = useState<string>(DEFAULT_STATE);
    const [energyRate, setEnergyRate] = useState<number>(DEFAULT_ENERGY_RATE);
    const [rateSource, setRateSource] = useState<'supabase' | 'mock' | 'cache' | 'loading'>('mock');
    const [isRegionSet, setIsRegionSet] = useState<boolean>(false);
    const [isDetecting, setIsDetecting] = useState<boolean>(false);
    const [detectionError, setDetectionError] = useState<string | null>(null);

    // AbortController for canceling fetch on unmount/re-render
    const abortControllerRef = useRef<AbortController | null>(null);
    const hasAttemptedDetection = useRef<boolean>(false);

    // ============================================
    // GEOLOCATION DETECTION
    // ============================================

    const detectLocation = useCallback(async () => {
        // Check if geolocation is available
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setDetectionError('Geolocalização não suportada neste navegador');
            return;
        }

        setIsDetecting(true);
        setDetectionError(null);

        try {
            // Get coordinates from browser
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false, // Faster, sufficient for state-level
                    timeout: 10000, // 10 seconds timeout
                    maximumAge: 600000, // Cache for 10 minutes
                });
            });

            const { latitude, longitude } = position.coords;

            // Reverse geocoding via OpenStreetMap Nominatim
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=5&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'pt-BR',
                        'User-Agent': 'ComparaTop/1.0 (https://comparatop.com.br)',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Falha ao obter localização');
            }

            const data = await response.json();
            const detectedStateName = data.address?.state;
            const detectedStateCode = mapStateNameToCode(detectedStateName);

            if (detectedStateCode && ENERGY_RATES[detectedStateCode]) {
                setStateCode(detectedStateCode);
                setIsRegionSet(true);

                // Save to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem(REGION_STORAGE_KEY, detectedStateCode);
                }

                console.log(`[RegionContext] 📍 Localização detectada: ${detectedStateName} (${detectedStateCode})`);
            } else {
                console.warn(`[RegionContext] Estado não reconhecido: ${detectedStateName}`);
                setDetectionError(`Estado não reconhecido: ${detectedStateName || 'desconhecido'}`);
            }
        } catch (error) {
            const errorMessage = error instanceof GeolocationPositionError
                ? getGeolocationErrorMessage(error)
                : (error instanceof Error ? error.message : 'Erro desconhecido');

            setDetectionError(errorMessage);
            console.warn('[RegionContext] Falha na detecção:', errorMessage);
        } finally {
            setIsDetecting(false);
        }
    }, []);

    // ============================================
    // LOAD SAVED REGION ON MOUNT
    // ============================================

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedRegion = localStorage.getItem(REGION_STORAGE_KEY);
            const savedRate = localStorage.getItem(RATE_STORAGE_KEY);

            if (savedRegion && ENERGY_RATES[savedRegion]) {
                setStateCode(savedRegion);
                setIsRegionSet(true);

                // Use cached rate immediately for no-flash UX
                if (savedRate) {
                    const parsed = JSON.parse(savedRate);
                    if (parsed.stateCode === savedRegion) {
                        setEnergyRate(parsed.rateKwh);
                        setRateSource('cache');
                    }
                }
            }
        }
    }, []);

    // ============================================
    // AUTO-DETECT LOCATION ON FIRST LOAD (DISABLED)
    // ============================================
    // Desativado para não solicitar permissão de localização automaticamente
    // O usuário pode detectar manualmente usando o botão de região se necessário

    // useEffect(() => {
    //     if (!isRegionSet && !hasAttemptedDetection.current && typeof window !== 'undefined') {
    //         hasAttemptedDetection.current = true;
    //         const timer = setTimeout(() => {
    //             detectLocation();
    //         }, 500);
    //         return () => clearTimeout(timer);
    //     }
    // }, [isRegionSet, detectLocation]);

    // ============================================
    // FETCH RATE FROM API WHEN STATE CHANGES
    // ============================================

    useEffect(() => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const fetchRate = async () => {
            // Start with mock for immediate update (no flash)
            const mockRate = getEnergyRate(stateCode);
            setEnergyRate(mockRate);

            try {
                setRateSource('loading');

                const response = await fetch(`/api/energy-rates?state=${stateCode}`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error('API error');
                }

                const data = await response.json();

                // Update if not aborted
                if (!controller.signal.aborted) {
                    setEnergyRate(data.rateKwh);
                    setRateSource(data.source as 'supabase' | 'mock' | 'cache');

                    // Cache in localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify({
                            stateCode: data.stateCode,
                            rateKwh: data.rateKwh,
                            source: data.source,
                            fetchedAt: Date.now()
                        }));
                    }
                }
            } catch (err) {
                // Ignore abort errors, keep mock rate for other errors
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.warn('[RegionContext] Rate fetch failed, using mock:', err.message);
                    setRateSource('mock');
                }
            }
        };

        fetchRate();

        return () => {
            controller.abort();
        };
    }, [stateCode]);

    // ============================================
    // SET REGION MANUALLY
    // ============================================

    const setRegion = useCallback((newStateCode: string) => {
        if (ENERGY_RATES[newStateCode]) {
            setStateCode(newStateCode);
            setIsRegionSet(true);
            setDetectionError(null); // Clear any previous detection error
            if (typeof window !== "undefined") {
                localStorage.setItem(REGION_STORAGE_KEY, newStateCode);
            }
        }
    }, []);

    const stateName = ENERGY_RATES[stateCode]?.stateName ?? "São Paulo";

    return (
        <RegionContext.Provider value={{
            stateCode,
            stateName,
            energyRate,
            setRegion,
            isRegionSet,
            rateSource,
            isDetecting,
            detectionError,
            detectLocation,
        }}>
            {children}
        </RegionContext.Provider>
    );
}

// ============================================
// HOOKS
// ============================================

export function useRegion() {
    const context = useContext(RegionContext);
    if (!context) {
        throw new Error("useRegion must be used within RegionProvider");
    }
    return context;
}

/**
 * Hook to calculate TCO with current region's energy rate
 */
export function useRegionalTco() {
    const { energyRate, stateCode } = useRegion();

    return {
        energyRate,
        stateCode,
        calculateWithRegion: (price: number, energyKwhMonth: number, lifespanYears?: number) => {
            // Import dynamically to avoid circular deps
            const { calculateTco } = require("@/lib/tco/calculate-tco");
            return calculateTco({
                price,
                energyKwhMonth,
                energyRate,
                lifespanYears
            });
        }
    };
}

// ============================================
// HELPERS
// ============================================

/**
 * Get user-friendly error message for geolocation errors
 */
function getGeolocationErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Permissão de localização negada';
        case error.POSITION_UNAVAILABLE:
            return 'Localização indisponível';
        case error.TIMEOUT:
            return 'Tempo esgotado ao obter localização';
        default:
            return 'Erro ao obter localização';
    }
}
