import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTagPosts } from '@/hooks';
import { PostCard } from '@/components/post';
import { Pagination, Loading, ErrorMessage, Seo } from '@/components/common';

export default function TagPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useTagPosts(slug, page);

  return (
    <>
      <Seo title={`태그: ${slug}`} description={`${slug} 태그가 포함된 게시글 목록`} />

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        태그: <span className="text-blue-600">#{slug}</span>
      </h1>

      {isLoading && <Loading />}
      {isError && <ErrorMessage message="게시글을 불러오지 못했습니다." onRetry={refetch} />}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="py-12 text-center text-gray-500">해당 태그에 게시글이 없습니다.</p>
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
