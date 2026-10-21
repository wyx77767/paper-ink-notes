import { useCallback, useEffect, useRef, useState } from 'react';
import type { Note, SaveStatus } from '../types';

const NOTES_KEY = 'paper-ink.notes.v1';
const ACTIVE_KEY = 'paper-ink.active.v1';

const WELCOME_CONTENT = `# 欢迎使用「纸间」

> 一个安静、离线、只用键盘就能写完的 Markdown 笔记本。

## 为什么是纸间

- **本地优先**：所有笔记保存在浏览器的 \`LocalStorage\` 里，刷新或关机都不会丢
- **实时预览**：左边敲字，右边立即看到排版结果
- **专注书写**：没有登录、没有网络请求、没有多余打扰

## 快捷操作

| 快捷键 | 作用 |
| --- | --- |
| \`Ctrl / ⌘ + B\` | 加粗选中文字 |
| \`Ctrl / ⌘ + I\` | 斜体选中文字 |
| \`Ctrl / ⌘ + K\` | 插入链接 |
| \`Ctrl / ⌘ + S\` | 立即保存 |
| \`Tab\` | 插入两个空格，而不是切换焦点 |

## 代码也能很好看

\`\`\`ts
interface Note {
  id: string;
  title: string;
  content: string;
}

const notes: Note[] = [];
\`\`\`

## 待办清单

- [x] 新建第一篇笔记
- [x] 试试工具栏上的按钮
- [ ] 写下今天最想记住的一件事

---

标题和内容都会自动保存。现在，删掉这些字，开始写你自己的吧。
`;

function createId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore and fall back
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeWelcomeNote(): Note {
  const now = Date.now();
  return {
    id: createId(),
    title: '欢迎使用纸间',
    content: WELCOME_CONTENT,
    createdAt: now,
    updatedAt: now,
  };
}

function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false;
  const n = value as Record<string, unknown>;
  return (
    typeof n.id === 'string' &&
    typeof n.title === 'string' &&
    typeof n.content === 'string' &&
    typeof n.createdAt === 'number' &&
    typeof n.updatedAt === 'number'
  );
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw === null) {
      const demo = [makeWelcomeNote()];
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(demo));
      } catch {
        // ignore storage quota / privacy errors
      }
      return demo;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isNote);
  } catch {
    return [makeWelcomeNote()];
  }
}

interface InitialState {
  notes: Note[];
  activeId: string;
}

function loadInitialState(): InitialState {
  const notes = loadNotes();
  let activeId = '';
  try {
    activeId = localStorage.getItem(ACTIVE_KEY) ?? '';
  } catch {
    // ignore
  }
  if (!notes.some((note) => note.id === activeId)) {
    activeId = notes[0]?.id ?? '';
  }
  return { notes, activeId };
}

export function useNotes() {
  const [initial] = useState(loadInitialState);
  const [notes, setNotes] = useState<Note[]>(initial.notes);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [savedAt, setSavedAt] = useState<number>(Date.now());
  const firstRun = useRef(true);

  const activeNote = notes.find((note) => note.id === activeId) ?? null;

  useEffect(() => {
    if (notes.length === 0) {
      if (activeId !== '') setActiveId('');
      return;
    }
    if (!notes.some((note) => note.id === activeId)) {
      setActiveId(notes[0].id);
    }
  }, [notes, activeId]);

  useEffect(() => {
    try {
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch {
      // ignore
    }
  }, [activeId]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaveStatus('saving');
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      } catch {
        // ignore storage errors
      }
      setSaveStatus('saved');
      setSavedAt(Date.now());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [notes]);

  const createNote = useCallback(() => {
    const now = Date.now();
    const note: Note = {
      id: createId(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
    return note.id;
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note,
        ),
      );
    },
    [],
  );

  const deleteNote = useCallback(
    (id: string) => {
      const index = notes.findIndex((note) => note.id === id);
      if (index === -1) return;
      const next = notes.filter((note) => note.id !== id);
      setNotes(next);
      if (id === activeId) {
        setActiveId(next[Math.min(index, next.length - 1)]?.id ?? '');
      }
    },
    [notes, activeId],
  );

  const saveNow = useCallback(() => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
    setSaveStatus('saved');
    setSavedAt(Date.now());
  }, [notes]);

  return {
    notes,
    activeNote,
    activeId,
    setActiveId,
    createNote,
    updateNote,
    deleteNote,
    saveNow,
    saveStatus,
    savedAt,
  };
}
