import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { BlogCoverImage } from '@/components/BlogCoverImage';
import { BlogPostViewClient } from '@/components/blog/BlogPostViewClient';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareBar } from '@/components/blog/ShareBar';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { getHeadingsFromBlocks, getReadingTimeMinutes } from '@/lib/blog-utils';
import type { Metadata } from 'next';

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

async function getRelatedBlogs(currentSlug: string, limit = 4): Promise<(Blog & { _id: string })[]> {
  try {
    const db = await getDatabase();
    const blogs = await db
      .collection<Blog>('blogs')
      .find({ slug: { $ne: currentSlug } })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();
    return blogs.map((b) => ({ ...b, _id: b._id?.toString() ?? '' }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: 'Post not found' };

  const title = blog.title;
  const description = blog.excerpt?.trim().slice(0, 160) || `${blog.title} – Blog post`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ombhope.com';
  const url = `${siteUrl}/blogs/${blog.slug}`;
  const image = blog.coverImage || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: image ? [{ url: image, alt: `Cover for ${blog.title}` }] : undefined,
      publishedTime: blog.publishedAt?.toISOString(),
      modifiedTime: blog.updatedAt?.toISOString(),
      authors: blog.author ? [blog.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: { canonical: url },
  };
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
  const headings = getHeadingsFromBlocks(content);
  const readingTimeMin = getReadingTimeMinutes(content);
  const [relatedPosts] = await Promise.all([getRelatedBlogs(slug, 4)]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ombhope.com';
  const postUrl = `${siteUrl}/blogs/${blog.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt || undefined,
    image: blog.coverImage || undefined,
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt?.toISOString(),
    author: blog.author ? { '@type': 'Person', name: blog.author } : undefined,
    url: postUrl,
  };

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-14 pb-24 sm:px-8 md:px-10 lg:px-12 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-10 text-sm text-[var(--text-tertiary)]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link href="/" className="text-[var(--primary)] hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/blogs" className="text-[var(--primary)] hover:underline">Blog</Link></li>
          <li aria-hidden>/</li>
          <li className="text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-none" aria-current="page">{blog.title}</li>
        </ol>
      </nav>

      <header className="mb-14">
        <h1 className="blog-post-title text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-[2.75rem] lg:text-5xl leading-tight">
          {blog.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[var(--text-tertiary)]">
          {blog.publishedAt && (
            <time dateTime={new Date(blog.publishedAt).toISOString()}>
              {formatDate(blog.publishedAt)}
            </time>
          )}
          {blog.updatedAt && (
            <span>Updated {formatDate(blog.updatedAt)}</span>
          )}
          <span>{readingTimeMin} min read</span>
          {blog.author && <span>{blog.author}</span>}
        </div>
        <div className="mt-4">
          <ShareBar title={blog.title} url={postUrl} />
        </div>
        {blog.coverImage && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl bg-[var(--border)] shadow-xl">
            <BlogCoverImage
              src={blog.coverImage}
              alt={`Cover for ${blog.title}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              fallbackTitle={blog.title}
            />
          </div>
        )}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1 min-w-0">
          <div className="blog-post-content rounded-xl border border-[var(--border)]/60 bg-[var(--background-alt)]/50 p-6 sm:p-8 md:p-10 text-[var(--text-secondary)] text-base leading-relaxed sm:text-[17px] sm:leading-[1.75]">
            <BlogPostViewClient content={content} headings={headings} />
          </div>
          <RelatedPosts posts={relatedPosts} currentSlug={slug} />
        </div>
        {headings.length > 0 && (
          <aside className="lg:w-56 shrink-0">
            <TableOfContents headings={headings} className="hidden lg:block" />
          </aside>
        )}
      </div>
      {/* Spacer so fixed bottom dock never overlaps the last code block */}
      <div className="h-24 md:h-32" aria-hidden />
    </article>
  );
}
