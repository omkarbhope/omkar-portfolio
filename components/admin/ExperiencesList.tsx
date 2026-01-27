'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';

interface ExperiencesListProps {
  experiences: Experience[];
}

export default function ExperiencesList({ experiences }: ExperiencesListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (experiences.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No experiences found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Projects
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {experiences.map((experience) => (
            <tr key={experience._id}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {experience.company}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {experience.location}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {experience.position}
                </div>
                {experience.current && (
                  <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Current
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDateRange(experience.startDate, experience.endDate)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {experience.projects.length} project{experience.projects.length !== 1 ? 's' : ''}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/experiences/${experience._id}/edit`}
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(experience._id!)}
                    disabled={deleting === experience._id}
                    className="text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {deleting === experience._id ? 'Deleting...' : 'Delete'}
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
