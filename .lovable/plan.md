# Academic / General Book Sections

Introduce a new `book_type` dimension across the platform so the marketplace can list both academic textbooks and general books (fiction, religious, etc.) — each with its own filters and sell form.

---

## 1. Database (migration)

Add to `listings`:
- `book_type` text NOT NULL DEFAULT `'academic'` with CHECK in (`'academic'`, `'general'`)
- `genre` text NULL with CHECK in the 9 allowed genres (or NULL)
- Backfill: existing rows stay `'academic'`, `genre = NULL`
- Make `curriculum` and `class_level` nullable (currently NOT NULL) so general listings can omit them
- Index on `book_type` for fast filtering

No RLS changes needed — existing policies stay.

---

## 2. Shared constants

New file `src/data/genres.ts` exporting the genre list + a `GENRE_BADGE` style. Update `src/types/index.ts`:
- `BookType = 'academic' | 'general'`
- `Genre = 'Fiction' | 'Non-fiction' | ...`
- Add `book_type` and `genre?` to `Listing` and `BookCardData`

---

## 3. Homepage — Academic / General tabs (`src/pages/Home.tsx`)

- Add `bookType` state, initialized from `localStorage.getItem('bookTypeTab')` (default `'academic'`), persisted on change
- Render two frosted-glass pill tabs ("📚 Academic Books" / "📖 General Books") between hero and the search/filter panel; active tab uses the `#E8357A` fill, inactive uses standard glass style
- Wrap filter bar + grid in `AnimatePresence` with a fade `motion.div` keyed on `bookType`
- **Academic tab**: existing filter bar unchanged; query adds `.eq('book_type', 'academic')`
- **General tab**: replace Curriculum + Class selects with a single Genre select (All + 9 options); keep Condition, District, Price, Sort; query adds `.eq('book_type', 'general')` and applies genre filter when set
- Search input shared; respects active tab (already scoped via the `book_type` filter)
- `clearFilters` resets the appropriate fields per tab; reset page to 1 on tab switch

---

## 4. BookCard + Listing Detail badges

`src/components/ui/BookCard.tsx`:
- Accept `book_type` and `genre` on `BookCardData`
- For `book_type === 'general'`: render Genre badge in place of curriculum; for academic: unchanged
- Add new `GlassBadge` variant `genre` with purple/violet tint (`bg-[rgba(139,92,246,0.10)] border-[rgba(139,92,246,0.25)] text-[#6D28D9]`) in `src/components/ui/GlassBadge.tsx`

`src/pages/ListingDetail.tsx`:
- For general listings: hide Curriculum/Class rows, show Genre and Author
- Show small "Academic"/"General" type chip near the title

---

## 5. Sell flow (`src/pages/SellBook.tsx`)

Add a first step before the form:
- Centered card: "What type of book are you selling?" with two large frosted-glass option cards (Academic / General) with hover scale
- After selection, transition (AnimatePresence) into the appropriate form

Forms:
- **Academic**: existing form, submits with `book_type: 'academic'`, `genre: null`
- **General**: same layout minus Curriculum and Class; add Genre select (required) and Author (optional text — wire to existing `author_publisher` column); all other fields identical; submits with `book_type: 'general'`, `genre`, `curriculum: null`, `class_level: null`
- "Back" link in the form header to return to the type selection step

---

## 6. Admin panel

- `src/pages/admin/ListingsQueue.tsx`: 
  - Select `book_type, genre` in the query
  - Add second row of pill tabs: All / Academic / General that filter by `book_type`
  - Render small "Academic"/"General" chip beside each book name; for general listings show Genre badge instead of curriculum
- `src/pages/admin/OrdersQueue.tsx`, `ActiveDeliveries.tsx`, `OrderHistory.tsx`, `Revenue.tsx`, `AdminDashboard.tsx`: include `book_type` (and `genre` where listing details are shown) in the joined listing select, and render the type chip next to listing titles. For general listings in detail views, show Genre and hide Curriculum/Class.

---

## 7. Dashboard — My Listings (`src/pages/Dashboard.tsx`)

- Include `book_type` in the listings select
- Render a small Academic/General chip on each listing card

---

## Technical details

- Genre options: `Fiction`, `Non-fiction`, `Self-help / Motivational`, `Religious`, `Science & Technology`, `History & Biography`, `Children's Books`, `Comics`, `Other`
- Type chip component reused (e.g. small variant of `GlassBadge` with new `academic`/`general` variants, or a single `<TypeChip type={book_type}/>` helper) to keep styling consistent
- All queries that previously assumed `curriculum`/`class_level` exist must tolerate `null`
- Trigger `listings_auto_fields` continues to work unchanged (only touches price/expiry)
- `localStorage` key: `bookTypeTab` with values `academic` | `general`

---

## Out of scope

- No changes to checkout, fee logic, emails, or notifications
- No edits to the `mark_listing_sold_pending` / `decrement_listing_quantity` functions
- Mock data (`src/data/mockBooks.ts`) left as-is unless it breaks types — will add `book_type: 'academic'` defaults if needed
