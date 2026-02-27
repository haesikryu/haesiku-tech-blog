import apiClient from './client';
import type { CategoryRequest, CategoryResponse, PostResponse, PageResponse } from '@/types';

export const categoryApi = {
  getAll: () =>
    apiClient.get<CategoryResponse[]>('/categories').then((res) => res.data),

  create: (data: CategoryRequest) =>
    apiClient.post<CategoryResponse>('/categories', data).then((res) => res.data),

  getPostsBySlug: (slug: string, page = 0, size = 10) =>
    apiClient.get<PageResponse<PostResponse>>(`/categories/${slug}/posts`, {
      params: { page, size },
    }).then((res) => res.data),
};
