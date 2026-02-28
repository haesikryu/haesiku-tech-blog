import { useState } from 'react';
import { usePublishedPosts } from '@/hooks';
import { PostCard } from '@/components/post';
import { Pagination, Loading, ErrorMessage, Seo } from '@/components/common';

type SortOption = 'createdAt,desc' | 'viewCount,desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'viewCount,desc', label: '조회수순' },
];

export default function PostListPage() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortOption>('createdAt,desc');
  const { data, isLoading, isError, refetch } = usePublishedPosts(page, sort);

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(0);
  };

  return (
    <>
      <Seo title="전체 게시글" description="전체 게시글 목록입니다." />

      <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">전체 게시글</h1>

        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortChange(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
                ${sort === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <Loading />}
      {isError && <ErrorMessage message="게시글을 불러오지 못했습니다." onRetry={refetch} />}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="py-12 text-center text-gray-500">게시글이 없습니다.</p>
          ) : (
            <div className="space-y-5">
              {data.content.map((post) => (
                <PostCard key={post.id} post={post} />
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
