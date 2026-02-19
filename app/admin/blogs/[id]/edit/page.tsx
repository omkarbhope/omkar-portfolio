'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, type BlogFormData } from '@/lib/validations';
import type { Blog } from '@/types';
import Link from 'next/link';
import BlogEditor from '@/components/admin/BlogEditor';
import type { BlockNoteEditor } from '@blocknote/core';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  const onEditorReady = useCallback((e: BlockNoteEditor) => setEditor(e), []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data: Blog & { _id?: string; publishedAt?: string | Date | null } = await response.json();

        setBlog(data);

        reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt ?? '',
          content: Array.isArray(data.content) ? data.content : [],
          coverImage: data.coverImage ?? '',
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString().slice(0, 16)
            : '',
          tags: data.tags ?? [],
          author: data.author ?? '',
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, reset]);

  const onSubmit = async (data: BlogFormData) => {
    if (!editor) {
      setError('Editor not ready. Please wait a moment.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const body = {
        ...data,
        content: editor.document,
        coverImage: data.coverImage || undefined,
        publishedAt: data.publishedAt || undefined,
      };

      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-red-600 dark:text-red-400">{error || 'Blog not found'}</p>
        <Link href="/admin/blogs" className="mt-4 inline-block text-blue-600 hover:text-blue-500 dark:text-blue-400">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin/blogs"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
      >
        ← Back to Blogs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Update blog post
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
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug *
              </label>
              <input
                {...register('slug')}
                type="text"
                id="slug"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                id="excerpt"
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover image URL
              </label>
              <input
                {...register('coverImage')}
                type="url"
                id="coverImage"
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.coverImage.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Published at (optional)
              </label>
              <input
                {...register('publishedAt')}
                type="datetime-local"
                id="publishedAt"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <BlogEditor
                initialContent={Array.isArray(blog.content) ? blog.content : []}
                onEditorReady={onEditorReady}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/blogs"
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
