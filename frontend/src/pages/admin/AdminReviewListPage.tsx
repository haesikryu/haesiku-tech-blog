import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviews, useDeleteReview } from '@/hooks';
import { Button, Pagination, Loading, ErrorMessage, Seo } from '@/components/common';

export default function AdminReviewListPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useReviews(page);
  const deleteMutation = useDeleteReview();

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`"${title}" 후기를 삭제하시겠습니까?`)) return;
    await deleteMutation.mutateAsync(id);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR');

  return (
    <>
      <Seo title="후기 관리" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">후기 관리</h1>
          <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            게시글 관리 →
          </Link>
        </div>
        <Link to="/admin/reviews/new">
          <Button>새 후기 작성</Button>
        </Link>
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
            <p className="py-12 text-center text-gray-500">등록된 후기가 없습니다.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">유형</th>
                    <th className="px-4 py-3 font-medium text-gray-700">후기 제목</th>
                    <th className="px-4 py-3 font-medium text-gray-700">책/강의</th>
                    <th className="px-4 py-3 font-medium text-gray-700">평점</th>
                    <th className="px-4 py-3 font-medium text-gray-700">작성일</th>
                    <th className="px-4 py-3 font-medium text-gray-700">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.content.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          {review.reviewType === 'BOOK' ? '책' : '강의'}
                        </span>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                        <Link
                          to={`/reviews/${review.id}`}
                          className="hover:text-blue-600"
                        >
                          {review.title}
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-gray-600">
                        {review.itemTitle}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{review.rating}점</td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/reviews/${review.id}/edit`}>
                            <Button size="sm" variant="outline">
                              수정
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(review.id, review.title)}
                            disabled={deleteMutation.isPending}
                          >
                            삭제
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </>
  );
}
