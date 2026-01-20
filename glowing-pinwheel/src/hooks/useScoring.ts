'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    calculateContextualScore,
    getAvailableContexts,
    type ProductFacts,
    type CategoryRules,
    type ScoringResult,
    type ScoringContext,
} from '@/lib/scoring/index';

// Import all rule files
import acRules from '@/data/rules/ac-rules.json';
import refrigeratorRules from '@/data/rules/refrigerator-rules.json';
import freezerRules from '@/data/rules/freezer-rules.json';
import washerRules from '@/data/rules/washer-rules.json';
import washerDryerRules from '@/data/rules/washer-dryer-rules.json';
import dishwasherRules from '@/data/rules/dishwasher-rules.json';
import microwaveRules from '@/data/rules/microwave-rules.json';
import stoveRules from '@/data/rules/stove-rules.json';
import airFryerRules from '@/data/rules/air-fryer-rules.json';
import espressoMachineRules from '@/data/rules/espresso-machine-rules.json';
import mixerProcessorRules from '@/data/rules/mixer-processor-rules.json';
import waterPurifierRules from '@/data/rules/water-purifier-rules.json';
import wineCoolerRules from '@/data/rules/wine-cooler-rules.json';
import rangeHoodRules from '@/data/rules/range-hood-rules.json';
import minibarRules from '@/data/rules/minibar-rules.json';
import builtinOvenRules from '@/data/rules/builtin-oven-rules.json';
import smartphoneRules from '@/data/rules/smartphone-rules.json';
import smarttvRules from '@/data/rules/smarttv-rules.json';
import notebookRules from '@/data/rules/notebook-rules.json';
import tabletRules from '@/data/rules/tablet-rules.json';
import monitorRules from '@/data/rules/monitor-rules.json';
import projectorRules from '@/data/rules/projector-rules.json';
import cameraRules from '@/data/rules/camera-rules.json';
import tvboxRules from '@/data/rules/tvbox-rules.json';
import soundbarRules from '@/data/rules/soundbar-rules.json';
import twsRules from '@/data/rules/tws-rules.json';
import headsetGamerRules from '@/data/rules/headset-gamer-rules.json';
import bluetoothSpeakerRules from '@/data/rules/bluetooth-speaker-rules.json';
import smartwatchRules from '@/data/rules/smartwatch-rules.json';
import cpuRules from '@/data/rules/cpu-rules.json';
import gpuRules from '@/data/rules/gpu-rules.json';
import ramRules from '@/data/rules/ram-rules.json';
import motherboardRules from '@/data/rules/motherboard-rules.json';
import psuRules from '@/data/rules/psu-rules.json';
import ssdRules from '@/data/rules/ssd-rules.json';
import caseRules from '@/data/rules/case-rules.json';
import upsRules from '@/data/rules/ups-rules.json';
import powerStripRules from '@/data/rules/power-strip-rules.json';
import consoleRules from '@/data/rules/console-rules.json';
import gamepadRules from '@/data/rules/gamepad-rules.json';
import chairRules from '@/data/rules/chair-rules.json';
import robotVacuumRules from '@/data/rules/robot-vacuum-rules.json';
import stickVacuumRules from '@/data/rules/stick-vacuum-rules.json';
import fanRules from '@/data/rules/fan-rules.json';
import securityCameraRules from '@/data/rules/security-camera-rules.json';
import smartLockRules from '@/data/rules/smart-lock-rules.json';
import routerRules from '@/data/rules/router-rules.json';
import printerRules from '@/data/rules/printer-rules.json';
import tireRules from '@/data/rules/tire-rules.json';
import carBatteryRules from '@/data/rules/car-battery-rules.json';
import pressureWasherRules from '@/data/rules/pressure-washer-rules.json';
import drillRules from '@/data/rules/drill-rules.json';
import keyboardRules from '@/data/rules/keyboard-rules.json';

// ============================================
// RULES REGISTRY
// ============================================

/**
 * Maps category slugs to their corresponding rules.
 * This is the central registry for all category rules.
 */
