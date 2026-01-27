import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Award } from '@/types';
import { regenerateEmbeddingsForContent, generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    const award = await db.collection('awards').findOne({
      _id: new ObjectId(id),
    });

    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 });
    }

    return NextResponse.json(award);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch award' }, { status: 500 });
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
      ...body,
      date: new Date(body.date),
      updatedAt: new Date(),
    };

    await db.collection('awards').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Regenerate embeddings
    await regenerateEmbeddingsForContent('award', id);
    const awardText = `${body.title} award from ${body.issuer}. ${body.description}. ${body.significance || ''}. Category: ${body.category}`;
    await generateAndStoreEmbedding(
      awardText,
      'award',
      id,
      { awardId: id, title: body.title, category: body.category }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    await db.collection('awards').deleteOne({ _id: new ObjectId(id) });

    // Delete associated embeddings
    await db.collection('embeddings').deleteMany({
      contentType: 'award',
      referenceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 });
  }
}
