/**
 * Energy Profiles API
 * 
 * GET /api/energy-profiles?sku=... - Get profile by SKU
 * GET /api/energy-profiles?category=... - List profiles by category
 * POST /api/energy-profiles - Upsert profile (admin-only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    getEnergyProfileBySku,
    listEnergyProfiles,
    upsertEnergyProfile,
    type EnergySource
} from '@/lib/energy/energy-profiles-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================
// ADMIN AUTH CHECK
// ============================================

async function isAdminAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('admin_session');
        return sessionCookie?.value === 'authenticated';
    } catch {
        return false;
    }
}

// ============================================
// GET HANDLER
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sku = searchParams.get('sku');
        const category = searchParams.get('category');

        // Single SKU lookup
        if (sku) {
            const profile = await getEnergyProfileBySku(sku);

            if (!profile) {
                return NextResponse.json(
                    { error: 'Profile not found', sku },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                sku: profile.sku,
                categorySlug: profile.categorySlug,
                kwhMonth: profile.kwhMonth,
                source: profile.source,
                notes: profile.notes,
                updatedAt: profile.updatedAt.toISOString(),
                storage: profile.storage
            });
        }

        // List by category (or all)
        const profiles = await listEnergyProfiles(
            category ? { categorySlug: category } : undefined
        );

        return NextResponse.json({
            count: profiles.length,
            profiles: profiles.map(p => ({
                sku: p.sku,
                categorySlug: p.categorySlug,
                kwhMonth: p.kwhMonth,
                source: p.source,
                notes: p.notes,
                updatedAt: p.updatedAt.toISOString(),
                storage: p.storage
            }))
        });
    } catch (error) {
        console.error('[energy-profiles] GET error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// POST HANDLER (Admin Only)
// ============================================

export async function POST(request: NextRequest) {
    try {
        // Check admin auth
        const isAdmin = await isAdminAuthenticated();
        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse body
        const body = await request.json();

        // Validate required fields
        if (!body.sku || typeof body.sku !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid sku' },
                { status: 400 }
            );
        }

        if (typeof body.kwhMonth !== 'number' || body.kwhMonth < 0) {
            return NextResponse.json(
                { error: 'Missing or invalid kwhMonth (must be non-negative number)' },
                { status: 400 }
            );
        }

        // Validate source
        const validSources: EnergySource[] = ['manual', 'inmetro', 'fabricante', 'medicao', 'estimado'];
        const source: EnergySource = validSources.includes(body.source) ? body.source : 'manual';

        // Upsert
        const result = await upsertEnergyProfile({
            sku: body.sku.trim(),
            categorySlug: body.categorySlug?.trim() || undefined,
            kwhMonth: body.kwhMonth,
            source,
            notes: body.notes?.trim()?.slice(0, 200) || undefined // Truncate notes
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to save profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            sku: body.sku,
            storage: result.storage
        });
    } catch (error) {
        console.error('[energy-profiles] POST error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
