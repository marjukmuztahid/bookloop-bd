# Admin User Details Modal

Add a **See Details** button beside each user in the admin Users page that opens a modal with their complete profile, payment info, and listing/order statistics.

## File to edit
- `src/pages/admin/Users.tsx` (only)

## UI changes
- Add a **See Details** button (GlassButton, secondary variant) beside the existing Ban/Unban button on each user row.
- Build a new full-detail modal (same frosted-glass pattern as the ban modal and ListingsQueue detail modal), `max-w-2xl`, scrollable.

## Modal contents

**Profile section**
- Full name, phone, district, detailed address, member since, banned/active status, email (fetched via `get_user_email` RPC).

**Payment information**
- Payment method (bKash / Nagad)
- Payment number (`bkash_nagad_number`)
- Fallback "Not provided" when null.

**Listings stats** (queried from `listings` where `seller_id = user.id`)
- Total listings
- Pending (status `pending`)
- Available (`available`)
- Sold (`sold_pending_delivery` + delivered count via orders)
- Rejected (`rejected`)
- Removed/Deleted (`removed`, soft-deleted)

**Orders as buyer** (queried from `orders` where `buyer_id = user.id`)
- Total orders placed
- Successful deliveries (status `delivered`)
- Unsuccessful (status `cancelled` / `failed` / `returned`)
- Pending/in-progress (remaining statuses)

**Orders as seller** (queried via `orders` joined to `listings` where `listings.seller_id = user.id`)
- Total sales
- Successful deliveries
- Unsuccessful deliveries
- In progress

## Technical details
- New state: `detailUser`, `detailStats`, `detailLoading`.
- `openDetails(user)` runs in parallel:
  1. `supabase.from('listings').select('status').eq('seller_id', user.id)` — aggregate counts client-side.
  2. `supabase.from('orders').select('status').eq('buyer_id', user.id)` — buyer stats.
  3. `supabase.from('orders').select('status, listings!inner(seller_id)').eq('listings.seller_id', user.id)` — seller stats (explicit FK hint per existing query patterns).
  4. `supabase.rpc('get_user_email', { _user_id: user.id })` — email.
- Skeleton loaders while fetching; stats shown as a compact grid of `glass-panel-sm` stat cards.
- Modal closes on overlay click / Close button; `e.stopPropagation()` on inner panel.
- No DB schema changes, no new RLS policies (admin already has SELECT on `users`, `listings`, `orders`).

## Out of scope
- Editing user fields from this modal.
- Viewing the actual listing/order rows (counts only). Can be added later if needed.
