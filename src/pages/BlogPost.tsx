import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Calendar, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedPosts from '@/components/blog/RelatedPosts';
import useSEO from '@/hooks/useSEO';
import { getPostBySlug, getRelatedPosts } from '@/data/blog/posts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const BlogPost = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = useMemo(() => getPostBySlug(slug), [slug]);
  const related = useMemo(() => (post ? getRelatedPosts(post.slug, 3) : []), [post]);

  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    const url = `https://bookloopbd.com/blog/${post.slug}`;
    const schemas: Record<string, any>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        author: { '@type': 'Person', name: post.author },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        publisher: {
          '@type': 'Organization',
          name: 'Book Loop BD',
          url: 'https://bookloopbd.com',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bookloopbd.com/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bookloopbd.com/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ];
    if (post.faqs && post.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }
    return schemas;
  }, [post]);

  useSEO({
    title: post?.metaTitle || 'Blog | Book Loop BD',
    description: post?.metaDescription,
    canonicalPath: post ? `/blog/${post.slug}` : '/blog',
    ogType: 'article',
    jsonLd,
  });

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-[#E8357A]">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/blog" className="hover:text-[#E8357A]">
            Blog
          </Link>
          <ChevronRight size={12} />
          <span className="line-clamp-1 text-heading">{post.title}</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <span className="mb-3 inline-block rounded-full bg-[rgba(232,53,122,0.10)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#E8357A]">
              {post.category}
            </span>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-heading sm:text-[36px]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User size={13} />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.readingMinutes} min read
              </span>
            </div>
          </header>

          <div className="glass-panel mb-6 p-3">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          <div>{post.content}</div>

          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-heading">Frequently asked questions</h2>
              <div className="glass-panel p-2 sm:p-4">
                <Accordion type="single" collapsible className="w-full">
                  {post.faqs.map(({ q, a }, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border-b border-white/40 last:border-b-0"
                    >
                      <AccordionTrigger className="px-2 text-left text-sm font-semibold text-heading hover:no-underline sm:px-3">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="px-2 text-sm leading-relaxed text-muted-foreground sm:px-3">
                        {a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          )}

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/40 pt-6 sm:flex-row sm:items-center">
            <ShareButtons title={post.title} slug={post.slug} />
            <Link
              to="/blog"
              className="text-sm font-medium text-[#E8357A] hover:underline"
            >
              ← Back to all posts
            </Link>
          </div>

          {/* CTA */}
          <section className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#E8357A] to-[#c8255f] p-6 text-center text-white shadow-[0_12px_32px_rgba(232,53,122,0.25)] sm:p-8">
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Ready to save on your next book?
            </h2>
            <p className="mb-5 text-sm text-white/90">
              Browse thousands of verified old books, or list yours in under two minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#E8357A] transition hover:bg-white/90"
              >
                Browse Old Books
              </Link>
              <Link
                to="/sell"
                className="rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Sell a Book
              </Link>
            </div>
          </section>
        </motion.article>

        <RelatedPosts posts={related} />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
