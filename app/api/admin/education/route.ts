import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Education } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const education = await db
      .collection<Education>('education')
      .find({})
      .sort({ endDate: -1 })
      .toArray();

    return NextResponse.json(education);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const education: Omit<Education, '_id'> = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Education>('education').insertOne(education as any);

    // Generate embeddings for the education
    const educationText = `${education.degree} in ${education.field} from ${education.institution}. GPA: ${education.gpa}/${education.gpaScale || 4}. Courses: ${education.courses.join(', ')}. Honors: ${education.honors.join(', ')}`;
    await generateAndStoreEmbedding(
      educationText,
      'education',
      result.insertedId.toString(),
      { educationId: result.insertedId.toString(), institution: education.institution, degree: education.degree }
    );

    return NextResponse.json({ _id: result.insertedId, ...education });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}
