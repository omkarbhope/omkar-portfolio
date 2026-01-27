import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { Skill } from '@/types';
import Link from 'next/link';
import SkillsList from '@/components/admin/SkillsList';

async function getSkills(): Promise<Skill[]> {
  const db = await getDatabase();
  const skills = await db
    .collection<Skill>('skills')
    .find({})
    .sort({ category: 1, proficiency: -1 })
    .toArray();

  return skills.map((skill) => ({
    ...skill,
    _id: skill._id?.toString(),
  }));
}

export default async function AdminSkillsPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const skills = await getSkills();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your skills
          </p>
        </div>
        <Link
          href="/admin/skills/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Skill
        </Link>
      </div>

      <SkillsList skills={skills} />
    </div>
  );
}
