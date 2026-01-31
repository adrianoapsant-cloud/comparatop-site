'use client';

// ============================================================================
// URL STATE HOOKS FOR TCO VIEW
// ============================================================================
// Custom hooks for managing TCO view state in the URL
// Enables shareable URLs like ?view=tco&persona=gamer&score=technical
// ============================================================================

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { TcoViewMode, UsagePersona } from '@/types/tco';

// ============================================
// TYPES
// ============================================

export type ScoreViewMode = 'community' | 'technical';

// ============================================
// CONSTANTS
// ============================================

const PARAM_VIEW = 'view';
const PARAM_PERSONA = 'persona';
const PARAM_YEARS = 'years';
const PARAM_SCORE = 'score';

const DEFAULT_VIEW: TcoViewMode = 'price';
const DEFAULT_PERSONA: UsagePersona = 'family';
const DEFAULT_YEARS = 5;
const DEFAULT_SCORE: ScoreViewMode = 'community';

const VALID_VIEWS: TcoViewMode[] = ['price', 'tco'];
const VALID_PERSONAS: UsagePersona[] = ['gamer', 'eco', 'family'];
const VALID_SCORES: ScoreViewMode[] = ['community', 'technical'];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function isValidView(value: string | null): value is TcoViewMode {
    return value !== null && VALID_VIEWS.includes(value as TcoViewMode);
}

function isValidPersona(value: string | null): value is UsagePersona {
    return value !== null && VALID_PERSONAS.includes(value as UsagePersona);
}

function isValidScore(value: string | null): value is ScoreViewMode {
    return value !== null && VALID_SCORES.includes(value as ScoreViewMode);
}

function createUpdatedParams(
    currentParams: URLSearchParams,
    updates: Record<string, string | null>
): URLSearchParams {
    const newParams = new URLSearchParams(currentParams.toString());

    for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }
    }

    return newParams;
}

// ============================================
// HOOK: useTcoView
// ============================================

export interface UseTcoViewReturn {
    view: TcoViewMode;
    isTcoView: boolean;
    isPriceView: boolean;
    showPrice: () => void;
    showTco: () => void;
    toggleView: () => void;
    setView: (view: TcoViewMode) => void;
}

