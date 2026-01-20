/**
 * Products Service - Supabase Integration
 * 
 * @description Async service for fetching products from Supabase database.
 * Includes mappers to convert ProductDB (raw DB format) to frontend types.
 * 
 * @see src/types/db.ts - ProductDB interface
 * @see src/types/category.ts - ScoredProduct interface
 * @see src/types/tco.ts - ProductTcoData interface
 */

import { createClient } from '@supabase/supabase-js';
import type { ProductDB, TcoDataJson, ScrsDataJson } from '@/types/db';
import type { ScoredProduct } from '@/types/category';
import type { ProductTcoData, EnergyProfile, ScrsBreakdown, ProductFeatures } from '@/types/tco';

// ============================================
// SUPABASE CLIENT (Lazy initialization)
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Check if Supabase is configured
 */
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Lazy-initialized Supabase client (only created when needed)
 */
let _supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (!isSupabaseConfigured) {
        console.warn('[products.ts] Supabase not configured - missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
        return null;
    }

    if (!_supabaseClient) {
        _supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);
    }

    return _supabaseClient;
}

// ============================================
// CATEGORY SLUG MAPPING
// ============================================

/**
 * Maps URL slugs to database category_slug values
 */
const SLUG_TO_DB_CATEGORY: Record<string, string> = {
    'smart-tvs': 'smart-tvs',
    'geladeiras': 'geladeiras',
    'ar-condicionados': 'ar-condicionado',
    'lavadoras': 'lavadoras',
    'robos-aspiradores': 'robo-aspiradores',
    'robo-aspiradores': 'robo-aspiradores',
    // Also accept category IDs directly
    'tv': 'smart-tvs',
    'fridge': 'geladeiras',
    'air_conditioner': 'ar-condicionado',
    'washer': 'lavadoras',
    'robot-vacuum': 'robo-aspiradores',
};

// ============================================
// MAPPERS: ProductDB → Frontend Types
// ============================================

/**
 * Maps ProductDB (raw Supabase row) to ScoredProduct (frontend format)
 */
export function mapProductDBToScoredProduct(db: ProductDB): ScoredProduct {
    const price = db.price_cents / 100;
    const overallScore = db.rating_technical ?? 7.5;

    return {
        // Base Product fields
        id: db.slug,
        name: db.name,
        brand: db.brand,
        model: db.slug.split('-').slice(1).join('-') || db.slug,
        categoryId: db.category_slug,
        price,
        imageUrl: db.image_url || undefined,

        // Scores per criterion (empty for DB products, filled from specs if needed)
        scores: {},

        // VoC data
        voc: {
            averageRating: db.rating_community ?? 4.0,
            totalReviews: db.community_reviews ?? 0,
            oneLiner: '',
            summary: '',
            pros: [],
            cons: [],
            sources: [],
        },

        // Specs/attributes from JSONB
        attributes: db.specs as Record<string, string | number | boolean | string[]>,

        // Computed scores (required by ScoredProduct)
        computed: {
            qs: overallScore, // Legacy field
            vs: overallScore, // Legacy field  
            gs: overallScore, // Legacy field
            overall: overallScore,
            pricePerPoint: price / Math.max(overallScore, 1),
            breakdown: [], // Would be populated by scoring engine
            profileId: null,
        },
    };
}

/**
 * Maps ProductDB (raw Supabase row) to ProductTcoData (TCO module format)
 */
