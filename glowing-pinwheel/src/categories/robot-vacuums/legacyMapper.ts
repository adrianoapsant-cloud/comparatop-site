/**
 * Robot Vacuum Legacy Mapper
 * Extracts structured specs from legacy product data
 * 
 * Used for:
 * 1. Runtime inference (uiAdapters.ts)
 * 2. Migration script (migrate-robot-vacuum-specs.ts)
 */
import type { RobotVacuumSpecs } from './spec.schema';
import { RobotVacuumSpecSchema } from './spec.schema';

// ============================================
// INFERENCE RESULT TYPE
// ============================================

export interface InferenceResult {
    /** Partially inferred specs (may be incomplete) */
    specsPartial: Partial<RobotVacuumSpecs>;
    /** Keys that could not be inferred */
    missingKeys: string[];
    /** Number of keys successfully inferred */
    inferredCount: number;
    /** Which product fields were used as sources */
    sourcesUsed: string[];
}

// ============================================
// DEFAULTS (conservative fallbacks)
// ============================================

export const FALLBACK_SPECS: RobotVacuumSpecs = {
    navigationType: 'gyroscope',
    mopType: 'static',
    brushType: 'bristle',
    dockType: 'basic',
    obstacleDetection: 'bump-only',
    heightCm: 9.5,
};

// Required fields that MUST be present
const REQUIRED_FIELDS: (keyof RobotVacuumSpecs)[] = [
    'navigationType',
    'mopType',
    'brushType',
    'dockType',
    'obstacleDetection',
    'heightCm',
];

// ============================================
// LEGACY PRODUCT TYPE
// ============================================

export type LegacyProduct = {
    id?: string;
    specs?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
    technicalSpecs?: Record<string, unknown>;
    productDimensions?: { height?: number };
    description?: string;
    name?: string;
};

// ============================================
// HELPER: Safe string extraction
// ============================================

function safeString(...sources: unknown[]): string {
    for (const source of sources) {
        if (typeof source === 'string' && source.trim()) {
            return source.toLowerCase().trim();
        }
    }
    return '';
}

function safeNumber(...sources: unknown[]): number | undefined {
    for (const source of sources) {
        if (typeof source === 'number' && !isNaN(source) && source > 0) {
            return source;
        }
        if (typeof source === 'string') {
            const parsed = parseFloat(source);
            if (!isNaN(parsed) && parsed > 0) return parsed;
        }
    }
    return undefined;
}

// ============================================
// INFERENCE FUNCTIONS
// ============================================

function inferNavigationType(p: LegacyProduct): RobotVacuumSpecs['navigationType'] | undefined {
    const sources = [
        p.attributes?.navigationType,
        p.technicalSpecs?.navigation,
        p.technicalSpecs?.navigationType,
        p.specs?.navigationType,
    ];
    const str = safeString(...sources);

    if (str.includes('lidar')) return 'lidar';
    if (str.includes('vslam') || str.includes('câmera') || str.includes('camera')) return 'vslam';
    if (str.includes('giroscóp') || str.includes('gyro') || str.includes('giroscop')) return 'gyroscope';
    if (str.includes('aleatória') || str.includes('aleator') || str.includes('random')) return 'random';

    // Check boolean flags
    if (p.technicalSpecs?.lidar === true) return 'lidar';
    if (p.technicalSpecs?.camera === true && p.technicalSpecs?.lidar !== true) return 'vslam';

    return undefined;
}

function inferMopType(p: LegacyProduct): RobotVacuumSpecs['mopType'] | undefined {
    const sources = [
        p.attributes?.mopType,
        p.technicalSpecs?.mopType,
        p.specs?.mopType,
    ];
    const str = safeString(...sources);

    if (str.includes('rotativ') || str.includes('dual mop') || str.includes('rotating')) return 'rotating';
    if (str.includes('vibra') || str.includes('sonic')) return 'vibrating';
    if (str.includes('pano') || str.includes('arrasto') || str.includes('static') || str.includes('microfibra')) return 'static';
    if (str.includes('sem') || str.includes('none') || str === '') {
        // Check if has mop at all
        if (p.attributes?.hasMop === false || p.technicalSpecs?.hasMop === false) return 'none';
    }

    // If hasMop is true but type unknown, assume static
    if (p.attributes?.hasMop === true) return 'static';

    return undefined;
}

