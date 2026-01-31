# Hydration Mismatch Issue

## Status
**Non-blocking** - Does not prevent merge of PDP gates (P21).

## Description
Client-side hydration errors occurring on PDP pages. React detects differences between server-rendered HTML and client-rendered content.

## How to Reproduce
1. Start dev server: `npm run dev`
2. Navigate to any product detail page (e.g., `/produto/robot-vacuum/roborock-q7-l5`)
3. Open browser console (F12)
4. Look for warnings containing "Hydration failed" or "Text content did not match"

## Suspected Components

### High Priority (Dynamic Content)
- **Recharts** (`ProductRadarChart`) - May generate dynamic IDs for SVG elements
- **Date/Time displays** - Server time vs client time differences
- **Score components** - If using `Math.random()` or `Date.now()` for any computation

### Medium Priority (State-dependent)
- Components using `useId()` incorrectly across SSR boundary
- Components that read from `localStorage` or `window` during SSR
- Dynamic CSS class generation (e.g., Tailwind with dynamic values)

### Low Priority (Unlikely)
- Static content components
- Pure presentational components without state

## Investigation Plan

### Phase 1: Identification (Binary Search)
1. Create feature flag `NEXT_PUBLIC_DEBUG_HYDRATION=1` 
2. Wrap suspicious components in error boundaries with logging
3. Comment out components one by one until error disappears:
   - Start with `ProductRadarChart`
   - Then `OwnershipInsights`
   - Then chart-heavy sections

### Phase 2: Root Cause Analysis
Once suspicious component identified:
1. Check for `Math.random()`, `Date.now()`, `crypto.randomUUID()` usage
2. Check for `useId()` usage (React 18+ hook)
3. Check for `window`/`document` access without `typeof window !== 'undefined'` guard
4. Check for library-generated dynamic IDs

### Phase 3: Fix Implementation
Based on root cause:
- **Dynamic IDs**: Use stable IDs from props/context instead
- **Date/Time**: Use `suppressHydrationWarning` for non-critical timestamps
- **Window access**: Move to `useEffect` or add SSR guard
- **Third-party libraries**: Consider `dynamic(() => import(...), { ssr: false })`

## Related Files
- `src/components/ProductDetailPage.tsx`
- `src/components/LazyProductRadarChart.tsx`
- `src/components/product/OwnershipInsights.tsx`
- `src/components/pdp/*.tsx`

## References
- [Next.js Hydration Error Docs](https://nextjs.org/docs/messages/react-hydration-error)
- [Related conversation: b3ef1941-0784-4bab-9382-1fbbbaf30851]

---

*Created: 2026-01-22*
*Last Updated: 2026-01-22*
*Assigned: TBD*
