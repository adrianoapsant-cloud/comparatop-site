/**
 * Category Registry
 * Central registry of all category modules for QA and other tools
 */
import type { CategoryModule } from './categoryModule';
import { robotVacuumsModule } from './robot-vacuums';

// Type for registry entries (loose typing to accommodate different category shapes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModule = CategoryModule<any, any, any>;

/**
 * Registry of all category modules
 * Add new categories here as they are implemented
 */
export const categoryRegistry: Record<string, AnyModule> = {
    'robot-vacuum': robotVacuumsModule,
    // Future categories:
    // 'smart-tv': smartTVsModule,
    // 'refrigerator': refrigeratorsModule,
    // 'air-fryer': airFryersModule,
};

/**
 * Get a category module by slug
 * @throws Error if category not found
 */
export function getCategoryModule(slug: string): AnyModule {
    const module = categoryRegistry[slug];
    if (!module) {
        const available = Object.keys(categoryRegistry).join(', ');
        throw new Error(`Category "${slug}" not found. Available: ${available}`);
    }
    return module;
}

/**
 * List all registered category slugs
 */
export function listCategories(): string[] {
    return Object.keys(categoryRegistry);
}
