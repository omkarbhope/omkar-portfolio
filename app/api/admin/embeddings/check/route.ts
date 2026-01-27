import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') || 'project';
    const referenceId = searchParams.get('referenceId');

    const db = await getDatabase();

    if (referenceId) {
      // Check embeddings for a specific item
      const count = await db.collection('embeddings').countDocuments({
        contentType,
        referenceId,
      });

      const embeddings = await db
        .collection('embeddings')
        .find(
          {
            contentType,
            referenceId,
          },
          { projection: { content: 1, metadata: 1, createdAt: 1, _id: 0 } }
        )
        .toArray();

      return NextResponse.json({
        exists: count > 0,
        count,
        embeddings,
      });
    } else {
      // Get summary for all content types
      const summary = await db
        .collection('embeddings')
        .aggregate([
          {
            $group: {
              _id: '$contentType',
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      const totalCount = await db.collection('embeddings').countDocuments();

      return NextResponse.json({
        total: totalCount,
        byContentType: summary,
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error checking embeddings:', error);
    return NextResponse.json(
      { error: 'Failed to check embeddings', details: error.message },
      { status: 500 }
    );
  }
}
