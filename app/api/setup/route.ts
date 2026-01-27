import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import type { AdminUser } from '@/types';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const existingAdmin = await db.collection<AdminUser>('adminUsers').findOne({ email });

    if (existingAdmin) {
      // Update password
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection<AdminUser>('adminUsers').updateOne(
        { email },
        { $set: { passwordHash } }
      );
      return NextResponse.json({ message: 'Admin password updated successfully!' });
    } else {
      // Create new admin
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection<AdminUser>('adminUsers').insertOne({
        email,
        passwordHash,
        role: 'admin',
        createdAt: new Date(),
      });
      return NextResponse.json({ message: 'Admin user created successfully!' });
    }
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup admin user', details: error.message },
      { status: 500 }
    );
  }
}
