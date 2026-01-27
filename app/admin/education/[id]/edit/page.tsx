'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, type EducationFormData } from '@/lib/validations';
import type { Education } from '@/types';
import Link from 'next/link';

export default function EditEducationPage() {
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
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  });

  const courses = watch('courses') || [];
  const honors = watch('honors') || [];

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch(`/api/admin/education/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch education');
        }
        const education: Education = await response.json();
        
        reset({
          institution: education.institution,
          degree: education.degree,
          field: education.field,
          location: education.location,
          startDate: new Date(education.startDate).toISOString().split('T')[0],
          endDate: new Date(education.endDate).toISOString().split('T')[0],
          gpa: education.gpa,
          gpaScale: education.gpaScale,
          courses: education.courses || [],
          honors: education.honors || [],
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load education');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEducation();
    }
  }, [id, reset]);

  const addCourse = () => {
    const input = document.getElementById('courseInput') as HTMLInputElement;
    if (input?.value.trim()) {
      setValue('courses', [...courses, input.value.trim()]);
      input.value = '';
    }
  };

  const removeCourse = (index: number) => {
    setValue('courses', courses.filter((_, i) => i !== index));
  };

  const addHonor = () => {
    const input = document.getElementById('honorInput') as HTMLInputElement;
    if (input?.value.trim()) {
      setValue('honors', [...honors, input.value.trim()]);
      input.value = '';
    }
  };

  const removeHonor = (index: number) => {
    setValue('honors', honors.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EducationFormData) => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update education');
      }

      router.push('/admin/education');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update education');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">Loading education...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/education"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Education
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Education</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Update education information
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
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Institution *
              </label>
              <input
                {...register('institution')}
                type="text"
                id="institution"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.institution && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.institution.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Degree *
                </label>
                <input
                  {...register('degree')}
                  type="text"
                  id="degree"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.degree.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Field *
                </label>
                <input
                  {...register('field')}
                  type="text"
                  id="field"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.field && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.field.message}</p>
                )}
              </div>
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
                  End Date *
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  id="endDate"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GPA
                </label>
                <input
                  {...register('gpa', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="gpa"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.gpa && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gpa.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gpaScale" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GPA Scale
                </label>
                <input
                  {...register('gpaScale', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="gpaScale"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.gpaScale && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gpaScale.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Courses
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                id="courseInput"
                placeholder="Add course name"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCourse();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCourse}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {courses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {courses.map((course, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Honors & Achievements
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                id="honorInput"
                placeholder="Add honor or achievement"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHonor();
                  }
                }}
              />
              <button
                type="button"
                onClick={addHonor}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {honors.length > 0 && (
              <ul className="list-disc space-y-1 pl-6">
                {honors.map((honor, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span>{honor}</span>
                    <button
                      type="button"
                      onClick={() => removeHonor(index)}
                      className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/education"
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
