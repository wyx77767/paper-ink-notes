import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Note } from '../types';
import { displayTitle, relativeTime } from '../utils/format';
import CodeBlock from './CodeBlock';
import { EyeIcon } from './Icons';

const markdownComponents: Components = {
  code({ className, children }) {
    const match = /language-([\w-]+)/.exec(className ?? '');
    const text = String(children ?? '').replace(/\n$/, '');
    const language = match?.[1] ?? '';
    const isBlock = Boolean(language) || text.includes('\n');

    if (isBlock) {
      return <CodeBlock language={language} code={text} />;
    }

    return <code className={`md-inline-code ${className ?? ''}`.trim()}>{children}</code>;
  },
  pre({ children }) {
    return <>{children}</>;
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    );
  },
  img({ src, alt }) {
    return <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" />;
  },
};

interface PreviewProps {
  note: Note | null;
}

export default function Preview({ note }: PreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [note?.id]);

  const hasLeadingHeading = note ? /^\s*#\s+/.test(note.content) : false;

  return (
    <div className="flex h-full min-h-0 flex-col bg-panelAlt">
      <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-line px-5">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
          <EyeIcon size={13} className="text-moss" />
          预览
        </span>
        <span className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.18em] text-[#a9a496]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6f9b7f]" />
          Live
        </span>
      </div>

      <div ref={scrollRef} className="thin-scroll min-h-0 flex-1 overflow-y-auto">
        {note ? (
          <article className="mx-auto w-full max-w-[780px] px-6 py-8 sm:px-10 sm:py-10">
            {!hasLeadingHeading && (
              <div className="mb-7 border-b border-line pb-5">
                <h1 className="font-display text-[26px] leading-snug tracking-[-0.01em] text-ink sm:text-[30px]">
                  {displayTitle(note.title)}
                </h1>
                <p className="mt-2 text-[9.5px] uppercase tracking-[0.18em] text-[#a9a496]">
                  更新于 {relativeTime(note.updatedAt)}
                </p>
              </div>
            )}

            <div className="md-body">
              {note.content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {note.content}
                </ReactMarkdown>
              ) : (
                <p className="text-[13px] italic text-[#b3ada0]">
                  开始输入，这里会实时显示 Markdown 渲染后的样子。
                </p>
              )}
            </div>
          </article>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-panel text-[#c1bbad]">
              <EyeIcon size={26} />
            </div>
            <p className="text-[12px] text-muted">选择或新建一篇笔记，开始预览</p>
          </div>
        )}
      </div>
    </div>
  );
}
