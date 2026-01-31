# Robot Vacuums QA Guide

Quality Assurance documentation for the robot vacuum category module.

## Overview

The QA system ensures:
1. All robot-vacuum products have valid `structuredSpecs`
2. No product falls back to `isFallback=true` (legacy inference)
3. Scores and tags remain stable (snapshot testing)

## Commands

### Validate (CI/local)
```bash
npm run qa:robot-vacuums
# or
npx tsx scripts/qa-robot-vacuums.ts
```

### Update Snapshot
When you intentionally change scoring rules:
```bash
npm run qa:robot-vacuums:update
# or
npx tsx scripts/qa-robot-vacuums.ts --write-snapshot
```

## Workflow

### Adding a New Product
1. Create `products.entry.*.ts` with `structuredSpecs`
2. Run `npm run qa:robot-vacuums` (expect failure: "ADDED")
3. Run `npm run qa:robot-vacuums:update` to add to snapshot
4. Commit both product file and updated snapshot

### Changing Scoring Rules
1. Edit `scoring.ts` or `tags.ts`
2. Run `npm run qa:robot-vacuums` (expect failures showing diffs)
3. Review diffs carefully
4. Run `npm run qa:robot-vacuums:update`
5. Commit with explanation of scoring changes

### Fixing a Fallback Error
If QA reports `isFallback=true`:
1. Check if `structuredSpecs` exists in the product file
2. Validate all required fields are present
3. Ensure enum values are valid (e.g., `brushType: 'bristle'`)

## Snapshot Location

```
qaSnapshots/robot-vacuums.v1.json
```

**Version 1 schema:**
```json
{
  "version": 1,
  "generatedAt": "2026-01-31T...",
  "productCount": 17,
  "items": [
    {
      "id": "product-id",
      "scores": { "c1": 8.8, "c2": 6.0, ... },
      "tags": { "hasLidar": true, ... }
    }
  ]
}
```

## Example Output

### Passing
```
✅ All checks passed!
   - Schema: OK
   - Fallback: 0
   - Snapshot: 0 diffs
```

### Failing (score changed)
```
--- SNAPSHOT DIFFS ---
[DIFF] roborock-q7-l5 :: scores.c1
       expected: 8.8
       actual:   9.1

❌ QA FAILED
   Fallback products: 0
   Snapshot diffs: 1
```

### Failing (missing specs)
```
--- ERRORS ---
[ERROR] new-product-id:
  - structuredSpecs not found

❌ QA FAILED
   Fallback products: 1
   Snapshot diffs: 0
```

## CI Integration

Add to your CI pipeline:
```yaml
- name: QA Robot Vacuums
  run: npm run qa:robot-vacuums
```

The script exits with code `1` on failure, blocking the build.
