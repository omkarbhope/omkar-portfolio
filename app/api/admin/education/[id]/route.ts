import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { Education } from '@/types';
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

    const education = await db.collection<Education>('education').findOne({
      _id: new ObjectId(id) as unknown as string,
    });

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
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
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      updatedAt: new Date(),
    };

    await db.collection<Education>('education').updateOne(
      { _id: new ObjectId(id) as unknown as string },
      { $set: updateData }
    );

    // Regenerate embeddings
    await regenerateEmbeddingsForContent('education', id);
    const educationText = `${body.degree} in ${body.field} from ${body.institution}. GPA: ${body.gpa || ''}/${body.gpaScale || 4}. Courses: ${body.courses?.join(', ') || ''}. Honors: ${body.honors?.join(', ') || ''}`;
    await generateAndStoreEmbedding(
      educationText,
      'education',
      id,
      { educationId: id, institution: body.institution, degree: body.degree }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
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

    await db.collection('education').deleteOne({ _id: new ObjectId(id) });

    // Delete associated embeddings
    await db.collection('embeddings').deleteMany({
      contentType: 'education',
      referenceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
