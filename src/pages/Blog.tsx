import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blog/BlogCard';
import useSEO from '@/hooks/useSEO';
import { getSortedPosts } from '@/data/blog/posts';

const CATEGORIES = [
  'All',
  'Buying Guides',
  'Selling Guides',
  'Comparisons',
  'Curriculum & Exam Prep',
  'Local & Sustainability',
] as const;

const Blog = () => {
  const posts = useMemo(() => getSortedPosts(), []);
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory],
  );

  useSEO({
    title: 'Old Books Blog — Buying & Selling Guides | Book Loop BD',
    description:
      'Guides, comparisons and tips for buying and selling old books in Bangladesh — NCTB, SSC, HSC, O-Level, A-Level. Save 50–70% with Cash on Delivery nationwide.',
    canonicalPath: '/blog',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Book Loop BD Blog',
        url: 'https://bookloopbd.com/blog',
        description:
          'Guides on buying and selling old books in Bangladesh — second-hand textbooks, NCTB, SSC, HSC, O-Level, A-Level.',
        publisher: {
          '@type': 'Organization',
          name: 'Book Loop BD',
          url: 'https://bookloopbd.com',
        },
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `https://bookloopbd.com/blog/${p.slug}`,
          datePublished: p.publishedAt,
          author: { '@type': 'Person', name: p.author },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bookloopbd.com/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bookloopbd.com/blog' },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-[rgba(232,53,122,0.10)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#E8357A]">
            Book Loop BD Blog
          </span>
          <h1 className="mx-auto mb-3 max-w-3xl text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Buying &amp; Selling Old Books in Bangladesh
          </h1>
          <p className="mx-auto max-w-2xl text-[15px] leading-7 text-muted-foreground">
            Guides, comparisons and practical tips for second-hand textbooks across Bangladesh
            — NCTB, SSC, HSC, O-Level, A-Level, and more. Written for students, by Book Loop BD.
          </p>
        </motion.header>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  isActive
                    ? 'rounded-full bg-[#E8357A] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(232,53,122,0.25)]'
                    : 'rounded-full bg-white/60 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white hover:text-[#E8357A]'
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No posts in this category yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
