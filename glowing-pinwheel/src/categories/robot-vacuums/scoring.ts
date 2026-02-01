/**
 * Robot Vacuum Scoring
 * Computes c1-c10 scores from structured specs
 */
import type { RobotVacuumSpecs } from './spec.schema';
import { clamp, scoreEnum, scoreBands, addIf } from '../../lib/scoring/helpers';

/**
 * PARR-BR scores for robot vacuums
 */
export interface RobotVacuumScores {
    c1: number;  // Navegação & Mapeamento (25%)
    c2: number;  // Software & Conectividade (15%)
    c3: number;  // Eficiência de Mop (15%)
    c4: number;  // Engenharia de Escovas - Pets (10%)
    c5: number;  // Restrições Físicas - Altura (10%)
    c6: number;  // Manutenibilidade - Peças BR (8%)
    c7: number;  // Autonomia (5%)
    c8: number;  // Acústica - Ruído (5%)
    c9: number;  // Automação - Docks (5%)
    c10: number; // IA & Detecção de Obstáculos (2%)
}

// ============================================
// SCORING TABLES (simple maps and bands)
// ============================================

const NAVIGATION_SCORES = {
    random: 2.5,
    gyroscope: 5.0,
    vslam: 7.0,
    lidar: 8.8,
} as const;

const APP_TIER_SCORES = {
    poor: 3.5,
    ok: 5.5,
    good: 7.2,
    excellent: 8.8,
} as const;

const MOP_TYPE_SCORES = {
    none: 0.5,
    static: 5.0,
    vibrating: 7.0,
    rotating: 8.6,
} as const;

const BRUSH_TYPE_SCORES = {
    bristle: 5.8,
    rubber: 7.0,
    'anti-tangle': 8.6,
    'suction-only': 6.5,
} as const;

const HEIGHT_BANDS = [
    { max: 7.9, score: 9.8 },
    { min: 8.0, max: 8.9, score: 8.7 },
    { min: 9.0, max: 9.9, score: 7.4 },
    { min: 10.0, max: 10.9, score: 6.2 },
    { min: 11.0, score: 5.0 },
];

const PARTS_AVAILABILITY_SCORES = {
    none: 2.5,
    limited: 5.0,
    good: 7.2,
    abundant: 9.0,
} as const;

const RUNTIME_BANDS = [
    { max: 60, score: 4.0 },
    { min: 61, max: 90, score: 6.0 },
    { min: 91, max: 120, score: 7.2 },
    { min: 121, max: 150, score: 8.2 },
    { min: 151, score: 8.8 },
];

const NOISE_BANDS = [
    { max: 55, score: 9.5 },
    { min: 56, max: 60, score: 8.5 },
    { min: 61, max: 65, score: 7.5 },
    { min: 66, max: 70, score: 6.5 },
    { min: 71, max: 75, score: 5.5 },
    { min: 76, score: 4.8 },
];

const DOCK_TYPE_SCORES = {
    basic: 4.5,
    'auto-empty': 7.0,
    'auto-wash': 8.3,
    'all-in-one': 9.2,
} as const;

const OBSTACLE_DETECTION_SCORES = {
    'bump-only': 3.0,
    infrared: 5.2,
    '3d-structured': 7.2,
    'ai-camera': 8.2,
} as const;

const AVOIDANCE_TIER_ADJUSTMENTS = {
    none: -1.0,
    basic: -0.5,
    mid: 0,
    high: 0.6,
} as const;

// ============================================
// SCORE COMPUTATION FUNCTIONS
// ============================================

function computeC1(specs: RobotVacuumSpecs): number {
    let score: number = NAVIGATION_SCORES[specs.navigationType];
    score = addIf(score, specs.mapFeatures?.noGoZones, 0.3);
    score = addIf(score, specs.mapFeatures?.multiFloor, 0.3);
    score = addIf(score, specs.mapFeatures?.roomNaming, 0.2);
    return score;
}

