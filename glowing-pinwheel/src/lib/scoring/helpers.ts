/**
 * Scoring Helpers
 * Simple pure functions for category scoring modules
 */

/**
 * Clamps a number between min and max
 */
export function clamp(n: number, min = 0, max = 10): number {
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
}

/**
 * Maps an enum value to a score using a lookup table
 */
export function scoreEnum<T extends string>(
    value: T | undefined,
    map: Record<T, number>,
    fallback: number
): number {
    if (value === undefined || !(value in map)) return fallback;
    return map[value];
}

/**
 * Scores a numeric value using bands (ranges)
 * Bands are checked in order; first match wins
 */
export type ScoreBand = {
    min?: number;
    max?: number;
    score: number;
};

export function scoreBands(n: number | undefined, bands: ScoreBand[], fallback: number): number {
    if (n === undefined || Number.isNaN(n)) return fallback;

    for (const band of bands) {
        const aboveMin = band.min === undefined || n >= band.min;
        const belowMax = band.max === undefined || n <= band.max;
        if (aboveMin && belowMax) return band.score;
    }
    return fallback;
}

/**
 * Adds delta to score if condition is true
 */
export function addIf(score: number, condition: boolean | undefined, delta: number): number {
    return condition ? score + delta : score;
}
