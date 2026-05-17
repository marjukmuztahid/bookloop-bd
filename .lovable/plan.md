# Improve AI discoverability + Google ranking signals

## Reality check

No code change can guarantee a #1 Google ranking. Ranking depends on
backlinks, brand authority, time, and competition. What we **can** do
is make sure every on-page signal Google and AI assistants
(ChatGPT, Perplexity, Claude, Gemini) read is clean, rich, and
keyword-aligned. The work below covers all of that.

## What I'll change

### 1. Richer `/llms.txt` for AI assistants
Today's file is a 3-line skeleton. AI crawlers use this to decide
whether to recommend your site. I'll rewrite it with:
- Clear positioning: "Bangladesh's marketplace for second-hand
  school/college books, COD via Steadfast Courier across 64 districts."
- The user problem it solves (affordable textbooks, recouping money on
  finished books).
- How buying and selling actually works (3-4 steps each).
- Coverage (academic levels, general genres, districts).
- Trust info (no refunds policy, admin-moderated listings, contact channels).
- Curated links to the key pages.

### 2. Per-page meta titles + descriptions
Right now most pages reuse near-identical titles. I'll rewrite each
route's `useSEO` call with a unique, keyword-rich title (under 60 chars)
and description (under 160 chars):
- Home → "Buy & Sell Second-Hand School Books in Bangladesh"
- About → "About Book Loop BD — Affordable Used Books for BD Students"
- How It Works → "How to Buy & Sell Used Books in Bangladesh — Book Loop BD"
- Contact, Sign Up, Login, Privacy, Terms → tightened similarly
- Listing Detail → already dynamic, but I'll add the price + district
  into the title for richer SERP snippets

### 3. Structured data (rich snippets)
- **FAQPage JSON-LD on `/how-it-works`** — lets Google show
  expandable Q&A under your result and lets AI assistants quote
  answers directly. I'll convert the existing steps into Q&A pairs.
- **BreadcrumbList JSON-LD on `/listings/:id`** — gives Google
  the "Home › Listings › Book Name" trail in search results.
- Organization + WebSite JSON-LD already in `index.html` (done in
  the last pass).
- Product JSON-LD already on listing pages (done in the last pass).

### 4. Dynamic sitemap including every listing
Today's sitemap only lists 9 static pages. I'll add a build-time
generator script (`scripts/generate-sitemap.ts`) that:
- Pulls all `available` and `sold_pending_delivery` listings from
  Supabase using the anon key.
- Emits one `<url>` per listing at `/listings/<id>` with `lastmod`.
- Runs via `predev` + `prebuild` npm scripts so it stays fresh on
  every deploy.
This is what gets your individual book pages indexed.

### 5. Semantic HTML polish
- Ensure every page has exactly one `<h1>`.
- Verify alt text on listing images uses the dynamic format already
  in your memory (book name + condition + curriculum).
- Add `aria-label` on icon-only buttons that lack one.

### 6. Optional, requires your input
- **Google Search Console verification** — once you publish, I can
  verify your site so you can submit the sitemap and watch
  impressions/clicks. Needs the Search Console connector enabled.
- **OG share image** — a real 1200×630 image (with logo + tagline)
  performs far better on WhatsApp/Facebook shares than the favicon.
  I can generate one if you want.

## Out of scope (only you can do these)

These move the needle on ranking more than any code change, but
they aren't code:
- **Backlinks**: get listed in Bangladeshi student blogs, FB groups,
  university forums, ed-tech directories.
- **Brand searches**: people Googling "Book Loop BD" by name is the
  strongest authority signal there is — promote on social.
- **Fresh content**: a `/blog` with posts like "How to sell HSC
  textbooks in Dhaka" targets long-tail keywords. Tell me if you
  want this scaffolded.

## Technical notes

- Sitemap generator uses the public anon key already in `.env` —
  read-only `select` on `listings` with the existing RLS policy.
- JSON-LD goes through the existing `useSEO` hook (already supports
  `jsonLd`) so no new dependency.
- No design or business-logic changes; pure SEO/metadata work.
