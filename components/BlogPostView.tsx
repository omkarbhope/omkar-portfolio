'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { BlogBlock } from '@/types';
import type { TocEntry } from '@/lib/blog-utils';
import { transformContentUrls } from '@/lib/blocknote-utils';
import { toProxiedMediaUrl, isDriveUrl, toDrivePreviewUrl, toYoutubeEmbedUrl, resolveProxiedUrl } from '@/lib/drive-url';

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
  const transformedContent = transformContentUrls(content, (url) => toProxiedMediaUrl(url, ''));

  const editor = useCreateBlockNote(
    transformedContent.length > 0
      ? {
          initialContent: transformedContent as any,
          resolveFileUrl: (url: string) => Promise.resolve(toProxiedMediaUrl(url, '')),
        }
      : { resolveFileUrl: (url: string) => Promise.resolve(toProxiedMediaUrl(url, '')) },
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
    const editorEl = (editor as { domElement?: HTMLElement | null }).domElement;
    const root = editorEl || container;

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

      root.querySelectorAll<HTMLElement>('pre').forEach((pre) => {
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
      root.querySelectorAll<HTMLElement>('.bn-block-content div').forEach((div) => {
        if (div.querySelector('select')) div.style.display = 'none';
      });

      /* YouTube/Drive video blocks: get embed URL from block data-url or content, inject iframe */
      const videoEmbedUrls: string[] = [];
      function collectVideoUrls(blocks: BlogBlock[]) {
        for (const b of blocks) {
          const props = b.props as Record<string, unknown> | undefined;
          const url = props?.url;
          if (b.type === 'video' && typeof url === 'string' && url.trim()) {
            const resolved = resolveProxiedUrl(url) || url.trim();
            const src = toYoutubeEmbedUrl(resolved) || (isDriveUrl(resolved) ? toDrivePreviewUrl(resolved) : '');
            if (src) videoEmbedUrls.push(src);
          }
          const children = b.children as BlogBlock[] | undefined;
          if (Array.isArray(children) && children.length) collectVideoUrls(children);
        }
      }
      collectVideoUrls(content);

      /* Match video blocks in DOM – BlockNote may use data-content-type="video" or we find wrapper with video/link */
      let videoBlocks = Array.from(root.querySelectorAll<HTMLElement>('.bn-block-content[data-content-type="video"]'));
      if (videoBlocks.length === 0) {
        const wrappers = root.querySelectorAll<HTMLElement>('.bn-file-block-content-wrapper');
        videoBlocks = [];
        wrappers.forEach((w) => {
          const block = w.closest('.bn-block-content');
          if (block && (w.querySelector('video') || w.querySelector('a[href*="youtube"]') || w.querySelector('a[href*="youtu.be"]') || w.querySelector('a[href*="drive.google"]'))) {
            videoBlocks.push(block as HTMLElement);
          }
        });
      }

      videoBlocks.forEach((block, i) => {
        let embedSrc = '';
        const dataUrl = block.getAttribute('data-url');
        if (dataUrl && dataUrl !== 'true' && dataUrl !== 'false') {
          const resolved = resolveProxiedUrl(dataUrl) || dataUrl;
          embedSrc = toYoutubeEmbedUrl(resolved) || (isDriveUrl(resolved) ? toDrivePreviewUrl(resolved) : '');
        }
        if (!embedSrc && videoEmbedUrls[i]) embedSrc = videoEmbedUrls[i];
        if (!embedSrc) {
          const anchor = block.querySelector<HTMLAnchorElement>('a[href]');
          const video = block.querySelector<HTMLVideoElement>('video');
          const raw = (video?.src || video?.querySelector('source')?.src || anchor?.href || '').trim();
          if (raw) {
            const resolved = resolveProxiedUrl(raw) || raw;
            embedSrc = toYoutubeEmbedUrl(resolved) || (isDriveUrl(resolved) ? toDrivePreviewUrl(resolved) : '');
          }
        }
        if (!embedSrc) return;

        const wrapper = block.querySelector<HTMLElement>('.bn-file-block-content-wrapper') || block;
        let wrap = wrapper.querySelector<HTMLDivElement>('.blog-video-embed-wrap');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.className = 'blog-video-embed-wrap';
          wrap.setAttribute('data-blog-video-embed', 'true');
          const iframe = document.createElement('iframe');
          iframe.src = embedSrc;
          iframe.title = 'Video';
          iframe.className = 'blog-video-embed-iframe';
          iframe.setAttribute('loading', 'lazy');
          wrap.appendChild(iframe);
          wrapper.prepend(wrap);
        }
        wrapper.querySelectorAll(':scope > *').forEach((child) => {
          const el = child as HTMLElement;
          if (el.classList.contains('blog-video-embed-wrap') || el.classList.contains('bn-file-caption')) return;
          el.style.display = 'none';
        });
      });

      /* Preview (iframe) and Download for file/audio only (not image, not video) */
      const embedSelector = '.bn-block-content[data-content-type="file"], .bn-block-content[data-content-type="audio"]';
      root.querySelectorAll<HTMLElement>(embedSelector).forEach((block) => {
        if (block.hasAttribute('data-embed-actions-injected')) return;
        const dataUrl = block.getAttribute('data-url');
        const anchor = block.querySelector<HTMLAnchorElement>('a[href]');
        const img = block.querySelector<HTMLImageElement>('img[src]');
        const media = block.querySelector<HTMLSourceElement>('video source[src], audio source[src]') || block.querySelector<HTMLMediaElement>('video[src], audio[src]');
        const rawUrl = anchor?.href ?? img?.src ?? (media && ('src' in media) ? (media as HTMLMediaElement).src : null) ?? (dataUrl && dataUrl !== 'true' && dataUrl !== 'false' ? dataUrl : null);
        if (!rawUrl || typeof rawUrl !== 'string') return;
        const url = rawUrl.trim();
        const wrapper = block.querySelector('.bn-file-block-content-wrapper') || block;
        const actionsWrap = document.createElement('div');
        actionsWrap.className = 'blog-embed-actions-wrap';
        const bar = document.createElement('div');
        bar.className = 'blog-embed-actions';
        const previewBtn = document.createElement('button');
        previewBtn.type = 'button';
        previewBtn.className = 'blog-embed-preview-btn';
        previewBtn.textContent = 'Preview';
        const previewPanel = document.createElement('div');
        previewPanel.className = 'blog-embed-preview-panel';
        previewPanel.setAttribute('hidden', '');
        const iframe = document.createElement('iframe');
        iframe.title = 'Preview';
        iframe.className = 'blog-embed-preview-iframe';
        previewPanel.appendChild(iframe);
        previewBtn.addEventListener('click', () => {
          const isHidden = previewPanel.hasAttribute('hidden');
          if (isHidden) {
            previewPanel.removeAttribute('hidden');
            if (!iframe.src) {
              const origin = typeof window !== 'undefined' ? window.location.origin : '';
              const previewSrc = url.startsWith('/') ? `${origin}${url}` : isDriveUrl(url) ? toProxiedMediaUrl(url, origin) : url;
              iframe.src = previewSrc;
            }
            previewBtn.textContent = 'Hide preview';
          } else {
            previewPanel.setAttribute('hidden', '');
            previewBtn.textContent = 'Preview';
          }
        });
        const download = document.createElement('a');
        download.href = url;
        download.target = '_blank';
        download.rel = 'noopener noreferrer';
        download.setAttribute('download', '');
        download.className = 'blog-embed-download';
        download.textContent = 'Download';
        bar.appendChild(previewBtn);
        bar.appendChild(download);
        actionsWrap.appendChild(bar);
        actionsWrap.appendChild(previewPanel);
        wrapper.appendChild(actionsWrap);
        block.setAttribute('data-embed-actions-injected', 'true');
      });
    };

    const schedule = () => {
      requestAnimationFrame(() => {
        setTimeout(runPrismAndCopyButtons, 100);
      });
    };

    schedule();
    /* Run again so video blocks are found after editor/content have mounted */
    setTimeout(schedule, 400);
    setTimeout(schedule, 1000);
    const observer = new MutationObserver(() => schedule());
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    return () => observer.disconnect();
  }, [content, editor]);

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
