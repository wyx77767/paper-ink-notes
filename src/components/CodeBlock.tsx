import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon, CopyIcon } from './Icons';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable in insecure contexts
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[#2b3a32] bg-[#1c2420] shadow-[0_18px_40px_-32px_rgba(16,26,20,0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#8fa79a]">
          {language || 'text'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-[#a9bdb0] transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25"
        >
          {copied ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '16px 18px',
          background: '#1c2420',
          fontSize: '12.5px',
          lineHeight: 1.75,
        }}
        codeTagProps={{
          style: {
            fontFamily:
              '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
