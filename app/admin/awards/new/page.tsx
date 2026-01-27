'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { awardSchema, type AwardFormData } from '@/lib/validations';
import Link from 'next/link';

export default function NewAwardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardFormData>({
    resolver: zodResolver(awardSchema),
  });

  const onSubmit = async (data: AwardFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create award');
      }

      router.push('/admin/awards');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create award');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/awards"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Awards
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Award</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Add a new award or honor
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Award Title *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date *
                </label>
                <input
                  {...register('date')}
                  type="date"
                  id="date"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                <select
                  {...register('category')}
                  id="category"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="significance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Significance
              </label>
              <textarea
                {...register('significance')}
                id="significance"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URL
              </label>
              <input
                {...register('imageUrl')}
                type="url"
                id="imageUrl"
                placeholder="https://example.com/award-image.jpg"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/awards"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Award'}
          </button>
        </div>
      </form>
    </div>
  );
}
