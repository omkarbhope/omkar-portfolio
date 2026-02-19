'use client';

import { useEffect, useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { BlockNoteEditor } from '@blocknote/core';
import type { BlogBlock } from '@/types';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface BlogEditorProps {
  initialContent?: BlogBlock[];
  onEditorReady: (editor: BlockNoteEditor) => void;
}

function BlogEditorInner({
  initialContent,
  onEditorReady,
}: BlogEditorProps) {
  const editor = useCreateBlockNote(
    initialContent && initialContent.length > 0 ? { initialContent: initialContent as any } : {},
    []
  );

  useEffect(() => {
    onEditorReady(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white [&_.bn-editor]:min-h-[280px]">
      <BlockNoteView editor={editor} editable />
    </div>
  );
}

export default function BlogEditor(props: BlogEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[280px] rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700" />
    );
  }

  return <BlogEditorInner {...props} />;
}
