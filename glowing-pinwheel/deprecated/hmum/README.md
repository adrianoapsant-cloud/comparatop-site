# HMUM Engine - Deprecated

> **Status:** DEPRECATED as of 2026-02-02
> **Reason:** Replaced by simpler PARR Ponderado (weighted average) scoring via `getUnifiedScore()`

## Why HMUM Was Removed

HMUM (Harmonic Mean Utility Model) was a Cobb-Douglas multiplicative scoring engine that:
- Required complex category-specific configs with field mappings
- Had inconsistent data mapping issues (specs vs technicalSpecs)
- Added ~6,500 LOC of runtime complexity
- Was already bypassed when products had c1-c10 scores

The new `getUnifiedScore()` approach:
- Uses simple weighted averages per category
- Relies on editorial c1-c10 scores (SSOT)
- Reduces complexity significantly
- Produces identical results (verified via baseline comparison)

## Migration Verification

Before removal, we verified that all 37 products produce identical scores:

```bash
# Generate baseline with old system
npm run generate:score-baseline

# Compare with new system
npm run compare:score-baseline
# Output: All 37 products have diff = 0.0000
```

## Baseline Reference

The pre-migration baseline is preserved at:
```
scoring-baselines/baseScore-v0.json
```

This file contains the exact score each product had before HMUM removal.

## How to Restore (If Needed)

1. Move contents back:
   ```bash
   mv deprecated/hmum/* src/lib/scoring/hmum/
   ```

2. Restore imports in `src/lib/getBaseScore.ts`:
   ```typescript
   import { getHMUMScore, hasHMUMSupport } from './getHMUMBreakdown';
   ```

3. Add HMUM fallback block in `getBaseScore()` function

4. Restore `src/lib/getHMUMBreakdown.ts` facade

## Contents

```
deprecated/hmum/
├── configs/           # Category-specific HMUM configurations
│   ├── index.ts       # Config registry
│   ├── smart-tv.ts
│   ├── monitor.ts
│   ├── notebook.ts
│   └── ... (56 category configs)
├── engine.ts          # Core HMUM calculation
├── types.ts           # Type definitions
├── normalize.ts       # Value normalization
├── critic.ts          # CRITIC weights calculator
└── index.ts           # Barrel exports
```

## Archive Date

- **Archived:** 2026-02-02
- **Commit:** (see git history)
- **Last Verified:** All 37 products - diff = 0.0000
