import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import BlogPostView from '@/components/BlogPostView';

export const dynamic = 'force-dynamic';

async function getBlogBySlug(slug: string): Promise<(Blog & { _id: string }) | null> {
  try {
    const db = await getDatabase();
    const blog = await db.collection<Blog>('blogs').findOne({ slug });

    if (!blog) return null;

    return {
      ...blog,
      _id: blog._id?.toString() ?? '',
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const content = Array.isArray(blog.content) ? blog.content : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/blogs"
        className="mb-8 inline-flex items-center text-sm font-medium text-[var(--primary)] hover:underline"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {blog.title}
        </h1>
        {blog.publishedAt && (
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">
            {formatDate(blog.publishedAt)}
          </p>
        )}
        {blog.coverImage && (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg bg-[var(--border)]">
            <Image
              src={blog.coverImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
      </header>

      <div className="text-[var(--text-secondary)]">
        <BlogPostView content={content} />
      </div>
    </article>
  );
}
