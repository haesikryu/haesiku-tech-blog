import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store";

const NAV_ITEMS = [
  { to: "/", label: "HOME", icon: "🏠" },
  { to: "/posts", label: "BLOG", icon: "📝" },
  { to: "/posts", label: "TECH NEWS", icon: "📰" },
  { to: "/posts", label: "TAGS", icon: "🏷️" },
  { to: "/posts", label: "ARCHIVES", icon: "🗄️" },
  { to: "/reviews", label: "BOOK REVIEW", icon: "📚" },
  { to: "/posts", label: "CATEGORIES", icon: "🗂️" },
  { to: "/about", label: "ABOUT", icon: "ℹ️" },
] as const;

export default function LeftSidebar() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white py-8 pl-6 pr-4 dark:border-gray-700 dark:bg-gray-900 lg:w-64">
      {/* 프로필 */}
      <div className="mb-8">
        <div className="mb-3 flex justify-center">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <img
              src="/profile.png"
              alt="Haesik Ryu 프로필"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <h2 className="text-center text-lg font-bold text-gray-900 dark:text-white">
          Haesik Ryu
        </h2>
        <p className="mt-1 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          SW 개발, AI 적용, 시스템 혁신에 대한 생각을 나눕니다.
        </p>
      </div>

      {/* 네비게이션 */}
      <nav aria-label="사이드 메뉴" className="space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              <span aria-hidden>{icon}</span>
              {label}
            </Link>
          );
        })}
        {isAuthenticated && (
          <Link
            to="/admin"
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              location.pathname.startsWith("/admin")
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            }`}
          >
            <span aria-hidden>⚙️</span>
            관리자
          </Link>
        )}
      </nav>

      {/* 소셜 아이콘 */}
      <div className="mt-10 flex justify-center gap-3">
        <a
          href="https://github.com/haesikryu"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="GitHub"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/haesiku/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="LinkedIn"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="mailto:haesikryu@gmail.com"
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="이메일"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </a>
      </div>
    </aside>
  );
}
