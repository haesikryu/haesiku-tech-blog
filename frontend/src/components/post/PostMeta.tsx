import { Link } from 'react-router-dom';
import { Badge } from '@/components/common';
import type { CategoryResponse, TagResponse } from '@/types';

interface PostMetaProps {
  createdAt: string;
  viewCount?: number;
  category?: CategoryResponse;
  tags?: TagResponse[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostMeta({ createdAt, viewCount, category, tags }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
      <time dateTime={createdAt}>{formatDate(createdAt)}</time>

      {viewCount !== undefined && (
        <>
          <span aria-hidden="true">&middot;</span>
          <span>조회 {viewCount.toLocaleString()}</span>
        </>
      )}

      {category && (
        <>
          <span aria-hidden="true">&middot;</span>
          <Link to={`/categories/${category.slug}`}>
            <Badge variant="category">{category.name}</Badge>
          </Link>
        </>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.slug}`}>
              <Badge variant="tag">{tag.name}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
