import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';

const RSS_LIMIT = 50;

export async function GET(request: Request) {
  try {
    const db = await getDatabase();
    const blogs = await db
      .collection<Blog>('blogs')
      .find({})
      .sort({ updatedAt: -1 })
      .limit(RSS_LIMIT)
      .toArray();

    /* Use request origin so feed URLs work in any environment (localhost, staging, production) */
    const url = new URL(request.url);
    const siteUrl = url.origin;
    const blogUrl = `${siteUrl}/blogs`;

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog</title>
    <description>Thoughts, updates, and technical writing.</description>
    <link>${blogUrl}</link>
    <atom:link href="${siteUrl}/blogs/feed" rel="self" type="application/rss+xml"/>
    ${blogs
      .map((post) => {
        const slug = post.slug;
        if (!slug) return '';
        const link = `${blogUrl}/${slug}`;
        const pubDate = post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : new Date(post.updatedAt).toISOString();
        const title = escapeXml(String(post.title ?? ''));
        const description = escapeXml(String(post.excerpt ?? '').slice(0, 500));
        return `    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      })
      .filter(Boolean)
      .join('\n')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return new Response('Error generating feed', { status: 500 });
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