function inferBrushType(p: LegacyProduct): RobotVacuumSpecs['brushType'] | undefined {
    const sources = [
        p.attributes?.brushType,
        p.technicalSpecs?.brushType,
        p.specs?.brushType,
    ];
    const str = safeString(...sources);

    // Exact enum value matches first
    if (str === 'anti-tangle') return 'anti-tangle';
    if (str === 'rubber') return 'rubber';
    if (str === 'bristle') return 'bristle';
    if (str === 'suction-only') return 'suction-only';

    // Keyword-based detection
    if (str.includes('suction-only') || str.includes('sucção direta') || str.includes('sem escova')) return 'suction-only';
    if (str.includes('anti') || str.includes('tangle') || str.includes('emaranhamento') || str.includes('zero-tangle')) return 'anti-tangle';
    if (str.includes('rubber') || str.includes('borracha') || str.includes('silicone')) return 'rubber';
    if (str.includes('single') || str.includes('escova') || str.includes('bristle')) return 'bristle';

    return undefined;
}

function inferDockType(p: LegacyProduct): RobotVacuumSpecs['dockType'] | undefined {
    const sources = [
        p.attributes?.dockType,
        p.technicalSpecs?.dockType,
        p.specs?.dockType,
    ];
    const str = safeString(...sources);

    // Exact enum value matches first
    if (str === 'all-in-one') return 'all-in-one';
    if (str === 'auto-wash') return 'auto-wash';
    if (str === 'auto-empty') return 'auto-empty';
    if (str === 'basic') return 'basic';

    // Keyword-based detection
    if (str.includes('all-in-one') || str.includes('all in one') || str.includes('completo') || str.includes('tudo em um')) return 'all-in-one';
    if (str.includes('lava') || str.includes('wash') || str.includes('auto mop')) return 'auto-wash';
    if (str.includes('autoesvaz') || str.includes('auto-esvaz') || str.includes('auto-empty') || str.includes('esvaziamento')) return 'auto-empty';
    if (str.includes('sem dock') || str.includes('manual') || str === '') return 'basic';

    // Check boolean flags
    const hasAutoEmpty = p.attributes?.hasAutoEmpty || p.technicalSpecs?.autoEmpty;
    const hasAutoMopWash = p.technicalSpecs?.autoMopWash;

    if (hasAutoEmpty && hasAutoMopWash) return 'all-in-one';
    if (hasAutoMopWash) return 'auto-wash';
    if (hasAutoEmpty) return 'auto-empty';

    return undefined;
}

function inferObstacleDetection(p: LegacyProduct): RobotVacuumSpecs['obstacleDetection'] | undefined {
    const sources = [
        p.technicalSpecs?.obstacleDetection,
        p.specs?.obstacleDetection,
    ];
    const str = safeString(...sources);

    // Exact enum value matches first
    if (str === 'ai-camera') return 'ai-camera';
    if (str === '3d-structured') return '3d-structured';
    if (str === 'infrared') return 'infrared';
    if (str === 'bump-only') return 'bump-only';

    // Keyword-based detection
    if (str.includes('ai') || str.includes('ia') || str.includes('câmera') || str.includes('camera') || str.includes('visão')) return 'ai-camera';
    if (str.includes('3d') || str.includes('estruturad') || str.includes('structured')) return '3d-structured';
    if (str.includes('infravermelho') || str.includes('infra') || str.includes('infrared')) return 'infrared';
    if (str.includes('impacto') || str.includes('bump') || str.includes('sensor')) return 'bump-only';

    return undefined;
}

function inferHeightCm(p: LegacyProduct): number | undefined {
    const height = safeNumber(
        p.productDimensions?.height,
        p.technicalSpecs?.height,
        p.specs?.height,
        p.specs?.Height,
    );

    if (height !== undefined) {
        // Handle if in mm instead of cm
        return height > 50 ? height / 10 : height;
    }

    return undefined;
}

