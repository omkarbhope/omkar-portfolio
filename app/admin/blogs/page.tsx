import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { Blog } from '@/types';
import Link from 'next/link';
import BlogsList from '@/components/admin/BlogsList';

async function getBlogs(): Promise<(Blog & { _id: string })[]> {
  const db = await getDatabase();
  const blogs = await db
    .collection<Blog>('blogs')
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();

  return blogs.map((blog) => ({
    ...blog,
    _id: blog._id?.toString() ?? '',
  }));
}

export default async function AdminBlogsPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const blogs = await getBlogs();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blogs</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your blog posts
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Blog
        </Link>
      </div>

      <BlogsList blogs={blogs} />
    </div>
  );
}
