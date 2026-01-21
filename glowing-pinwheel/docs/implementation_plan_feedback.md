# Implementation Plan: Data Correction Feature MVP

## Overview

Extend the existing `/api/feedback` endpoint to support contextual data correction from PDP pages.

---

## 1. Decision: Extend What Exists ✅

| Decision | Rationale |
|----------|-----------|
| Extend `feedback_logs` table | Already has core fields, just add new columns |
| Keep `/api/feedback` as single endpoint | 1 existing consumer (`feedback-widget.tsx`), maintain compatibility |
| Use SERVICE_ROLE pattern | Matches existing implementation |
| Union Zod schema | Accept both old (rating-based) and new (correction-based) payloads |

---

## 2. Schema: Backwards-Compatible Extension

### Current Fields (keep as-is)
- `product_sku`, `category_slug`, `page_url`, `rating`, `reason`, `reason_text`, `user_agent`, `created_at`

### New Fields (additive)
| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `element_id` | TEXT | NULL | Section identifier: `pdp_specs`, `pdp_tco`, `spec_battery` |
| `feedback_type` | TEXT | `'rating'` | `'rating'` (legacy) or `'content_error'` (new) |
| `suggested_fix` | TEXT | NULL | User's suggested correction |
| `status` | TEXT | `'new'` | Workflow: `new`, `reviewed`, `fixed`, `rejected` |

---

## 3. Rate Limiting

Reuse existing pattern from `/api/alerts/subscribe`:
- Table: `api_rate_limits`
- Identifier: IP address (since corrections are anonymous)
- Limit: 10 submissions per IP per hour
- Endpoint: `feedback`

---

## 4. Files to Create/Modify

### [NEW] `supabase/migrations/20260121_feedback_data_correction.sql`
Add new columns to `feedback_logs`

### [MODIFY] `src/app/api/feedback/route.ts`
- Union Zod schema (legacy + new)
- Rate limiting via IP
- Return `{ ok, id }`

### [NEW] `src/components/feedback/DataCorrectionModal.tsx`
- Based on `SmartAlertModal.tsx` pattern
- Fields: comment (required), suggested_fix (optional)
- Uses `ToastContext` for feedback

### [NEW] `src/components/feedback/InlineDataCorrectionCTA.tsx`
- Reusable CTA button
- Props: `elementId`, `productSlug`, `label`

### [MODIFY] `src/components/TechSpecsAccordion.tsx`
- Add CTA at bottom of specs section

---

## 5. Verification Plan

- [ ] `npm run build` passes
- [ ] CTA appears in PDP Ficha Técnica
- [ ] Modal opens with correct fields
- [ ] Submission creates row in Supabase
- [ ] Rate limit blocks after 10 requests
- [ ] Toast shows success/error
- [ ] Legacy `FeedbackWidget` still works