function inferNoiseDb(p: LegacyProduct): number | undefined {
    return safeNumber(
        p.technicalSpecs?.noiseLevel,
        p.specs?.noiseLevel,
        p.specs?.noiseDb,
    );
}

function inferRuntimeMinutes(p: LegacyProduct): number | undefined {
    return safeNumber(
        p.attributes?.runtimeMinutes,
        p.technicalSpecs?.runtimeMinutes,
    );
}

function inferBatteryMah(p: LegacyProduct): number | undefined {
    return safeNumber(
        p.attributes?.batteryMah,
        p.technicalSpecs?.batteryCapacity,
        p.specs?.batteryCapacity,
    );
}

function inferRechargeResume(p: LegacyProduct): boolean | undefined {
    const val = p.attributes?.hasRechargeResume ?? p.technicalSpecs?.rechargeResume;
    if (typeof val === 'boolean') return val;
    return undefined;
}

function inferMopLift(p: LegacyProduct): boolean | undefined {
    const val = p.attributes?.hasMopLift ?? p.technicalSpecs?.mopLift;
    if (typeof val === 'boolean') return val;
    return undefined;
}

function inferMapFeatures(p: LegacyProduct): RobotVacuumSpecs['mapFeatures'] | undefined {
    const hasNoGoZones = p.attributes?.hasNoGoZones ?? p.technicalSpecs?.noGoZones;
    const hasMultiFloor = p.attributes?.multiFloorMapping ?? p.technicalSpecs?.multiFloorMapping;
    const hasRoomNaming = p.technicalSpecs?.roomNaming;

    if (hasNoGoZones !== undefined || hasMultiFloor !== undefined || hasRoomNaming !== undefined) {
        return {
            noGoZones: typeof hasNoGoZones === 'boolean' ? hasNoGoZones : undefined,
            multiFloor: typeof hasMultiFloor === 'boolean' ? hasMultiFloor : undefined,
            roomNaming: typeof hasRoomNaming === 'boolean' ? hasRoomNaming : undefined,
        };
    }

    return undefined;
}

// ============================================
// MAIN INFERENCE FUNCTION
// ============================================

/**
 * Infer structured specs from legacy product data
 */
export function inferRobotVacuumSpecsFromLegacy(product: LegacyProduct): InferenceResult {
    const specsPartial: Partial<RobotVacuumSpecs> = {};
    const sourcesUsed: string[] = [];
    const missingKeys: string[] = [];

    // Core required fields
    const navType = inferNavigationType(product);
    if (navType) {
        specsPartial.navigationType = navType;
        sourcesUsed.push('navigationType');
    } else {
        missingKeys.push('navigationType');
    }

    const mopType = inferMopType(product);
    if (mopType) {
        specsPartial.mopType = mopType;
        sourcesUsed.push('mopType');
    } else {
        missingKeys.push('mopType');
    }

    const brushType = inferBrushType(product);
    if (brushType) {
        specsPartial.brushType = brushType;
        sourcesUsed.push('brushType');
    } else {
        missingKeys.push('brushType');
    }

    const dockType = inferDockType(product);
    if (dockType) {
        specsPartial.dockType = dockType;
        sourcesUsed.push('dockType');
    } else {
        missingKeys.push('dockType');
    }

    const obstacleDetection = inferObstacleDetection(product);
    if (obstacleDetection) {
        specsPartial.obstacleDetection = obstacleDetection;
        sourcesUsed.push('obstacleDetection');
    } else {
        missingKeys.push('obstacleDetection');
    }

    const heightCm = inferHeightCm(product);
    if (heightCm !== undefined) {
        specsPartial.heightCm = heightCm;
        sourcesUsed.push('heightCm');
    } else {
        missingKeys.push('heightCm');
    }

    // Optional fields
    const noiseDb = inferNoiseDb(product);
    if (noiseDb !== undefined) {
        specsPartial.noiseDb = noiseDb;
        sourcesUsed.push('noiseDb');
    }

    const runtimeMinutes = inferRuntimeMinutes(product);
    if (runtimeMinutes !== undefined) {
        specsPartial.runtimeMinutes = runtimeMinutes;
        sourcesUsed.push('runtimeMinutes');
    }

    const batteryMah = inferBatteryMah(product);
    if (batteryMah !== undefined) {
        specsPartial.batteryMah = batteryMah;
        sourcesUsed.push('batteryMah');
    }

    const rechargeResume = inferRechargeResume(product);
    if (rechargeResume !== undefined) {
        specsPartial.rechargeResume = rechargeResume;
        sourcesUsed.push('rechargeResume');
    }

    const mopLift = inferMopLift(product);
    if (mopLift !== undefined) {
        specsPartial.mopLift = mopLift;
        sourcesUsed.push('mopLift');
    }

    const mapFeatures = inferMapFeatures(product);
    if (mapFeatures) {
        specsPartial.mapFeatures = mapFeatures;
        sourcesUsed.push('mapFeatures');
    }

    return {
        specsPartial,
        missingKeys,
        inferredCount: sourcesUsed.length,
        sourcesUsed,
    };
}

