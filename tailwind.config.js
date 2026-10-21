/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        panel: 'var(--panel)',
        panelAlt: 'var(--panel-alt)',
        ink: 'var(--ink)',
        inkSoft: 'var(--ink-soft)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        moss: 'var(--moss)',
        mossDark: 'var(--moss-dark)',
        mossSoft: 'var(--moss-soft)',
        sidebar: 'var(--sidebar)',
        sidebarAlt: 'var(--sidebar-alt)',
        sidebarText: 'var(--sidebar-text)',
        sidebarMuted: 'var(--sidebar-muted)',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'monospace'],
        display: ['"Songti SC"', '"Noto Serif SC"', 'SimSun', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
