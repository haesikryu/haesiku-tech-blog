import { useState } from 'react';
import type { CommentResponse } from '@/types';

interface CommentListProps {
  comments: CommentResponse[];
  onUpdate: (commentId: number, password: string, body: string) => void;
  onDelete: (commentId: number, password: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  errorMessage?: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentList({
  comments,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  errorMessage,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editBody, setEditBody] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const startEdit = (c: CommentResponse) => {
    setEditingId(c.id);
    setEditBody(c.body);
    setEditPassword('');
  };
  const startDelete = (commentId: number) => {
    setDeletingId(commentId);
    setDeletePassword('');
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditPassword('');
    setEditBody('');
  };
  const cancelDelete = () => {
    setDeletingId(null);
    setDeletePassword('');
  };

  const handleUpdate = (commentId: number) => {
    if (!editPassword.trim() || !editBody.trim()) return;
    onUpdate(commentId, editPassword, editBody);
    setEditingId(null);
    setEditPassword('');
    setEditBody('');
  };
  const handleDelete = (commentId: number) => {
    if (!deletePassword.trim()) return;
    onDelete(commentId, deletePassword);
    setDeletingId(null);
    setDeletePassword('');
  };

  if (comments.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {errorMessage && (
        <li>
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {errorMessage}
          </p>
        </li>
      )}
      {comments.map((c) => (
        <li
          key={c.id}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{c.author}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(c.createdAt)}
              {c.updatedAt !== c.createdAt && ' (수정됨)'}
            </span>
          </div>
          {editingId === c.id ? (
            <div className="mt-2 space-y-2">
              <input
                type="password"
                placeholder="비밀번호"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full max-w-xs rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={3}
                maxLength={2000}
                className="w-full resize-y rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(c.id)}
                  disabled={isUpdating}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-600"
                >
                  취소
                </button>
              </div>
            </div>
          ) : deletingId === c.id ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                type="password"
                placeholder="비밀번호"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="max-w-xs rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                disabled={isDeleting}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                삭제
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-600"
              >
                취소
              </button>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{c.body}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => startDelete(c.id)}
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
