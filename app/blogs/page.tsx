import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { BlogCoverImage } from '@/components/BlogCoverImage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, updates, and technical writing.',
  openGraph: {
    title: 'Blog',
    description: 'Thoughts, updates, and technical writing.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'Thoughts, updates, and technical writing.',
  },
};

const BLOGS_PAGE_SIZE = 12;
const BLOGS_SAFETY_LIMIT = 50;

async function getBlogs(options: {
  limit?: number;
  skip?: number;
  tag?: string;
} = {}): Promise<(Blog & { _id: string })[]> {
  const { limit = BLOGS_SAFETY_LIMIT, skip = 0, tag } = options;
  try {
    const db = await getDatabase();
    const filter = tag ? { tags: tag } : {};
    const blogs = await db
      .collection<Blog>('blogs')
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return blogs.map((blog) => ({
      ...blog,
      _id: blog._id?.toString() ?? '',
    }));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

async function getBlogsCount(tag?: string): Promise<number> {
  try {
    const db = await getDatabase();
    const filter = tag ? { tags: tag } : {};
    return await db.collection<Blog>('blogs').countDocuments(filter);
  } catch (error) {
    console.error('Error counting blogs:', error);
    return 0;
  }
}

async function getAllTags(): Promise<string[]> {
  try {
    const db = await getDatabase();
    const tags = await db.collection<Blog>('blogs').distinct('tags');
    return (tags as string[]).filter(Boolean).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

function excerptText(text: string | undefined, maxLength = 160): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + '…';
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageParam, tag: tagParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const tag = tagParam && String(tagParam).trim() ? String(tagParam).trim() : undefined;
  const skip = (page - 1) * BLOGS_PAGE_SIZE;

  const [blogs, total, allTags] = await Promise.all([
    getBlogs({ limit: BLOGS_PAGE_SIZE, skip, tag }),
    getBlogsCount(tag),
    getAllTags(),
  ]);

  const totalPages = Math.ceil(total / BLOGS_PAGE_SIZE);
  const hasMore = page < totalPages;
  const basePath = tag ? `/blogs?tag=${encodeURIComponent(tag)}` : '/blogs';

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Thoughts, updates, and technical writing.
        </p>
      </header>

      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/blogs"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !tag
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--background-alt)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={tag === t ? '/blogs' : `/blogs?tag=${encodeURIComponent(t)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tag === t
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background-alt)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {blogs.length > 0 ? (
        <>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/5"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--border)]">
                  {blog.coverImage ? (
                    <BlogCoverImage
                      src={blog.coverImage}
                      alt={`Cover for ${blog.title}`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      fallbackTitle={blog.title}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10">
                      <span className="text-4xl font-light text-[var(--text-tertiary)]">📝</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {blog.publishedAt && (
                      <time
                        dateTime={new Date(blog.publishedAt).toISOString()}
                        className="text-sm text-[var(--text-tertiary)]"
                      >
                        {formatDate(blog.publishedAt)}
                      </time>
                    )}
                    {blog.tags && blog.tags.length > 0 && (
                      <span className="flex flex-wrap gap-1.5">
                        {blog.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--primary)]"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                      {excerptText(blog.excerpt)}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-[var(--primary)]">
                    Read more
                    <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <div className="mt-14 flex justify-center">
              <Link
                href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${page + 1}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
              >
                Load more
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10 text-4xl text-[var(--primary)]">
            📝
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
            {tag ? `No posts in “${tag}”` : 'No posts yet'}
          </h2>
          <p className="mt-2 max-w-md mx-auto text-[var(--text-secondary)]">
            {tag
              ? 'Try another tag or browse all posts.'
              : 'Check back soon for thoughts, updates, and technical writing.'}
          </p>
          <Link
            href={tag ? '/blogs' : '/'}
            className="mt-6 inline-flex items-center rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            {tag ? 'View all posts' : 'Back to home'}
          </Link>
        </div>
      )}

      <p className="mt-12 text-center text-sm text-[var(--text-tertiary)]">
        <Link href="/blogs/feed" className="hover:text-[var(--primary)] hover:underline">
          RSS feed
        </Link>
      </p>
    </div>
  );
}
