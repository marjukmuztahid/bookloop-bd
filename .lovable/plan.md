
# Blog Section + 15 SEO-Optimized Posts

## What gets built

A `/blog` index page and `/blog/:slug` post pages backed by static TypeScript files in the repo (no DB, no admin UI). 15 long-form posts (1,200–1,800 words each) targeting high-intent Bangladeshi keywords for old/second-hand books, written by **Marjuk Muztahid**, dated **Jan–May 2026**.

## The 15 posts (titles + primary keyword)

**Buying & Selling Guides**
1. How to Buy Old Books Online in Bangladesh (2026 Guide) — *old books online bangladesh*
2. How to Sell Your Old Books in Bangladesh for the Best Price — *sell old books bangladesh*
3. Complete Guide to Buying Second-Hand Books in Bangladesh — *second hand books bangladesh*
4. How to Price Your Used Books: Seller's Pricing Guide — *used book price bangladesh*

**Comparisons vs Alternatives**
5. Book Loop BD vs Nilkhet: Which is Better for Old Books? — *nilkhet old books*
6. Buying Books on Facebook Groups vs Verified Marketplace — *facebook book group bangladesh*
7. Why Verified Sellers Matter When Buying Old Books Online — *verified old book seller*

**Curriculum & Exam-Prep Lists**
8. Best Old NCTB Books for SSC Students (Save 50–70%) — *old ssc books*
9. HSC Reference Books Guide: Where to Find Cheap Used Copies — *hsc reference books cheap*
10. O-Level Cambridge Books in Bangladesh: Buying Used Copies — *o level books bangladesh*
11. A-Level Edexcel Old Books: A Student's Buying Guide — *a level books bangladesh*

**Local SEO + Sustainability**
12. Buy Old Books in Dhaka: Online Delivery Across the City — *old books dhaka*
13. Old Books in Chittagong, Sylhet & Beyond: Nationwide COD — *old books chittagong*
14. The Eco Impact of Reusing School Books in Bangladesh — *reuse textbooks bangladesh*

**Money-Saving / Student Angle**
15. 10 Smart Ways Bangladeshi Students Save Money on Books — *save money on textbooks*

Each post includes: intro hook, 4–6 H2 sections with H3 subsections, internal links (to `/`, `/how-it-works`, `/faq`, `/sell`, relevant other posts), keyword-rich alt text, FAQ block at bottom, CTA to browse/sell.

## Architecture

```
src/
  data/
    blog/
      posts.ts            // exported BlogPost[] metadata array
      content/
        how-to-buy-old-books-bd.tsx     // JSX content per post
        ...14 more
      index.ts            // re-exports + helpers (getBySlug, getRelated)
  pages/
    Blog.tsx              // /blog index — grid of post cards
    BlogPost.tsx          // /blog/:slug — article layout
  components/blog/
    BlogCard.tsx          // glass-panel post preview card
    ShareButtons.tsx      // WhatsApp + Facebook share (reuses existing pattern)
    RelatedPosts.tsx      // 3 related posts by tag overlap
    BlogTOC.tsx           // sticky table of contents (desktop)
```

`BlogPost` shape:
```ts
{ slug, title, excerpt, author: 'Marjuk Muztahid', publishedAt,
  updatedAt, readingMinutes, tags: string[], heroImage?, content: ReactNode,
  metaTitle, metaDescription, faqs?: {q,a}[] }
```

## SEO implementation per post

- **Per-route `<title>`, `<meta description>`, canonical, og:*** via existing `useSEO` hook (already supports per-page metadata and JSON-LD arrays).
- **JSON-LD schemas** stacked per post: `Article` (headline, author, datePublished, dateModified, image) + `BreadcrumbList` (Home → Blog → Post) + optional `FAQPage` when the post has FAQs.
- **Semantic HTML**: single `<h1>`, proper `<article>`, `<time>`, `<nav>` for breadcrumbs.
- **Internal linking**: every post links to 3–5 other posts + 2–3 site pages (boosts crawl depth & authority flow).
- **Sitemap**: add `/blog` + all 15 `/blog/:slug` URLs to `public/sitemap.xml` AND to the Supabase `sitemap` edge function so dynamic listings + blog all stay indexed.
- **Footer link** to `/blog` added.
- **Reading time** auto-calculated and shown (trust signal).

## Design (matches existing glass / iOS aesthetic)

- **Blog index**: hero with H1 "Book Loop BD Blog — Buying & Selling Old Books in Bangladesh", search-friendly intro paragraph, tag filter chips, responsive 3-col grid of `BlogCard` (glass-panel, hover lift, magenta accent on tag).
- **Post page**: max-w-prose article, hero image (optional, generated only if useful), title, author + date + reading time row, sticky TOC on lg+, body with Tailwind `prose` styling tuned to Inter + bg #F9F9F9, share buttons (WhatsApp/Facebook) at top + bottom, FAQ accordion, "Related posts" 3-card row, big CTA banner ("Browse old books" / "Sell your books").
- All colors use existing tokens (`#E8357A` magenta accent, glass-panel classes). No new design system work.

## Files touched/created

**New (~25 files)**
- `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx`
- `src/data/blog/posts.ts`, `src/data/blog/index.ts`
- `src/data/blog/content/*.tsx` × 15
- `src/components/blog/BlogCard.tsx`, `ShareButtons.tsx`, `RelatedPosts.tsx`, `BlogTOC.tsx`

**Edited**
- `src/App.tsx` — add `/blog` and `/blog/:slug` lazy routes
- `src/components/layout/Footer.tsx` — add "Blog" link
- `public/sitemap.xml` — add 16 entries
- `supabase/functions/sitemap/index.ts` — add `/blog` + 15 post paths to `STATIC_PAGES`

**Optional**
- Hero images via `imagegen` for the 4–5 highest-priority posts (rest use no image — placeholders hurt previews). I'll confirm before generating.

## Out of scope

- No CMS / admin editor (per your choice — static files).
- No comments, no likes, no view-counter.
- No newsletter signup (can add later if you want).
- No category/tag landing pages (tags filter the index in-place instead, simpler).

## Implementation order

1. Routes, types, blog index page + card components, share/related/TOC components.
2. Write all 15 posts (metadata + JSX content) with internal links + FAQs.
3. Wire sitemap (static + edge function) + footer link.
4. Verify build, spot-check 2–3 post pages in preview for layout/SEO meta correctness.

Approve to proceed.
