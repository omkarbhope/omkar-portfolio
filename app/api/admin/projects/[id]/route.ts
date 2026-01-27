import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Project } from '@/types';
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

    const project = await db.collection<Project>('projects').findOne({
      _id: new ObjectId(id) as unknown as string,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check embedding status
    const embeddingCount = await db.collection('embeddings').countDocuments({
      contentType: 'project',
      referenceId: id,
    });

    return NextResponse.json({
      ...project,
      _embeddingStatus: {
        exists: embeddingCount > 0,
        count: embeddingCount,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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
      updatedAt: new Date(),
    };

    await db.collection<Project>('projects').updateOne(
      { _id: new ObjectId(id) as unknown as string },
      { $set: updateData }
    );

    // Regenerate embeddings (non-blocking)
    try {
      await regenerateEmbeddingsForContent('project', id);
      const projectText = `${body.title}. ${body.description}. ${body.achievements?.join('. ') || ''}. ${body.techStack?.join(', ') || ''}`;
      await generateAndStoreEmbedding(
        projectText,
        'project',
        id,
        { projectId: id, title: body.title }
      );
    } catch (embeddingError: any) {
      console.error('Failed to regenerate embeddings (non-critical):', embeddingError);
      // Continue - project is still updated
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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

    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });

    // Delete associated embeddings
    await db.collection('embeddings').deleteMany({
      contentType: 'project',
      referenceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
