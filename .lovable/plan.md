# Admin Edit Listing Feature

Yes — fully possible. Admins already have `UPDATE` RLS permission on `listings`, and the `listings_auto_fields` trigger will auto-recompute `display_price` whenever `seller_price` changes, so price math stays correct.

Note: the project rule "No post-submission listing edits" applies to **sellers**. This adds an **admin-only** override for fixing miscategorized posts — it does not change seller-facing behavior.

## Where

`src/pages/admin/ListingsQueue.tsx` — add an "Edit" mode inside the existing full-detail modal. No new page, no schema changes.

## Editable fields

All listing fields a seller originally chose:
- **Book Type** (`academic` ⇄ `general`) — the main fix you mentioned
- **Book Name**, **Author/Publisher**
- **Condition** (new / good / fair / worn)
- **Weight (kg)**, **Quantity** (1–50), **Seller Price** (display price auto-recalculates)
- **Description** (seller's note)
- **Academic-only**: Curriculum, Class Level
- **General-only**: Genre

Not editable here (out of scope): status, photos, seller, dates, rejection reason.

## UX

- In the detail modal footer, add an **"Edit Listing"** button (visible only when status is `pending` or `available`).
- Clicking it swaps the read-only view into a form (same modal) with all fields pre-filled.
- Switching **Book Type** swaps the conditional fields (genre vs curriculum/class) and clears the now-irrelevant ones on save.
- **Save** / **Cancel** buttons at the bottom. Save shows a confirmation toast.
- On save: update DB → log activity (`listing_edited`) → notify the seller ("Your listing for X was updated by admin: <changed fields>") → refresh list → return to read-only view.

## Data writes

Single `supabase.from('listings').update({...}).eq('id', l.id)` call. When `book_type` is changed:
- to `general`: set `genre`, null out `curriculum` & `class_level`
- to `academic`: set `curriculum` & `class_level`, null out `genre`

`display_price` is recomputed by the existing DB trigger — no client-side calculation needed for persistence.

## Out of scope

- Editing photos (would require re-upload flow)
- Allowing sellers to edit (explicit project constraint stays)
- Editing status, seller, or dates from this UI
