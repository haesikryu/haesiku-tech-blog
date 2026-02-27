import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostFormValues } from '@/utils/postSchema';
import { useCategories } from '@/hooks';
import { Input, Button, ErrorMessage } from '@/components/common';
import TagInput from './TagInput';
import MarkdownEditor from './MarkdownEditor';
import type { PostResponse, CategoryResponse } from '@/types';

const DRAFT_KEY = 'post-editor-draft';

interface PostEditorProps {
  initialData?: PostResponse;
  onSubmit: (data: PostFormValues) => Promise<void>;
  onSaveDraft?: (data: PostFormValues) => Promise<void>;
  isPending: boolean;
  submitError?: string;
}

function loadDraft(): Partial<PostFormValues> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(data: PostFormValues) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function toDefaults(
  initial?: PostResponse,
  draft?: Partial<PostFormValues> | null
): PostFormValues {
  if (initial) {
    return {
      title: initial.title,
      content: initial.content,
      summary: initial.summary ?? '',
      author: initial.author,
      categoryId: initial.category?.id,
      tagNames: initial.tags.map((t) => t.name),
    };
  }
  if (draft) {
    return {
      title: draft.title ?? '',
      content: draft.content ?? '',
      summary: draft.summary ?? '',
      author: draft.author ?? '',
      categoryId: draft.categoryId,
      tagNames: draft.tagNames ?? [],
    };
  }
  return { title: '', content: '', summary: '', author: '', categoryId: undefined, tagNames: [] };
}

export default function PostEditor({
  initialData,
  onSubmit,
  onSaveDraft,
  isPending,
  submitError,
}: PostEditorProps) {
  const isEdit = !!initialData;
  const draft = isEdit ? null : loadDraft();
  const { data: categories = [] } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: toDefaults(initialData, draft),
  });

  // 자동 임시저장 (새 글만, 10초 간격)
  const { getValues } = { getValues: watch };
  useEffect(() => {
    if (isEdit) return;
    const timer = setInterval(() => {
      saveDraft(getValues() as PostFormValues);
    }, 10_000);
    return () => clearInterval(timer);
  }, [isEdit, getValues]);

  const handlePublish = handleSubmit(async (data) => {
    await onSubmit(data);
    if (!isEdit) clearDraft();
  });

  const handleDraft = handleSubmit(async (data) => {
    if (onSaveDraft) {
      await onSaveDraft(data);
      if (!isEdit) clearDraft();
    }
  });

  return (
    <form onSubmit={handlePublish} className="space-y-5">
      {submitError && (
        <ErrorMessage message={submitError} />
      )}

      {/* 임시저장 복원 안내 */}
      {draft && draft.title && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          이전에 작성 중이던 내용이 복원되었습니다.
          <button
            type="button"
            onClick={() => { clearDraft(); window.location.reload(); }}
            className="ml-2 font-medium underline hover:no-underline"
          >
            초기화
          </button>
        </div>
      )}

      <Input
        label="제목"
        placeholder="게시글 제목을 입력하세요"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="작성자"
        placeholder="작성자 이름"
        error={errors.author?.message}
        {...register('author')}
      />

      {/* 카테고리 */}
      <div className="w-full">
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          카테고리
        </label>
        <select
          id="categoryId"
          {...register('categoryId', { setValueAs: (v: string) => (v === '' ? undefined : Number(v)) })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">카테고리 선택 (선택사항)</option>
          {categories.map((c: CategoryResponse) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* 태그 */}
      <Controller
        name="tagNames"
        control={control}
        render={({ field }) => (
          <TagInput
            value={field.value}
            onChange={field.onChange}
            error={errors.tagNames?.message}
          />
        )}
      />

      {/* 요약 */}
      <div className="w-full">
        <label htmlFor="summary" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          요약 (선택사항)
        </label>
        <textarea
          id="summary"
          rows={2}
          placeholder="게시글 요약을 입력하세요 (목록에 표시됩니다)"
          {...register('summary')}
          className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
            ${errors.summary ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600" role="alert">{errors.summary.message}</p>
        )}
      </div>

      {/* Markdown 에디터 */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <MarkdownEditor
            value={field.value}
            onChange={field.onChange}
            error={errors.content?.message}
          />
        )}
      />

      {/* 이미지 업로드 영역 (추후 구현 대비) */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
        <p className="text-sm text-gray-400">이미지 업로드 (추후 구현 예정)</p>
        <p className="mt-1 text-xs text-gray-300">Drag & Drop 또는 클릭하여 이미지 첨부</p>
      </div>

      {/* 버튼 */}
      <div className="flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : isEdit ? '수정하기' : '발행하기'}
        </Button>
        {onSaveDraft && (
          <Button type="button" variant="secondary" disabled={isPending} onClick={handleDraft}>
            임시저장
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          취소
        </Button>

        {/* 자동 저장 안내 */}
        {!isEdit && (
          <span className="ml-auto text-xs text-gray-400">10초마다 자동 임시저장</span>
        )}
      </div>
    </form>
  );
}
