import { useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import type { Note, SaveStatus } from '../types';
import { displayTitle, savedTime } from '../utils/format';
import {
  BoldIcon,
  CodeIcon,
  FileTextIcon,
  HeadingIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  PencilIcon,
  PlusIcon,
  QuoteIcon,
  TrashIcon,
} from './Icons';

interface EditorProps {
  note: Note | null;
  saveStatus: SaveStatus;
  savedAt: number;
  onUpdate: (patch: Partial<Pick<Note, 'title' | 'content'>>) => void;
  onDelete: () => void;
  onSaveNow: () => void;
  onCreate: () => void;
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-[6px] text-[#83887b] transition hover:bg-[#ece8dd] hover:text-[#2c342c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c6b52]/25"
    >
      {children}
    </button>
  );
}

export default function Editor({
  note,
  saveStatus,
  savedAt,
  onUpdate,
  onDelete,
  onSaveNow,
  onCreate,
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!note) {
    return (
      <div className="flex h-full flex-col bg-panel">
        <div className="flex h-[46px] shrink-0 items-center gap-2 border-b border-line px-5 text-[11px] text-muted">
          <PencilIcon size={13} className="text-moss" />
          <span>编辑器</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-paper text-[#b8b2a4]">
            <FileTextIcon size={26} />
          </div>
          <div>
            <p className="font-display text-[19px] text-ink">还没有打开的笔记</p>
            <p className="mt-1.5 text-[12px] text-muted">新建一篇，开始记录。</p>
          </div>
          <button
            type="button"
            onClick={onCreate}
            className="mt-1 flex items-center gap-2 rounded-lg bg-moss px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-mossDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/40"
          >
            <PlusIcon size={14} />
            新建笔记
          </button>
        </div>
      </div>
    );
  }

  const content = note.content;

  const applyEdit = (next: string, selectionStart: number, selectionEnd: number) => {
    onUpdate({ content: next });
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const insertText = (text: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = content.slice(0, start) + text + content.slice(end);
    applyEdit(next, start + text.length, start + text.length);
  };

  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + selected + after + content.slice(end);
    const innerStart = start + before.length;
    applyEdit(next, innerStart, innerStart + selected.length);
  };

  const prefixLines = (prefix: string, existing: RegExp) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const lineBreak = content.indexOf('\n', end);
    const blockEnd = lineBreak === -1 ? content.length : lineBreak;
    const lines = content.slice(lineStart, blockEnd).split('\n');
    const shouldRemove = lines.every((line) => line.startsWith(prefix));
    const nextBlock = lines
      .map((line) =>
        shouldRemove ? line.slice(prefix.length) : `${prefix}${line.replace(existing, '')}`,
      )
      .join('\n');
    const next = content.slice(0, lineStart) + nextBlock + content.slice(blockEnd);
    applyEdit(next, lineStart, lineStart + nextBlock.length);
  };

  const insertLink = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || '链接文字';
    const snippet = `[${selected}](https://)`;
    const next = content.slice(0, start) + snippet + content.slice(end);
    const urlStart = start + selected.length + 3;
    applyEdit(next, urlStart, urlStart + 8);
  };

  const insertCodeBlock = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || 'const hello = "world";';
    const fence = '```';
    const opener = `\n${fence}ts\n`;
    const snippet = `${opener}${selected}\n${fence}\n`;
    const next = content.slice(0, start) + snippet + content.slice(end);
    const innerStart = start + opener.length;
    applyEdit(next, innerStart, innerStart + selected.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      insertText('  ');
      return;
    }

    const mod = event.ctrlKey || event.metaKey;
    if (!mod) return;

    const key = event.key.toLowerCase();
    if (key === 'b') {
      event.preventDefault();
      wrapSelection('**', '**', '粗体文字');
    } else if (key === 'i') {
      event.preventDefault();
      wrapSelection('*', '*', '斜体文字');
    } else if (key === 'k') {
      event.preventDefault();
      insertLink();
    } else if (key === 's') {
      event.preventDefault();
      onSaveNow();
    }
  };

  const charCount = content.replace(/\s/g, '').length;
  const lineCount = content ? content.split('\n').length : 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-[46px] shrink-0 items-center justify-between gap-3 border-b border-line px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-[11px] text-muted">
          <PencilIcon size={13} className="shrink-0 text-moss" />
          <span className="truncate">{displayTitle(note.title)}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                saveStatus === 'saving' ? 'animate-pulse bg-[#c99a4b]' : 'bg-[#6f9b7f]'
              }`}
            />
            {saveStatus === 'saving' ? '保存中…' : `已保存 ${savedTime(savedAt)}`}
          </span>
          <button
            type="button"
            onClick={onDelete}
            title="删除笔记"
            aria-label="删除笔记"
            className="grid h-7 w-7 place-items-center rounded-md text-[#a6a294] transition hover:bg-[#f7e9e5] hover:text-[#a8513d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8513d]/25"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll">
        <div className="flex min-h-full flex-col">
          <div className="px-5 pb-1 pt-6 sm:px-8">
            <input
              value={note.title}
              onChange={(event) => onUpdate({ title: event.target.value })}
              placeholder="无标题笔记"
              aria-label="笔记标题"
              className="w-full bg-transparent font-display text-[25px] leading-tight tracking-[-0.01em] text-ink outline-none placeholder:text-[#c1bbad] sm:text-[28px]"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="-ml-1 flex flex-wrap items-center gap-0.5">
                <ToolButton label="加粗 (Ctrl+B)" onClick={() => wrapSelection('**', '**', '粗体文字')}>
                  <BoldIcon size={15} />
                </ToolButton>
                <ToolButton label="斜体 (Ctrl+I)" onClick={() => wrapSelection('*', '*', '斜体文字')}>
                  <ItalicIcon size={15} />
                </ToolButton>
                <span className="mx-1 h-4 w-px bg-line" />
                <ToolButton label="二级标题" onClick={() => prefixLines('## ', /^#{1,6}\s+/)}>
                  <HeadingIcon size={15} />
                </ToolButton>
                <ToolButton label="引用" onClick={() => prefixLines('> ', /^>\s+/)}>
                  <QuoteIcon size={15} />
                </ToolButton>
                <ToolButton label="无序列表" onClick={() => prefixLines('- ', /^([-*+]|\d+\.)\s+/)}>
                  <ListIcon size={15} />
                </ToolButton>
                <ToolButton label="链接 (Ctrl+K)" onClick={insertLink}>
                  <LinkIcon size={15} />
                </ToolButton>
                <ToolButton label="代码块" onClick={insertCodeBlock}>
                  <CodeIcon size={15} />
                </ToolButton>
              </div>

              <span className="hidden shrink-0 text-[10px] tabular-nums text-[#a9a496] sm:block">
                {charCount} 字 · {lineCount} 行
              </span>
            </div>
          </div>

          <textarea
            key={note.id}
            ref={textareaRef}
            value={content}
            onChange={(event) => onUpdate({ content: event.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={'开始写点什么吧…\n\n支持 Markdown 语法，右侧会实时预览。'}
            spellCheck={false}
            className="editor-textarea min-h-[260px] w-full flex-1 resize-none bg-transparent px-5 pb-8 pt-4 font-mono text-[13px] leading-[1.9] text-[#39403a] outline-none placeholder:text-[#b9b4a7] sm:px-8 sm:text-[13.5px]"
          />

          <div className="flex shrink-0 items-center justify-between border-t border-line/70 px-5 py-2 text-[10px] text-[#a9a496] sm:px-8">
            <span className="tracking-[0.14em]">MARKDOWN</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
