import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { Project } from '@/types';
import Link from 'next/link';
import ProjectsList from '@/components/admin/ProjectsList';

async function getProjects(): Promise<Project[]> {
  const db = await getDatabase();
  const projects = await db
    .collection<Project>('projects')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return projects.map((project) => ({
    ...project,
    _id: project._id?.toString(),
  }));
}

export default async function AdminProjectsPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Project
        </Link>
      </div>

      <ProjectsList projects={projects} />
    </div>
  );
}
