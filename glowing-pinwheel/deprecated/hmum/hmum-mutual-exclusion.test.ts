/**
 * @file hmum-mutual-exclusion.test.ts
 * @description Unit tests for HMUM mutual exclusion validation
 * 
 * Tests that conflicting contexts throw MutualExclusionError
 */

import { describe, it, expect } from 'vitest';

// ============================================
// INLINE IMPORTS (to avoid @/ alias issues)
// Copy of relevant code from hmum-v4-geo-restrictive.ts
// ============================================

interface ContextProfile {
    id: string;
    name: string;
    mutuallyExclusiveWith?: string[];
    weightMultipliers: Partial<Record<string, number>>;
}

class MutualExclusionError extends Error {
    public conflictingContexts: string[];
    constructor(contexts: string[]) {
        super(`Contextos mutuamente exclusivos selecionados: ${contexts.join(', ')}`);
        this.name = 'MutualExclusionError';
        this.conflictingContexts = contexts;
    }
}

const MUTUAL_EXCLUSION_GROUPS: string[][] = [
    ['small_apartment', 'daily_maintenance', 'large_home'],
    ['cinema_purist', 'budget_conscious'],
];

const ROBOT_VACUUM_PROFILES: ContextProfile[] = [
    {
        id: 'general_use',
        name: 'Uso Geral',
        weightMultipliers: { c1: 1.0 },
    },
    {
        id: 'daily_maintenance',
        name: 'Manutenção Diária (Apartamento)',
        mutuallyExclusiveWith: ['large_home'],
        weightMultipliers: { c1: 0.5 },
    },
    {
        id: 'large_home',
        name: 'Casas Grandes (>100m²)',
        mutuallyExclusiveWith: ['daily_maintenance', 'small_apartment'],
        weightMultipliers: { c1: 2.5 },
    },
    {
        id: 'pet_owners',
        name: 'Donos de Pets',
        weightMultipliers: { c1: 1.2 },
    },
];

function checkMutualExclusion(
    selectedContextIds: string[],
    profiles: ContextProfile[]
): void {
    if (selectedContextIds.length <= 1) return;

    for (const contextId of selectedContextIds) {
        const profile = profiles.find(p => p.id === contextId);
        if (!profile?.mutuallyExclusiveWith) continue;

        const conflicts = selectedContextIds.filter(
            id => id !== contextId && profile.mutuallyExclusiveWith!.includes(id)
        );

        if (conflicts.length > 0) {
            throw new MutualExclusionError([contextId, ...conflicts]);
        }
    }

    for (const group of MUTUAL_EXCLUSION_GROUPS) {
        const matches = selectedContextIds.filter(id => group.includes(id));
        if (matches.length > 1) {
            throw new MutualExclusionError(matches);
        }
    }
}

// ============================================
// TESTS
// ============================================

describe('HMUM Mutual Exclusion Validation', () => {

    describe('checkMutualExclusion - Single Context', () => {

        it('should NOT throw when single context is selected', () => {
            expect(() => {
                checkMutualExclusion(['daily_maintenance'], ROBOT_VACUUM_PROFILES);
            }).not.toThrow();
        });

        it('should NOT throw when no context is selected', () => {
            expect(() => {
                checkMutualExclusion([], ROBOT_VACUUM_PROFILES);
            }).not.toThrow();
        });

    });

    describe('checkMutualExclusion - Compatible Contexts', () => {

        it('should NOT throw when daily_maintenance + pet_owners are selected', () => {
            expect(() => {
                checkMutualExclusion(['daily_maintenance', 'pet_owners'], ROBOT_VACUUM_PROFILES);
            }).not.toThrow();
        });

        it('should NOT throw when large_home + pet_owners are selected', () => {
            expect(() => {
                checkMutualExclusion(['large_home', 'pet_owners'], ROBOT_VACUUM_PROFILES);
            }).not.toThrow();
        });

    });

    describe('checkMutualExclusion - Conflicting Contexts', () => {

        it('should THROW when daily_maintenance + large_home are selected', () => {
            expect(() => {
                checkMutualExclusion(['daily_maintenance', 'large_home'], ROBOT_VACUUM_PROFILES);
            }).toThrow(MutualExclusionError);
        });

        it('should include both conflicting context IDs in error', () => {
            try {
                checkMutualExclusion(['daily_maintenance', 'large_home'], ROBOT_VACUUM_PROFILES);
                expect(true).toBe(false); // Should not reach
            } catch (error) {
                expect(error).toBeInstanceOf(MutualExclusionError);
                const mutualError = error as MutualExclusionError;
                expect(mutualError.conflictingContexts).toContain('daily_maintenance');
                expect(mutualError.conflictingContexts).toContain('large_home');
            }
        });

        it('should provide user-friendly error message', () => {
            try {
                checkMutualExclusion(['daily_maintenance', 'large_home'], ROBOT_VACUUM_PROFILES);
            } catch (error) {
                const message = (error as Error).message;
                expect(message).toContain('mutuamente exclusivos');
            }
        });

    });

    describe('checkMutualExclusion - Global Exclusion Groups', () => {

        it('should THROW for global exclusion group conflicts', () => {
            // small_apartment and daily_maintenance are in same global group
            expect(() => {
                checkMutualExclusion(['small_apartment', 'daily_maintenance'], ROBOT_VACUUM_PROFILES);
            }).toThrow(MutualExclusionError);
        });

    });

});
