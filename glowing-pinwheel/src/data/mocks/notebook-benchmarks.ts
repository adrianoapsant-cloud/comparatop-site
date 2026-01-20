/**
 * @file notebook-benchmarks.ts
 * @description Mock Notebook Products for HMUM Validation
 * 
 * These products represent archetypal notebook market segments:
 * 1. Ultrabook Pro - Lightweight, long battery, for mobile professionals
 * 2. Gaming Beast - Heavy, GPU-focused, for gamers
 * 3. Budget Student - Basic specs, affordable
 * 4. Developer Workstation - RAM and CPU heavy
 * 
 * @version 1.0.0
 */

import type { Product } from '@/types/category';

// ============================================
// BENCHMARK PRODUCTS
// ============================================

/**
 * The Ultrabook Pro - MacBook Air / Dell XPS Archetype
 * 
 * Profile: Lightweight, all-day battery, premium build.
 * Expected behavior:
 * - Dominates in office_mobility (weight + battery)
 * - Loses to Gaming Beast in gaming contexts
 * - Good in general productivity
 */
export const ULTRABOOK_PRO: Product = {
    id: 'benchmark-ultrabook-pro',
    name: 'Dell XPS 15 (Benchmark)',
    shortName: 'Dell XPS 15',
    model: 'XPS 15',
    categoryId: 'notebook',
    brand: 'Dell',
    price: 12000,
    imageUrl: '/images/products/placeholder-notebook.svg',
    scores: {
        c1: 8.5,  // Performance
        c2: 9.0,  // Display
        c3: 9.5,  // Build Quality
        c4: 9.2,  // Portability
        c5: 9.0,  // Battery
        c6: 6.0,  // Gaming (integrated GPU)
        c7: 7.0,  // Value
        c8: 8.5,  // Keyboard/Trackpad
        c9: 9.0,  // Connectivity
        c10: 9.0, // Overall
    },
    specs: {
        // Performance
        cpu_passmark_score: 22000, // Intel i7-13700H
        gpu_class: 0, // Integrated Intel Iris Xe
        ram_gb: 16,

        // Display
        screen_resolution_score: 2, // 2K/QHD
        screen_size_inches: 15.6,

        // Portability
        weight_kg: 1.4,
        battery_hours: 12,

        // Storage
        storage_gb: 512,
        storage_is_ssd: true,

        // Other
        warranty_years: 2,
        voltage: 'bivolt',
    },
};

/**
 * The Gaming Beast - ASUS ROG / Alienware Archetype
 * 
 * Profile: Heavy, powerful GPU, short battery.
 * Expected behavior:
 * - Dominates in gamer_laptop context
 * - Poor in mobility contexts (heavy, short battery)
 * - Great for content creation
 */
export const GAMING_BEAST: Product = {
    id: 'benchmark-gaming-beast',
    name: 'ASUS ROG Strix G16 RTX 4070 (Benchmark)',
    shortName: 'ASUS ROG Strix',
    model: 'ROG Strix G16',
    categoryId: 'notebook',
    brand: 'ASUS',
    price: 9500,
    imageUrl: '/images/products/placeholder-notebook.svg',
    scores: {
        c1: 9.5,  // Performance
        c2: 8.5,  // Display
        c3: 8.0,  // Build Quality
        c4: 5.0,  // Portability (heavy)
        c5: 5.0,  // Battery (short)
        c6: 9.8,  // Gaming (dedicated GPU)
        c7: 8.0,  // Value
        c8: 8.0,  // Keyboard
        c9: 8.5,  // Connectivity
        c10: 8.5, // Overall
    },
    specs: {
        // Performance
        cpu_passmark_score: 28000, // Intel i7-13650HX
        gpu_class: 2, // Mid Dedicated (RTX 4070)
        ram_gb: 16,

        // Display
        screen_resolution_score: 1, // FHD 165Hz
        screen_size_inches: 16,

        // Portability - WEAK
        weight_kg: 2.6,
        battery_hours: 4,

        // Storage
        storage_gb: 1024,
        storage_is_ssd: true,

        // Other
        warranty_years: 2,
        voltage: 'bivolt',
    },
};