export const RULES_REGISTRY: Record<string, CategoryRules> = {
    // Climatização
    'ar-condicionado': acRules as CategoryRules,
    'ac': acRules as CategoryRules,

    // Refrigeração
    'geladeira': refrigeratorRules as CategoryRules,
    'refrigerator': refrigeratorRules as CategoryRules,
    'freezer': freezerRules as CategoryRules,
    'minibar': minibarRules as CategoryRules,
    'frigobar': minibarRules as CategoryRules,
    'adega': wineCoolerRules as CategoryRules,
    'wine-cooler': wineCoolerRules as CategoryRules,

    // Lavanderia
    'maquina-lavar': washerRules as CategoryRules,
    'washer': washerRules as CategoryRules,
    'lava-seca': washerDryerRules as CategoryRules,
    'washer-dryer': washerDryerRules as CategoryRules,
    'lava-loucas': dishwasherRules as CategoryRules,
    'dishwasher': dishwasherRules as CategoryRules,

    // Cozinha
    'micro-ondas': microwaveRules as CategoryRules,
    'microwave': microwaveRules as CategoryRules,
    'fogao': stoveRules as CategoryRules,
    'stove': stoveRules as CategoryRules,
    'air-fryer': airFryerRules as CategoryRules,
    'fritadeira': airFryerRules as CategoryRules,
    'cafeteira': espressoMachineRules as CategoryRules,
    'espresso': espressoMachineRules as CategoryRules,
    'batedeira': mixerProcessorRules as CategoryRules,
    'mixer': mixerProcessorRules as CategoryRules,
    'purificador': waterPurifierRules as CategoryRules,
    'water-purifier': waterPurifierRules as CategoryRules,
    'coifa': rangeHoodRules as CategoryRules,
    'range-hood': rangeHoodRules as CategoryRules,
    'forno': builtinOvenRules as CategoryRules,
    'builtin-oven': builtinOvenRules as CategoryRules,

    // Eletrônicos
    'smartphone': smartphoneRules as CategoryRules,
    'celular': smartphoneRules as CategoryRules,
    'tv': smarttvRules as CategoryRules,
    'smarttv': smarttvRules as CategoryRules,
    'notebook': notebookRules as CategoryRules,
    'laptop': notebookRules as CategoryRules,
    'tablet': tabletRules as CategoryRules,
    'monitor': monitorRules as CategoryRules,
    'projetor': projectorRules as CategoryRules,
    'projector': projectorRules as CategoryRules,
    'camera': cameraRules as CategoryRules,
    'tvbox': tvboxRules as CategoryRules,
    'streaming': tvboxRules as CategoryRules,

    // Áudio
    'soundbar': soundbarRules as CategoryRules,
    'tws': twsRules as CategoryRules,
    'fone-tws': twsRules as CategoryRules,
    'headset-gamer': headsetGamerRules as CategoryRules,
    'headset': headsetGamerRules as CategoryRules,
    'caixa-som': bluetoothSpeakerRules as CategoryRules,
    'bluetooth-speaker': bluetoothSpeakerRules as CategoryRules,

    // Wearables
    'smartwatch': smartwatchRules as CategoryRules,
    'relogio': smartwatchRules as CategoryRules,

    // PC Components
    'cpu': cpuRules as CategoryRules,
    'processador': cpuRules as CategoryRules,
    'gpu': gpuRules as CategoryRules,
    'placa-video': gpuRules as CategoryRules,
    'ram': ramRules as CategoryRules,
    'memoria': ramRules as CategoryRules,
    'motherboard': motherboardRules as CategoryRules,
    'placa-mae': motherboardRules as CategoryRules,
    'psu': psuRules as CategoryRules,
    'fonte': psuRules as CategoryRules,
    'ssd': ssdRules as CategoryRules,
    'gabinete': caseRules as CategoryRules,
    'case': caseRules as CategoryRules,
    'nobreak': upsRules as CategoryRules,
    'ups': upsRules as CategoryRules,
    'filtro-linha': powerStripRules as CategoryRules,
    'power-strip': powerStripRules as CategoryRules,

    // Gaming
    'console': consoleRules as CategoryRules,
    'videogame': consoleRules as CategoryRules,
    'controle': gamepadRules as CategoryRules,
    'gamepad': gamepadRules as CategoryRules,
    'cadeira-gamer': chairRules as CategoryRules,
    'chair': chairRules as CategoryRules,
    'teclado': keyboardRules as CategoryRules,
    'keyboard': keyboardRules as CategoryRules,

    // Limpeza
    'robo-aspirador': robotVacuumRules as CategoryRules,
    'robot-vacuum': robotVacuumRules as CategoryRules,
    'aspirador-vertical': stickVacuumRules as CategoryRules,
    'stick-vacuum': stickVacuumRules as CategoryRules,
    'ventilador': fanRules as CategoryRules,
    'fan': fanRules as CategoryRules,

    // Smart Home
    'camera-seguranca': securityCameraRules as CategoryRules,
    'security-camera': securityCameraRules as CategoryRules,
    'fechadura': smartLockRules as CategoryRules,
    'smart-lock': smartLockRules as CategoryRules,
    'roteador': routerRules as CategoryRules,
    'router': routerRules as CategoryRules,

    // Equipamentos
    'impressora': printerRules as CategoryRules,
    'printer': printerRules as CategoryRules,
    'pneu': tireRules as CategoryRules,
    'tire': tireRules as CategoryRules,
    'bateria-carro': carBatteryRules as CategoryRules,
    'car-battery': carBatteryRules as CategoryRules,
    'lavadora-pressao': pressureWasherRules as CategoryRules,
    'pressure-washer': pressureWasherRules as CategoryRules,
    'furadeira': drillRules as CategoryRules,
    'drill': drillRules as CategoryRules,
};

