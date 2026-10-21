export function relativeTime(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const diff = now.getTime() - ts;

  if (diff < 45_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} 分钟前`;

  if (date.toDateString() === now.toDateString()) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return '昨天';

  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function savedTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function displayTitle(title: string): string {
  return title.trim() || '无标题笔记';
}

export function excerpt(content: string, max = 52): string {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|>-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '还没有内容';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
