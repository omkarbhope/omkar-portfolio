'use client';

import { useState, useEffect } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { BlogBlock } from '@/types';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface BlogPostViewProps {
  content: BlogBlock[];
}

function BlogPostViewInner({ content }: BlogPostViewProps) {
  const editor = useCreateBlockNote(
    content.length > 0 ? { initialContent: content as any } : {},
    []
  );

  return (
    <div className="prose prose-invert max-w-none dark:prose-invert [&_.bn-editor]:!p-0 [&_.bn-editor]:min-h-0">
      <BlockNoteView editor={editor} editable={false} />
    </div>
  );
}

export default function BlogPostView(props: BlogPostViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[120px] animate-pulse rounded bg-[var(--border)]" />;
  }

  return <BlogPostViewInner {...props} />;
}
