import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getBlogs(): Promise<(Blog & { _id: string })[]> {
  try {
    const db = await getDatabase();
    const blogs = await db
      .collection<Blog>('blogs')
      .find({})
      .sort({ updatedAt: -1 })
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

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Blog</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Thoughts and updates
        </p>
      </div>

      {blogs.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] transition hover:border-[var(--primary)] hover:shadow-lg"
            >
              {blog.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden bg-[var(--border)]">
                  <Image
                    src={blog.coverImage}
                    alt=""
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)]">
                  {blog.title}
                </h2>
                {blog.publishedAt && (
                  <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                    {formatDate(blog.publishedAt)}
                  </p>
                )}
                {blog.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">
                    {blog.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
