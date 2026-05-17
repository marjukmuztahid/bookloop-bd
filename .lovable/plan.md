# Contact Page Enhancement Plan

Refresh `src/pages/Contact.tsx` to feel more professional while keeping the existing Frosted Glass / iOS aesthetic. No backend or schema changes needed.

## Layout

Switch the main container from `max-w-2xl` (single column) to `max-w-5xl` with a responsive grid:

```text
Desktop (md+):                 Mobile:
┌────────────┬────────────┐    ┌────────────┐
│  Contact   │  Business  │    │  Contact   │
│  Methods   │   Info     │    │  Methods   │
│  (left)    │  + Social  │    ├────────────┤
├────────────┤  (right)   │    │ Business   │
│ Quick FAQ  │            │    │   Info     │
│  (left)    │            │    ├────────────┤
└────────────┴────────────┘    │ Quick FAQ  │
                               ├────────────┤
                               │  Social    │
                               └────────────┘
```

- Left column: existing Email / WhatsApp / Phone / General Inquiries / Report a Problem cards (kept as-is)
- Right column: new **Business Info** card + **Follow Us** card
- Below: new **Quick Help** card with FAQ shortcuts

## 1. Business Info card (new)

A glass panel with three rows, each with an icon + label + value:

- **Response time** (Clock icon, magenta) — "Usually within 24 hours"
- **Support hours** (Calendar icon, magenta) — "Saturday – Thursday, 10 AM – 8 PM (BST)"
- **Languages** (Languages icon, magenta) — "Bangla & English"

## 2. Quick Help card (new)

Heading: "Quick Help — answers in seconds". Below it, a 2-col grid (1-col on mobile) of link tiles. Each tile is a `Link` (react-router) to `/faq` with a relevant question label:

- "How do I sell a book?"
- "How does delivery work?"
- "When will I get paid?"
- "What if my order doesn't arrive?"
- "Can I cancel an order?"
- "Browse all FAQs →" (primary styled, links to `/faq`)

Tiles use subtle hover lift (border + shadow transition) consistent with existing glass-panel styling.

## 3. Follow Us card (new)

A small glass panel with heading "Follow us" and three social buttons in a row:

- **Facebook** — link from existing footer (`https://www.facebook.com/share/17HMqPLb1L/`), hover color `#1877F2`
- **Instagram** — link from existing footer (`https://www.instagram.com/book_loop_bd?igsh=eW9`), hover color `#E1306C`
- **WhatsApp** — `https://wa.me/8801743661887`, hover color `#25D366`

Each button: 40×40 rounded-xl tile with the brand SVG (reuse the same SVGs already in `Footer.tsx` for Facebook/Instagram for consistency; use Lucide `MessageCircle` for WhatsApp or inline SVG).

## 4. Visual polish

- Update the page intro: keep the H1 "Contact / Report an Issue" but tighten the description.
- Add subtle entrance fade-in (Framer Motion `motion.div` with stagger) matching the site's existing animation patterns.
- Keep all colors via existing inline hex values that already appear in the file (magenta `#E8357A`, WhatsApp green `#25D366`, etc.) — no new design tokens needed.

## Technical notes

- **File edited:** `src/pages/Contact.tsx` only.
- **New Lucide icons:** `Clock`, `Calendar`, `Languages`, `HelpCircle`, `ArrowRight`, `Facebook`, `Instagram` (or keep custom SVG for brand accuracy).
- **No DB / no edge functions / no new routes** — FAQ links point to the existing `/faq` page.
- **SEO:** keep existing `useSEO` call; no changes.
- **Accessibility:** social icons get `aria-label`; FAQ tiles are real `<Link>` elements.
- **Responsive:** validated for the 602px viewport — grid collapses to single column below `md` (768px).

After implementation, the contact page becomes a proper "support hub" rather than just a list of contact methods.
