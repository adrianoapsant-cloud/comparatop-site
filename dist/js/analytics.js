/**
 * ComparaTop 2.0 - Analytics Module (GA4)
 * Google Analytics 4 integration with custom events
 * 
 * SETUP:
 * 1. Replace 'G-XXXXXXXXXX' with your GA4 Measurement ID
 * 2. Add the GA4 script tag to index.html (see bottom of file)
 */

const Analytics = (function () {
    'use strict';

    // GA4 Measurement ID - REPLACE WITH YOUR ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

    // Track if GA is loaded
    let isLoaded = false;

    /**
     * Initialize GA4
     */
    function init() {
        if (typeof gtag === 'function') {
            isLoaded = true;
            console.log('[Analytics] GA4 initialized');
        } else {
            console.warn('[Analytics] GA4 not loaded - check script tag');
        }
    }

    /**
     * Send custom event to GA4
     */
    function sendEvent(eventName, params = {}) {
        if (!isLoaded) {
            console.log('[Analytics] Event queued (GA not loaded):', eventName, params);
            return;
        }

        gtag('event', eventName, params);
        console.log('[Analytics] Event sent:', eventName, params);
    }

    /**
     * Track CTA offer click
     * Called when user clicks "Ver Oferta" button
     */
    function trackOfferClick(productId, retailer, price, position, pageType) {
        sendEvent('cta_offer_click', {
            product_id: productId,
            retailer: retailer,
            price: price,
            position: position,
            page_type: pageType || 'product'
        });
    }

    /**
     * Track product added to comparison
     */
    function trackCompareAdd(productId) {
        sendEvent('compare_add', {
            product_id: productId
        });
    }

    /**
     * Track comparison view
     */
    function trackCompareView(productIds) {
        sendEvent('compare_view', {
            product_ids: productIds.join(','),
            product_count: productIds.length
        });
    }

    /**
     * Track email submission
     */
    function trackEmailSubmit(context) {
        sendEvent('email_submit', {
            context: context || 'newsletter'
        });
    }

    /**
     * Track scroll depth (25%, 50%, 75%, 90%)
     */
    function initScrollTracking() {
        const thresholds = [25, 50, 75, 90];
        const tracked = {};

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            thresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !tracked[threshold]) {
                    tracked[threshold] = true;
                    sendEvent('scroll_depth', {
                        percent: threshold,
                        page_path: window.location.pathname
                    });
                }
            });
        }, 500));
    }

    /**
     * Track page view
     */
    function trackPageView(path, title) {
        if (!isLoaded) return;

        gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
            page_title: title
        });
    }

    // Public API
    return {
        init,
        trackOfferClick,
        trackCompareAdd,
        trackCompareView,
        trackEmailSubmit,
        trackPageView,
        initScrollTracking
    };
})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
    Analytics.initScrollTracking();
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}

/*
================================================================================
GA4 SCRIPT TAG - Add this to index.html <head> section:
================================================================================

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>

================================================================================
USAGE EXAMPLES:
================================================================================

1. Track offer click (add to offer button onclick):
   Analytics.trackOfferClick('brm44hb', 'amazon', 3199.00, 1, 'product');

2. Track comparison add (add to compare button onclick):
   Analytics.trackCompareAdd('brm44hb');

3. Track comparison view (call when modal opens):
   Analytics.trackCompareView(['brm44hb', 'tf55']);

4. Track email submit (call in newsletter form handler):
   Analytics.trackEmailSubmit('newsletter');
   Analytics.trackEmailSubmit('price_alert');

5. Track page view (called automatically by router):
   Analytics.trackPageView('/produto/geladeira/brm44hb', 'Brastemp BRM44HB');

================================================================================
*/
