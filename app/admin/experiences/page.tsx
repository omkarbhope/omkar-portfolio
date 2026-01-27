import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { Experience } from '@/types';
import Link from 'next/link';
import ExperiencesList from '@/components/admin/ExperiencesList';

async function getExperiences(): Promise<Experience[]> {
  const db = await getDatabase();
  const experiences = await db
    .collection<Experience>('experiences')
    .find({})
    .sort({ startDate: -1 })
    .toArray();

  return experiences.map((exp) => ({
    ...exp,
    _id: exp._id?.toString(),
  }));
}

export default async function AdminExperiencesPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const experiences = await getExperiences();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Experiences</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your work experiences
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Experience
        </Link>
      </div>

      <ExperiencesList experiences={experiences} />
    </div>
  );
}
