import BlogCard from './BlogCard';
import type { BlogPost } from '@/data/blog/types';

const RelatedPosts = ({ posts }: { posts: BlogPost[] }) => {
  if (!posts.length) return null;
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-bold text-heading">Related reads</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <BlogCard key={p.slug} post={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
