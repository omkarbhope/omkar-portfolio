import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import {
  regenerateEmbeddingsForContent,
  generateAndStoreEmbedding,
} from '@/lib/embeddings';
import { blocksToPlainText } from '@/lib/blocknote-utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    const blog = await db.collection<Blog>('blogs').findOne({
      _id: new ObjectId(id) as unknown as string,
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    const updateData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? '',
      content: Array.isArray(body.content) ? body.content : [],
      coverImage: body.coverImage || undefined,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      tags: body.tags,
      author: body.author,
      updatedAt: new Date(),
    };

    await db.collection<Blog>('blogs').updateOne(
      { _id: new ObjectId(id) as unknown as string },
      { $set: updateData }
    );

    await regenerateEmbeddingsForContent('blog', id);
    const plainText = `${body.title}\n${body.excerpt ?? ''}\n${blocksToPlainText(updateData.content)}`;
    await generateAndStoreEmbedding(plainText, 'blog', id, {
      blogId: id,
      title: body.title,
      slug: body.slug,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    await db.collection<Blog>('blogs').deleteOne({ _id: new ObjectId(id) as unknown as string });
    await db.collection('embeddings').deleteMany({
      contentType: 'blog',
      referenceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
