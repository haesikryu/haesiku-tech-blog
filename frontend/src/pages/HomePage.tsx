import { useState } from 'react';
import { usePublishedPosts } from '@/hooks';
import { PostCard } from '@/components/post';
import { Pagination, Loading, ErrorMessage, Seo } from '@/components/common';

export default function HomePage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = usePublishedPosts(page);

  return (
    <>
      <Seo description="개발과 기술에 대한 이야기를 나누는 블로그입니다." />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">최신 게시글</h1>

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