// ============================================
// MERGE FUNCTION
// ============================================

export interface MergeResult {
    /** Final merged specs (complete) */
    specs: RobotVacuumSpecs;
    /** Whether Zod validation passed */
    isValid: boolean;
    /** Zod error messages if any */
    errors: string[];
    /** Fields that used fallback defaults */
    usedDefaults: string[];
}

/**
 * Merge inferred specs with defaults and validate with Zod
 */
export function mergeRobotVacuumSpecs(
    existingSpecs: Partial<RobotVacuumSpecs> | undefined,
    inferredPartial: Partial<RobotVacuumSpecs>
): MergeResult {
    const usedDefaults: string[] = [];

    // Start with inferred, overlay existing, fill gaps with defaults
    const merged: RobotVacuumSpecs = {
        ...FALLBACK_SPECS,
        ...inferredPartial,
        ...(existingSpecs || {}),
    };

    // Track which required fields used defaults
    for (const key of REQUIRED_FIELDS) {
        const inExisting = existingSpecs && key in existingSpecs;
        const inInferred = key in inferredPartial;
        if (!inExisting && !inInferred) {
            usedDefaults.push(key);
        }
    }

    // Validate with Zod
    const result = RobotVacuumSpecSchema.safeParse(merged);

    if (result.success) {
        return {
            specs: result.data,
            isValid: true,
            errors: [],
            usedDefaults,
        };
    } else {
        return {
            specs: merged,
            isValid: false,
            errors: result.error.issues.map(e => `${String(e.path.join('.'))}: ${e.message}`),
            usedDefaults,
        };
    }
}

/**
 * Check if product already has valid structured specs
 */
export function hasValidStructuredSpecs(product: LegacyProduct): boolean {
    const specs = product.specs as Partial<RobotVacuumSpecs> | undefined;
    if (!specs) return false;

    // Check if navigationType is a valid enum value (not legacy string)
    const validNavTypes = ['random', 'gyroscope', 'vslam', 'lidar'];
    if (typeof specs.navigationType !== 'string') return false;
    if (!validNavTypes.includes(specs.navigationType)) return false;

    // Check other required enums
    const validMopTypes = ['none', 'static', 'vibrating', 'rotating'];
    if (!specs.mopType || !validMopTypes.includes(specs.mopType)) return false;

    const validBrushTypes = ['bristle', 'rubber', 'anti-tangle'];
    if (!specs.brushType || !validBrushTypes.includes(specs.brushType)) return false;

    const validDockTypes = ['basic', 'auto-empty', 'auto-wash', 'all-in-one'];
    if (!specs.dockType || !validDockTypes.includes(specs.dockType)) return false;

    const validObstacleTypes = ['bump-only', 'infrared', '3d-structured', 'ai-camera'];
    if (!specs.obstacleDetection || !validObstacleTypes.includes(specs.obstacleDetection)) return false;

    if (typeof specs.heightCm !== 'number') return false;

    return true;
}
