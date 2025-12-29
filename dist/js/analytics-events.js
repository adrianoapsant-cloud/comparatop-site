/**
 * ComparaTop - GA4 Event Integration
 * 
 * Auto-wires GA4 events to DOM elements via data attributes.
 * Include this file AFTER analytics.js
 * 
 * Usage:
 * <a href="..." data-track-offer data-product-id="brm44hb" data-retailer="Amazon" data-price="3199">Ver Oferta</a>
 * <button data-track-compare-add data-product-id="brm44hb">Comparar</button>
 */

(function () {
    'use strict';

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', initEventTracking);

    function initEventTracking() {
        // Track offer clicks
        document.addEventListener('click', function (e) {
            const offerLink = e.target.closest('[data-track-offer]');
            if (offerLink) {
                trackOfferClick(offerLink);
            }

            const compareBtn = e.target.closest('[data-track-compare-add]');
            if (compareBtn) {
                trackCompareAdd(compareBtn);
            }
        });

        // Track compare modal open
        observeCompareModal();

        console.log('[GA4] Event tracking initialized');
    }

    function trackOfferClick(element) {
        if (typeof Analytics === 'undefined') return;

        const productId = element.dataset.productId || 'unknown';
        const retailer = element.dataset.retailer || element.textContent.trim();
        const price = parseFloat(element.dataset.price) || 0;
        const position = parseInt(element.dataset.position) || 1;
        const pageType = element.dataset.pageType || getPageType();

        Analytics.trackOfferClick(productId, retailer, price, position, pageType);
    }

    function trackCompareAdd(element) {
        if (typeof Analytics === 'undefined') return;

        const productId = element.dataset.productId || 'unknown';
        Analytics.trackCompareAdd(productId);
    }

    function observeCompareModal() {
        // Watch for compare modal becoming visible
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const modal = mutation.target;
                    if (modal.classList.contains('active') && modal.id === 'compare-modal') {
                        trackCompareView();
                    }
                }
            });
        });

        const compareModal = document.getElementById('compare-modal');
        if (compareModal) {
            observer.observe(compareModal, { attributes: true });
        }
    }

    function trackCompareView() {
        if (typeof Analytics === 'undefined' || typeof Comparator === 'undefined') return;

        const productIds = Comparator.getItems ? Comparator.getItems() : [];
        if (productIds.length > 0) {
            Analytics.trackCompareView(productIds);
        }
    }

    function getPageType() {
        const path = window.location.pathname;
        if (path.includes('/produto/')) return 'product';
        if (path.includes('/comparar/')) return 'comparison';
        if (path.includes('/categoria/')) return 'category';
        return 'home';
    }

    // Also track page views on route change
    if (typeof Router !== 'undefined') {
        const originalNavigate = Router.navigate;
        Router.navigate = function (path) {
            originalNavigate.call(Router, path);
            if (typeof Analytics !== 'undefined') {
                Analytics.trackPageView(path, document.title);
            }
        };
    }

    // Export helper for manual tracking
    window.GA4Track = {
        offerClick: function (productId, retailer, price, position) {
            if (typeof Analytics !== 'undefined') {
                Analytics.trackOfferClick(productId, retailer, price, position || 1, getPageType());
            }
        },
        compareAdd: function (productId) {
            if (typeof Analytics !== 'undefined') {
                Analytics.trackCompareAdd(productId);
            }
        },
        emailSubmit: function (context) {
            if (typeof Analytics !== 'undefined') {
                Analytics.trackEmailSubmit(context || 'newsletter');
            }
        }
    };
})();
