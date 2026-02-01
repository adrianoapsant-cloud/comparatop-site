/**
 * Robot Vacuum Specs Schema
 * Structured specification for robot vacuum products
 */
import { z } from 'zod';

// Navigation types
const NavigationType = z.enum(['random', 'gyroscope', 'vslam', 'lidar']);

// Mop types
const MopType = z.enum(['none', 'static', 'vibrating', 'rotating']);

// Brush types
const BrushType = z.enum(['suction-only', 'bristle', 'rubber', 'anti-tangle']);

// Dock types
const DockType = z.enum(['basic', 'auto-empty', 'auto-wash', 'all-in-one']);

// Obstacle detection types
const ObstacleDetection = z.enum(['bump-only', 'infrared', '3d-structured', 'ai-camera']);

// Editorial tiers (optional fields)
const AppTier = z.enum(['poor', 'ok', 'good', 'excellent']);
const PartsAvailabilityBr = z.enum(['none', 'limited', 'good', 'abundant']);
const PickupTier = z.enum(['weak', 'ok', 'good', 'excellent']);
const AvoidanceTier = z.enum(['none', 'basic', 'mid', 'high']);

// Map features (optional)
const MapFeatures = z.object({
    noGoZones: z.boolean().optional(),
    multiFloor: z.boolean().optional(),
    roomNaming: z.boolean().optional(),
}).optional();

/**
 * Robot Vacuum Specs Schema
 */
export const RobotVacuumSpecSchema = z.object({
    // Core hardware specs (required)
    navigationType: NavigationType,
    mopType: MopType,
    brushType: BrushType,
    dockType: DockType,
    obstacleDetection: ObstacleDetection,
    heightCm: z.number(),

    // Optional numeric specs
    noiseDb: z.number().optional(),
    batteryMah: z.number().optional(),
    runtimeMinutes: z.number().optional(),

    // Optional editorial tiers
    appTier: AppTier.optional(),
    partsAvailabilityBr: PartsAvailabilityBr.optional(),
    pickupTier: PickupTier.optional(),
    avoidanceTier: AvoidanceTier.optional(),

    // Optional boolean features
    rechargeResume: z.boolean().optional(),
    mopLift: z.boolean().optional(),

    // Optional map features
    mapFeatures: MapFeatures,
});

export type RobotVacuumSpecs = z.infer<typeof RobotVacuumSpecSchema>;

// Re-export enum types for convenience
export type NavigationType = z.infer<typeof NavigationType>;
export type MopType = z.infer<typeof MopType>;
export type BrushType = z.infer<typeof BrushType>;
export type DockType = z.infer<typeof DockType>;
export type ObstacleDetection = z.infer<typeof ObstacleDetection>;
export type AppTier = z.infer<typeof AppTier>;
export type PartsAvailabilityBr = z.infer<typeof PartsAvailabilityBr>;
