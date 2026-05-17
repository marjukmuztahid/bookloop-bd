## Goal
Make the **Book Card** (grid item) and **Listing Detail** page feel more aesthetic, modern, and "premium" — closer to a polished iOS/Apple-store product feel — without changing business logic, copy, prices, or data flow.

---

## Book Card refinements

Visual upgrades to `src/components/ui/BookCard.tsx`:

1. **Layered cover image**
   - Add a soft tinted "halo" behind the cover using a blurred copy of the image (CSS `filter: blur(24px) saturate(140%)`, opacity 0.45) so each card glows in its own dominant color.
   - Replace flat `aspect-[3/4]` with a subtle rounded-22px frame, inner 1px white ring, and a faint gradient sheen on top-left (mimics glass reflection).

2. **Refined hover/press**
   - Replace existing scale-1.03 with: lift `y: -4`, scale `1.015`, shadow `0 18px 40px -16px rgba(232,53,122,0.25)`. Tighter, more "Apple".
   - Image gets a parallax-style `scale(1.06)` and `translateY(-2px)` only on hover.

3. **Typography hierarchy**
   - Book name → `text-[15px] font-semibold tracking-tight`, max 2 lines (line-clamp-2) instead of `truncate` — prevents harsh cut-offs.
   - Author → `text-[11px] uppercase tracking-[0.08em] text-muted-foreground`.
   - Class/genre line removed (moved into a single badge row) to reduce vertical noise.

4. **Badge row**
   - Show only **one** primary contextual badge (curriculum OR genre) + condition badge.
   - Use smaller pill: `px-2 py-0.5 text-[10px]`.
   - Add a subtle icon prefix (BookOpen / Sparkles) for condition.

5. **Price + district row**
   - Combine into one flex row: price left (`text-[17px] font-bold text-primary`), district right (`text-[11px] muted` with pin icon).
   - Adds a thin `border-t border-white/40` above the row for separation.

6. **Status overlay**
   - Replace bottom-pinned pill with a centered frosted chip + diagonal soft gradient overlay (`from-black/0 via-black/10 to-black/40`).
   - For "Sold": add a subtle grayscale filter (`filter: grayscale(0.6)`) on the cover to reinforce state.

7. **Skeleton card**
   - Match new spacing & sizes in `SkeletonBookCard.tsx`.

---

## Listing Detail refinements

Visual upgrades to `src/pages/ListingDetail.tsx`:

1. **Ambient backdrop**
   - Behind the photo column, render a large blurred copy of the active photo (`absolute inset-0 -z-10 blur(60px) opacity-30`) bounded to the left column. Creates a museum-style spotlight feel; respects `prefers-reduced-motion`.

2. **Photo gallery polish**
   - Main photo: rounded-[24px], 1px inner highlight ring, soft drop shadow `0 24px 60px -24px rgba(0,0,0,0.18)`.
   - Thumbnails: 56×56 → 64×64, rounded-[14px], active thumb gets a `ring-2 ring-primary ring-offset-2 ring-offset-background` instead of solid border; inactive thumbs at `opacity-60` and brighten on hover.
   - Add discrete left/right arrow buttons on the main image when more than one photo (desktop only).
   - Add a tiny "1 / 4" counter pill in bottom-right of main image.

3. **Right column hierarchy**
   - Restructure to three visual blocks separated by hairline dividers instead of multiple glass panels stacked:
     - **Header block**: category chip → H1 title → author (smaller, muted).
     - **Price block**: big price + small "Cash on Delivery via Steadfast" line directly under it (replaces the standalone "Delivery charge calculated at checkout" panel — keeps the message, less boxy).
     - **Meta block**: badges row (curriculum/genre + condition + stock indicator inline) — currently spread across 3 separate rows.
   - Reduces visual clutter from the 5–6 stacked glass panels.

4. **Seller card**
   - Convert plain text line into a compact avatar-style row: circular initial badge (first letter of seller name on a tinted primary background) + name + district. Feels human, not a notice bar.

5. **Seller's Note**
   - Keep glass panel but add a soft top-left quote glyph and italic body. Distinguishes it from generic info panels.

6. **Action buttons**
   - "Order Now" stays primary, but place "Save to Wishlist" and "Share on WhatsApp" side-by-side as secondary icons-only buttons on desktop (≥md), full-width stacked on mobile. Reduces button stack from 3 to a cleaner 1 + 2 layout.
   - Add a sticky bottom action bar on mobile (`fixed bottom-0` glass bar) holding price + "Order Now" — common modern e-commerce pattern, keeps CTA always reachable.

7. **Breadcrumb**
   - Add a small breadcrumb above the H1 on desktop: `Home / Books / {class or genre}` using existing `Breadcrumb` shadcn component. Already have BreadcrumbList JSON-LD; this surfaces it visually.

8. **Stock badge wording stays identical** (per memory). Only the placement changes.

---

## Animation polish (shared)

- Cards stagger in with 40ms delay using existing `staggerContainer`.
- Listing detail right-column blocks fade-up with 60ms delay between them.
- Cover image cross-fade duration bumped from 0.25s → 0.35s with `ease-out`.
- All respect `prefers-reduced-motion` via existing `animations.ts` helpers.

---

## Out of scope

- Wishlist logic, order flow, pricing math, SEO/JSON-LD, data fetching.
- Color palette or accent change (still `#E8357A` magenta + frosted glass).
- New routes or new fields.

---

## Files to be edited

- `src/components/ui/BookCard.tsx`
- `src/components/ui/SkeletonBookCard.tsx`
- `src/pages/ListingDetail.tsx`

No new dependencies. No DB changes.
