import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Project } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const projects = await db
      .collection<Project>('projects')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const project: Omit<Project, '_id'> = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Project>('projects').insertOne(project as any);

    // Generate embeddings for the project (non-blocking - continue even if it fails)
    try {
      const projectText = `${project.title}. ${project.description}. ${project.achievements?.join('. ') || ''}. ${project.techStack?.join(', ') || ''}`;
      await generateAndStoreEmbedding(
        projectText,
        'project',
        result.insertedId.toString(),
        { projectId: result.insertedId.toString(), title: project.title }
      );
    } catch (embeddingError: any) {
      console.error('Failed to generate embeddings (non-critical):', embeddingError);
      // Continue without embeddings - project is still created
    }

    return NextResponse.json({ _id: result.insertedId, ...project });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
