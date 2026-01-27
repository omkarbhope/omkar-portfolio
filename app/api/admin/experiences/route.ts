import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Experience } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const experiences = await db
      .collection<Experience>('experiences')
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json(experiences);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    // Process projects to convert architectureDiagrams from string to array
    const processedProjects = (body.projects || []).map((project: any) => ({
      ...project,
      architectureDiagrams: typeof project.architectureDiagrams === 'string'
        ? project.architectureDiagrams.split('\n').filter((url: string) => url.trim())
        : (project.architectureDiagrams || []),
    }));

    const experience: Omit<Experience, '_id'> = {
      ...body,
      projects: processedProjects,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Experience>('experiences').insertOne(experience as any);

    // Generate embeddings for the experience
    const experienceText = `${experience.position} at ${experience.company}. ${experience.projects.map(p => `${p.name}: ${p.description}`).join('. ')}. Technologies: ${experience.technologies.join(', ')}`;
    await generateAndStoreEmbedding(
      experienceText,
      'experience',
      result.insertedId.toString(),
      { experienceId: result.insertedId.toString(), company: experience.company, position: experience.position }
    );

    return NextResponse.json({ _id: result.insertedId, ...experience });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
