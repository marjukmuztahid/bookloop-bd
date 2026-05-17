import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/data/blog/types';

interface Props {
  post: BlogPost;
  index?: number;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const BlogCard = ({ post, index = 0 }: Props) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group h-full"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="glass-panel flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(232,53,122,0.12)]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-[rgba(232,53,122,0.10)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#E8357A]">
            {post.category}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-heading transition-colors group-hover:text-[#E8357A]">
          {post.title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingMinutes} min
            </span>
          </div>
          <ArrowRight size={14} className="text-[#E8357A] transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
