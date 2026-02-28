import apiClient from './client';
import type { CommentResponse, CommentCreateRequest, CommentUpdateRequest } from '@/types';

export const commentApi = {
  list: (postId: number) =>
    apiClient.get<CommentResponse[]>(`/posts/${postId}/comments`).then((res) => res.data),

  create: (postId: number, data: CommentCreateRequest) =>
    apiClient.post<CommentResponse>(`/posts/${postId}/comments`, data).then((res) => res.data),

  update: (postId: number, commentId: number, data: CommentUpdateRequest) =>
    apiClient.put<CommentResponse>(`/posts/${postId}/comments/${commentId}`, data).then((res) => res.data),

  delete: (postId: number, commentId: number, password: string) =>
    apiClient.delete(`/posts/${postId}/comments/${commentId}`, {
      data: { password },
    }),
};
