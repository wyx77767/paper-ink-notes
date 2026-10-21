import type { Note } from '../types';
import { displayTitle, excerpt, relativeTime } from '../utils/format';
import { CloseIcon, PlusIcon, SearchIcon } from './Icons';

interface SidebarProps {
  notes: Note[];
  filteredNotes: Note[];
  activeId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

function TitleWithHighlight({ title, query }: { title: string; query: string }) {
  const text = displayTitle(title);
  const keyword = query.trim();
  if (!keyword) return <>{text}</>;

  const index = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[2px] bg-[#a9cbb4]/25 px-px text-[#dcebdd]">
        {text.slice(index, index + keyword.length)}
      </mark>
      {text.slice(index + keyword.length)}
    </>
  );
}

export default function Sidebar({
  notes,
  filteredNotes,
  activeId,
  query,
  onQueryChange,
  onSelect,
  onCreate,
}: SidebarProps) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebarText">
      <div className="px-5 pb-4 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#dce8da] font-display text-[19px] leading-none text-[#22382a]">
            纸
          </div>
          <div>
            <div className="font-display text-[17px] leading-none tracking-wide">纸间</div>
            <div className="mt-1.5 text-[8.5px] tracking-[0.26em] text-sidebarMuted">
              PAPER &amp; INK
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e5eee4] px-3 py-2.5 text-[12.5px] font-medium text-[#22382a] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9cbb4]/60"
        >
          <PlusIcon size={15} />
          新建笔记
        </button>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2 transition focus-within:border-white/25">
          <SearchIcon size={14} className="shrink-0 text-sidebarMuted" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索笔记标题"
            aria-label="搜索笔记标题"
            className="w-full bg-transparent text-[12.5px] text-sidebarText outline-none placeholder:text-sidebarMuted/80"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="清除搜索"
              className="grid h-5 w-5 shrink-0 place-items-center rounded text-sidebarMuted transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-2 text-[9.5px] uppercase tracking-[0.2em] text-sidebarMuted">
        <span>笔记</span>
        <span className="tabular-nums">
          {hasQuery ? `${filteredNotes.length} / ${notes.length}` : notes.length}
        </span>
      </div>

      <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-2.5 pb-4">
        {filteredNotes.length === 0 ? (
          <div className="mx-1 mt-5 rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
            <SearchIcon size={22} className="mx-auto text-white/20" />
            <p className="mt-2.5 text-[11.5px] text-sidebarMuted">
              {hasQuery ? '没有找到匹配的笔记' : '还没有笔记'}
            </p>
            {hasQuery ? (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="mt-3 text-[11px] text-[#b7d3c0] underline underline-offset-4"
              >
                清除搜索
              </button>
            ) : (
              <p className="mt-2 text-[10.5px] text-sidebarMuted/70">点击上方按钮，写下第一篇</p>
            )}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {filteredNotes.map((note) => {
              const active = note.id === activeId;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(note.id)}
                    className={`group relative w-full rounded-lg px-3 py-2.5 text-left transition ${
                      active ? 'bg-white/[0.09]' : 'hover:bg-white/[0.05]'
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-2.5 left-0 top-2.5 w-[2.5px] rounded-full bg-[#a9cbb4]" />
                    )}
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`truncate text-[12.5px] ${
                          active ? 'text-white' : 'text-sidebarText/90'
                        }`}
                      >
                        <TitleWithHighlight title={note.title} query={query} />
                      </span>
                      <span className="shrink-0 text-[9px] text-sidebarMuted">
                        {relativeTime(note.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[10.5px] leading-relaxed text-sidebarMuted">
                      {excerpt(note.content)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="border-t border-white/[0.07] px-5 py-3.5 text-[10px] text-sidebarMuted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8fb49b]" />
          本地存储 · 自动保存
        </span>
      </div>
    </div>
  );
}
