import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { ArchitectureDiagram } from '@/types';

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const diagram: Omit<ArchitectureDiagram, '_id'> = {
      ...body,
      createdAt: new Date(),
    };

    const result = await db.collection<ArchitectureDiagram>('architectureDiagrams').insertOne(diagram as any);

    return NextResponse.json({ _id: result.insertedId, ...diagram });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to upload diagram' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const db = await getDatabase();

    const query = projectId ? { projectId } : {};
    const diagrams = await db
      .collection<ArchitectureDiagram>('architectureDiagrams')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(diagrams);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch diagrams' }, { status: 500 });
  }
}
