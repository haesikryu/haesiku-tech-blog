import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Loading, ScrollToTop, ProtectedRoute } from '@/components/common';

const HomePage = lazy(() => import('@/pages/HomePage'));
const PostListPage = lazy(() => import('@/pages/PostListPage'));
const PostDetailPage = lazy(() => import('@/pages/PostDetailPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const TagPage = lazy(() => import('@/pages/TagPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ReviewListPage = lazy(() => import('@/pages/ReviewListPage'));
const ReviewDetailPage = lazy(() => import('@/pages/ReviewDetailPage'));
const AdminListPage = lazy(() => import('@/pages/admin/AdminListPage'));
const PostFormPage = lazy(() => import('@/pages/admin/PostFormPage'));
const AdminReviewListPage = lazy(() => import('@/pages/admin/AdminReviewListPage'));
const ReviewFormPage = lazy(() => import('@/pages/admin/ReviewFormPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/tags/:slug" element={<TagPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reviews" element={<ReviewListPage />} />
            <Route path="/reviews/:id" element={<ReviewDetailPage />} />

            {/* Admin (Protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminListPage /></ProtectedRoute>} />
            <Route path="/admin/posts/new" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
            <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviewListPage /></ProtectedRoute>} />
            <Route path="/admin/reviews/new" element={<ProtectedRoute><ReviewFormPage /></ProtectedRoute>} />
            <Route path="/admin/reviews/:id/edit" element={<ProtectedRoute><ReviewFormPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
