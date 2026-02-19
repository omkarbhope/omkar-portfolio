import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { BlogCoverImage } from '@/components/BlogCoverImage';
import type { Blog } from '@/types';

interface RelatedPostsProps {
  posts: (Blog & { _id: string })[];
  currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filtered = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (filtered.length === 0) return null;

  return (
    <aside className="mt-16 pt-12 border-t border-[var(--border)]">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
        Related posts
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post._id}
            href={`/blogs/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] transition hover:border-[var(--primary)]"
          >
            {post.coverImage && (
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--border)]">
                <BlogCoverImage
                  src={post.coverImage}
                  alt={`Cover for ${post.title}`}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  fallbackTitle={post.title}
                />
              </div>
            )}
            <div className="p-4">
              {post.publishedAt && (
                <time
                  dateTime={new Date(post.publishedAt).toISOString()}
                  className="text-xs text-[var(--text-tertiary)]"
                >
                  {formatDate(post.publishedAt)}
                </time>
              )}
              <h3 className="mt-1 font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] line-clamp-2">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
