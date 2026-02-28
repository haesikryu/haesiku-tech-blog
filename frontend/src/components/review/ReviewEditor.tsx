import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewFormValues } from '@/utils/reviewSchema';
import { reviewApi } from '@/api';
import { Input, Button, ErrorMessage } from '@/components/common';
import { MarkdownEditor } from '@/components/post';
import type { ReviewResponse } from '@/types';

interface ReviewEditorProps {
  initialData?: ReviewResponse;
  onSubmit: (data: ReviewFormValues) => Promise<void>;
  isPending: boolean;
  submitError?: string;
}

function toDefaults(initial?: ReviewResponse): ReviewFormValues {
  if (initial) {
    return {
      reviewType: initial.reviewType,
      title: initial.title,
      content: initial.content,
      rating: initial.rating,
      itemTitle: initial.itemTitle,
      itemAuthor: initial.itemAuthor ?? '',
      itemLink: initial.itemLink ?? '',
    };
  }
  return {
    reviewType: 'BOOK',
    title: '',
    content: '',
    rating: 5,
    itemTitle: '',
    itemAuthor: '',
    itemLink: '',
  };
}

export default function ReviewEditor({
  initialData,
  onSubmit,
  isPending,
  submitError,
}: ReviewEditorProps) {
  const [isbnInput, setIsbnInput] = useState('');
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [isbnError, setIsbnError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: toDefaults(initialData),
  });

  const reviewType = watch('reviewType');

  const handleFetchBookByIsbn = async () => {
    const isbn = isbnInput.replace(/\s/g, '').replace(/-/g, '');
    if (!isbn) {
      setIsbnError('ISBN을 입력해 주세요.');
      return;
    }
    setIsbnError(null);
    setIsbnLoading(true);
    try {
      const book = await reviewApi.getBookByIsbn(isbn);
      setValue('itemTitle', book.title);
      setValue('itemAuthor', book.author ?? '');
      setValue('itemLink', book.link ?? '');
    } catch {
      setIsbnError('해당 ISBN의 책 정보를 찾을 수 없습니다.');
    } finally {
      setIsbnLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {submitError && <ErrorMessage message={submitError} />}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          유형
        </label>
        <select
          {...register('reviewType')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="BOOK">책</option>
          <option value="COURSE">강의</option>
        </select>
      </div>

      {reviewType === 'BOOK' && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800/50">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            ISBN으로 책 정보 자동 입력
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[180px] flex-1">
              <input
                type="text"
                placeholder="ISBN-10 또는 ISBN-13 (예: 9788966262471)"
                value={isbnInput}
                onChange={(e) => {
                  setIsbnInput(e.target.value);
                  setIsbnError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFetchBookByIsbn())}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleFetchBookByIsbn}
              disabled={isbnLoading}
            >
              {isbnLoading ? '조회 중...' : '책 정보 조회'}
            </Button>
          </div>
          {isbnError && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {isbnError}
            </p>
          )}
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            하이픈 없이 숫자만 입력해도 됩니다. 조회되면 아래 책/강의 제목·저자·링크가 자동으로 채워집니다.
          </p>
        </div>
      )}

      <Input
        label="후기 제목"
        placeholder="후기 제목을 입력하세요"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="책/강의 제목"
        placeholder="예: 클린 코드"
        error={errors.itemTitle?.message}
        {...register('itemTitle')}
      />

      <Input
        label="저자/강사 (선택)"
        placeholder="예: 로버트 C. 마틴"
        error={errors.itemAuthor?.message}
        {...register('itemAuthor')}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          평점 (1~5)
        </label>
        <select
          {...register('rating', { valueAsNumber: true })}
          className="w-full max-w-[120px] rounded-lg border border-gray-300 px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}점
            </option>
          ))}
        </select>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.rating.message}
          </p>
        )}
      </div>

      <Input
        label="구매/강의 링크 (선택)"
        placeholder="https://..."
        error={errors.itemLink?.message}
        {...register('itemLink')}
      />

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

      <div className="flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : initialData ? '수정하기' : '등록하기'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
