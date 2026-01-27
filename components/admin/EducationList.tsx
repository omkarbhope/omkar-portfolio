'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Education } from '@/types';

interface EducationListProps {
  education: Education[];
}

export default function EducationList({ education }: EducationListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (education.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No education entries found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Institution
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Degree
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              GPA
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {education.map((edu) => (
            <tr key={edu._id}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {edu.institution}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {edu.location}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {edu.degree}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {edu.field}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {edu.gpa ? `${edu.gpa}${edu.gpaScale ? ` / ${edu.gpaScale}` : ''}` : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/education/${edu._id}/edit`}
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(edu._id!)}
                    disabled={deleting === edu._id}
                    className="text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {deleting === edu._id ? 'Deleting...' : 'Delete'}
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
