import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { ArchitectureDiagram } from '@/types';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    await db.collection<ArchitectureDiagram>('architectureDiagrams').deleteOne({
      _id: new ObjectId(id) as unknown as string,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete diagram' }, { status: 500 });
  }
}
