import { Link } from 'react-router-dom';
import { Card } from '@/components/common';
import PostMeta from './PostMeta';
import type { PostResponse } from '@/types';

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card as="article" className="transition-transform hover:-translate-y-0.5">
      <Link to={`/posts/${post.slug}`} className="block space-y-3">
        <h2 className="text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 line-clamp-2">
          {post.title}
        </h2>

        {post.summary && (
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
            {post.summary}
          </p>
        )}
      </Link>

      <div className="mt-4">
        <PostMeta
          createdAt={post.createdAt}
          viewCount={post.viewCount}
          category={post.category}
          tags={post.tags}
        />
      </div>
    </Card>
  );
}
