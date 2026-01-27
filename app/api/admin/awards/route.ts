import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Award } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const awards = await db
      .collection<Award>('awards')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(awards);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const award: Omit<Award, '_id'> = {
      ...body,
      date: new Date(body.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Award>('awards').insertOne(award as any);

    // Generate embeddings for the award
    const awardText = `${award.title} award from ${award.issuer}. ${award.description}. ${award.significance || ''}. Category: ${award.category}`;
    await generateAndStoreEmbedding(
      awardText,
      'award',
      result.insertedId.toString(),
      { awardId: result.insertedId.toString(), title: award.title, category: award.category }
    );

    return NextResponse.json({ _id: result.insertedId, ...award });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 });
  }
}
