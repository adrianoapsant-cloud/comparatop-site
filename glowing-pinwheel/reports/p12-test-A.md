# Product Completeness Report

**Category**: `air-fryer` (stub)
**Status**: ✅ PASS
**Completeness**: 70%
**Mode**: STRICT

## Schema Validation

✅ Schema: Valid

_No errors._

## Required Fields (7/7)

✅ All required fields present.

## Evidence Fields (0/3)

- ⚠️ NO EVIDENCE: `product.brand`
- ⚠️ NO EVIDENCE: `product.model`
- ⚠️ NO EVIDENCE: `price.valueBRL`

## Recommended Fields (0/6)

- ⚠️ MISSING: `scoreReasons.c1`
- ⚠️ MISSING: `scoreReasons.c2`
- ⚠️ MISSING: `scoreReasons.c3`
- ⚠️ MISSING: `badges`
- ⚠️ MISSING: `offers`

... and 1 more

## Repair Prompt

Para completar o cadastro, adicione os seguintes campos:

```json
{
  "evidence": {
    "product.brand": {
      "sourceUrl": "https://...",
      "note": "Fonte oficial"
    },
    "product.model": {
      "sourceUrl": "https://...",
      "note": "Fonte oficial"
    },
    "price.valueBRL": {
      "sourceUrl": "https://...",
      "note": "Fonte oficial"
    }
  }
}
```
