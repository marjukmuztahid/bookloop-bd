import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://bookloopbd.com";

const STATIC_PAGES = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/how-it-works", priority: "0.8", changefreq: "monthly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/faq", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", priority: "0.9", changefreq: "weekly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/signup", priority: "0.6", changefreq: "monthly" },
  { loc: "/login", priority: "0.5", changefreq: "monthly" },
  { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
];

const BLOG_POSTS = [
  { slug: "how-to-buy-old-books-online-bangladesh", lastmod: "2026-01-12" },
  { slug: "how-to-sell-old-books-bangladesh", lastmod: "2026-01-19" },
  { slug: "second-hand-books-bangladesh-guide", lastmod: "2026-01-26" },
  { slug: "used-book-pricing-guide", lastmod: "2026-02-02" },
  { slug: "book-loop-bd-vs-nilkhet", lastmod: "2026-02-09" },
  { slug: "facebook-groups-vs-marketplace", lastmod: "2026-02-16" },
  { slug: "verified-sellers-old-books-bangladesh", lastmod: "2026-02-23" },
  { slug: "old-nctb-books-ssc", lastmod: "2026-03-02" },
  { slug: "hsc-reference-books-cheap", lastmod: "2026-03-09" },
  { slug: "o-level-books-bangladesh", lastmod: "2026-03-16" },
  { slug: "a-level-books-bangladesh", lastmod: "2026-03-23" },
  { slug: "old-books-dhaka", lastmod: "2026-03-30" },
  { slug: "old-books-chittagong-sylhet", lastmod: "2026-04-06" },
  { slug: "reuse-textbooks-bangladesh", lastmod: "2026-04-13" },
  { slug: "save-money-on-textbooks", lastmod: "2026-04-20" },
];

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all available listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, created_at")
    .in("status", ["available", "sold_pending_delivery"])
    .order("created_at", { ascending: false });

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of STATIC_PAGES) {
    xml += `
  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  if (listings) {
    for (const listing of listings) {
      const lastmod = listing.created_at.split("T")[0];
      xml += `
  <url>
    <loc>${BASE_URL}/listings/${listing.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  }

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
