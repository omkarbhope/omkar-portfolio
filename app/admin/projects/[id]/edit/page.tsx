'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/lib/validations';
import type { Project } from '@/types';
import Link from 'next/link';

export default function EditProjectPage() {
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
    watch,
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      techStack: [],
      achievements: [],
      images: [],
      architectureDiagrams: [],
      featured: false,
      metrics: {},
    },
  });

  const techStack = watch('techStack') || [];
  const achievements = watch('achievements') || [];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const project: Project = await response.json();
        
        reset({
          title: project.title,
          description: project.description,
          techStack: project.techStack || [],
          achievements: project.achievements || [],
          metrics: project.metrics || {},
          demoUrl: project.demoUrl || '',
          githubUrl: project.githubUrl || '',
          images: project.images || [],
          architectureDiagrams: project.architectureDiagrams || [],
          featured: project.featured || false,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, reset]);

  const addTechStack = () => {
    const input = document.getElementById('techStackInput') as HTMLInputElement;
    if (input?.value.trim()) {
      setValue('techStack', [...techStack, input.value.trim()]);
      input.value = '';
    }
  };

  const removeTechStack = (index: number) => {
    setValue('techStack', techStack.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    const input = document.getElementById('achievementInput') as HTMLInputElement;
    if (input?.value.trim()) {
      setValue('achievements', [...achievements, input.value.trim()]);
      input.value = '';
    }
  };

  const removeAchievement = (index: number) => {
    setValue('achievements', achievements.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    const keyInput = document.getElementById('metricKey') as HTMLInputElement;
    const valueInput = document.getElementById('metricValue') as HTMLInputElement;
    if (keyInput?.value.trim() && valueInput?.value.trim()) {
      const currentMetrics = watch('metrics') || {};
      setValue('metrics', {
        ...currentMetrics,
        [keyInput.value.trim()]: valueInput.value.trim(),
      });
      keyInput.value = '';
      valueInput.value = '';
    }
  };

  const removeMetric = (key: string) => {
    const currentMetrics = watch('metrics') || {};
    const { [key]: _, ...rest } = currentMetrics;
    setValue('metrics', rest);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Update project information
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Project
              </label>
              <div className="mt-2 flex items-center">
                <input
                  {...register('featured')}
                  type="checkbox"
                  id="featured"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Mark as featured project
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Tech Stack *
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                id="techStackInput"
                placeholder="Add technology (e.g., React, Node.js)"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechStack();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTechStack}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechStack(index)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.techStack && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.techStack.message}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Achievements *
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                id="achievementInput"
                placeholder="Add achievement (e.g., Increased revenue by 25%)"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAchievement();
                  }
                }}
              />
              <button
                type="button"
                onClick={addAchievement}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {achievements.length > 0 && (
              <ul className="list-disc space-y-1 pl-6">
                {achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span>{achievement}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.achievements && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.achievements.message}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Metrics (Optional)
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                id="metricKey"
                placeholder="Metric name (e.g., Revenue)"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                id="metricValue"
                placeholder="Value (e.g., $70M+)"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addMetric}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {Object.keys(watch('metrics') || {}).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(watch('metrics') || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>{key}:</strong> {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMetric(key)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Links (Optional)
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Demo URL
              </label>
              <input
                {...register('demoUrl')}
                type="url"
                id="demoUrl"
                placeholder="https://example.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.demoUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.demoUrl.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub URL
              </label>
              <input
                {...register('githubUrl')}
                type="url"
                id="githubUrl"
                placeholder="https://github.com/username/repo"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.githubUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.githubUrl.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/projects"
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
