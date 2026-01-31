/**
 * Robot Vacuums Category Module
 * Unified scoring system for robot vacuum products
 */

// Schema
export { RobotVacuumSpecSchema } from './spec.schema';
export type { RobotVacuumSpecs, NavigationType, MopType, BrushType, DockType, ObstacleDetection } from './spec.schema';

// Tags
export { deriveRobotVacuumTags } from './tags';
export type { RobotVacuumTags } from './tags';

// Scoring
export { computeRobotVacuumScores, computeWeightedScore, PARR_BR_WEIGHTS } from './scoring';
export type { RobotVacuumScores } from './scoring';

// UI Adapters (compat layer)
export { getRobotVacuumDerived, getRobotVacuumBadges } from './uiAdapters';
export type { RobotVacuumDerived, RobotVacuumBadge } from './uiAdapters';

// Category module implementation
import { RobotVacuumSpecSchema, type RobotVacuumSpecs } from './spec.schema';
import { deriveRobotVacuumTags, type RobotVacuumTags } from './tags';
import { computeRobotVacuumScores, type RobotVacuumScores } from './scoring';
import { getRobotVacuumDerived } from './uiAdapters';
import type { CategoryModule } from '../categoryModule';

/**
 * Robot Vacuums Category Module
 * Single source of truth for specs, tags, and scores
 */
export const robotVacuumsModule: CategoryModule<RobotVacuumSpecs, RobotVacuumTags, RobotVacuumScores> = {
    categoryId: 'robot-vacuum',
    specSchema: RobotVacuumSpecSchema,
    deriveTags: deriveRobotVacuumTags,
    computeScores: computeRobotVacuumScores,
    // Compat layer that handles legacy products
    getDerived: (product) => {
        const derived = getRobotVacuumDerived(product as Parameters<typeof getRobotVacuumDerived>[0]);
        return {
            specs: derived.specs,
            tags: derived.tags,
            scores: derived.scores,
            isFallback: derived.isFallback,
        };
    },
};

export default robotVacuumsModule;

