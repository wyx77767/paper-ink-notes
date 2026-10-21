import { useEffect, useMemo, useState } from 'react';
import type { Note } from './types';
import { displayTitle } from './utils/format';
import { useNotes } from './hooks/useNotes';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ConfirmDialog from './components/ConfirmDialog';
import { EyeIcon, MenuIcon, PencilIcon } from './components/Icons';

type MobileView = 'editor' | 'preview';

export default function App() {
  const {
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
  } = useNotes();

  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('editor');
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const filteredNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return notes;
    return notes.filter((note) => note.title.toLowerCase().includes(keyword));
  }, [notes, query]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setDrawerOpen(false);
    setMobileView('editor');
  };

  const handleCreate = () => {
    createNote();
    setQuery('');
    setDrawerOpen(false);
    setMobileView('editor');
  };

  const handleConfirmDelete = () => {
    const target = pendingDelete;
    setPendingDelete(null);
    if (target) deleteNote(target.id);
  };

  const sidebar = (
    <Sidebar
      notes={notes}
      filteredNotes={filteredNotes}
      activeId={activeId}
      query={query}
      onQueryChange={setQuery}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );

  return (
    <div className="flex h-full overflow-hidden bg-paper">
      <aside className="hidden w-[286px] shrink-0 lg:block">{sidebar}</aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-[#0f1511]/45 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative h-full w-[300px] max-w-[85vw] animate-slide-in shadow-2xl">
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[46px] shrink-0 items-center gap-2 border-b border-line bg-panel px-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开笔记列表"
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] text-inkSoft transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/25"
          >
            <MenuIcon size={15} />
            笔记
          </button>

          <span className="min-w-0 flex-1 truncate text-center text-[11.5px] text-muted">
            {activeNote ? displayTitle(activeNote.title) : '纸间'}
          </span>

          <div className="flex shrink-0 items-center rounded-lg bg-[#eeeadf] p-0.5 md:hidden">
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] transition ${
                mobileView === 'editor'
                  ? 'bg-panel text-ink shadow-sm'
                  : 'text-muted hover:text-inkSoft'
              }`}
            >
              <PencilIcon size={11} />
              编辑
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] transition ${
                mobileView === 'preview'
                  ? 'bg-panel text-ink shadow-sm'
                  : 'text-muted hover:text-inkSoft'
              }`}
            >
              <EyeIcon size={12} />
              预览
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <section
            className={`min-w-0 flex-col md:flex md:w-[46%] md:border-r md:border-line ${
              mobileView === 'editor' ? 'flex' : 'hidden'
            }`}
          >
            <Editor
              key={activeNote?.id ?? 'empty'}
              note={activeNote}
              saveStatus={saveStatus}
              savedAt={savedAt}
              onUpdate={(patch) => {
                if (activeNote) updateNote(activeNote.id, patch);
              }}
              onDelete={() => {
                if (activeNote) setPendingDelete(activeNote);
              }}
              onSaveNow={saveNow}
              onCreate={handleCreate}
            />
          </section>

          <section
            className={`min-w-0 flex-1 flex-col ${
              mobileView === 'preview' ? 'flex' : 'hidden'
            } md:flex`}
          >
            <Preview note={activeNote} />
          </section>
        </div>
      </main>

      <ConfirmDialog
        open={pendingDelete !== null}
        noteTitle={pendingDelete ? displayTitle(pendingDelete.title) : ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
