## Goal
Let admins click any listing in the Listings Queue (pending or otherwise) to view the full submission — all photos, full description, weight, price breakdown, curriculum/genre, seller info — before approving or rejecting.

## Approach
Add a "View Details" interaction on each row in `src/pages/admin/ListingsQueue.tsx`. Clicking the row (or a dedicated "View" button) opens a full-detail modal built inside the same file, reusing the existing `Modal` component and glass design tokens.

The modal will fetch nothing extra — the row already holds the full listing record (`select('*')`), so we just pass the listing object into the modal and render every field.

## What the modal shows
- Photo gallery: all images in `photos[]` with a main image + thumbnail strip and prev/next arrows (admin needs to inspect every photo).
- Book name, author/publisher, book type badge (Academic/General).
- For academic: curriculum + class level. For general: genre.
- Condition, weight (kg), quantity.
- Full seller note / description (no truncation).
- Price breakdown: seller price, +10% platform fee, display price.
- Status badge, created date, expiry date, rejection reason (if any).
- Seller block: full name, district, phone, detailed address, bKash/Nagad number, payment method (fetched once on modal open from `users` table by `seller_id`).
- Action buttons inside the modal footer mirroring the row actions (Approve / Reject / Remove / Delete Permanently) so admin can act without closing first.

## UX details
- Whole row becomes clickable (cursor-pointer) to open the modal; existing inline action buttons stop propagation so they still work directly.
- Modal uses a wider variant (`max-w-3xl`) and `max-h-[90vh] overflow-y-auto` since content is long.
- Reject flow from inside the detail modal opens the existing reject reason modal on top (or inlines the textarea in a confirmation step).

## Files to change
- `src/pages/admin/ListingsQueue.tsx` — add `detailModal` state, make rows clickable, add new `<ListingDetailModal>` component (in same file) with gallery + all fields + action buttons, fetch seller profile on open.

## Out of scope
- No DB or RLS changes (admins already have full SELECT on listings + users).
- No changes to the public `ListingDetail.tsx` page.
- No edits to listings themselves (per project constraint: post-submission listings are not editable).
