'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Project } from '@/types';

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Featured
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Tech Stack
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {projects.map((project) => (
            <tr key={project._id}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.title}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {project.featured ? (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Yes
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">No</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/projects/${project._id}/edit`}
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id!)}
                    disabled={deleting === project._id}
                    className="text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {deleting === project._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
