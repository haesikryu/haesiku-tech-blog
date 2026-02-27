import apiClient from './client';
import type { TagResponse, PostResponse, PageResponse } from '@/types';

export const tagApi = {
  getAll: () =>
    apiClient.get<TagResponse[]>('/tags').then((res) => res.data),

  getPostsBySlug: (slug: string, page = 0, size = 10) =>
    apiClient.get<PageResponse<PostResponse>>(`/tags/${slug}/posts`, {
      params: { page, size },
    }).then((res) => res.data),
};
