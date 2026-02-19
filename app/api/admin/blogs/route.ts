import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';
import { blocksToPlainText } from '@/lib/blocknote-utils';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const blogs = await db
      .collection<Blog>('blogs')
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(blogs);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const blog: Omit<Blog, '_id'> = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? '',
      content: Array.isArray(body.content) ? body.content : [],
      coverImage: body.coverImage || undefined,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      tags: body.tags,
      author: body.author,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Blog>('blogs').insertOne(blog as Blog);
    const id = result.insertedId.toString();

    const plainText = `${blog.title}\n${blog.excerpt}\n${blocksToPlainText(blog.content)}`;
    await generateAndStoreEmbedding(plainText, 'blog', id, {
      blogId: id,
      title: blog.title,
      slug: blog.slug,
    });

    return NextResponse.json({ _id: id, ...blog });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
