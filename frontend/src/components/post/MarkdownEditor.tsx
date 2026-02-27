import { useState } from 'react';
import { MarkdownRenderer } from '@/components/common';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

type Tab = 'write' | 'preview';

export default function MarkdownEditor({ value, onChange, error }: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>('write');

  const insertMarkdown = (syntax: string, placeholder: string) => {
    const textarea = document.getElementById('md-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const text = selected || placeholder;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const inserted = syntax.replace('$', text);
    onChange(before + inserted + after);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + inserted.indexOf(text) + text.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const toolbar = [
    { label: 'B', title: '굵게', action: () => insertMarkdown('**$**', '굵은 텍스트') },
    { label: 'I', title: '기울임', action: () => insertMarkdown('*$*', '기울임 텍스트') },
    { label: 'H2', title: '제목', action: () => insertMarkdown('\n## $\n', '제목') },
    { label: 'H3', title: '소제목', action: () => insertMarkdown('\n### $\n', '소제목') },
    { label: '""', title: '인용', action: () => insertMarkdown('\n> $\n', '인용문') },
    { label: '<>', title: '코드', action: () => insertMarkdown('`$`', 'code') },
    { label: '```', title: '코드 블록', action: () => insertMarkdown('\n```\n$\n```\n', '코드 블록') },
    { label: '-', title: '목록', action: () => insertMarkdown('\n- $\n', '항목') },
    { label: '🔗', title: '링크', action: () => insertMarkdown('[$](url)', '링크 텍스트') },
    { label: '🖼', title: '이미지', action: () => insertMarkdown('![alt]($)', 'image-url') },
  ];

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        내용 (Markdown)
      </label>

      {/* 탭 + 툴바 */}
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-800">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors
              ${tab === 'write'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
          >
            작성
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors
              ${tab === 'preview'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
          >
            미리보기
          </button>
        </div>

        {tab === 'write' && (
          <div className="flex gap-0.5">
            {toolbar.map((btn) => (
              <button
                key={btn.title}
                type="button"
                onClick={btn.action}
                title={btn.title}
                className="rounded px-1.5 py-1 text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 에디터 / 프리뷰 */}
      {tab === 'write' ? (
        <textarea
          id="md-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Markdown으로 작성하세요..."
          rows={20}
          className={`w-full rounded-b-lg border px-4 py-3 font-mono text-sm text-gray-900
            placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'md-editor-error' : undefined}
        />
      ) : (
        <div className="min-h-[480px] rounded-b-lg border border-gray-300 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-sm text-gray-400">미리보기할 내용이 없습니다.</p>
          )}
        </div>
      )}

      {error && (
        <p id="md-editor-error" className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