/**
 * Get rules for a category by slug.
 */
export function getRulesForCategory(categorySlug: string): CategoryRules | null {
    const slug = categorySlug.toLowerCase().trim();
    return RULES_REGISTRY[slug] || null;
}

// ============================================
// USE SCORING HOOK
// ============================================

export interface UseScoringOptions {
    /** Initial context ID to use */
    initialContext?: string;
    /** Enable debug logging */
    debug?: boolean;
    /** Base score to start calculations from (default: 10.0) */
    baseScore?: number;
}

export interface UseScoringReturn {
    /** Current scoring result */
    result: ScoringResult | null;
    /** Previous result (for animations) */
    previousResult: ScoringResult | null;
    /** Currently selected context ID */
    selectedContext: string | null;
    /** Available contexts for this category */
    availableContexts: ScoringContext[];
    /** Change the current context */
    setContext: (contextId: string) => void;
    /** Whether rules are loaded for this category */
    hasRules: boolean;
    /** Category rules (for direct access) */
    categoryRules: CategoryRules | null;
    /** Penalties from current result */
    penalties: ScoringResult['reasons'];
    /** Bonuses from current result */
    bonuses: ScoringResult['reasons'];
    /** Current score (convenience) */
    score: number;
    /** Score delta from base (convenience) */
    delta: number;
}

/**
 * Hook to connect UI to the Contextual Scoring system.
 * 
 * @param facts - Product facts (specs)
 * @param categorySlug - Category identifier (matches RULES_REGISTRY)
 * @param options - Optional configuration
 * 
 * @example
 * const { score, penalties, bonuses, setContext, availableContexts } = useScoring(
 *   product.scoring_facts,
 *   'ar-condicionado'
 * );
 */
export function useScoring(
    facts: ProductFacts | undefined | null,
    categorySlug: string | undefined | null,
    options: UseScoringOptions = {}
): UseScoringReturn {
    const { initialContext, debug = false, baseScore = 10.0 } = options;

    // Get rules for the category
    const categoryRules = useMemo(() => {
        if (!categorySlug) return null;
        return getRulesForCategory(categorySlug);
    }, [categorySlug]);

    // Get available contexts
    const availableContexts = useMemo(() => {
        if (!categoryRules) return [];
        return getAvailableContexts(categoryRules);
    }, [categoryRules]);

    // State for selected context - starts as null (user must choose)
    const [selectedContext, setSelectedContext] = useState<string | null>(
        initialContext || null
    );

    // Keep previous result for animations
    const [previousResult, setPreviousResult] = useState<ScoringResult | null>(null);

    // NOTE: Removed auto-selection of first context
    // User must explicitly choose their context for meaningful scoring

    // Calculate score when facts or context change
    const result = useMemo<ScoringResult | null>(() => {
        if (!facts || !categoryRules || !selectedContext) {
            return null;
        }

        const newResult = calculateContextualScore(
            facts,
            selectedContext,
            categoryRules,
            { debug, baseScore }
        );

        return newResult;
    }, [facts, categoryRules, selectedContext, debug]);

    // Handle context change
    const setContext = useCallback((contextId: string) => {
        // Save current result as previous (for animation)
        if (result) {
            setPreviousResult(result);
        }
        setSelectedContext(contextId);
    }, [result]);

    // Extract penalties and bonuses
    const penalties = useMemo(() => {
        return result?.reasons.filter(r => r.type === 'penalty') ?? [];
    }, [result]);

    const bonuses = useMemo(() => {
        return result?.reasons.filter(r => r.type === 'bonus') ?? [];
    }, [result]);

    return {
        result,
        previousResult,
        selectedContext,
        availableContexts,
        setContext,
        hasRules: categoryRules !== null,
        categoryRules,
        penalties,
        bonuses,
        score: result?.finalScore ?? 10.0,
        delta: result?.delta ?? 0,
    };
}

export default useScoring;
