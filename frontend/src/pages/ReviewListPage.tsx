import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useReviews,
  useReviewsByType,
  useSearchReviews,
} from '@/hooks';
import { ReviewCard } from '@/components/review';
import { Pagination, Loading, ErrorMessage, Seo } from '@/components/common';
import type { ReviewType } from '@/types';

const TYPE_OPTIONS: { value: 'ALL' | ReviewType; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'BOOK', label: '책' },
  { value: 'COURSE', label: '강의' },
];

export default function ReviewListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') ?? '';
  const typeParam = (searchParams.get('type') as 'ALL' | ReviewType) || 'ALL';
  const [page, setPage] = useState(0);
  const [keywordInput, setKeywordInput] = useState(keywordParam);

  const hasKeyword = !!keywordParam.trim();

  const allQuery = useReviews(page);
  const bookQuery = useReviewsByType('BOOK', page);
  const courseQuery = useReviewsByType('COURSE', page);
  const searchQuery = useSearchReviews(keywordParam, page);

  const listQuery =
    typeParam === 'BOOK'
      ? bookQuery
      : typeParam === 'COURSE'
        ? courseQuery
        : allQuery;
  const { data, isLoading, isError, refetch } = hasKeyword ? searchQuery : listQuery;

  const handleTypeChange = (type: 'ALL' | ReviewType) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('type', type);
      next.delete('keyword');
      return next;
    });
    setPage(0);
    setKeywordInput('');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = keywordInput.trim();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (trimmed) next.set('keyword', trimmed);
      else next.delete('keyword');
      return next;
    });
    setPage(0);
  };

  return (
    <>
      <Seo
        title="후기"
        description="책과 강의 후기를 정리한 목록입니다."
      />

      <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">후기</h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTypeChange(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  typeParam === opt.value && !hasKeyword
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} role="search" className="flex gap-2">
            <input
              type="search"
              placeholder="제목·내용 검색..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="w-44 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm
                placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                sm:w-56"
            />
            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      {isLoading && <Loading />}
      {isError && (
        <ErrorMessage
          message="후기를 불러오지 못했습니다."
          onRetry={refetch}
        />
      )}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              {hasKeyword ? '검색 결과가 없습니다.' : '등록된 후기가 없습니다.'}
            </p>
          ) : (
            <div className="space-y-5">
              {data.content.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
      </div>
    </>
  );
}
