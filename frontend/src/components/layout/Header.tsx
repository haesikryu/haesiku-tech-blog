import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useAuthStore, useUiStore } from '@/store';

const PATH_LABELS: Record<string, string> = {
  '/': 'Home',
  '/posts': 'BLOG',
  '/reviews': 'BOOK REVIEW',
  '/search': 'Search',
  '/about': 'About',
  '/admin': '관리자',
};

function getBreadcrumbLabel(pathname: string, customTitle: string | null): string {
  if (customTitle) return customTitle;
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/posts/')) return pathname === '/posts' ? 'BLOG' : 'BLOG';
  if (pathname.startsWith('/categories/')) return 'CATEGORIES';
  if (pathname.startsWith('/tags/')) return 'TAGS';
  return PATH_LABELS[pathname] ?? (pathname.slice(1) || 'Home');
}

function getBreadcrumbPath(pathname: string, customTitle: string | null): { href: string; label: string }[] {
  const label = getBreadcrumbLabel(pathname, customTitle);
  if (pathname === '/' || pathname === '') return [{ href: '/', label: 'Home' }];
  const segments = pathname.split('/').filter(Boolean);
  const items: { href: string; label: string }[] = [{ href: '/', label: 'Home' }];
  let acc = '';
  for (let i = 0; i < segments.length; i++) {
    acc += '/' + segments[i];
    const isLast = i === segments.length - 1;
    items.push({
      href: acc,
      label: isLast ? label : (PATH_LABELS[acc] ?? segments[i]),
    });
  }
  return items;
}

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { title: customTitle } = useBreadcrumb();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  const breadcrumbs = getBreadcrumbPath(location.pathname, customTitle);
  const displayLabel = getBreadcrumbLabel(location.pathname, customTitle);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) {
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
      setKeyword('');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* 브레드크럼 */}
        <nav aria-label="브레드크럼" className="flex min-w-0 items-center text-sm">
          {breadcrumbs.length <= 1 ? (
            <Link to="/" className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
              Home
            </Link>
          ) : (
            <>
              <Link to="/" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Home
              </Link>
              {breadcrumbs.slice(1).map((b, i) => (
                <span key={b.href} className="flex items-center gap-1">
                  <span className="mx-1.5 text-gray-400">&gt;</span>
                  {i === breadcrumbs.length - 2 ? (
                    <span className="font-medium text-gray-900 dark:text-white">
                      {displayLabel}
                    </span>
                  ) : (
                    <Link to={b.href} className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                      {b.label}
                    </Link>
                  )}
                </span>
              ))}
            </>
          )}
        </nav>

        {/* 검색 */}
        <div className="flex shrink-0 items-center gap-2">
          <form onSubmit={handleSearch} role="search" className="flex">
            <label htmlFor="search-input" className="sr-only">검색</label>
            <div className="relative">
              <input
                id="search-input"
                type="search"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-36 rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-3 pr-8 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 sm:w-44"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                aria-label="검색"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={theme === 'light' ? '다크 모드' : '라이트 모드'}
          >
            {theme === 'light' ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {isAuthenticated && user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{user.username}</span>
              <button
                onClick={logout}
                className="rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
