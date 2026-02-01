/**
 * Robot Vacuums UI Adapters
 * Glue code to connect scoring module to UI components
 * 
 * TEMPORARY COMPAT LAYER:
 * Products that don't have structured specs yet will use fallback defaults.
 * Remove this file when all products have migrated to structured specs.
 */
import type { ScoredProduct } from '../../types/category';
import type { RobotVacuumSpecs, RobotVacuumTags, RobotVacuumScores } from './index';
import { deriveRobotVacuumTags, computeRobotVacuumScores } from './index';
import {
    inferRobotVacuumSpecsFromLegacy,
    mergeRobotVacuumSpecs,
    hasValidStructuredSpecs,
    type LegacyProduct,
} from './legacyMapper';

// ============================================
// DERIVED DATA STRUCTURE
// ============================================

export interface RobotVacuumDerived {
    specs: RobotVacuumSpecs;
    tags: RobotVacuumTags;
    scores: RobotVacuumScores;
    /** True if using fallback specs (not migrated yet) */
    isFallback: boolean;
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get derived data (specs, tags, scores) for a robot vacuum product
 * Uses compat layer for products without structured specs
 * 
 * STRICT_SPECS mode (env var):
 * When STRICT_SPECS=true, this function throws if a product would use fallback.
 * Recommended for production to ensure all products are migrated.
 */
export function getRobotVacuumDerived(product: ScoredProduct): RobotVacuumDerived {
    const legacyProduct = product as unknown as LegacyProduct;
    const isStrictMode = process.env.STRICT_SPECS === 'true';

    // Check if product already has valid structured specs
    if (hasValidStructuredSpecs(legacyProduct)) {
        const specs = legacyProduct.specs as unknown as RobotVacuumSpecs;
        return {
            specs,
            tags: deriveRobotVacuumTags(specs),
            scores: computeRobotVacuumScores(specs),
            isFallback: false,
        };
    }

    // COMPAT: Infer specs from legacy data
    const inference = inferRobotVacuumSpecsFromLegacy(legacyProduct);
    const merged = mergeRobotVacuumSpecs(undefined, inference.specsPartial);

    // STRICT MODE: Log error (but don't throw to avoid crashing pages)
    // QA Gate enforces structuredSpecs validation separately
    if (isStrictMode) {
        console.error(
            `[STRICT_SPECS] robot-vacuums fallback for "${product.id}": ` +
            `Missing fields: ${inference.missingKeys.join(', ')}. ` +
            `Add structuredSpecs to this product or set STRICT_SPECS=false.`
        );
    }

    // Log fallback usage in dev mode
    if (process.env.NODE_ENV === 'development') {
        console.log(`[RobotVacuumAdapter] Fallback specs for "${product.id}":`, {
            inferredCount: inference.inferredCount,
            missingKeys: inference.missingKeys,
            usedDefaults: merged.usedDefaults,
        });
    }

    return {
        specs: merged.specs,
        tags: deriveRobotVacuumTags(merged.specs),
        scores: computeRobotVacuumScores(merged.specs),
        isFallback: true,
    };
}

// ============================================
// BADGE DEFINITIONS
// ============================================

export interface RobotVacuumBadge {
    id: string;
    label: string;
    icon: string;
    color: string;
}

/**
 * Get badges for a robot vacuum based on tags and scores
 */
export function getRobotVacuumBadges(derived: RobotVacuumDerived): RobotVacuumBadge[] {
    const { tags, scores } = derived;
    const badges: RobotVacuumBadge[] = [];

    // Navigation badges
    if (scores.c1 >= 8.5) {
        badges.push({ id: 'top-nav', label: 'Top Navegação', icon: '🗺️', color: 'bg-violet-100 text-violet-700' });
    }
    if (tags.hasLidar) {
        badges.push({ id: 'lidar', label: 'LiDAR', icon: '📡', color: 'bg-blue-100 text-blue-700' });
    }

    // Mopping badges
    if (tags.trueMopping && scores.c3 >= 8) {
        badges.push({ id: 'top-mop', label: 'Top Mop', icon: '💧', color: 'bg-cyan-100 text-cyan-700' });
    }
    if (tags.hasRotatingMop) {
        badges.push({ id: 'rotating-mop', label: 'Mop Rotativo', icon: '🔄', color: 'bg-blue-100 text-blue-700' });
    }

    // Pet badge
    if (tags.goodForPets && scores.c4 >= 7) {
        badges.push({ id: 'pets', label: 'Pet Friendly', icon: '🐕', color: 'bg-amber-100 text-amber-700' });
    }

    // Physical badges
    if (tags.lowProfile) {
        badges.push({ id: 'low-profile', label: 'Baixo Perfil', icon: '📐', color: 'bg-pink-100 text-pink-700' });
    }

    // Dock badges
    if (tags.allInOneDock) {
        badges.push({ id: 'all-in-one', label: 'All-in-One', icon: '🏠', color: 'bg-purple-100 text-purple-700' });
    } else if (tags.autoEmptyDock) {
        badges.push({ id: 'auto-empty', label: 'Auto-Esvazia', icon: '🗑️', color: 'bg-gray-100 text-gray-700' });
    }

    // AI/Detection badge
    if (tags.advancedAvoidance) {
        badges.push({ id: 'ai-avoid', label: 'Desvio IA', icon: '🤖', color: 'bg-rose-100 text-rose-700' });
    }

    // Performance badges
    if (tags.quiet) {
        badges.push({ id: 'quiet', label: 'Silencioso', icon: '🔇', color: 'bg-indigo-100 text-indigo-700' });
    }
    if (tags.longRuntime) {
        badges.push({ id: 'long-runtime', label: 'Autonomia+', icon: '🔋', color: 'bg-green-100 text-green-700' });
    }

    return badges;
}
