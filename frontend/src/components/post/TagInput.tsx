import { useState, type KeyboardEvent } from 'react';
import { Badge } from '@/components/common';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export default function TagInput({ value, onChange, error }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        태그
      </label>
      <div
        className={`flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2
          transition-colors focus-within:ring-2 focus-within:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          bg-white dark:bg-gray-800`}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="tag" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 text-gray-400 hover:text-red-500"
              aria-label={`${tag} 태그 삭제`}
            >
              &times;
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={value.length === 0 ? 'Enter 또는 쉼표로 태그 추가' : ''}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400
            dark:text-white dark:placeholder-gray-500"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}
