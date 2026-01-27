import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Experience } from '@/types';
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

    const experience = await db.collection<Experience>('experiences').findOne({
      _id: new ObjectId(id) as unknown as string,
    });

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
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

    // Process projects to convert architectureDiagrams from string to array
    const processedProjects = (body.projects || []).map((project: any) => ({
      ...project,
      architectureDiagrams: typeof project.architectureDiagrams === 'string'
        ? project.architectureDiagrams.split('\n').filter((url: string) => url.trim())
        : (project.architectureDiagrams || []),
    }));

    const updateData = {
      ...body,
      projects: processedProjects,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      updatedAt: new Date(),
    };

    await db.collection<Experience>('experiences').updateOne(
      { _id: new ObjectId(id) as unknown as string },
      { $set: updateData }
    );

    // Regenerate embeddings
    await regenerateEmbeddingsForContent('experience', id);
    const experienceText = `${body.position} at ${body.company}. ${body.projects?.map((p: any) => `${p.name}: ${p.description}`).join('. ') || ''}. Technologies: ${body.technologies?.join(', ') || ''}`;
    await generateAndStoreEmbedding(
      experienceText,
      'experience',
      id,
      { experienceId: id, company: body.company, position: body.position }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
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

    await db.collection('experiences').deleteOne({ _id: new ObjectId(id) });

    // Delete associated embeddings
    await db.collection('embeddings').deleteMany({
      contentType: 'experience',
      referenceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
