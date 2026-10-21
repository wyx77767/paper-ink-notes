import { useEffect } from 'react';
import { TrashIcon } from './Icons';

interface ConfirmDialogProps {
  open: boolean;
  noteTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  noteTitle,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div
        className="absolute inset-0 animate-fade-in bg-[#0f1511]/45 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="relative w-full max-w-[360px] animate-pop rounded-2xl border border-line bg-panel p-6 shadow-[0_30px_80px_-30px_rgba(20,25,20,0.5)]"
      >
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f7e9e5] text-[#a8513d]">
          <TrashIcon size={16} />
        </div>
        <h2 id="delete-dialog-title" className="mt-4 font-display text-[20px] text-ink">
          删除这篇笔记？
        </h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
          「{noteTitle}」将被永久删除，且无法恢复。
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-lg border border-line px-3.5 py-2 text-[12px] text-inkSoft transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/25"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#a8513d] px-3.5 py-2 text-[12px] font-medium text-white transition hover:bg-[#94452f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8513d]/40"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
