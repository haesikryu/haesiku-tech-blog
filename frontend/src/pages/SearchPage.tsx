import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchPosts } from '@/hooks';
import { PostCard } from '@/components/post';
import { Pagination, Loading, ErrorMessage, Seo } from '@/components/common';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useSearchPosts(keyword, page);

  return (
    <>
      <Seo title={`검색: ${keyword}`} description={`"${keyword}" 검색 결과`} />

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        검색: <span className="text-blue-600">&ldquo;{keyword}&rdquo;</span>
      </h1>

      {!keyword && (
        <p className="py-12 text-center text-gray-500">검색어를 입력해 주세요.</p>
      )}

      {keyword && isLoading && <Loading />}
      {keyword && isError && <ErrorMessage message="검색에 실패했습니다." onRetry={refetch} />}

      {data && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            총 {data.totalElements}개의 결과
          </p>

          {data.content.length === 0 ? (
            <p className="py-12 text-center text-gray-500">검색 결과가 없습니다.</p>
          ) : (
            <div className="space-y-5">
              {data.content.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
