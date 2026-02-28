import { Link } from 'react-router-dom';
import { Card } from '@/components/common';
import type { ReviewResponse } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ratingStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

interface ReviewCardProps {
  review: ReviewResponse;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card as="article" className="transition-transform hover:-translate-y-0.5">
      <Link to={`/reviews/${review.id}`} className="block space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            {review.reviewType === 'BOOK' ? '책' : '강의'}
          </span>
          <span className="text-sm text-amber-600" aria-label={`평점 ${review.rating}점`}>
            {ratingStars(review.rating)}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 line-clamp-2">
          {review.title}
        </h2>

        <p className="text-sm font-medium text-gray-600">
          {review.itemTitle}
          {review.itemAuthor && ` · ${review.itemAuthor}`}
        </p>

        <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
          {review.content.replace(/^#+\s*/m, '').slice(0, 120)}
          {review.content.length > 120 ? '…' : ''}
        </p>
      </Link>

      <div className="mt-4 text-sm text-gray-500">
        <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
      </div>
    </Card>
  );
}
