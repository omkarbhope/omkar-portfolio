'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceFormData } from '@/lib/validations';
import Link from 'next/link';

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      current: false,
      projects: [],
      technologies: [],
    },
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects',
  });

  const technologies = watch('technologies') || [];
  const isCurrent = watch('current');

  const addTechnology = () => {
    const input = document.getElementById('technologyInput') as HTMLInputElement;
    if (input?.value.trim()) {
      setValue('technologies', [...technologies, input.value.trim()]);
      input.value = '';
    }
  };

  const removeTechnology = (index: number) => {
    setValue('technologies', technologies.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create experience');
      }

      router.push('/admin/experiences');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/experiences"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Experiences
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Experience</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Add a new work experience
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company *
              </label>
              <input
                {...register('company')}
                type="text"
                id="company"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Position *
              </label>
              <input
                {...register('position')}
                type="text"
                id="position"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location *
              </label>
              <input
                {...register('location')}
                type="text"
                id="location"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  id="startDate"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  id="endDate"
                  disabled={isCurrent}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Position
              </label>
              <div className="mt-2 flex items-center">
                <input
                  {...register('current')}
                  type="checkbox"
                  id="current"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="current" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  I currently work here
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Technologies
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                id="technologyInput"
                placeholder="Add technology"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTechnology}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Projects
            </h2>
            <button
              type="button"
              onClick={() => appendProject({ name: '', description: '', technologies: [], architectureDiagrams: '' })}
              className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Add Project
            </button>
          </div>

          <div className="space-y-4">
            {projectFields.map((field, index) => (
              <div key={field.id} className="rounded-md border border-gray-200 p-4 dark:border-gray-600">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Project {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Project Name *
                    </label>
                    <input
                      {...register(`projects.${index}.name`)}
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Description *
                    </label>
                    <textarea
                      {...register(`projects.${index}.description`)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Architecture Diagrams (URLs, one per line)
                    </label>
                    <textarea
                      {...register(`projects.${index}.architectureDiagrams`)}
                      rows={3}
                      placeholder="https://example.com/diagram1.png&#10;https://example.com/diagram2.png"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enter one URL per line for architecture diagrams
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {projectFields.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No projects added. Click "Add Project" to add one.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/experiences"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Experience'}
          </button>
        </div>
      </form>
    </div>
  );
}
