'use client';

import dynamic from 'next/dynamic';
import type { BlogBlock } from '@/types';
import type { TocEntry } from '@/lib/blog-utils';

const BlogPostView = dynamic(() => import('@/components/BlogPostView'), { ssr: false });

interface BlogPostViewClientProps {
  content: BlogBlock[];
  headings?: TocEntry[];
}

export function BlogPostViewClient({ content, headings }: BlogPostViewClientProps) {
  return <BlogPostView content={content} headings={headings} />;
}
