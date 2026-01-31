/**
 * Robot Vacuum Tags
 * Derives boolean tags from structured specs for chips/badges
 */
import type { RobotVacuumSpecs } from './spec.schema';

/**
 * Tags derived from robot vacuum specs
 * Used for filter chips and profile badges
 */
export interface RobotVacuumTags {
    // Navigation
    hasLidar: boolean;
    hasVslam: boolean;
    hasSmartNav: boolean; // lidar or vslam

    // Mopping
    trueMopping: boolean; // vibrating or rotating
    hasRotatingMop: boolean;
    hasMopLift: boolean;

    // Physical
    lowProfile: boolean; // height <= 8.5cm
    ultraLowProfile: boolean; // height <= 7.5cm

    // Dock
    allInOneDock: boolean;
    autoEmptyDock: boolean;
    autoWashDock: boolean;

    // Pets
    goodForPets: boolean; // rubber or anti-tangle brush

    // AI/Detection
    advancedAvoidance: boolean; // 3d-structured or ai-camera
    hasAiCamera: boolean;

    // Performance
    quiet: boolean; // noiseDb <= 60
    longRuntime: boolean; // runtimeMinutes >= 150
    hasRechargeResume: boolean;

    // App/Smart
    hasGoodApp: boolean; // appTier good or excellent

    // Maintenance
    goodPartsBrazil: boolean; // partsAvailabilityBr good or abundant
}

/**
 * Derives tags from robot vacuum specs
 * Deterministic: same specs always produce same tags
 */
export function deriveRobotVacuumTags(specs: RobotVacuumSpecs): RobotVacuumTags {
    return {
        // Navigation
        hasLidar: specs.navigationType === 'lidar',
        hasVslam: specs.navigationType === 'vslam',
        hasSmartNav: specs.navigationType === 'lidar' || specs.navigationType === 'vslam',

        // Mopping
        trueMopping: specs.mopType === 'vibrating' || specs.mopType === 'rotating',
        hasRotatingMop: specs.mopType === 'rotating',
        hasMopLift: specs.mopLift === true,

        // Physical
        lowProfile: specs.heightCm <= 8.5,
        ultraLowProfile: specs.heightCm <= 7.5,

        // Dock
        allInOneDock: specs.dockType === 'all-in-one',
        autoEmptyDock: specs.dockType === 'auto-empty' || specs.dockType === 'all-in-one',
        autoWashDock: specs.dockType === 'auto-wash' || specs.dockType === 'all-in-one',

        // Pets
        goodForPets: specs.brushType === 'rubber' || specs.brushType === 'anti-tangle',

        // AI/Detection
        advancedAvoidance: specs.obstacleDetection === '3d-structured' || specs.obstacleDetection === 'ai-camera',
        hasAiCamera: specs.obstacleDetection === 'ai-camera',

        // Performance
        quiet: specs.noiseDb !== undefined && specs.noiseDb <= 60,
        longRuntime: specs.runtimeMinutes !== undefined && specs.runtimeMinutes >= 150,
        hasRechargeResume: specs.rechargeResume === true,

        // App/Smart
        hasGoodApp: specs.appTier === 'good' || specs.appTier === 'excellent',

        // Maintenance
        goodPartsBrazil: specs.partsAvailabilityBr === 'good' || specs.partsAvailabilityBr === 'abundant',
    };
}
