/**
 * Seed Products Script
 * 
 * Populates the Supabase products table from mock data.
 * Run: npx tsx scripts/seed-products.ts
 * 
 * WARNING: This will delete all existing products before seeding!
 */

import { createClient } from '@supabase/supabase-js';
import { CURATED_PRODUCTS, generateMockProducts, type TcoCategory } from '../src/lib/tco/mock-data';
import type { ProductTcoData } from '../src/types/tco';

// ============================================
// SUPABASE CLIENT
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ProductInsert {
    slug: string;
    name: string;
    brand: string;
    category_slug: string;
    price_cents: number;
    image_url: string | null;
    rating_community: number | null;
    community_reviews: number | null;
    rating_technical: number | null;
    specs: Record<string, unknown>;
    tco_data: Record<string, unknown>;
    features: Record<string, boolean>;
    scrs_data: Record<string, unknown>;
}

// ============================================
// CONVERTER: Mock → DB Format
// ============================================

function convertMockToDbFormat(product: ProductTcoData): ProductInsert {
    return {
        slug: product.id,
        name: product.name,
        brand: product.brand,
        category_slug: product.categoryId,
        price_cents: Math.round(product.price * 100),
        image_url: null, // Will be added later via admin
        rating_community: product.communityRating ?? null,
        community_reviews: product.communityReviews ?? null,
        rating_technical: product.technicalScore ?? product.editorialScore ?? null,
        specs: product.specs || {},
        tco_data: {
            energy_kwh: product.energyKwh,
            energy_cost: product.energyCost,
            maintenance_cost: product.maintenanceCost,
            resale_value: product.resaleValue,
            resale_percentage: product.resalePercentage,
            lifespan_years: product.lifespanYears,
        },
        features: (product.features || {}) as unknown as Record<string, boolean>,
        scrs_data: {
            score: product.scrsScore,
            parts_availability: product.scrsBreakdown?.partsAvailability ?? 0,
            service_network: product.scrsBreakdown?.serviceNetwork ?? 0,
            repairability: product.scrsBreakdown?.repairability ?? 0,
            brand_reliability: product.scrsBreakdown?.brandReliability ?? 0,
        },
    };
}

// ============================================
// SEED LOGIC
// ============================================

async function seedProducts() {
    console.log('🌱 Starting product seed...\n');

    // Collect all products from curated + generated
    const allProducts: ProductTcoData[] = [];

    // 1. Add curated products from all categories
    const categories: TcoCategory[] = ['smart-tvs', 'geladeiras', 'lavadoras', 'ar-condicionado', 'robo-aspiradores'];

    for (const category of categories) {
        const curated = CURATED_PRODUCTS[category] || [];
        console.log(`📦 ${category}: ${curated.length} curated products`);
        allProducts.push(...curated);
    }

    // 2. Generate additional mock products if needed (optional)
    // Uncomment if you want more variety:
    // for (const category of categories) {
    //     const generated = generateMockProducts(category, 5);
    //     allProducts.push(...generated);
    // }

    console.log(`\n📊 Total products to seed: ${allProducts.length}\n`);

    // 3. Convert to DB format
    const dbProducts = allProducts.map(convertMockToDbFormat);

    // 4. Check for duplicate slugs
    const slugs = new Set<string>();
    const uniqueProducts: ProductInsert[] = [];

    for (const product of dbProducts) {
        if (slugs.has(product.slug)) {
            console.warn(`⚠️  Duplicate slug skipped: ${product.slug}`);
            continue;
        }
        slugs.add(product.slug);
        uniqueProducts.push(product);
    }

    console.log(`📝 Unique products after dedup: ${uniqueProducts.length}\n`);

    // 5. Clear existing products (optional, be careful!)
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
        console.log('🗑️  Clearing existing products...');
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
            console.error('❌ Error clearing products:', deleteError);
        } else {
            console.log('✅ Existing products cleared\n');
        }
    }

    // 6. Insert products in batches
    const BATCH_SIZE = 25;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < uniqueProducts.length; i += BATCH_SIZE) {
        const batch = uniqueProducts.slice(i, i + BATCH_SIZE);

        const { data, error } = await supabase
            .from('products')
            .upsert(batch, { onConflict: 'slug' })
            .select('slug');

        if (error) {
            console.error(`❌ Batch ${i / BATCH_SIZE + 1} error:`, error.message);
            errors += batch.length;
        } else {
            inserted += data?.length || 0;
            console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${data?.length || 0} products upserted`);
        }
    }

    // 7. Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SEED SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Inserted/Updated: ${inserted}`);
    console.log(`❌ Errors: ${errors}`);
    console.log('='.repeat(50));

    // 8. Verify by fetching counts
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    console.log(`\n🔍 Total products in database: ${count}\n`);
}

// ============================================
// RUN
// ============================================

seedProducts()
    .then(() => {
        console.log('🎉 Seed complete!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('💥 Seed failed:', err);
        process.exit(1);
    });
