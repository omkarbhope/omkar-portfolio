import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { LicenseCertification } from '@/types';
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

    const certification = await db.collection('licensesCertifications').findOne({
      _id: new ObjectId(id),
    });

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    return NextResponse.json(certification);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch certification' }, { status: 500 });
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
      issueDate: new Date(body.issueDate),
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
      updatedAt: new Date(),
    };

    await db.collection('licensesCertifications').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Regenerate embeddings
    await regenerateEmbeddingsForContent('license', id);
    const certText = `${body.name} certification from ${body.issuer}. Issued: ${body.issueDate}. ${body.credentialId ? `Credential ID: ${body.credentialId}` : ''}`;
    await generateAndStoreEmbedding(
      certText,
      'license',
      id,
      { certificationId: id, name: body.name, issuer: body.issuer }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
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

    await db.collection('licensesCertifications').deleteOne({ _id: new ObjectId(id) });

    // Delete associated embeddings
    await db.collection('embeddings').deleteMany({
      contentType: 'license',
      referenceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}
