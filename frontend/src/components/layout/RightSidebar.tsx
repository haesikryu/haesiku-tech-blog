import { Link } from 'react-router-dom';
import { usePublishedPosts, useTags } from '@/hooks';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function RightSidebar() {
  const { data: postsData } = usePublishedPosts(0);
  const { data: tags = [] } = useTags();

  const recentPosts = postsData?.content.slice(0, 5) ?? [];

  return (
    <aside className="w-64 shrink-0 border-l border-gray-200 bg-white py-8 pl-4 pr-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Recently Updated */}
      <section className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Recently Updated
        </h2>
        {recentPosts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">최근 글이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/posts/${post.slug}`}
                  className="block text-sm text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <span className="block text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="mt-0.5 line-clamp-2">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Trending Tags */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Trending Tags
        </h2>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">태그가 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tags/${tag.slug}`}
                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}
