import { useState, type FormEvent } from 'react';

interface CommentFormProps {
  onSubmit: (data: { author: string; password: string; body: string }) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export default function CommentForm({ onSubmit, isSubmitting, errorMessage }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !password.trim() || !body.trim()) return;
    onSubmit({ author: author.trim(), password, body: body.trim() });
    setAuthor('');
    setPassword('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      {errorMessage && (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder="작성자"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={100}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 (수정/삭제 시 사용)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={4}
          maxLength={100}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      <textarea
        placeholder="댓글 내용"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        maxLength={2000}
        className="mb-3 w-full resize-y rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        {isSubmitting ? '등록 중...' : '댓글 등록'}
      </button>
    </form>
  );
}
