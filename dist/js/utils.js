/**
 * ComparaTop 2.0 - Utility Functions
 * Common helpers used across modules
 */

const Utils = (function () {
    'use strict';

    /**
     * Format number as Brazilian Real currency
     */
    function formatBRL(value) {
        if (value == null) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    /**
     * Format number with Brazilian locale
     */
    function formatNumber(value, decimals = 1) {
        if (value == null) return 'N/A';
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    /**
     * Format date as Brazilian format
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    /**
     * Format datetime as Brazilian format
     */
    function formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' ' +
            date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Get nested value from object using dot notation
     */
    function getNestedValue(obj, path) {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((curr, key) => curr?.[key], obj);
    }

    /**
     * Set nested value in object using dot notation
     */
    function setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return obj;
    }

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Generate slug from string
     */
    function slugify(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Parse query string to object
     */
    function parseQueryString(queryString) {
        const params = new URLSearchParams(queryString);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    /**
     * Build query string from object
     */
    function buildQueryString(params) {
        return new URLSearchParams(params).toString();
    }

    /**
     * Deep clone an object
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Generate star rating HTML
     */
    function generateStars(rating, scale = 5) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = scale - fullStars - (hasHalf ? 1 : 0);

        return '★'.repeat(fullStars) +
            (hasHalf ? '½' : '') +
            '☆'.repeat(emptyStars);
    }

    /**
     * Calculate percentage difference between two values
     */
    function percentDiff(a, b) {
        if (a === 0 || b === 0) return null;
        return Math.round(((a - b) / b) * 100);
    }

    /**
     * Create element with attributes and children
     */
    function createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);

        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'class' || key === 'className') {
                el.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key.startsWith('data-')) {
                el.setAttribute(key, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                el[key] = value;
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                el.appendChild(child);
            }
        });

        return el;
    }

    /**
     * Smooth scroll to element
     */
    function scrollToElement(elementOrSelector, offset = 90) {
        const el = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (!el) return;

        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    /**
     * Copy text to clipboard
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Generate unique ID
     */
    function generateId(prefix = 'id') {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Pluralize word (Portuguese)
     */
    function pluralize(count, singular, plural) {
        return count === 1 ? singular : plural;
    }

    /**
     * Update page meta tags for SEO
     * @param {Object} options - Meta tag values
     */
    function updateMetaTags({ title, description, image, url, type = 'website' }) {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Helper to set meta content
        const setMeta = (selector, content) => {
            const el = document.querySelector(selector);
            if (el && content) {
                if (el.tagName === 'LINK') {
                    el.setAttribute('href', content);
                } else {
                    el.setAttribute('content', content);
                }
            }
        };

        // Standard meta tags
        setMeta('meta[name="description"]', description);
        setMeta('link[rel="canonical"]', url);

        // Open Graph
        setMeta('meta[property="og:title"]', title);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[property="og:image"]', image);
        setMeta('meta[property="og:url"]', url);
        setMeta('meta[property="og:type"]', type);

        // Twitter Cards
        setMeta('meta[name="twitter:title"]', title);
        setMeta('meta[name="twitter:description"]', description);
        setMeta('meta[name="twitter:image"]', image);
    }

    /**
     * Local storage helpers with JSON support
     */
    const storage = {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch {
                return false;
            }
        }
    };

    // Public API
    return {
        formatBRL,
        formatNumber,
        formatDate,
        formatDateTime,
        escapeHtml,
        getNestedValue,
        setNestedValue,
        debounce,
        throttle,
        slugify,
        parseQueryString,
        buildQueryString,
        deepClone,
        generateStars,
        percentDiff,
        createElement,
        scrollToElement,
        copyToClipboard,
        isInViewport,
        generateId,
        pluralize,
        updateMetaTags,
        storage
    };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
