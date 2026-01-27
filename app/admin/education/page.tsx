import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { Education } from '@/types';
import Link from 'next/link';
import EducationList from '@/components/admin/EducationList';

async function getEducation(): Promise<Education[]> {
  const db = await getDatabase();
  const education = await db
    .collection<Education>('education')
    .find({})
    .sort({ endDate: -1 })
    .toArray();

  return education.map((edu) => ({
    ...edu,
    _id: edu._id?.toString(),
  }));
}

export default async function AdminEducationPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const education = await getEducation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your education entries
          </p>
        </div>
        <Link
          href="/admin/education/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Education
        </Link>
      </div>

      <EducationList education={education} />
    </div>
  );
}
