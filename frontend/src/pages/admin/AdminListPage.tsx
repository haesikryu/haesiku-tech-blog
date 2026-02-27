import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllPosts, useDeletePost, useTogglePublish } from '@/hooks';
import { Button, Badge, Pagination, Loading, ErrorMessage, Seo } from '@/components/common';

export default function AdminListPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useAllPosts(page);
  const deleteMutation = useDeletePost();
  const togglePublishMutation = useTogglePublish();

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleTogglePublish = async (id: number) => {
    await togglePublishMutation.mutateAsync(id);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR');

  return (
    <>
      <Seo title="관리자" />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">게시글 관리</h1>
        <Link to="/admin/posts/new">
          <Button>새 게시글 작성</Button>
        </Link>
      </div>

      {isLoading && <Loading />}
      {isError && <ErrorMessage message="게시글을 불러오지 못했습니다." onRetry={refetch} />}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="py-12 text-center text-gray-500">게시글이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">제목</th>
                    <th className="px-4 py-3 font-medium text-gray-700">상태</th>
                    <th className="px-4 py-3 font-medium text-gray-700">작성일</th>
                    <th className="px-4 py-3 font-medium text-gray-700">조회수</th>
                    <th className="px-4 py-3 font-medium text-gray-700">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.content.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                        <Link to={`/posts/${post.slug}`} className="hover:text-blue-600">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={post.status === 'PUBLISHED' ? 'status' : 'tag'}>
                          {post.status === 'PUBLISHED' ? '발행' : '임시저장'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(post.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-500">{post.viewCount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/posts/${post.id}/edit`}>
                            <Button size="sm" variant="outline">수정</Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleTogglePublish(post.id)}
                            disabled={togglePublishMutation.isPending}
                          >
                            {post.status === 'PUBLISHED' ? '비공개' : '발행'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleDelete(post.id, post.title)}
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
            <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
