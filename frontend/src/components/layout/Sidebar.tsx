import { Link } from 'react-router-dom';
import { Badge } from '@/components/common';
import type { CategoryResponse, TagResponse } from '@/types';

interface SidebarProps {
  categories: CategoryResponse[];
  tags: TagResponse[];
}

export default function Sidebar({ categories, tags }: SidebarProps) {
  return (
    <aside className="space-y-8" aria-label="사이드바">
      {/* 카테고리 목록 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">카테고리</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">카테고리가 없습니다.</p>
        ) : (
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/categories/${category.slug}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600
                    transition-colors hover:bg-gray-100 hover:text-blue-600"
                >
                  <span>{category.name}</span>
                  {category.description && (
                    <span className="text-xs text-gray-400" title={category.description}>i</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 인기 태그 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">태그</h2>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">태그가 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.id} to={`/tags/${tag.slug}`}>
                <Badge variant="tag" className="cursor-pointer transition-colors hover:bg-gray-200">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}
