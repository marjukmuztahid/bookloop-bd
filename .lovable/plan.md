# Expand scope: University + Test-Prep books

Right now the platform only accepts school/college books (Class 1–10, SSC, HSC, O-Level, A-Level) under three curricula (Bangla Version, English Version, English Medium). We'll extend the academic book flow to also accept university and test-prep books, without touching the existing General Books flow.

## New taxonomy

Two new curriculum options will be added alongside the existing three:

- **University** → class levels: `Bachelors`, `Masters`
- **Test Prep** → class levels: `IELTS`, `GRE`, `SAT`, `TOEFL`

Existing curricula (Bangla Version / English Version / English Medium) keep their current class levels.

The Sell Book form's class-level dropdown will dynamically show the right list based on the selected curriculum, so a user picking "University" only sees Bachelors/Masters, etc.

## Files to update

**Frontend (pure UI / config):**
- `src/types/index.ts` — extend `Curriculum` type with `'university' | 'test_prep'`
- `src/pages/SellBook.tsx` — add the 2 new curriculum pills; replace the flat `CLASS_LEVELS` array with a curriculum→levels map so the dropdown filters correctly
- `src/pages/Home.tsx` — add new curricula to `CURRICULA_MAP`; extend `CLASSES` filter list with Bachelors, Masters, IELTS, GRE, SAT, TOEFL
- `src/components/ui/BookCard.tsx` — add labels `university: 'University'`, `test_prep: 'Test Prep'` in `curriculumLabels`
- `src/pages/HowItWorks.tsx` and `src/components/HowItWorksModal.tsx` — update copy that mentions "school/college" to include university & test-prep where shown
- `src/pages/About.tsx` — update mission copy to reflect the broader student audience
- `src/pages/FAQ.tsx` — update any FAQ entries that say "school and college only"

**Legal pages (copy updates):**
- `src/pages/PrivacyPolicy.tsx` — broaden the "school and college students" description to include university and test-prep learners
- `src/pages/Terms.tsx` — remove the explicit exclusion of university books and foreign editions (sections that currently forbid them), and update the "Permitted Listings" / "Prohibited Activities" wording accordingly

**Memory updates:**
- Update `mem://index.md` Core line — remove "No university curriculum"
- Update `mem://constraints/curriculum-scope` — rewrite to reflect new supported scope (school, college, university, test-prep)
- Update `mem://tech-stack/listing-data-mapping` — add the new curriculum slugs

## What we are NOT changing

- Database schema — `curriculum` and `class_level` are free-text `text` columns, no migration needed.
- General Books flow (genres, fiction/non-fiction, etc.) — untouched.
- Platform fee, delivery, checkout, RLS, admin panel — untouched.
- Existing listings — stay valid; their curriculum/class values are unaffected.
- No DB migration, no edge function changes.

## Verification

After implementation, I'll:
1. Open Sell Book → confirm new curriculum pills appear and the class-level dropdown swaps correctly per curriculum.
2. Open Home filters → confirm new curricula and class levels appear and filter results.
3. Spot-check the Privacy/Terms/About/FAQ pages for the updated copy.
