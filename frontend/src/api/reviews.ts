import apiClient from './client';
import type { ReviewRequest, ReviewResponse, PageResponse, BookInfo } from '@/types';

export const reviewApi = {
  getAll: (page = 0, size = 10, sort = 'createdAt,desc') =>
    apiClient
      .get<PageResponse<ReviewResponse>>('/reviews', {
        params: { page, size, sort },
      })
      .then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<ReviewResponse>(`/reviews/${id}`).then((res) => res.data),

  getByType: (reviewType: 'BOOK' | 'COURSE', page = 0, size = 10) =>
    apiClient
      .get<PageResponse<ReviewResponse>>(`/reviews/type/${reviewType}`, {
        params: { page, size, sort: 'createdAt,desc' },
      })
      .then((res) => res.data),

  search: (keyword: string, page = 0, size = 10) =>
    apiClient
      .get<PageResponse<ReviewResponse>>('/reviews/search', {
        params: { keyword, page, size },
      })
      .then((res) => res.data),

  create: (data: ReviewRequest) =>
    apiClient.post<ReviewResponse>('/reviews', data).then((res) => res.data),

  update: (id: number, data: ReviewRequest) =>
    apiClient.put<ReviewResponse>(`/reviews/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<void>(`/reviews/${id}`),

  /** ISBN으로 책 정보 조회 (Open Library) */
  getBookByIsbn: (isbn: string) =>
    apiClient
      .get<BookInfo>(`/reviews/books/isbn/${encodeURIComponent(isbn.trim())}`)
      .then((res) => res.data),
};
