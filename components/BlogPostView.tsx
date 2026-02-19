'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { BlogBlock } from '@/types';
import type { TocEntry } from '@/lib/blog-utils';
import { transformContentUrls } from '@/lib/blocknote-utils';
import { toDirectImageUrl } from '@/lib/drive-url';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import 'prismjs/themes/prism-tomorrow.css';

interface BlogPostViewProps {
  content: BlogBlock[];
  headings?: TocEntry[];
}

const blogBlockNoteTheme = {
  light: {
    colors: {
      editor: { background: 'transparent', text: 'var(--text-primary)' },
      menu: { background: 'var(--background-alt)', text: 'var(--text-primary)' },
      tooltip: { background: 'var(--background-alt)', text: 'var(--text-primary)' },
      hovered: { background: 'var(--primary-soft)', text: 'var(--text-primary)' },
      selected: { background: 'var(--primary)', text: 'var(--foreground)' },
      border: 'var(--border)',
      shadow: 'var(--border)',
      sideMenu: 'var(--border)',
    },
    borderRadius: 8,
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  dark: {
    colors: {
      editor: { background: 'transparent', text: 'var(--text-primary)' },
      menu: { background: 'var(--background-alt)', text: 'var(--text-primary)' },
      tooltip: { background: 'var(--background-alt)', text: 'var(--text-primary)' },
      hovered: { background: 'var(--primary-soft)', text: 'var(--text-primary)' },
      selected: { background: 'var(--primary)', text: 'var(--foreground)' },
      border: 'var(--border)',
      shadow: 'var(--border)',
      sideMenu: 'var(--border)',
    },
    borderRadius: 8,
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
};

function BlogPostViewInner({ content, headings = [] }: BlogPostViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const blockNoteTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const transformedContent = transformContentUrls(content, toDirectImageUrl);

  const editor = useCreateBlockNote(
    transformedContent.length > 0 ? { initialContent: transformedContent as any } : {},
    []
  );

  useEffect(() => {
    if (!containerRef.current || headings.length === 0) return;
    const els = containerRef.current.querySelectorAll<HTMLHeadingElement>('h2, h3');
    els.forEach((el, i) => {
      if (headings[i]) el.id = headings[i].id;
    });
  }, [content, headings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const runPrismAndCopyButtons = () => {
      const Prism = require('prismjs');
      require('prismjs/components/prism-javascript');
      require('prismjs/components/prism-typescript');
      require('prismjs/components/prism-jsx');
      require('prismjs/components/prism-tsx');
      require('prismjs/components/prism-css');
      require('prismjs/components/prism-json');
      require('prismjs/components/prism-bash');
      require('prismjs/components/prism-python');
      require('prismjs/components/prism-markdown');
      require('prismjs/components/prism-yaml');

      container.querySelectorAll<HTMLElement>('pre').forEach((pre) => {
        if (pre.hasAttribute('data-copy-ready')) return;
        const code = pre.querySelector('code');
        if (!code) return;
        const lang = pre.getAttribute('data-language') || code.getAttribute('data-language') || 'text';
        code.classList.add('language-' + lang);
        try {
          Prism.highlightElement(code);
        } catch {
          code.classList.add('language-none');
          Prism.highlightElement(code);
        }

        pre.setAttribute('data-copy-ready', 'true');
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group/code';
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Copy';
        btn.className = 'absolute top-2 right-2 rounded px-2 py-1 text-xs font-medium bg-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] opacity-0 group-hover/code:opacity-100 transition-opacity';
        btn.addEventListener('click', () => {
          const text = code.innerText;
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
          });
        });
        wrapper.appendChild(btn);
        /* Hide BlockNote language bar (fallback when CSS :has() not supported) */
        const prev = wrapper.previousElementSibling;
        if (prev?.querySelector?.('select')) (prev as HTMLElement).style.display = 'none';
      });
      /* Hide any remaining language bar (div with select) inside block content */
      container.querySelectorAll<HTMLElement>('.bn-block-content div').forEach((div) => {
        if (div.querySelector('select')) div.style.display = 'none';
      });
    };

    const schedule = () => {
      requestAnimationFrame(() => {
        setTimeout(runPrismAndCopyButtons, 100);
      });
    };

    schedule();
    const observer = new MutationObserver(() => schedule());
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`blog-post-view prose max-w-none [&_.bn-editor]:!p-0 [&_.bn-editor]:min-h-0 [&_.bn-block-content]:!max-w-full [&_.bn-block-outer]:!mb-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:p-5 [&_pre]:my-6 [&_pre]:border [&_pre]:border-[var(--border)] [&_code]:text-sm [&_pre_code]:!p-0 [&_pre_code]:!bg-transparent [&_table]:!my-6 [&_img]:rounded-lg [&_img]:shadow-md ${blockNoteTheme === 'dark' ? 'prose-invert dark:prose-invert' : 'prose'}`}
    >
      <BlockNoteView
        editor={editor}
        editable={false}
        theme={blogBlockNoteTheme}
        sideMenu={false}
        formattingToolbar={false}
        linkToolbar={false}
        slashMenu={false}
      />
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
