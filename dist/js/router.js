/**
 * ComparaTop 2.0 - Router Module
 * History API based routing for SEO-friendly URLs
 */

const Router = (function () {
    'use strict';

    const BASE_URL = window.location.origin;
    let currentRoute = null;
    let routeHandlers = {};

    /**
     * Route definitions
     * Pattern format: /path/:param
     */
    const routes = [
        { pattern: '/', name: 'home' },
        // Canonical category routes (SEO-friendly)
        { pattern: '/geladeiras', name: 'category', staticParams: { categoryId: 'geladeira' } },
        { pattern: '/geladeiras/', name: 'category', staticParams: { categoryId: 'geladeira' } },
        { pattern: '/freezers', name: 'category', staticParams: { categoryId: 'freezer' } },
        { pattern: '/freezers/', name: 'category', staticParams: { categoryId: 'freezer' } },
        { pattern: '/frigobares', name: 'category', staticParams: { categoryId: 'frigobar' } },
        { pattern: '/frigobares/', name: 'category', staticParams: { categoryId: 'frigobar' } },
        // Legacy category route (for backwards compatibility)
        { pattern: '/categoria/:categoryId', name: 'category' },
        { pattern: '/categoria/:categoryId/', name: 'category' },
        { pattern: '/produto/:categoryId/:productId', name: 'product' },
        { pattern: '/produto/:categoryId/:productId/', name: 'product' },
        { pattern: '/comparar', name: 'comparison' },
        { pattern: '/comparar/', name: 'comparison' },
        { pattern: '/comparar/:comparisonId', name: 'comparison' },
        { pattern: '/comparar/:comparisonId/', name: 'comparison' }
    ];

    /**
     * Parse a URL pattern into regex and param names
     */
    function parsePattern(pattern) {
        const paramNames = [];
        const regexStr = pattern.replace(/:(\w+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });
        return {
            regex: new RegExp(`^${regexStr}$`),
            paramNames
        };
    }

    /**
     * Match a path against routes
     */
    function matchRoute(path) {
        // Default to root
        if (!path || path === '') path = '/';

        for (const route of routes) {
            const { regex, paramNames } = parsePattern(route.pattern);
            const match = path.match(regex);

            if (match) {
                const params = {};
                // Use staticParams if defined, otherwise extract from URL
                if (route.staticParams) {
                    Object.assign(params, route.staticParams);
                }
                paramNames.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });
                return { name: route.name, params, pattern: route.pattern };
            }
        }

        // Default to home if no match
        return { name: 'home', params: {}, pattern: '/' };
    }

    /**
     * Navigate to a new route
     * @param {string} path - URL path (e.g., '/produto/geladeira/brm44hb')
     * @param {boolean} pushState - Whether to add to history (false for initial load)
     */
    function navigate(path, pushState = true) {
        // Normalize path
        if (!path.startsWith('/')) path = '/' + path;

        // Mobile UX: Close sidebar automatically on navigation
        if (window.innerWidth <= 1024 && typeof window.closeSidebar === 'function') {
            window.closeSidebar();
        }

        const route = matchRoute(path);
        currentRoute = route;

        // Update browser URL
        if (pushState) {
            history.pushState({ path, route: route.name }, '', path);
        }

        // Call the appropriate handler
        handleRoute(route);
    }

    /**
     * Handle a matched route
     */
    function handleRoute(route) {
        const handler = routeHandlers[route.name];
        if (handler) {
            handler(route.params);
        } else {
            console.warn(`[Router] No handler for route: ${route.name}`);
        }
    }

    /**
     * Register a route handler
     */
    function on(routeName, handler) {
        routeHandlers[routeName] = handler;
    }

    /**
     * Build a URL for a route
     */
    function buildUrl(routeName, params = {}) {
        const route = routes.find(r => r.name === routeName);
        if (!route) return '/';

        let path = route.pattern;
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, encodeURIComponent(value));
        }
        return path;
    }

    /**
     * Get current route info
     */
    function getCurrentRoute() {
        return currentRoute;
    }

    /**
     * Check for legacy hash URLs and redirect
     */
    function handleLegacyHash() {
        const hash = window.location.hash;
        if (!hash) return false;

        // Map old hash routes to new paths
        if (hash.startsWith('#produto-')) {
            const productId = hash.replace('#produto-', '');
            navigate(`/produto/geladeira/${productId}`);
            return true;
        }
        if (hash === '#geladeiras' || hash.startsWith('#categoria-')) {
            const categoryId = hash.replace('#categoria-', '') || 'geladeira';
            navigate(`/categoria/${categoryId}`);
            return true;
        }
        if (hash === '#comparar') {
            navigate('/comparar');
            return true;
        }

        return false;
    }

    /**
     * Initialize router
     */
    function init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            const path = event.state?.path || window.location.pathname;
            navigate(path, false);
        });

        // Check for legacy hash URLs first
        if (handleLegacyHash()) {
            return;
        }

        // Handle current URL on page load
        const currentPath = window.location.pathname;
        navigate(currentPath, false);
    }

    // Public API
    return {
        navigate,
        on,
        buildUrl,
        getCurrentRoute,
        init
    };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
