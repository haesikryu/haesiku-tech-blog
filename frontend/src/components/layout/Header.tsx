import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useUiStore } from '@/store';

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) {
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
      setKeyword('');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors dark:text-white">
          Haesiku Tech Blog
        </Link>

        <nav aria-label="메인 네비게이션" className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300">
            홈
          </Link>
          <Link to="/posts" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300">
            게시글
          </Link>
          <Link to="/reviews" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300">
            후기
          </Link>
          {isAuthenticated && (
            <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300">
              관리자
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* 검색 */}
          <form onSubmit={handleSearch} role="search" className="hidden md:block">
            <label htmlFor="search-input" className="sr-only">블로그 검색</label>
            <div className="relative">
              <input
                id="search-input"
                type="search"
                placeholder="검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-40 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 pr-9 text-sm
                  placeholder-gray-400 transition-colors focus:border-blue-500 focus:bg-white
                  focus:outline-none focus:ring-1 focus:ring-blue-500 lg:w-56
                  dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:bg-gray-700"
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

          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
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

          {/* 유저 정보 / 로그아웃 */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{user.username}</span>
              <button
                onClick={logout}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800"
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