/**
 * The Budget Student - Entry-level laptop
 * 
 * Profile: Basic specs, cheap price.
 * Expected behavior:
 * - Good in student_budget context (price is key)
 * - Poor in performance contexts
 * - FATAL in gamer_laptop (no dedicated GPU)
 */
export const BUDGET_STUDENT: Product = {
    id: 'benchmark-budget-student',
    name: 'Lenovo IdeaPad 3 (Benchmark)',
    shortName: 'Lenovo IdeaPad 3',
    model: 'IdeaPad 3',
    categoryId: 'notebook',
    brand: 'Lenovo',
    price: 2800,
    imageUrl: '/images/products/placeholder-notebook.svg',
    scores: {
        c1: 5.0,  // Performance
        c2: 6.0,  // Display
        c3: 6.0,  // Build Quality
        c4: 7.0,  // Portability
        c5: 6.0,  // Battery
        c6: 2.0,  // Gaming (no GPU)
        c7: 9.0,  // Value
        c8: 5.5,  // Keyboard
        c9: 6.0,  // Connectivity
        c10: 6.0, // Overall
    },
    specs: {
        // Performance - WEAK
        cpu_passmark_score: 8000, // Intel i3-1215U
        gpu_class: 0, // Integrated only - FATAL for AAA gaming!
        ram_gb: 8,

        // Display
        screen_resolution_score: 1, // FHD
        screen_size_inches: 15.6,

        // Portability - OK
        weight_kg: 1.8,
        battery_hours: 7,

        // Storage - Small
        storage_gb: 256,
        storage_is_ssd: true,

        // Other
        warranty_years: 1,
        voltage: 'bivolt',
    },
};

/**
 * The Developer Workstation - Thinkpad / MacBook Pro Archetype
 * 
 * Profile: High RAM, fast CPU, long warranty.
 * Expected behavior:
 * - Dominates in developer context
 * - Good in content_creator context
 * - Acceptable in mobility (balanced weight)
 */
export const DEVELOPER_WORKSTATION: Product = {
    id: 'benchmark-developer-workstation',
    name: 'Lenovo ThinkPad X1 Carbon (Benchmark)',
    shortName: 'ThinkPad X1 Carbon',
    model: 'X1 Carbon',
    categoryId: 'notebook',
    brand: 'Lenovo',
    price: 15000,
    imageUrl: '/images/products/placeholder-notebook.svg',
    scores: {
        c1: 9.0,  // Performance
        c2: 9.0,  // Display
        c3: 9.5,  // Build Quality
        c4: 8.5,  // Portability
        c5: 8.0,  // Battery
        c6: 3.0,  // Gaming (integrated)
        c7: 6.5,  // Value (expensive)
        c8: 9.5,  // Keyboard (legendary)
        c9: 9.0,  // Connectivity
        c10: 9.0, // Overall
    },
    specs: {
        // Performance - Strong CPU, lots of RAM
        cpu_passmark_score: 25000, // Intel i7-1365U
        gpu_class: 0, // Integrated
        ram_gb: 32, // Developer requirement

        // Display
        screen_resolution_score: 2, // 2K
        screen_size_inches: 14,

        // Portability - Good
        weight_kg: 1.25,
        battery_hours: 10,

        // Storage - Fast and big
        storage_gb: 1024,
        storage_is_ssd: true,

        // Other
        warranty_years: 3, // Enterprise warranty
        voltage: 'bivolt',
    },
};

// ============================================
// EXPORTS
// ============================================

/**
 * All notebook benchmark products.
 */
export const NOTEBOOK_BENCHMARKS: Product[] = [
    ULTRABOOK_PRO,
    GAMING_BEAST,
    BUDGET_STUDENT,
    DEVELOPER_WORKSTATION,
];

/**
 * Benchmark map for quick lookup by ID.
 */
export const NOTEBOOK_BENCHMARK_MAP: Record<string, Product> = {
    'ultrabook-pro': ULTRABOOK_PRO,
    'gaming-beast': GAMING_BEAST,
    'budget-student': BUDGET_STUDENT,
    'developer-workstation': DEVELOPER_WORKSTATION,
};

export default NOTEBOOK_BENCHMARKS;
