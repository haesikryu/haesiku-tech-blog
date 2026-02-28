import { useParams, Link } from 'react-router-dom';
import { useReview } from '@/hooks';
import { Loading, ErrorMessage, Seo, MarkdownRenderer } from '@/components/common';

function ratingStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function ReviewDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const reviewId = Number(id);
  const { data: review, isLoading, isError, refetch } = useReview(reviewId);

  if (isLoading) return <Loading message="후기를 불러오는 중..." />;
  if (isError || !review) {
    return (
      <ErrorMessage
        message="후기를 찾을 수 없습니다."
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <Seo
        title={review.title}
        description={`${review.itemTitle} - ${review.title}`}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-gray-200 pb-8">
          <span className="mb-3 inline-block rounded bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800">
            {review.reviewType === 'BOOK' ? '책' : '강의'}
          </span>

          <h1 className="mb-2 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {review.title}
          </h1>

          <p className="mb-2 text-lg text-gray-600">
            {review.itemTitle}
            {review.itemAuthor && ` · ${review.itemAuthor}`}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span
              className="text-amber-600"
              aria-label={`평점 ${review.rating}점`}
            >
              {ratingStars(review.rating)}
            </span>
            <time dateTime={review.createdAt}>
              {new Date(review.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          {review.itemLink && (
            <a
              href={review.itemLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              링크 열기 →
            </a>
          )}
        </header>

        <MarkdownRenderer content={review.content} />

        <div className="mt-8">
          <Link
            to="/reviews"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            &larr; 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </>
  );
}
