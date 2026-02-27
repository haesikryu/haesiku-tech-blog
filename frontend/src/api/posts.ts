import apiClient from './client';
import type { PostRequest, PostResponse, PageResponse } from '@/types';

export const postApi = {
  getPublished: (page = 0, size = 10, sort = 'createdAt,desc') =>
    apiClient.get<PageResponse<PostResponse>>('/posts', {
      params: { page, size, sort },
    }).then((res) => res.data),

  getBySlug: (slug: string) =>
    apiClient.get<PostResponse>(`/posts/${slug}`).then((res) => res.data),

  search: (keyword: string, page = 0, size = 10) =>
    apiClient.get<PageResponse<PostResponse>>('/posts/search', {
      params: { keyword, page, size },
    }).then((res) => res.data),

  create: (data: PostRequest) =>
    apiClient.post<PostResponse>('/posts', data).then((res) => res.data),

  update: (id: number, data: PostRequest) =>
    apiClient.put<PostResponse>(`/posts/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<void>(`/posts/${id}`),

  togglePublish: (id: number) =>
    apiClient.patch<PostResponse>(`/posts/${id}/publish`).then((res) => res.data),

  getAll: (page = 0, size = 10, sort = 'createdAt,desc') =>
    apiClient.get<PageResponse<PostResponse>>('/posts/admin', {
      params: { page, size, sort },
    }).then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<PostResponse>(`/posts/admin/${id}`).then((res) => res.data),
};
