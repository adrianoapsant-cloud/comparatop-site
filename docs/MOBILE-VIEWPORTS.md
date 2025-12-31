# ComparaTop - Device Viewports Reference

## Quick Reference for Testing

| Device | Width | Height | Ratio | Use Case |
|--------|-------|--------|-------|----------|
| Samsung M52/S21+ | 412 | 915 | 20:9 | High-end Android |
| iPhone 14 Pro | 393 | 852 | 19.5:9 | Modern iOS |
| Android Small | 360 | 640 | 16:9 | Budget Android |
| iPhone SE | 375 | 667 | 16:9 | Compact iOS |

## CSS Breakpoints

```css
/* Mobile First - Base styles for mobile */

/* Tablets and up */
@media (min-width: 769px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Small Mobile */
@media (max-width: 480px) { ... }
```

## Mobile-Only Components

1. `.ml-bottom-bar` - Bottom navigation (z-index: 100)
2. `.compare-sticky-bottom-bar` - Compare counter (z-index: 1050, bottom: 60px)
3. `.ml-bottom-sheet` - Slide-up menus
4. `.floating-compare-btn` - Floating action button

## Testing Checklist

- [ ] Text readable (min 14px on mobile)
- [ ] Touch targets 44x44px minimum
- [ ] No horizontal scroll on page
- [ ] Bottom bar not overlapping content
- [ ] Modals scrollable on small screens
