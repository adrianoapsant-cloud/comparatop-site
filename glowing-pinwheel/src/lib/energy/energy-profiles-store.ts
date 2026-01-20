/**
 * Energy Profiles Store
 * 
 * Abstraction layer for SKU-specific energy consumption data.
 * Uses Supabase when available, falls back to local JSON file.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

export type EnergySource = 'manual' | 'inmetro' | 'fabricante' | 'medicao' | 'estimado';
export type StorageType = 'supabase' | 'local' | 'none';

export interface EnergyProfile {
    sku: string;
    categorySlug?: string;
    kwhMonth: number;
    source: EnergySource;
    notes?: string;
    updatedAt: Date;
}

export interface EnergyProfileResult extends EnergyProfile {
    storage: StorageType;
}

export interface UpsertEnergyProfileInput {
    sku: string;
    categorySlug?: string;
    kwhMonth: number;
    source: EnergySource;
    notes?: string;
}

// Database row type (for Supabase)
interface EnergyProfileRow {
    sku: string;
    category_slug: string | null;
    kwh_month: number;
    source: string;
    notes: string | null;
    updated_at: string;
}

// ============================================
// LOCAL STORAGE PATH
// ============================================

const LOCAL_PROFILES_PATH = path.join(process.cwd(), '.immunity', 'energy_profiles.json');

function ensureLocalDir(): void {
    const dir = path.dirname(LOCAL_PROFILES_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function readLocalProfiles(): Record<string, EnergyProfile> {
    try {
        if (fs.existsSync(LOCAL_PROFILES_PATH)) {
            const content = fs.readFileSync(LOCAL_PROFILES_PATH, 'utf-8');
            const parsed = JSON.parse(content);
            // Convert dates
            for (const key of Object.keys(parsed)) {
                if (parsed[key].updatedAt) {
                    parsed[key].updatedAt = new Date(parsed[key].updatedAt);
                }
            }
            return parsed;
        }
    } catch (e) {
        console.warn('[energy-profiles] Failed to read local profiles:', e);
    }
    return {};
}

function writeLocalProfiles(profiles: Record<string, EnergyProfile>): void {
    try {
        ensureLocalDir();
        fs.writeFileSync(LOCAL_PROFILES_PATH, JSON.stringify(profiles, null, 2), 'utf-8');
    } catch (e) {
        console.error('[energy-profiles] Failed to write local profiles:', e);
    }
}

// ============================================
// SUPABASE CLIENT (lazy)
// ============================================

let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseChecked = false;
let supabaseAvailable = false;

function getSupabaseClient(): ReturnType<typeof createClient> | null {
    if (supabaseChecked) {
        return supabaseAvailable ? supabaseClient : null;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    supabaseChecked = true;

    if (url && key) {
        try {
            supabaseClient = createClient(url, key);
            supabaseAvailable = true;
            return supabaseClient;
        } catch (e) {
            console.warn('[energy-profiles] Failed to create Supabase client:', e);
        }
    }

    return null;
}

// ============================================
// STORE FUNCTIONS
// ============================================

/**
 * Get energy profile by SKU
 * Returns the profile with storage indicator (supabase, local, or none)
 */
export async function getEnergyProfileBySku(sku: string): Promise<EnergyProfileResult | null> {
    const client = getSupabaseClient();

    // Try Supabase first
    if (client) {
        try {
            const { data, error } = await client
                .from('energy_profiles')
                .select('*')
                .eq('sku', sku)
                .single();

            if (!error && data) {
                const row = data as unknown as EnergyProfileRow;
                return {
                    sku: row.sku,
                    categorySlug: row.category_slug || undefined,
                    kwhMonth: Number(row.kwh_month),
                    source: row.source as EnergySource,
                    notes: row.notes || undefined,
                    updatedAt: new Date(row.updated_at),
                    storage: 'supabase'
                };
            }
        } catch (e) {
            console.warn('[energy-profiles] Supabase query failed, falling back to local:', e);
        }
    }

    // Fallback to local
    const localProfiles = readLocalProfiles();
    const localProfile = localProfiles[sku];

    if (localProfile) {
        return {
            ...localProfile,
            storage: 'local'
        };
    }

    return null;
}

/**
 * Upsert energy profile (create or update)
 * Writes to Supabase if available, otherwise to local JSON
 */
export async function upsertEnergyProfile(input: UpsertEnergyProfileInput): Promise<{ success: boolean; storage: StorageType; error?: string }> {
    const client = getSupabaseClient();
    const now = new Date();

    // Try Supabase first
    if (client) {
        try {
            const upsertData = {
                sku: input.sku,
                category_slug: input.categorySlug || null,
                kwh_month: input.kwhMonth,
                source: input.source,
                notes: input.notes || null,
                updated_at: now.toISOString()
            } as unknown as never;
            const { error } = await client
                .from('energy_profiles')
                .upsert(upsertData, {
                    onConflict: 'sku'
                });

            if (!error) {
                return { success: true, storage: 'supabase' };
            }

            console.warn('[energy-profiles] Supabase upsert failed:', error.message);
        } catch (e) {
            console.warn('[energy-profiles] Supabase upsert error:', e);
        }
    }

    // Fallback to local
    try {
        const localProfiles = readLocalProfiles();
        localProfiles[input.sku] = {
            sku: input.sku,
            categorySlug: input.categorySlug,
            kwhMonth: input.kwhMonth,
            source: input.source,
            notes: input.notes,
            updatedAt: now
        };
        writeLocalProfiles(localProfiles);
        return { success: true, storage: 'local' };
    } catch (e) {
        return { success: false, storage: 'none', error: String(e) };
    }
}

/**
 * List energy profiles, optionally filtered by category
 */
export async function listEnergyProfiles(options?: { categorySlug?: string }): Promise<EnergyProfileResult[]> {
    const client = getSupabaseClient();
    const results: EnergyProfileResult[] = [];

    // Try Supabase first
    if (client) {
        try {
            let query = client.from('energy_profiles').select('*');

            if (options?.categorySlug) {
                query = query.eq('category_slug', options.categorySlug);
            }

            const { data, error } = await query.order('sku');

            if (!error && data) {
                const rows = data as unknown as EnergyProfileRow[];
                for (const row of rows) {
                    results.push({
                        sku: row.sku,
                        categorySlug: row.category_slug || undefined,
                        kwhMonth: Number(row.kwh_month),
                        source: row.source as EnergySource,
                        notes: row.notes || undefined,
                        updatedAt: new Date(row.updated_at),
                        storage: 'supabase'
                    });
                }
                return results;
            }
        } catch (e) {
            console.warn('[energy-profiles] Supabase list failed, falling back to local:', e);
        }
    }

    // Fallback to local
    const localProfiles = readLocalProfiles();

    for (const profile of Object.values(localProfiles)) {
        if (!options?.categorySlug || profile.categorySlug === options.categorySlug) {
            results.push({
                ...profile,
                storage: 'local'
            });
        }
    }

    return results.sort((a, b) => a.sku.localeCompare(b.sku));
}

/**
 * Check if a SKU has a real (non-estimated) energy profile
 */
export async function hasRealEnergyProfile(sku: string): Promise<boolean> {
    const profile = await getEnergyProfileBySku(sku);
    return profile !== null && profile.source !== 'estimado';
}

/**
 * Get storage mode currently in use
 */
export function getStorageMode(): StorageType {
    const client = getSupabaseClient();
    if (client) return 'supabase';

    // Check if local file exists
    if (fs.existsSync(LOCAL_PROFILES_PATH)) return 'local';

    return 'none';
}
