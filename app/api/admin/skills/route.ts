import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Skill } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const skills = await db
      .collection<Skill>('skills')
      .find({})
      .sort({ category: 1, proficiency: -1 })
      .toArray();

    return NextResponse.json(skills);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const skill: Omit<Skill, '_id'> = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Skill>('skills').insertOne(skill as any);

    // Generate embeddings for the skill
    const skillText = `${skill.name} - ${skill.category} skill with proficiency level ${skill.proficiency}/5`;
    await generateAndStoreEmbedding(
      skillText,
      'skill',
      result.insertedId.toString(),
      { skillId: result.insertedId.toString(), name: skill.name, category: skill.category }
    );

    return NextResponse.json({ _id: result.insertedId, ...skill });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