export function mapProductDBToTcoData(db: ProductDB): ProductTcoData {
    const tcoData = db.tco_data as TcoDataJson;
    const scrsData = db.scrs_data as ScrsDataJson;
    const features = db.features as Record<string, boolean>;

    // Default energy profile if not in database
    const defaultEnergy: EnergyProfile = { eco: 0.5, family: 0.7, gamer: 1.0 };

    const energyKwh: EnergyProfile = tcoData?.energy_kwh ?? defaultEnergy;
    const energyCost: EnergyProfile = tcoData?.energy_cost ?? {
        eco: energyKwh.eco * 0.85,
        family: energyKwh.family * 0.85,
        gamer: energyKwh.gamer * 0.85,
    };

    const scrsBreakdown: ScrsBreakdown = {
        partsAvailability: scrsData?.parts_availability ?? 5,
        serviceNetwork: scrsData?.service_network ?? 5,
        repairability: scrsData?.repairability ?? 5,
        brandReliability: scrsData?.brand_reliability ?? 5,
    };

    const productFeatures: ProductFeatures = {
        gaming: features?.gaming ?? false,
        energyEfficient: features?.energyEfficient ?? features?.energy_efficient ?? false,
        familyFriendly: features?.familyFriendly ?? features?.family_friendly ?? false,
        premiumBrand: features?.premiumBrand ?? features?.premium_brand ?? false,
        smart: features?.smart ?? false,
        extendedWarranty: features?.extendedWarranty ?? features?.extended_warranty ?? false,
    };

    const price = db.price_cents / 100;
    const resalePercentage = tcoData?.resale_percentage ?? 25;

    return {
        id: db.slug,
        name: db.name,
        brand: db.brand,
        categoryId: db.category_slug,
        price,
        energyCost,
        energyKwh,
        maintenanceCost: tcoData?.maintenance_cost ?? Math.round(price * 0.03),
        resaleValue: tcoData?.resale_value ?? Math.round(price * resalePercentage / 100),
        resalePercentage,
        scrsScore: scrsData?.score ?? 5,
        scrsBreakdown,
        lifespanYears: tcoData?.lifespan_years ?? 5,
        features: productFeatures,
        specs: db.specs as Record<string, string | number>,
        editorialScore: db.rating_technical ?? 7.5,
        communityRating: db.rating_community ?? 4.0,
        communityReviews: db.community_reviews ?? 0,
        technicalScore: db.rating_technical ?? 7.5,
    };
}

// ============================================
// SUPABASE QUERIES
// ============================================

/**
 * Fetches products by category from Supabase
 * 
 * @param categorySlug - Category slug (e.g., 'robos-aspiradores') or categoryId (e.g., 'robot-vacuum')
 * @returns Array of ProductTcoData (for TCO components)
 */
export async function getProductsByCategoryFromDB(categorySlug: string): Promise<ProductTcoData[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    // Normalize slug to database format
    const dbCategorySlug = SLUG_TO_DB_CATEGORY[categorySlug] || categorySlug;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', dbCategorySlug)
        .order('rating_technical', { ascending: false, nullsFirst: false });

    if (error) {
        console.error('[products.ts] Supabase query error:', error.message);
        return [];
    }

    if (!data || data.length === 0) {
        console.warn(`[products.ts] No products found for category: ${dbCategorySlug}`);
        return [];
    }

    // Map to ProductTcoData
    return data.map((row: ProductDB) => mapProductDBToTcoData(row));
}

/**
 * Fetches products as ScoredProduct format
 * 
 * @param categorySlug - Category slug
 * @returns Array of ScoredProduct (for product cards)
 */
export async function getScoredProductsByCategoryFromDB(categorySlug: string): Promise<ScoredProduct[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const dbCategorySlug = SLUG_TO_DB_CATEGORY[categorySlug] || categorySlug;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', dbCategorySlug)
        .order('rating_technical', { ascending: false, nullsFirst: false });

    if (error) {
        console.error('[products.ts] Supabase query error:', error.message);
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    return data.map((row: ProductDB) => mapProductDBToScoredProduct(row));
}

/**
 * Fetches a single product by slug
 * 
 * @param slug - Product slug (e.g., 'roborock-q7-l5')
 * @returns ProductTcoData or null
 */
export async function getProductBySlugFromDB(slug: string): Promise<ProductTcoData | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.error('[products.ts] Product not found:', slug);
        return null;
    }

    return mapProductDBToTcoData(data as ProductDB);
}

/**
 * Fetches all products from database
 * 
 * @returns Array of ProductTcoData
 */
export async function getAllProductsFromDB(): Promise<ProductTcoData[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category_slug')
        .order('rating_technical', { ascending: false });

    if (error) {
        console.error('[products.ts] Supabase query error:', error.message);
        return [];
    }

    return (data || []).map((row: ProductDB) => mapProductDBToTcoData(row));
}

/**
 * Gets product count by category
 * 
 * @param categorySlug - Category slug
 * @returns Number of products in category
 */
export async function getProductCountByCategory(categorySlug: string): Promise<number> {
    const supabase = getSupabaseClient();
    if (!supabase) return 0;

    const dbCategorySlug = SLUG_TO_DB_CATEGORY[categorySlug] || categorySlug;

    const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_slug', dbCategorySlug);

    if (error) {
        console.error('[products.ts] Count error:', error.message);
        return 0;
    }

    return count ?? 0;
}

