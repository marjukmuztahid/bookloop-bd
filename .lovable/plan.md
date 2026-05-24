## Add Seller Instructions to Sell a Book Page

Add a new instructions panel **below** the "What type of book are you selling?" card on the book-type selection step (Step 1) of `src/pages/SellBook.tsx`. The form step (Step 2) stays unchanged.

### Placement
- Same page, immediately under the existing `glass-panel` card that contains the Academic / General choices.
- Same `max-w-2xl` width container — flows naturally on mobile and desktop.

### Structure
A second `glass-panel` block containing:

1. **Bold heading at top** (magenta `#E8357A` accent + bold):
   > "Please read these seller instructions carefully before posting your book."

2. **Four grouped sections** with sub-headings and bullet lists:

   - **Before you list**
     - Photo must be your actual copy — no internet images
     - Mention missing pages, heavy writing, or torn covers in description
     - Set a fair price, correct weight, edition, class or genre etc.

   - **While listed**
     - If your book sells elsewhere (e.g. Facebook group, in person), remove it from Book Loop BD immediately to avoid confusions
     - Don't post the same book twice

   - **When ordered**
     - Be ready to hand over the book when Steadfast comes for pickup; a no-show may result in account suspension
     - Make sure your bKash/Nagad number is correct in your profile — that's how you get paid

   - **General**
     - Renew before expiry if still available
     - If your listing is rejected, read the reason and fix it before reposting

### Styling (matches existing design system)
- Container: `glass-panel` with `mt-6 p-6` (consistent with site frosted-glass aesthetic).
- Top heading: `text-sm sm:text-base font-bold text-[#E8357A]` with a faint magenta tint background card (`rgba(232,53,122,0.06)` rounded box) so it stands out.
- Group sub-headings: `text-xs font-bold uppercase tracking-wide text-[#1A1A1A]`.
- Bullets: `text-xs text-[#3A3A3A] leading-relaxed`, magenta dot markers.
- Sections separated by subtle spacing (`space-y-5`), no harsh dividers.

### Scope
- **Only edits `src/pages/SellBook.tsx`** — adds JSX inside the Step 1 branch.
- No new components, no logic changes, no DB/backend changes, no animation overhaul (inherits page transition).
