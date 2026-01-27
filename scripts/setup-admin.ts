// Load .env.local file BEFORE any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Now import other modules after env vars are loaded
import { getDatabase } from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import type { AdminUser } from '../types';

async function setupAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    process.exit(1);
  }

  try {
    const db = await getDatabase();
    const existingAdmin = await db.collection<AdminUser>('adminUsers').findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection<AdminUser>('adminUsers').updateOne(
        { email },
        { $set: { passwordHash } }
      );
      console.log('Admin password updated successfully!');
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection<AdminUser>('adminUsers').insertOne({
        email,
        passwordHash,
        role: 'admin',
        createdAt: new Date(),
      });
      console.log('Admin user created successfully!');
    }
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
