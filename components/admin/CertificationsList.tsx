'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { LicenseCertification } from '@/types';
import { formatDate } from '@/lib/utils';

interface CertificationsListProps {
  certifications: LicenseCertification[];
}

export default function CertificationsList({ certifications }: CertificationsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/certifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (certifications.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No certifications found.</p>
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
              Issuer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Issue Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {certifications.map((cert) => (
            <tr key={cert._id}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {cert.name}
                </div>
                {cert.credentialId && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {cert.credentialId}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {cert.issuer}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(cert.issueDate)}
                {cert.expirationDate && (
                  <div className="text-xs">
                    Expires: {formatDate(cert.expirationDate)}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/certifications/${cert._id}/edit`}
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cert._id!)}
                    disabled={deleting === cert._id}
                    className="text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {deleting === cert._id ? 'Deleting...' : 'Delete'}
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
