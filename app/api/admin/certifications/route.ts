import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import type { LicenseCertification } from '@/types';
import { generateAndStoreEmbedding } from '@/lib/embeddings';

export async function GET() {
  try {
    await requireAuth();
    const db = await getDatabase();
    const certifications = await db
      .collection<LicenseCertification>('licensesCertifications')
      .find({})
      .sort({ issueDate: -1 })
      .toArray();

    return NextResponse.json(certifications);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const db = await getDatabase();

    const certification: Omit<LicenseCertification, '_id'> = {
      ...body,
      issueDate: new Date(body.issueDate),
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<LicenseCertification>('licensesCertifications').insertOne(certification as any);

    // Generate embeddings for the certification
    const certText = `${certification.name} certification from ${certification.issuer}. Issued: ${certification.issueDate}. ${certification.credentialId ? `Credential ID: ${certification.credentialId}` : ''}`;
    await generateAndStoreEmbedding(
      certText,
      'license',
      result.insertedId.toString(),
      { certificationId: result.insertedId.toString(), name: certification.name, issuer: certification.issuer }
    );

    return NextResponse.json({ _id: result.insertedId, ...certification });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}
