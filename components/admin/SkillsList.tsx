'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Skill } from '@/types';

interface SkillsListProps {
  skills: Skill[];
}

export default function SkillsList({ skills }: SkillsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (skills.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No skills found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Proficiency
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {skills.map((skill) => (
            <tr key={skill._id}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {skill.name}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {skill.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500"
                      style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.proficiency}/5
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/skills/${skill._id}/edit`}
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(skill._id!)}
                    disabled={deleting === skill._id}
                    className="text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {deleting === skill._id ? 'Deleting...' : 'Delete'}
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
