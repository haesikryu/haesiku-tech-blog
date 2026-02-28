import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  usePost,
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from '@/hooks';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { PostMeta } from '@/components/post';
import { CommentForm, CommentList } from '@/components/comment';
import { Loading, ErrorMessage, Seo, MarkdownRenderer, Badge } from '@/components/common';

export default function PostDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError, refetch } = usePost(slug);
  const { setTitle } = useBreadcrumb();

  const postId = post?.id ?? 0;
  const { data: comments = [], isLoading: commentsLoading } = useComments(postId);
  const createComment = useCreateComment(postId);
  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const getApiMessage = (err: unknown) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  const commentError =
    getApiMessage(createComment.error) ||
    getApiMessage(updateComment.error) ||
    getApiMessage(deleteComment.error);

  useEffect(() => {
    if (post?.title) setTitle(post.title);
    return () => setTitle(null);
  }, [post?.title, setTitle]);

  if (isLoading) return <Loading message="게시글을 불러오는 중..." />;
  if (isError || !post) return <ErrorMessage message="게시글을 찾을 수 없습니다." onRetry={refetch} />;

  return (
    <>
      <Seo title={post.title} description={post.summary || post.title} />

      <article className="mx-auto max-w-3xl">
        {/* 헤더 */}
        <header className="mb-8 border-b border-gray-200 pb-8">
          {post.category && (
            <Link to={`/categories/${post.category.slug}`} className="mb-3 inline-block">
              <Badge variant="category">{post.category.name}</Badge>
            </Link>
          )}

          <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {post.title}
          </h1>

          <PostMeta
            createdAt={post.createdAt}
            viewCount={post.viewCount}
            commentCount={post.commentCount}
            tags={post.tags}
          />

          {post.author && (
            <p className="mt-3 text-sm text-gray-500">by {post.author}</p>
          )}
        </header>

        {/* 본문 */}
        <MarkdownRenderer content={post.content} />

        {/* 태그 목록 */}
        {post.tags.length > 0 && (
          <footer className="mt-12 border-t border-gray-200 pt-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.slug}`}>
                  <Badge variant="tag" className="cursor-pointer transition-colors hover:bg-gray-200">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </footer>
        )}

        {/* 댓글 */}
        <section className="mt-12 border-t border-gray-200 pt-8" aria-label="댓글">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            댓글 {comments.length > 0 && `(${comments.length})`}
          </h2>
          <CommentForm
            onSubmit={(data) => createComment.mutate(data)}
            isSubmitting={createComment.isPending}
            errorMessage={createComment.error ? String(commentError) : undefined}
          />
          <div className="mt-6">
            {commentsLoading ? (
              <p className="text-sm text-gray-500">댓글을 불러오는 중...</p>
            ) : (
              <CommentList
                comments={comments}
                onUpdate={(commentId, password, body) =>
                  updateComment.mutate({ commentId, data: { password, body } })
                }
                onDelete={(commentId, password) =>
                  deleteComment.mutate({ commentId, password })
                }
                isUpdating={updateComment.isPending}
                isDeleting={deleteComment.isPending}
                errorMessage={updateComment.error || deleteComment.error ? String(commentError) : undefined}
              />
            )}
          </div>
        </section>

        {/* 목록으로 */}
        <div className="mt-8">
          <Link
            to="/"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            &larr; 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </>
  );
}
