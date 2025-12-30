/**
 * CompareStore - Category-Scoped Comparison System
 * ComparaTop 2.0
 * 
 * Implements multi-shelf architecture with category guard.
 * Follows industry patterns (Amazon, BestBuy, RTINGS).
 */

const CompareStore = (function () {
    'use strict';

    // Constants
    const STORAGE_KEY = 'comparatop_compare_v2';
    const OLD_STORAGE_KEY = 'compareList';
    const MAX_ITEMS_PER_CATEGORY = 4;
    const VERSION = 2;

    // Internal state
    let store = {
        version: VERSION,
        activeCategory: null,
        lists: {},
        updatedAt: null
    };

    /**
     * Initialize the store - loads from localStorage and migrates old data
     */
    function init() {
        // Try to load existing v2 data
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.version === VERSION) {
                    store = parsed;
                    console.log('[CompareStore] Loaded v2 data:', Object.keys(store.lists).map(k => `${k}:${store.lists[k].length}`).join(', '));
                }
            }
        } catch (e) {
            console.warn('[CompareStore] Failed to load v2 data:', e);
        }

        // Migrate old data if no v2 data exists
        if (!store.activeCategory) {
            migrateFromV1();
        }

        // Listen for cross-tab changes
        window.addEventListener('storage', handleStorageEvent);

        return CompareStore;
    }

    /**
     * Migrate from old single-list format (compareList)
     */
    function migrateFromV1() {
        try {
            const oldData = localStorage.getItem(OLD_STORAGE_KEY);
            if (oldData) {
                const oldList = JSON.parse(oldData);
                if (Array.isArray(oldList) && oldList.length > 0) {
                    // Assume all items are from the same category (geladeiras for now)
                    // In future, items should have category field
                    const category = oldList[0].category || 'geladeiras';
                    store.lists[category] = oldList.map(item => ({
                        ...item,
                        category: category
                    }));
                    store.activeCategory = category;
                    save();

                    // Remove old data
                    localStorage.removeItem(OLD_STORAGE_KEY);
                    console.log('[CompareStore] Migrated', oldList.length, 'items from v1 to', category);
                }
            }
        } catch (e) {
            console.warn('[CompareStore] Migration failed:', e);
        }
    }

    /**
     * Save store to localStorage
     */
    function save() {
        store.updatedAt = Date.now();
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
            // Also save in old format for backward compatibility during transition
            if (store.activeCategory && store.lists[store.activeCategory]) {
                localStorage.setItem(OLD_STORAGE_KEY, JSON.stringify(store.lists[store.activeCategory]));
            }
        } catch (e) {
            console.error('[CompareStore] Failed to save:', e);
        }
    }

    /**
     * Handle cross-tab storage events
     */
    function handleStorageEvent(e) {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                store = JSON.parse(e.newValue);
                emitChange('sync', null);
            } catch (e) {
                console.warn('[CompareStore] Failed to sync from other tab:', e);
            }
        }
    }

    /**
     * Emit change event for all listeners
     */
    function emitChange(action, product, category) {
        window.dispatchEvent(new CustomEvent('compare:changed', {
            detail: {
                action: action,
                product: product,
                category: category || store.activeCategory,
                activeCategory: store.activeCategory,
                activeList: getActiveList(),
                counts: getCounts()
            }
        }));
    }

    /**
     * Get the active category
     */
    function getActiveCategory() {
        return store.activeCategory;
    }

    /**
     * Set the active category
     * @param {string} category - Category slug (e.g., 'geladeiras', 'lavadoras')
     * @param {boolean} silent - If true, don't emit change event
     */
    function setActiveCategory(category, silent = false) {
        const previousCategory = store.activeCategory;

        if (previousCategory !== category) {
            store.activeCategory = category;

            // Ensure the category list exists
            if (!store.lists[category]) {
                store.lists[category] = [];
            }

            save();

            if (!silent) {
                emitChange('switch', null, category);

                // Show toast if switching from a non-empty list
                if (previousCategory && store.lists[previousCategory]?.length > 0) {
                    showCategorySwitch(previousCategory, category);
                }
            }
        }

        return CompareStore;
    }

    /**
     * Show toast when switching categories
     */
    function showCategorySwitch(from, to) {
        const fromCount = store.lists[from]?.length || 0;
        if (fromCount > 0 && typeof showToast === 'function') {
            const fromLabel = getCategoryLabel(from);
            const toLabel = getCategoryLabel(to);
            showToast(`Comparação alternada para ${toLabel}. (${fromCount} ${fromLabel} salvos)`);
        }
    }

    /**
     * Get human-readable category label
     */
    function getCategoryLabel(category) {
        const labels = {
            'geladeiras': 'Geladeiras',
            'lavadoras': 'Lavadoras',
            'climatizacao': 'Climatização',
            'coccao': 'Cocção'
        };
        return labels[category] || category;
    }

    /**
     * Get the list for the active category
     */
    function getActiveList() {
        if (!store.activeCategory) return [];
        return store.lists[store.activeCategory] || [];
    }

    /**
     * Get the list for any category
     */
    function getList(category) {
        return store.lists[category] || [];
    }

    /**
     * Toggle a product in the comparison list
     * @param {Object} product - Product object with id, model, brand, category, etc.
     * @returns {boolean} - true if added, false if removed
     */
    function toggleItem(product) {
        if (!product || !product.id) {
            console.warn('[CompareStore] toggleItem called without valid product');
            return false;
        }

        // Determine category from product or use active
        const category = product.category || store.activeCategory || 'geladeiras';

        // Switch active category if needed
        if (store.activeCategory !== category) {
            setActiveCategory(category);
        }

        // Ensure list exists
        if (!store.lists[category]) {
            store.lists[category] = [];
        }

        const list = store.lists[category];
        const existingIndex = list.findIndex(p => p.id === product.id);

        if (existingIndex > -1) {
            // Remove
            list.splice(existingIndex, 1);
            save();
            emitChange('remove', product, category);
            return false;
        } else {
            // Add
            if (list.length >= MAX_ITEMS_PER_CATEGORY) {
                if (typeof showToast === 'function') {
                    showToast(`Máximo de ${MAX_ITEMS_PER_CATEGORY} produtos para comparação`);
                }
                return false;
            }

            // Ensure product has category
            const productWithCategory = { ...product, category };
            list.push(productWithCategory);
            save();
            emitChange('add', productWithCategory, category);
            return true;
        }
    }

    /**
     * Check if a product is in a list
     * @param {string} productId - Product ID
     * @param {string} category - Optional category, defaults to active
     */
    function isInList(productId, category) {
        const cat = category || store.activeCategory;
        if (!cat || !store.lists[cat]) return false;
        return store.lists[cat].some(p => p.id === productId);
    }

    /**
     * Clear the active category list
     */
    function clearActiveList() {
        if (store.activeCategory && store.lists[store.activeCategory]) {
            store.lists[store.activeCategory] = [];
            save();
            emitChange('clear', null);
        }
        return CompareStore;
    }

    /**
     * Clear all lists
     */
    function clearAll() {
        store.lists = {};
        store.activeCategory = null;
        save();
        emitChange('clear', null);
        return CompareStore;
    }

    /**
     * Get count for a category (or active if not specified)
     */
    function getCount(category) {
        const cat = category || store.activeCategory;
        if (!cat || !store.lists[cat]) return 0;
        return store.lists[cat].length;
    }

    /**
     * Get counts for all categories
     */
    function getCounts() {
        const counts = {};
        for (const cat in store.lists) {
            counts[cat] = store.lists[cat].length;
        }
        return counts;
    }

    /**
     * Remove a specific product by ID
     */
    function removeItem(productId, category) {
        const cat = category || store.activeCategory;
        if (!cat || !store.lists[cat]) return false;

        const index = store.lists[cat].findIndex(p => p.id === productId);
        if (index > -1) {
            const product = store.lists[cat][index];
            store.lists[cat].splice(index, 1);
            save();
            emitChange('remove', product, cat);
            return true;
        }
        return false;
    }

    /**
     * Get the full store state (for debugging)
     */
    function getState() {
        return { ...store };
    }

    // Public API
    return {
        init,
        getActiveCategory,
        setActiveCategory,
        getActiveList,
        getList,
        toggleItem,
        isInList,
        clearActiveList,
        clearAll,
        getCount,
        getCounts,
        removeItem,
        getState,
        getCategoryLabel,
        MAX_ITEMS: MAX_ITEMS_PER_CATEGORY
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CompareStore.init());
} else {
    CompareStore.init();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompareStore;
}
