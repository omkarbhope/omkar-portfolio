import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { Award } from '@/types';
import Link from 'next/link';
import AwardsList from '@/components/admin/AwardsList';

async function getAwards(): Promise<Award[]> {
  const db = await getDatabase();
  const awards = await db
    .collection<Award>('awards')
    .find({})
    .sort({ date: -1 })
    .toArray();

  return awards.map((award) => ({
    ...award,
    _id: award._id?.toString(),
  }));
}

export default async function AdminAwardsPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const awards = await getAwards();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Awards</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your awards and honors
          </p>
        </div>
        <Link
          href="/admin/awards/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Award
        </Link>
      </div>

      <AwardsList awards={awards} />
    </div>
  );
}
