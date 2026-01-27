'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, type CertificationFormData } from '@/lib/validations';
import Link from 'next/link';

export default function NewCertificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
  });

  const hasExpiration = watch('expirationDate');

  const onSubmit = async (data: CertificationFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create certification');
      }

      router.push('/admin/certifications');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/certifications"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Certifications
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Certification</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Add a new license or certification
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Certification Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issuer *
              </label>
              <input
                {...register('issuer')}
                type="text"
                id="issuer"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.issuer && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.issuer.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Issue Date *
                </label>
                <input
                  {...register('issueDate')}
                  type="date"
                  id="issueDate"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.issueDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.issueDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expiration Date
                </label>
                <input
                  {...register('expirationDate')}
                  type="date"
                  id="expirationDate"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expirationDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Credential ID
              </label>
              <input
                {...register('credentialId')}
                type="text"
                id="credentialId"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="verificationUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification URL
              </label>
              <input
                {...register('verificationUrl')}
                type="url"
                id="verificationUrl"
                placeholder="https://example.com/verify"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.verificationUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.verificationUrl.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="badgeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Badge URL
              </label>
              <input
                {...register('badgeUrl')}
                type="url"
                id="badgeUrl"
                placeholder="https://example.com/badge.png"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.badgeUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.badgeUrl.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <input
                {...register('category')}
                type="text"
                id="category"
                placeholder="e.g., Cloud, Security, Development"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/certifications"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Certification'}
          </button>
        </div>
      </form>
    </div>
  );
}