export function useTcoView(): UseTcoViewReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const view = useMemo((): TcoViewMode => {
        const param = searchParams.get(PARAM_VIEW);
        return isValidView(param) ? param : DEFAULT_VIEW;
    }, [searchParams]);

    const isTcoView = view === 'tco';
    const isPriceView = view === 'price';

    const setView = useCallback((newView: TcoViewMode) => {
        const newParams = createUpdatedParams(searchParams, {
            [PARAM_VIEW]: newView === DEFAULT_VIEW ? null : newView,
        });
        const queryString = newParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    const showPrice = useCallback(() => setView('price'), [setView]);
    const showTco = useCallback(() => setView('tco'), [setView]);
    const toggleView = useCallback(() => setView(isTcoView ? 'price' : 'tco'), [setView, isTcoView]);

    return { view, isTcoView, isPriceView, showPrice, showTco, toggleView, setView };
}

// ============================================
// HOOK: useScoreView
// ============================================

export interface UseScoreViewReturn {
    /** Current score view mode ('community' or 'technical') */
    scoreView: ScoreViewMode;
    /** Whether community view is active (Amazon/ML stars) */
    isCommunityView: boolean;
    /** Whether technical view is active (ComparaTop 10 Dores) */
    isTechnicalView: boolean;
    /** Switch to community score view */
    showCommunity: () => void;
    /** Switch to technical score view */
    showTechnical: () => void;
    /** Toggle between score views */
    toggleScoreView: () => void;
    /** Set specific score view */
    setScoreView: (mode: ScoreViewMode) => void;
}

/**
 * Hook for managing score view state in URL
 * 
 * - community: Uses product.rating (Amazon/ML community stars)
 * - technical: Uses product.score (ComparaTop based on 10 Dores)
 */
export function useScoreView(): UseScoreViewReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const scoreView = useMemo((): ScoreViewMode => {
        const param = searchParams.get(PARAM_SCORE);
        return isValidScore(param) ? param : DEFAULT_SCORE;
    }, [searchParams]);

    const isCommunityView = scoreView === 'community';
    const isTechnicalView = scoreView === 'technical';

    const setScoreView = useCallback((newMode: ScoreViewMode) => {
        const newParams = createUpdatedParams(searchParams, {
            [PARAM_SCORE]: newMode === DEFAULT_SCORE ? null : newMode,
        });
        const queryString = newParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    const showCommunity = useCallback(() => setScoreView('community'), [setScoreView]);
    const showTechnical = useCallback(() => setScoreView('technical'), [setScoreView]);
    const toggleScoreView = useCallback(
        () => setScoreView(isCommunityView ? 'technical' : 'community'),
        [setScoreView, isCommunityView]
    );

    return {
        scoreView,
        isCommunityView,
        isTechnicalView,
        showCommunity,
        showTechnical,
        toggleScoreView,
        setScoreView,
    };
}

// ============================================
// HOOK: usePersona
// ============================================

export interface UsePersonaReturn {
    persona: UsagePersona;
    isGamer: boolean;
    isEco: boolean;
    isFamily: boolean;
    setPersona: (persona: UsagePersona) => void;
    personaLabel: string;
    allPersonas: { value: UsagePersona; label: string; icon: string }[];
}

const PERSONA_CONFIG: Record<UsagePersona, { label: string; icon: string }> = {
    gamer: { label: 'Gamer / Heavy', icon: '🎮' },
    eco: { label: 'Econômico', icon: '🌱' },
    family: { label: 'Família', icon: '👨‍👩‍👧‍👦' },
};

export function usePersona(): UsePersonaReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const persona = useMemo((): UsagePersona => {
        const param = searchParams.get(PARAM_PERSONA);
        return isValidPersona(param) ? param : DEFAULT_PERSONA;
    }, [searchParams]);

    const isGamer = persona === 'gamer';
    const isEco = persona === 'eco';
    const isFamily = persona === 'family';

    const setPersona = useCallback((newPersona: UsagePersona) => {
        const newParams = createUpdatedParams(searchParams, {
            [PARAM_PERSONA]: newPersona === DEFAULT_PERSONA ? null : newPersona,
        });
        const queryString = newParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    const personaLabel = PERSONA_CONFIG[persona].label;
    const allPersonas = useMemo(() =>
        VALID_PERSONAS.map(p => ({
            value: p,
            label: PERSONA_CONFIG[p].label,
            icon: PERSONA_CONFIG[p].icon,
        })),
        []);

    return { persona, isGamer, isEco, isFamily, setPersona, personaLabel, allPersonas };
}

// ============================================
// HOOK: useTcoYears
// ============================================

export interface UseTcoYearsReturn {
    years: number;
    setYears: (years: number) => void;
    yearOptions: number[];
}

export function useTcoYears(): UseTcoYearsReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const years = useMemo((): number => {
        const param = searchParams.get(PARAM_YEARS);
        if (!param) return DEFAULT_YEARS;
        const parsed = parseInt(param, 10);
        return isNaN(parsed) || parsed < 1 || parsed > 15 ? DEFAULT_YEARS : parsed;
    }, [searchParams]);

    const setYears = useCallback((newYears: number) => {
        const newParams = createUpdatedParams(searchParams, {
            [PARAM_YEARS]: newYears === DEFAULT_YEARS ? null : newYears.toString(),
        });
        const queryString = newParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    const yearOptions = [1, 3, 5, 7, 10];

    return { years, setYears, yearOptions };
}

// ============================================
// COMBINED HOOK: useTcoState
// ============================================

export interface UseTcoStateReturn extends UseTcoViewReturn, UsePersonaReturn, UseTcoYearsReturn, UseScoreViewReturn {
    resetAll: () => void;
    getShareableUrl: () => string;
}

/**
 * Combined hook for all TCO URL state
 * Includes: view, persona, years, scoreView
 */
export function useTcoState(): UseTcoStateReturn {
    const viewState = useTcoView();
    const personaState = usePersona();
    const yearsState = useTcoYears();
    const scoreState = useScoreView();

    const router = useRouter();
    const pathname = usePathname();

    const resetAll = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [router, pathname]);

    const getShareableUrl = useCallback(() => {
        if (typeof window === 'undefined') return '';

        const params = new URLSearchParams();
        if (viewState.view !== DEFAULT_VIEW) params.set(PARAM_VIEW, viewState.view);
        if (personaState.persona !== DEFAULT_PERSONA) params.set(PARAM_PERSONA, personaState.persona);
        if (yearsState.years !== DEFAULT_YEARS) params.set(PARAM_YEARS, yearsState.years.toString());
        if (scoreState.scoreView !== DEFAULT_SCORE) params.set(PARAM_SCORE, scoreState.scoreView);

        const queryString = params.toString();
        return `${window.location.origin}${pathname}${queryString ? `?${queryString}` : ''}`;
    }, [viewState.view, personaState.persona, yearsState.years, scoreState.scoreView, pathname]);

    return {
        ...viewState,
        ...personaState,
        ...yearsState,
        ...scoreState,
        resetAll,
        getShareableUrl,
    };
}

// ============================================
// TYPES: Display View Mode
// ============================================

export type DisplayViewMode = 'grid' | 'table';

const PARAM_DISPLAY = 'display';
const DEFAULT_DISPLAY: DisplayViewMode = 'table';
const VALID_DISPLAYS: DisplayViewMode[] = ['grid', 'table'];

function isValidDisplay(value: string | null): value is DisplayViewMode {
    return value !== null && VALID_DISPLAYS.includes(value as DisplayViewMode);
}

// ============================================
// HOOK: useDisplayView
// ============================================

export interface UseDisplayViewReturn {
    /** Current display mode ('grid' or 'table') */
    displayView: DisplayViewMode;
    /** Whether grid/gallery view is active */
    isGridView: boolean;
    /** Whether table/engineering view is active */
    isTableView: boolean;
    /** Switch to grid view */
    showGrid: () => void;
    /** Switch to table view */
    showTable: () => void;
    /** Toggle between display modes */
    toggleDisplayView: () => void;
    /** Set specific display mode */
    setDisplayView: (mode: DisplayViewMode) => void;
}

/**
 * Hook for managing display view state in URL
 * 
 * - grid: Visual gallery mode (product cards with images)
 * - table: Engineering mode (MutantTable with TCO data)
 * 
 * @example
 * ```tsx
 * const { displayView, isGridView, isTableView, setDisplayView } = useDisplayView();
 * 
 * return isTableView ? <DataTable ... /> : <ProductGrid ... />;
 * ```
 */
export function useDisplayView(): UseDisplayViewReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const displayView = useMemo((): DisplayViewMode => {
        const param = searchParams.get(PARAM_DISPLAY);
        return isValidDisplay(param) ? param : DEFAULT_DISPLAY;
    }, [searchParams]);

    const isGridView = displayView === 'grid';
    const isTableView = displayView === 'table';

    const setDisplayView = useCallback((newMode: DisplayViewMode) => {
        const newParams = createUpdatedParams(searchParams, {
            [PARAM_DISPLAY]: newMode === DEFAULT_DISPLAY ? null : newMode,
        });
        const queryString = newParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    const showGrid = useCallback(() => setDisplayView('grid'), [setDisplayView]);
    const showTable = useCallback(() => setDisplayView('table'), [setDisplayView]);
    const toggleDisplayView = useCallback(
        () => setDisplayView(isGridView ? 'table' : 'grid'),
        [setDisplayView, isGridView]
    );

    return {
        displayView,
        isGridView,
        isTableView,
        showGrid,
        showTable,
        toggleDisplayView,
        setDisplayView,
    };
}
