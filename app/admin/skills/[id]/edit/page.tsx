'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, type SkillFormData } from '@/lib/validations';
import type { Skill } from '@/types';
import Link from 'next/link';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch(`/api/admin/skills/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch skill');
        }
        const skill: Skill = await response.json();
        
        reset({
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          icon: skill.icon || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load skill');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSkill();
    }
  }, [id, reset]);

  const onSubmit = async (data: SkillFormData) => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update skill');
      }

      router.push('/admin/skills');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update skill');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">Loading skill...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/skills"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Skills
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Skill</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Update skill information
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
                Skill Name *
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                {...register('category')}
                id="category"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="Languages">Languages</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Databases">Databases</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="DevOps">DevOps</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proficiency (1-5) *
              </label>
              <input
                {...register('proficiency', { valueAsNumber: true })}
                type="number"
                min="1"
                max="5"
                id="proficiency"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.proficiency && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proficiency.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icon URL (Optional)
              </label>
              <input
                {...register('icon')}
                type="url"
                id="icon"
                placeholder="https://example.com/icon.svg"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.icon && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.icon.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/skills"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