function computeC2(specs: RobotVacuumSpecs): number {
    return scoreEnum(specs.appTier, APP_TIER_SCORES, 6.0);
}

function computeC3(specs: RobotVacuumSpecs): number {
    let score: number = MOP_TYPE_SCORES[specs.mopType];
    score = addIf(score, specs.mopLift, 0.6);
    score = addIf(score, specs.dockType === 'auto-wash' || specs.dockType === 'all-in-one', 0.4);
    return score;
}

function computeC4(specs: RobotVacuumSpecs): number {
    return BRUSH_TYPE_SCORES[specs.brushType];
}

function computeC5(specs: RobotVacuumSpecs): number {
    return scoreBands(specs.heightCm, HEIGHT_BANDS, 6.0);
}

function computeC6(specs: RobotVacuumSpecs): number {
    return scoreEnum(specs.partsAvailabilityBr, PARTS_AVAILABILITY_SCORES, 6.0);
}

function computeC7(specs: RobotVacuumSpecs): number {
    let score = scoreBands(specs.runtimeMinutes, RUNTIME_BANDS, 6.5);
    score = addIf(score, specs.rechargeResume, 0.7);
    return score;
}

function computeC8(specs: RobotVacuumSpecs): number {
    return scoreBands(specs.noiseDb, NOISE_BANDS, 6.5);
}

function computeC9(specs: RobotVacuumSpecs): number {
    return DOCK_TYPE_SCORES[specs.dockType];
}

function computeC10(specs: RobotVacuumSpecs): number {
    let score: number = OBSTACLE_DETECTION_SCORES[specs.obstacleDetection];
    if (specs.avoidanceTier) {
        score += AVOIDANCE_TIER_ADJUSTMENTS[specs.avoidanceTier];
    }
    return score;
}

/**
 * Computes all PARR-BR scores from structured specs
 * @param specs - Structured specs for the robot vacuum
 * @param overrides - Optional manual overrides for specific criteria
 * @returns Object with c1-c10 scores (0-10, clamped)
 */
export function computeRobotVacuumScores(
    specs: RobotVacuumSpecs,
    overrides?: Partial<RobotVacuumScores>
): RobotVacuumScores {
    const computed: RobotVacuumScores = {
        c1: clamp(computeC1(specs)),
        c2: clamp(computeC2(specs)),
        c3: clamp(computeC3(specs)),
        c4: clamp(computeC4(specs)),
        c5: clamp(computeC5(specs)),
        c6: clamp(computeC6(specs)),
        c7: clamp(computeC7(specs)),
        c8: clamp(computeC8(specs)),
        c9: clamp(computeC9(specs)),
        c10: clamp(computeC10(specs)),
    };

    // Apply overrides if provided
    if (overrides) {
        for (const key of Object.keys(overrides) as (keyof RobotVacuumScores)[]) {
            if (overrides[key] !== undefined) {
                computed[key] = clamp(overrides[key]!);
            }
        }
    }

    return computed;
}

/**
 * PARR-BR criteria weights for robot vacuums
 */
export const PARR_BR_WEIGHTS: Record<keyof RobotVacuumScores, number> = {
    c1: 0.25,  // 25%
    c2: 0.15,  // 15%
    c3: 0.15,  // 15%
    c4: 0.10,  // 10%
    c5: 0.10,  // 10%
    c6: 0.08,  // 8%
    c7: 0.05,  // 5%
    c8: 0.05,  // 5%
    c9: 0.05,  // 5%
    c10: 0.02, // 2%
};

/**
 * Computes weighted average score from individual criteria
 */
export function computeWeightedScore(scores: RobotVacuumScores): number {
    let total = 0;
    for (const key of Object.keys(PARR_BR_WEIGHTS) as (keyof RobotVacuumScores)[]) {
        total += scores[key] * PARR_BR_WEIGHTS[key];
    }
    return clamp(total);
}
